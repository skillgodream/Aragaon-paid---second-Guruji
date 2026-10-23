export interface CardImage {
  diagramType: 'protein_origami' | 'cleanroom' | 'flowchart' | 'cold_chain' | 'incident_triage';
  url?: string;
  alt?: string;
}

export interface CriticalRule {
  type: 'never_do' | 'must_do' | 'warning';
  rule: string;
  consequenceOfFailure: string;
  verificationCheck: string;
}

export interface Analogy {
  metaphor: string;
  takeaway: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  action: string;
  whyItMatters: string;
  criticalWatchout?: string;
}

export interface ReferenceItem {
  label: string;
  value: string;
  detail: string;
}

export interface QuizData {
  scenario: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  feynmanFeedback: string;
  distractorExplanations: string[];
}

export interface Pitfall {
  symptomOrMistake: string;
  rootCause: string;
  immediateFix: string;
}

export interface DeckCard {
  title: string;
  subtitle?: string;
  feynmanExplanation: string;
  badgeText?: string;
  image?: CardImage;
  analogy?: Analogy;
  criticalRules?: CriticalRule[];
  steps?: ProcessStep[];
  referenceItems?: ReferenceItem[];
  quiz?: QuizData;
  pitfalls?: Pitfall[];
}

export interface FeynmanCoreConcept {
    centralAnalogy: {
        title: string;
        analogyText: string;
        howItMapsToSOP: string;
    }
}

export interface FeynmanDeck {
    title: string;
    summary: string;
    originalDocType: string;
    estimatedMinutes: number;
    targetAudience: string;
    heroImage?: CardImage;
    feynmanCoreConcept: FeynmanCoreConcept;
    cards: DeckCard[];
}
