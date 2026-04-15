module.exports = {
  PORT: process.env.PORT || 4001,
  STEAL_DURATION_MS: 15_000,
  TRADE_DURATION_MS: 60_000,
  READ_FORCE_ADVANCE_MS: 30_000,   // host's forced-advance if not all players ready
  ANSWER_DURATION_MS: 60_000,
  STARTING_CHIPS: 10,
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 8,
  ROOM_CODE_CHARS: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", // no confusable chars
  ROOM_CODE_LENGTH: 4,
};
