import { createClient } from "jsr:@supabase/supabase-js@2";

const POLL_INTERVAL_MS = 3_000;
const RUN_DURATION_MS = 55_000;

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const startedAt = Date.now();

  while (Date.now() - startedAt < RUN_DURATION_MS) {
    const { data: expiredRooms } = await supabase
      .from("rooms")
      .select("code, phase, round_index")
      .lt("phase_deadline", new Date().toISOString())
      .not("phase", "in", "(lobby,leaderboard)");

    for (const room of expiredRooms ?? []) {
      const { data: result } = await supabase.rpc("advance_phase_if_expired", {
        p_room_code: room.code,
      });

      if (result && result !== "NOT_EXPIRED" && result !== "LOCKED" && result !== "NOOP") {
        // Determine broadcast event from transition string
        const channel = supabase.channel(`game:${room.code}`);
        const transition = result as string;

        if (transition.startsWith("read->trade")) {
          await channel.send({
            type: "broadcast",
            event: "PHASE_CHANGED",
            payload: {
              phase: "trade",
              deadline_ms: Date.now() + 60_000,
              round_index: room.round_index,
            },
          });
        } else if (transition.startsWith("trade->answer")) {
          await channel.send({
            type: "broadcast",
            event: "PHASE_CHANGED",
            payload: {
              phase: "answer",
              deadline_ms: Date.now() + 60_000,
              round_index: room.round_index,
            },
          });
        } else if (transition.startsWith("steal->trade")) {
          const { data: stealer } = await supabase
            .from("steal_state")
            .select("stealer_id")
            .eq("room_code", room.code)
            .single();

          await channel.send({
            type: "broadcast",
            event: "STEAL_RESULT",
            payload: {
              correct: false,
              stealer_id: stealer?.stealer_id,
              chip_deltas: [{ player_id: stealer?.stealer_id, delta: -5 }],
            },
          });
          await channel.send({
            type: "broadcast",
            event: "PHASE_CHANGED",
            payload: {
              phase: "trade",
              deadline_ms: Date.now() + 30_000,
              round_index: room.round_index,
              resume: true,
            },
          });
        } else if (transition === "answer->resolve(pending)") {
          // Trigger round resolution
          const { data: resolveResult } = await supabase.rpc("resolve_round", {
            p_room_code: room.code,
          });

          if (resolveResult?.status === "RESULT") {
            await channel.send({
              type: "broadcast",
              event: "ROUND_RESULT",
              payload: { chip_deltas: resolveResult.chip_deltas, round_index: room.round_index },
            });
          } else if (resolveResult?.status === "LEADERBOARD") {
            const { data: players } = await supabase
              .from("game_players")
              .select("player_id, name, avatar_char, color, chips, stats_correct, stats_steals, stats_poison_sold")
              .eq("room_code", room.code)
              .order("chips", { ascending: false });

            await channel.send({
              type: "broadcast",
              event: "LEADERBOARD",
              payload: { players },
            });
          }
        }
      }
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  return new Response("done");
});
