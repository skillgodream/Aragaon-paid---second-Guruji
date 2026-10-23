export type SlideType =
  | 'WELCOME'
  | 'OBJECTIVES'
  | 'SECTION_INTRO'
  | 'TEACH_STEP'
  | 'DO_DONT'
  | 'IMPORTANT_RULE'
  | 'REAL_WORLD_SCENARIO'
  | 'DECISION'
  | 'KEY_TAKEAWAYS'
  | 'COMPLETION'
  | 'FEYNMAN_CARD';

export type FeynmanCardType =
  | 'concept_analogy'
  | 'critical_rules'
  | 'process_steps'
  | 'pitfalls_troubleshooting'
  | 'scenario_quiz'
  | 'quick_reference';

export interface FeynmanCardMetadata {
  cardType: FeynmanCardType;
  feynmanExplanation: string;
  badgeText?: string;
  analogy?: {
    metaphor: string;
    takeaway: string;
  };
  criticalRules?: {
    type: 'must_do' | 'never_do' | 'warning';
    rule: string;
    consequenceOfFailure: string;
    verificationCheck: string;
  }[];
  steps?: {
    stepNumber: number;
    title: string;
    action: string;
    whyItMatters: string;
    criticalWatchout?: string;
  }[];
  pitfalls?: {
    symptomOrMistake: string;
    rootCause: string;
    immediateFix: string;
  }[];
  quiz?: {
    scenario: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    feynmanFeedback: string;
    distractorExplanations: string[];
  };
}

export interface GurujiCoaching {
  explanation: string;
  probingQuestion?: string;
  expectedResponse?: string;
  feedback?: string;
  whyItMatters: string;
  nextMove: string;
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  why?: string;
}

export interface DecisionOption {
  t: string;
  why: string;
  ok?: number;
}

export interface Slide {
  type: SlideType;
  title: string;
  content?: string;
  tag?: string;
  role?: string;
  cta?: string;
  sec?: string;
  step?: string;
  lead?: string;
  items?: string[];
  fl?: string[]; // Floating checklist items in Section Intro
  ic?: string;   // Icon key
  slash?: boolean | number;
  dos?: string[];
  donts?: string[];
  opts?: DecisionOption[];
  choices?: Choice[];
  why?: string;
  next?: string;
  nb?: string;
  img?: string;
  alt?: string;
  gurujiCoaching?: GurujiCoaching;
  comparison?: { do: string[]; dont: string[] };
  evidenceSource?: string;
  visualFormat?: string;
  teachingMethod?: string;
  feynmanMetadata?: FeynmanCardMetadata;
}

export interface TeachMePlan {
  lessonId: string;
  title: string;
  slides: Slide[];
  teachingBlueprint?: any;
  adaptiveSlides?: any[];
  qaReport?: any;
}

export type SlidePlan = TeachMePlan & {
  domain?: string;
};
