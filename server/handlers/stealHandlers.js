const rm = require("../roomManager");
const { resolveSteal } = require("../chipLedger");
const { startStealTimer, startTradeTimer, clearStealTimer, clearPhaseTimer } = require("../timers");
const { expirePendingOffers } = require("./tradeHandlers");
const { endTradePhase } = require("./readHandlers");
const { RESUME_TRADE_MS } = require("../config");

function registerStealHandlers(io, socket) {

  socket.on("TRIGGER_STEAL", () => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.phase !== "trade") {
      return socket.emit("ROOM_ERROR", { code: "INVALID_PHASE", message: "Can only steal during trade phase." });
    }
    if (room.stealState) {
      return socket.emit("ROOM_ERROR", { code: "STEAL_ACTIVE", message: "A steal is already in progress." });
    }

    const stealer = room.players.get(socket.id);
    if (!stealer) return;

    if (stealer.hasStolen) {
      return socket.emit("ROOM_ERROR", { code: "ALREADY_STOLEN", message: "You already attempted a steal this round." });
    }

    // Prevent stealing after participating in a trade
    const hasTraded = [...room.tradeOffers.values()].some(offer =>
      offer.status === "accepted" &&
      (offer.fromSocketId === socket.id || offer.toSocketId === socket.id)
    );
    if (hasTraded) {
      return socket.emit("ROOM_ERROR", { code: "ALREADY_TRADED", message: "You cannot steal after trading." });
    }

    // Freeze trades
    expirePendingOffers(io, room);
    clearPhaseTimer(room);
    room.phase = "steal";

    stealer.hasStolen = true;
    stealer.stats.steals++;

    io.to(room.code).emit("STEAL_INITIATED", {
      stealerSocketId: socket.id,
      stealerPlayer: rm.publicPlayer(stealer),
      durationMs: 15000,
    });

    startStealTimer(room, socket.id, () => autoFailSteal(io, room));
  });

  socket.on("SUBMIT_STEAL", ({ answer }) => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.phase !== "steal") return;
    if (!room.stealState || room.stealState.stealerSocketId !== socket.id) return;
    if (room.stealState.resolved) return; // guard double-resolution

    const { validateAnswer } = require("../gameEngine");
    const correct = validateAnswer(answer, room.currentRound.answer);
    resolveStealOutcome(io, room, correct);
  });
}

function autoFailSteal(io, room) {
  if (!room.stealState || room.stealState.resolved) return;
  resolveStealOutcome(io, room, false);
  io.to(room.code).emit("STEAL_TIMEOUT", { stealerSocketId: room.stealState.stealerSocketId });
}

function resolveStealOutcome(io, room, correct) {
  clearStealTimer(room);
  room.stealState.resolved = true;

  const deltas = resolveSteal(room, room.stealState.stealerSocketId, correct);

  io.to(room.code).emit("STEAL_RESULT", {
    correct,
    questionAnswer: room.currentRound.answer,
    stealerSocketId: room.stealState.stealerSocketId,
    chipDeltas: deltas,
    players: rm.publicPlayers(room),
  });

  // Broadcast updated chips
  for (const { socketId, chips } of deltas) {
    io.to(room.code).emit("CHIPS_UPDATED", { socketId, chips });
  }

  // If wrong steal, the round continues into answer phase after a short delay
  // If correct steal, the round is over — skip to next round
  if (correct) {
    // Track correct steal
    const stealer = room.players.get(room.stealState.stealerSocketId);
    if (stealer) stealer.stats.correct++;

    setTimeout(() => advanceAfterSteal(io, room, true), 4000);
  } else {
    // Round continues — resume trade so others can still trade/steal.
    // The stealer is locked out (hasStolen=true) and auto-passed for the answer phase.
    setTimeout(() => resumeTradePhase(io, room), 3000);
  }
}

function resumeTradePhase(io, room) {
  const stealerId = room.stealState?.stealerSocketId;

  // Auto-pass the stealer into the answer buffer before clearing steal state
  if (stealerId && !room.answerBuffer.has(stealerId)) {
    room.answerBuffer.set(stealerId, { answer: null, submittedAt: Date.now(), fromSteal: true });
  }

  room.stealState = null;
  room.phase = "trade";
  room.endTradeVotes = new Set();

  // Notify clients: stealer is already locked in, then resume trade
  if (stealerId) {
    io.to(room.code).emit("ANSWER_RECEIVED", { socketId: stealerId });
  }
  const activePlayers = [...room.players.values()].filter(p => !p.hasStolen).length;
  io.to(room.code).emit("TRADE_VOTE_UPDATE", { votes: 0, total: activePlayers });
  io.to(room.code).emit("TRADE_PHASE_START", { tradeWindowMs: RESUME_TRADE_MS });

  startTradeTimer(room, () => endTradePhase(io, room), RESUME_TRADE_MS);
}

function advanceAfterSteal(io, room, stealWon) {
  const { resolveRound } = require("./readHandlers");

  if (stealWon) {
    // Stealer won — skip normal answer phase, go straight to round result
    // Mark everyone as passed except the stealer (handled in chips already)
    room.phase = "answer"; // need this for resolveRound check
    for (const [sid] of room.players) {
      if (sid !== room.stealState.stealerSocketId) {
        room.answerBuffer.set(sid, { answer: null, submittedAt: Date.now() });
      }
    }
    // Stealer's correct answer is already resolved via chip ledger; mark as correct
    room.answerBuffer.set(room.stealState.stealerSocketId, {
      answer: room.currentRound.answer,
      submittedAt: Date.now(),
      fromSteal: true,
    });
    resolveRound(io, room);
  }
}

module.exports = { registerStealHandlers };
