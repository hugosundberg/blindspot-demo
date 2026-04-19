import type { Pack, QuestionType } from "@blindspot/game-constants";

export interface Question {
  id: string;
  pack: Pack;
  category: string;
  type: QuestionType;
  answer: string;
  fragment: string;
  otherFragments: string[];
  poisonFragment?: string;
}

export interface RoundQuestion extends Question {
  num: number;
}

export interface FragmentAssignment {
  fragment: string;
  isPoison: boolean;
}
