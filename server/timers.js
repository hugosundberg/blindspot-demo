const { TRADE_DURATION_MS, STEAL_DURATION_MS, ANSWER_DURATION_MS, READ_FORCE_ADVANCE_MS } = require("./config");

function startReadTimer(room, onExpire) {
  clearPhaseTimer(room);
  room.phaseTimer = setTimeout(onExpire, READ_FORCE_ADVANCE_MS);
}

function startTradeTimer(room, onExpire, durationMs = TRADE_DURATION_MS) {
  clearPhaseTimer(room);
  room.phaseTimer = setTimeout(onExpire, durationMs);
}

function startAnswerTimer(room, onExpire) {
  clearPhaseTimer(room);
  room.phaseTimer = setTimeout(onExpire, ANSWER_DURATION_MS);
}

function clearPhaseTimer(room) {
  if (room.phaseTimer) {
    clearTimeout(room.phaseTimer);
    room.phaseTimer = null;
  }
}

function startStealTimer(room, stealerSocketId, onExpire) {
  clearPhaseTimer(room); // kills the trade timer
  room.stealState = {
    stealerSocketId,
    startedAt: Date.now(),
    resolved: false,
    timerRef: setTimeout(onExpire, STEAL_DURATION_MS),
  };
}

function clearStealTimer(room) {
  if (room.stealState?.timerRef) {
    clearTimeout(room.stealState.timerRef);
  }
}

module.exports = {
  startReadTimer, startTradeTimer, startAnswerTimer, clearPhaseTimer,
  startStealTimer, clearStealTimer,
};
