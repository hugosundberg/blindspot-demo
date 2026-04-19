-- Row Level Security Policies
-- Players authenticate with a JWT containing app_metadata.player_id

-- Helper function to extract player_id from JWT
CREATE OR REPLACE FUNCTION auth_player_id()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'player_id')::uuid;
$$;

-- Enable RLS
ALTER TABLE rooms               ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players        ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rounds         ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_fragments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_offers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_submissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE steal_state         ENABLE ROW LEVEL SECURITY;
ALTER TABLE end_trade_votes     ENABLE ROW LEVEL SECURITY;

-- ── rooms ──────────────────────────────────────────────────────────────
-- Anyone can read rooms they belong to
CREATE POLICY "room_members_can_read" ON rooms
  FOR SELECT USING (
    code IN (
      SELECT room_code FROM game_players WHERE player_id = auth_player_id()
    )
  );

-- ── game_players ───────────────────────────────────────────────────────
-- All players in the same room can see each other
CREATE POLICY "room_members_visible" ON game_players
  FOR SELECT USING (
    room_code IN (
      SELECT room_code FROM game_players WHERE player_id = auth_player_id()
    )
  );

-- ── game_rounds ────────────────────────────────────────────────────────
CREATE POLICY "room_members_see_rounds" ON game_rounds
  FOR SELECT USING (
    room_code IN (
      SELECT room_code FROM game_players WHERE player_id = auth_player_id()
    )
  );

-- ── player_fragments ───────────────────────────────────────────────────
-- Each player can only read their own fragment
CREATE POLICY "own_fragment_only" ON player_fragments
  FOR SELECT USING (player_id = auth_player_id());

-- ── trade_offers ───────────────────────────────────────────────────────
-- A player sees offers they sent or received; fragment_revealed is in the
-- row but only the buyer (from_player_id) needs it — RLS ensures the
-- seller cannot see fragment_revealed of offers they didn't send
CREATE POLICY "trade_offer_participants" ON trade_offers
  FOR SELECT USING (
    from_player_id = auth_player_id()
    OR to_player_id = auth_player_id()
  );

-- ── answer_submissions ─────────────────────────────────────────────────
-- Players can only read submissions in their room; their own answer
-- is visible, others' answers are masked (the API handles masking)
CREATE POLICY "room_answer_submissions" ON answer_submissions
  FOR SELECT USING (
    room_code IN (
      SELECT room_code FROM game_players WHERE player_id = auth_player_id()
    )
  );

-- ── steal_state ────────────────────────────────────────────────────────
CREATE POLICY "room_steal_state" ON steal_state
  FOR SELECT USING (
    room_code IN (
      SELECT room_code FROM game_players WHERE player_id = auth_player_id()
    )
  );

-- ── end_trade_votes ────────────────────────────────────────────────────
CREATE POLICY "room_votes" ON end_trade_votes
  FOR SELECT USING (
    room_code IN (
      SELECT room_code FROM game_players WHERE player_id = auth_player_id()
    )
  );
