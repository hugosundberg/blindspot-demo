import type { Pack } from "@blindspot/game-constants";
import { QUESTIONS } from "./questions";
import type { FragmentAssignment, Question, RoundQuestion } from "./types";

export { QUESTIONS } from "./questions";
export type { FragmentAssignment, Question, RoundQuestion } from "./types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(pool: Question[], type: string, exclude: string[] = []): Question | undefined {
  const candidates = pool.filter((q) => q.type === type && !exclude.includes(q.id));
  const fallback = QUESTIONS.filter((q) => q.type === type && !exclude.includes(q.id));
  const source = candidates.length > 0 ? candidates : fallback;
  return source[Math.floor(Math.random() * source.length)];
}

export function selectRounds(pack: Pack, count = 15): RoundQuestion[] {
  const pool = pack === "Mixed" ? QUESTIONS : QUESTIONS.filter((q) => q.pack === pack);
  const cycle = ["normal", "normal", "poison"] as const;
  const rounds: RoundQuestion[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    const type = cycle[i % cycle.length];
    let q = pick(pool, type, [...usedIds]);
    if (!q) q = pick(pool, type, []);
    if (!q) throw new Error(`No questions available for pack "${pack}" type "${type}"`);
    usedIds.add(q.id);
    rounds.push({ ...q, num: i + 1 });
  }
  return rounds;
}

export function distributeFragments(
  question: Question,
  playerIds: string[]
): Map<string, FragmentAssignment> {
  const ids = [...playerIds];
  const distribution = new Map<string, FragmentAssignment>();

  if (question.type === "poison") {
    const poisonIdx = Math.floor(Math.random() * ids.length);
    const realFragments = shuffle([question.fragment, ...question.otherFragments]);
    let realIdx = 0;
    for (let i = 0; i < ids.length; i++) {
      if (i === poisonIdx) {
        distribution.set(ids[i], { fragment: question.poisonFragment!, isPoison: true });
      } else {
        distribution.set(ids[i], {
          fragment: realFragments[realIdx % realFragments.length],
          isPoison: false,
        });
        realIdx++;
      }
    }
  } else {
    const all = shuffle([question.fragment, ...question.otherFragments]);
    for (let i = 0; i < ids.length; i++) {
      distribution.set(ids[i], { fragment: all[i % all.length], isPoison: false });
    }
  }

  return distribution;
}

export function normalizeAnswer(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/^(the|a|an)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateAnswer(submitted: string | undefined | null, canonical: string): boolean {
  if (!submitted || typeof submitted !== "string") return false;
  return normalizeAnswer(submitted) === normalizeAnswer(canonical);
}
