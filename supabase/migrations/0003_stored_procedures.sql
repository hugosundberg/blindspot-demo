-- Stored procedures for atomic game operations

-- ═══════════════════════════════════════════
-- accept_trade_offer
-- Atomically: check buyer chips → transfer chips → reveal fragment → mark accepted
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION accept_trade_offer(p_offer_id UUID)
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
  v_offer    trade_offers%ROWTYPE;
  v_buyer    game_players%ROWTYPE;
  v_seller   game_players%ROWTYPE;
  v_fragment TEXT;
BEGIN
  SELECT * INTO v_offer FROM trade_offers WHERE offer_id = p_offer_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'OFFER_NOT_FOUND'; END IF;
  IF v_offer.status <> 'pending' THEN RAISE EXCEPTION 'OFFER_NOT_PENDING'; END IF;

  SELECT * INTO v_buyer  FROM game_players WHERE player_id = v_offer.from_player_id FOR UPDATE;
  SELECT * INTO v_seller FROM game_players WHERE player_id = v_offer.to_player_id   FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'PLAYER_NOT_FOUND'; END IF;
  IF v_buyer.chips < v_offer.chip_amount THEN RAISE EXCEPTION 'INSUFFICIENT_CHIPS'; END IF;

  -- Get seller's fragment for this round
  SELECT fragment INTO v_fragment FROM player_fragments
    WHERE player_id = v_offer.to_player_id
      AND room_code = v_offer.room_code
      AND round_index = v_offer.round_index;

  -- Transfer chips
  UPDATE game_players SET chips = chips - v_offer.chip_amount WHERE player_id = v_offer.from_player_id;
  UPDATE game_players SET chips = chips + v_offer.chip_amount WHERE player_id = v_offer.to_player_id;

  -- Mark accepted + reveal fragment to buyer
  UPDATE trade_offers
    SET status = 'accepted', fragment_revealed = v_fragment
    WHERE offer_id = p_offer_id;

  RETURN jsonb_build_object(
    'buyer_chips',  v_buyer.chips  - v_offer.chip_amount,
    'seller_chips', v_seller.chips + v_offer.chip_amount,
    'fragment',     v_fragment
  );
END;
$$;

