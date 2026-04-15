const rm = require("../roomManager");
const { resolveSteal } = require("../chipLedger");
const { startStealTimer, clearStealTimer, clearPhaseTimer } = require("../timers");
const { expirePendingOffers } = require("./tradeHandlers");
const { startAnswerPhase } = require("./readHandlers");

function registerStealHandlers(io, socket) {

  socket.on("TRIGGER_STEAL", () => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.phase !== "trade") {
      return socket.emit("ROOM_ERROR", { code: "INVALID_PHASE", message: "Can only steal during trade phase." });
    }
    if (room.stealState) {
      return socket.emit("ROOM_ERROR", { code: "STEAL_ACTIVE", message: "A steal is already in progress." });
    }

    // Freeze trades
    expirePendingOffers(io, room);
    clearPhaseTimer(room);
    room.phase = "steal";

    const stealer = room.players.get(socket.id);
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
    // Round continues; other players still answer
    setTimeout(() => startAnswerPhase(io, room), 3000);
  }
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
