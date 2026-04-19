-- Blindspot: Initial Schema
-- Phase types: lobby | countdown | read | trade | steal | answer | result | leaderboard

-- ═══════════════════════════════════════
-- rooms
-- ═══════════════════════════════════════
CREATE TABLE rooms (
  code            TEXT        PRIMARY KEY,
  host_player_id  UUID        NOT NULL,
  phase           TEXT        NOT NULL DEFAULT 'lobby',
  round_index     INT         NOT NULL DEFAULT 0,
  total_rounds    INT         NOT NULL DEFAULT 15,
  pack            TEXT        NOT NULL DEFAULT 'Mixed',
  phase_deadline  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON rooms (phase_deadline) WHERE phase_deadline IS NOT NULL;

-- ═══════════════════════════════════════
-- game_rounds  (immutable after start)
-- ═══════════════════════════════════════
CREATE TABLE game_rounds (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code       TEXT        NOT NULL REFERENCES rooms(code) ON DELETE CASCADE,
  round_index     INT         NOT NULL,
  question_id     TEXT        NOT NULL,
  question_type   TEXT        NOT NULL,
  answer          TEXT        NOT NULL,
  category        TEXT        NOT NULL,
  pack            TEXT        NOT NULL,
  fragment        TEXT        NOT NULL,
  other_fragments TEXT[]      NOT NULL,
  poison_fragment TEXT,
  UNIQUE (room_code, round_index)
);

-- ═══════════════════════════════════════
-- game_players
-- ═══════════════════════════════════════
CREATE TABLE game_players (
  player_id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code         TEXT        NOT NULL REFERENCES rooms(code) ON DELETE CASCADE,
  name              TEXT        NOT NULL,
  avatar_char       TEXT        NOT NULL,
  color             TEXT        NOT NULL,
  chips             INT         NOT NULL DEFAULT 10,
  is_host           BOOLEAN     NOT NULL DEFAULT false,
  is_connected      BOOLEAN     NOT NULL DEFAULT true,
  has_stolen        BOOLEAN     NOT NULL DEFAULT false,
  ready_to_trade    BOOLEAN     NOT NULL DEFAULT false,
  stats_correct     INT         NOT NULL DEFAULT 0,
  stats_steals      INT         NOT NULL DEFAULT 0,
  stats_poison_sold INT         NOT NULL DEFAULT 0,
  joined_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON game_players (room_code);

-- ═══════════════════════════════════════
-- player_fragments  (RLS-protected)
-- ═══════════════════════════════════════
CREATE TABLE player_fragments (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code       TEXT        NOT NULL,
  round_index     INT         NOT NULL,
  player_id       UUID        NOT NULL REFERENCES game_players(player_id) ON DELETE CASCADE,
  fragment        TEXT        NOT NULL,
  is_poison       BOOLEAN     NOT NULL DEFAULT false,
  UNIQUE (room_code, round_index, player_id)
);

CREATE INDEX ON player_fragments (room_code, round_index);

-- ═══════════════════════════════════════
-- trade_offers
-- ═══════════════════════════════════════
CREATE TABLE trade_offers (
  offer_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code         TEXT        NOT NULL,
  round_index       INT         NOT NULL,
  from_player_id    UUID        NOT NULL REFERENCES game_players(player_id),
  to_player_id      UUID        NOT NULL REFERENCES game_players(player_id),
  chip_amount       INT         NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'pending',
  fragment_revealed TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON trade_offers (room_code, round_index, status);

-- ═══════════════════════════════════════
-- answer_submissions
-- ═══════════════════════════════════════
CREATE TABLE answer_submissions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code       TEXT        NOT NULL,
  round_index     INT         NOT NULL,
  player_id       UUID        NOT NULL REFERENCES game_players(player_id),
  answer          TEXT,
  is_correct      BOOLEAN,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  from_steal      BOOLEAN     NOT NULL DEFAULT false,
  UNIQUE (room_code, round_index, player_id)
);

CREATE INDEX ON answer_submissions (room_code, round_index);

-- ═══════════════════════════════════════
-- steal_state
-- ═══════════════════════════════════════
CREATE TABLE steal_state (
  room_code   TEXT        PRIMARY KEY REFERENCES rooms(code) ON DELETE CASCADE,
  stealer_id  UUID        NOT NULL REFERENCES game_players(player_id),
  deadline    TIMESTAMPTZ NOT NULL,
  resolved    BOOLEAN     NOT NULL DEFAULT false
);

-- ═══════════════════════════════════════
-- end_trade_votes  (per-round set)
-- ═══════════════════════════════════════
CREATE TABLE end_trade_votes (
  room_code   TEXT    NOT NULL,
  round_index INT     NOT NULL,
  player_id   UUID    NOT NULL REFERENCES game_players(player_id),
  PRIMARY KEY (room_code, round_index, player_id)
);

-- ═══════════════════════════════════════
-- updated_at trigger
-- ═══════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