-- ═══════════════════════════════════════════
-- advance_phase_if_expired
-- Advisory-locked phase transition — safe to call from multiple concurrent sources
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION advance_phase_if_expired(p_room_code TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  v_room rooms%ROWTYPE;
  v_lock_key BIGINT;
BEGIN
  -- Advisory lock keyed to room code hash — prevents double-advancement
  v_lock_key := hashtext(p_room_code);
  IF NOT pg_try_advisory_xact_lock(v_lock_key) THEN
    RETURN 'LOCKED';
  END IF;

  SELECT * INTO v_room FROM rooms WHERE code = p_room_code FOR UPDATE;
  IF NOT FOUND THEN RETURN 'NOT_FOUND'; END IF;
  IF v_room.phase_deadline IS NULL OR v_room.phase_deadline > now() THEN
    RETURN 'NOT_EXPIRED';
  END IF;

  CASE v_room.phase
    WHEN 'read' THEN
      UPDATE rooms SET phase = 'trade',
        phase_deadline = now() + interval '60 seconds',
        updated_at = now()
        WHERE code = p_room_code;
      RETURN 'read->trade';

    WHEN 'trade' THEN
      UPDATE rooms SET phase = 'answer',
        phase_deadline = now() + interval '60 seconds',
        updated_at = now()
        WHERE code = p_room_code;
      -- Expire all pending offers
      UPDATE trade_offers SET status = 'expired'
        WHERE room_code = p_room_code
          AND round_index = v_room.round_index
          AND status = 'pending';
      RETURN 'trade->answer';

    WHEN 'steal' THEN
      -- Auto-fail the steal
      UPDATE steal_state SET resolved = true WHERE room_code = p_room_code;
      -- Deduct chips from stealer
      UPDATE game_players
        SET chips = chips - 5
        WHERE player_id = (SELECT stealer_id FROM steal_state WHERE room_code = p_room_code)
          AND room_code = p_room_code;
      -- Resume trade with shorter window
      UPDATE rooms SET phase = 'trade',
        phase_deadline = now() + interval '30 seconds',
        updated_at = now()
        WHERE code = p_room_code;
      RETURN 'steal->trade(resume)';

    WHEN 'answer' THEN
      -- Auto-submit pass for any players who haven't answered
      INSERT INTO answer_submissions (room_code, round_index, player_id, answer, is_correct)
        SELECT p_room_code, v_room.round_index, player_id, NULL, NULL
        FROM game_players
        WHERE room_code = p_room_code
          AND player_id NOT IN (
            SELECT player_id FROM answer_submissions
            WHERE room_code = p_room_code AND round_index = v_room.round_index
          )
        ON CONFLICT DO NOTHING;
      RETURN 'answer->resolve(pending)';

    ELSE
      RETURN 'NOOP';
  END CASE;
END;
$$;

-- ═══════════════════════════════════════════
-- resolve_round
-- Validate answers, award chips, advance round_index or end game
-- Called by API route after all answers submitted, or by Edge Function after timer
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION resolve_round(p_room_code TEXT)
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
  v_room        rooms%ROWTYPE;
  v_round       game_rounds%ROWTYPE;
  v_lock_key    BIGINT;
  v_sub         answer_submissions%ROWTYPE;
  v_correct     BOOLEAN;
  v_chip_deltas JSONB := '[]'::jsonb;
  v_delta       INT;
  v_player_count INT;
  v_submission_count INT;
BEGIN
  v_lock_key := hashtext('resolve:' || p_room_code);
  IF NOT pg_try_advisory_xact_lock(v_lock_key) THEN
    RETURN jsonb_build_object('status', 'LOCKED');
  END IF;

  SELECT * INTO v_room  FROM rooms       WHERE code       = p_room_code          FOR UPDATE;
  SELECT * INTO v_round FROM game_rounds WHERE room_code  = p_room_code
                                           AND round_index = v_room.round_index;
  IF NOT FOUND THEN RAISE EXCEPTION 'ROUND_NOT_FOUND'; END IF;

  SELECT COUNT(*) INTO v_player_count    FROM game_players     WHERE room_code = p_room_code AND is_connected;
  SELECT COUNT(*) INTO v_submission_count FROM answer_submissions WHERE room_code = p_room_code AND round_index = v_room.round_index;
  IF v_submission_count < v_player_count THEN
    RETURN jsonb_build_object('status', 'WAITING');
  END IF;

  -- Score each submission
  FOR v_sub IN
    SELECT * FROM answer_submissions
    WHERE room_code = p_room_code AND round_index = v_room.round_index
  LOOP
    IF v_sub.answer IS NULL THEN
      v_correct := NULL;
      v_delta   := 0;
    ELSE
      -- normalise: lowercase, strip leading article, trim
      v_correct := lower(regexp_replace(trim(v_sub.answer), '^(the|a|an)\s+', '', 'i'))
                 = lower(regexp_replace(trim(v_round.answer), '^(the|a|an)\s+', '', 'i'));
      v_delta   := CASE WHEN v_correct THEN 5 ELSE -2 END;
    END IF;

    UPDATE answer_submissions SET is_correct = v_correct WHERE id = v_sub.id;
    UPDATE game_players SET
      chips = chips + v_delta,
      stats_correct = stats_correct + (CASE WHEN v_correct THEN 1 ELSE 0 END)
      WHERE player_id = v_sub.player_id;

    v_chip_deltas := v_chip_deltas || jsonb_build_object(
      'player_id', v_sub.player_id,
      'delta',     v_delta,
      'correct',   v_correct
    );
  END LOOP;

  -- Award poison bonus (1 chip per player who bought the poison)
  UPDATE game_players gp
    SET chips = chips + (
      SELECT COUNT(*) FROM trade_offers
      WHERE room_code = p_room_code
        AND round_index = v_room.round_index
        AND to_player_id = gp.player_id
        AND status = 'accepted'
        AND to_player_id IN (
          SELECT player_id FROM player_fragments
          WHERE room_code = p_room_code AND round_index = v_room.round_index AND is_poison
        )
    ),
    stats_poison_sold = stats_poison_sold + (
      SELECT COUNT(*) FROM trade_offers
      WHERE room_code = p_room_code
        AND round_index = v_room.round_index
        AND to_player_id = gp.player_id
        AND status = 'accepted'
        AND to_player_id IN (
          SELECT player_id FROM player_fragments
          WHERE room_code = p_room_code AND round_index = v_room.round_index AND is_poison
        )
    )
  WHERE gp.room_code = p_room_code;

  -- Reset per-round flags
  UPDATE game_players SET has_stolen = false, ready_to_trade = false WHERE room_code = p_room_code;

  -- Advance or end
  IF v_room.round_index + 1 >= v_room.total_rounds THEN
    UPDATE rooms SET phase = 'leaderboard', phase_deadline = NULL, updated_at = now()
      WHERE code = p_room_code;
    RETURN jsonb_build_object('status', 'LEADERBOARD', 'chip_deltas', v_chip_deltas);
  ELSE
    UPDATE rooms SET
      phase = 'result',
      round_index = round_index + 1,
      phase_deadline = now() + interval '8 seconds',
      updated_at = now()
      WHERE code = p_room_code;
    RETURN jsonb_build_object('status', 'RESULT', 'chip_deltas', v_chip_deltas);
  END IF;
END;
$$;
