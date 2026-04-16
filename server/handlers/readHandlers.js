const rm = require("../roomManager");
const { distributeFragments } = require("../gameEngine");
const { startReadTimer, clearPhaseTimer } = require("../timers");
const { TRADE_DURATION_MS } = require("../config");

function registerReadHandlers(io, socket) {
  socket.on("READY_TO_TRADE", () => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.phase !== "read") return;

    const player = room.players.get(socket.id);
    if (!player) return;
    player.readyToTrade = true;

    // Broadcast updated ready status
    io.to(room.code).emit("PLAYERS_STATUS", {
      players: rm.publicPlayers(room).map(p => ({
        ...p,
        readyToTrade: room.players.get(p.socketId)?.readyToTrade || false,
      })),
    });

    // If all players are ready, start trade phase immediately
    const allReady = [...room.players.values()].every(p => p.readyToTrade);
    if (allReady) {
      clearPhaseTimer(room);
      startTradePhase(io, room);
    }
  });

  socket.on("VOTE_END_TRADE", () => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.phase !== "trade") return;
    if (room.stealState) return; // votes are frozen during a steal

    room.endTradeVotes.add(socket.id);

    // Players who failed a steal are already locked out of answering and don't
    // count toward the vote threshold — only active (non-stolen) players need to agree.
    const activePlayers = [...room.players.values()].filter(p => !p.hasStolen).length;

    io.to(room.code).emit("TRADE_VOTE_UPDATE", {
      votes: room.endTradeVotes.size,
      total: activePlayers,
    });

    if (room.endTradeVotes.size >= activePlayers) {
      clearPhaseTimer(room);
      endTradePhase(io, room);
    }
  });
}

/** Called from lobbyHandlers and answerHandlers (next round). */
function startRound(io, room) {
  const question = room.rounds[room.roundIndex];
  if (!question) {
    // Game over
    return endGame(io, room);
  }

  room.phase = "read";
  room.currentRound = question;
  room.answerBuffer = new Map();
  room.tradeOffers = new Map();
  room.endTradeVotes = new Set();
  room.stealState = null;

  // Reset per-round player state
  for (const p of room.players.values()) {
    p.readyToTrade = false;
    p.fragment = null;
    p.isPoison = false;
    p.hasStolen = false;
  }

  // Distribute fragments
  const dist = distributeFragments(question, room.players.keys());
  let poisonSocketId = null;
  for (const [sid, { fragment, isPoison }] of dist) {
    const p = room.players.get(sid);
    p.fragment = fragment;
    p.isPoison = isPoison;
    if (isPoison) poisonSocketId = sid;
  }
  room.currentRound.poisonSocketId = poisonSocketId;

  // Send each player their private fragment
  for (const [sid, { fragment, isPoison }] of dist) {
    const player = room.players.get(sid);
    io.to(sid).emit("ROUND_START", {
      roundIndex: room.roundIndex,
      roundNum: question.num,
      totalRounds: room.totalRounds,
      category: question.category,
      questionType: question.type,
      fragment,
      isPoison,
      players: rm.publicPlayers(room),
    });
  }

  // Force advance to trade after READ_FORCE_ADVANCE_MS if not all ready
  startReadTimer(room, () => startTradePhase(io, room));
}

function startTradePhase(io, room) {
  if (room.phase !== "read") return;
  room.phase = "trade";
  const { TRADE_DURATION_MS } = require("../config");
  const { startTradeTimer } = require("../timers");

  io.to(room.code).emit("TRADE_PHASE_START", {
    tradeWindowMs: TRADE_DURATION_MS,
  });

  startTradeTimer(room, () => endTradePhase(io, room));
}

function endTradePhase(io, room) {
  if (room.phase !== "trade") return;
  io.to(room.code).emit("TRADE_PHASE_END", {});
  startAnswerPhase(io, room);
}

function startAnswerPhase(io, room) {
  room.phase = "answer";
  const { ANSWER_DURATION_MS } = require("../config");
  const { startAnswerTimer } = require("../timers");

  io.to(room.code).emit("ANSWER_PHASE_START", {
    timeLimitMs: ANSWER_DURATION_MS,
    questionType: room.currentRound.type,
  });

  startAnswerTimer(room, () => flushAnswers(io, room));
}

function flushAnswers(io, room) {
  // Auto-pass anyone who hasn't submitted
  for (const [sid] of room.players) {
    if (!room.answerBuffer.has(sid)) {
      room.answerBuffer.set(sid, { answer: null, submittedAt: Date.now() });
    }
  }
  resolveRound(io, room);
}

function resolveRound(io, room) {
  if (room.phase !== "answer") return;
  room.phase = "result";

  const { validateAnswer } = require("../gameEngine");
  const { resolveAnswer } = require("../chipLedger");
  const question = room.currentRound;
  const chipDeltas = [];

  for (const [sid, entry] of room.answerBuffer) {
    const correct = entry.answer === null ? null : validateAnswer(entry.answer, question.answer);
    const deltas = resolveAnswer(room, sid, correct);
    if (correct === true) {
      const p = room.players.get(sid);
      if (p) p.stats.correct++;
    }
    deltas.forEach(d => chipDeltas.push({ ...d, correct }));
  }

  const payload = {
    questionAnswer: question.answer,
    category: question.category,
    questionType: question.type,
    chipDeltas,
    players: rm.publicPlayers(room),
  };

  if (question.type === "poison") {
    // Add poison reveal info
    const poisonHolder = room.players.get(question.poisonSocketId);
    const soldTo = [];
    for (const [, offer] of room.tradeOffers) {
      if (offer.fromSocketId === question.poisonSocketId && offer.status === "accepted") {
        soldTo.push({ buyerSocketId: offer.toSocketId, chipAmount: offer.chipAmount });
      }
    }
    payload.poisonReveal = {
      poisonHolderSocketId: question.poisonSocketId,
      poisonFragment: question.poisonFragment,
      soldTo,
    };
  }

  io.to(room.code).emit("ROUND_RESULT", payload);

  // Advance to next round after a delay, or end game
  const isLastRound = room.roundIndex >= room.totalRounds - 1;
  setTimeout(() => {
    if (isLastRound) {
      endGame(io, room);
    } else {
      room.roundIndex++;
      startRound(io, room);
    }
  }, 8000); // 8s for the result screen before auto-advancing
}

function endGame(io, room) {
  room.phase = "leaderboard";
  const players = rm.publicPlayers(room).sort((a, b) => b.chips - a.chips);
  io.to(room.code).emit("LEADERBOARD", {
    players,
    finalRound: true,
  });
}

module.exports = { registerReadHandlers, startRound, startTradePhase, endTradePhase, startAnswerPhase, flushAnswers, resolveRound };
