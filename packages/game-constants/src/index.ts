export const STEAL_DURATION_MS = 15_000;
export const TRADE_DURATION_MS = 60_000;
export const RESUME_TRADE_MS = 30_000;
export const READ_FORCE_ADVANCE_MS = 30_000;
export const ANSWER_DURATION_MS = 60_000;
export const STARTING_CHIPS = 10;
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 8;
export const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const ROOM_CODE_LENGTH = 4;

export const STEAL_REWARD = 8;
export const STEAL_BYSTANDER_PENALTY = 1;
export const STEAL_FAILURE_PENALTY = 5;
export const ANSWER_REWARD = 5;
export const ANSWER_PENALTY = 2;
export const POISON_SOLD_BONUS = 1;

export type Pack = "Mixed" | "Science" | "History" | "Pop Culture";
export type Phase =
  | "lobby"
  | "countdown"
  | "read"
  | "trade"
  | "steal"
  | "answer"
  | "result"
  | "leaderboard";
export type QuestionType = "normal" | "poison";
export type OfferStatus = "pending" | "accepted" | "rejected" | "expired";
