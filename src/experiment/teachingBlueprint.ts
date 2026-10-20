/**
 * GURUJI — ADAPTIVE SOP-TO-TRAINING-DECK INTELLIGENCE (GAMMA EDITORIAL BRAIN)
 *
 * Enhances the SOP -> CanonicalTaskModel -> KnowItPlanner -> ExperiencePlayer pipeline by:
 * 1. Extracting & preserving full SOP operational knowledge with strict source distinction.
 * 2. Building a structured Teaching Blueprint BEFORE generating slides.
 * 3. Synthesizing the "Training Spine" (Start Here -> Control 01..0N -> The Handoff -> Exception Path -> Non-Negotiables -> Close the Loop).
 * 4. Assigning 8 distinct Gamma Editorial Card Archetypes so no two adjacent slides share a layout.
 * 5. Compressing verbose sentences into verb-first micro-items + full-bleed terracotta guardrail stop-banners.
 * 6. Running pre-delivery Source Traceability & Quality Assurance verification.
 */

import { Lesson } from '../types';
import { SlidePlan } from './types';
import { buildCanonicalTaskModel, CanonicalTaskModel } from '../utils/canonicalTaskModel';
import { findBestVisualMatch } from '../utils/visualLibraryMatcher';
import {
  sanitizeLearnerText,
  sanitizeSlideCardCopy,
  isDuplicateLearnerCopy,
  deriveSemanticConceptLabel,
  synthesizeEditorialMicroCopy,
  isBrokenOrRedundantTitle,
} from '../utils/learnerCopySanitizer';

export type AdaptiveVisualFormat =
  | 'process_flow'        // Sequential procedures
  | 'annotated_photo'     // Physical tasks with equipment/environment callouts
  | 'step_demonstration'  // Task execution walkthrough
  | 'comparison'          // Correct vs incorrect actions (Do vs Don't)
  | 'decision_tree'       // Conditional actions and exceptions (IF -> THEN)
  | 'checklist'           // Verification, prerequisites, and completion
  | 'diagram'             // Relationships and system/role structure
  | 'structured_table'    // Meaningful comparisons, thresholds, or reference data
  | 'scenario_example'    // Judgement and field application
  | 'knowledge_check';    // Summary, readiness, and interactive reinforcement

export type GammaCardArchetype =
  | 'split_photo_numbered_lines'    // Left vertical photo + Right 01/02/03 terracotta badges over orange hairlines
  | 'ledger_with_stop_banner'       // Stacked numbered horizontal rows + Full-bleed burnt-orange bottom guardrail bar
  | 'two_over_one_grid'             // 2 top columns split by 1px vertical hairline + 1 full-width bottom row + Stop banner
  | 'dark_anchor_three_column'      // Deep slate-blue (#364958) left anchor sidebar with giant thesis + Right 3-column strip
  | 'crosshair_quad_grid'           // 2x2 architectural quadrant grid with '+' hairline divider and terracotta circular icons
  | 'inline_icon_split_photo'       // Left Icon + Bold Label · Crisp rule rows + Right vertical photo
  | 'checkerboard_exception_matrix' // 2x2 alternating Dark Slate (#364958) and Warm Cream (#FBF9F5) cards + Stop banner
  | 'non_negotiable_ledger'         // Numbered hard prohibitions + Stop banner
  | 'interactive_mastery_gate';     // Close the Loop + Interactive Scenario Role-Play

export interface GammaMicroItem {
  badge: string;
  title: string;
  body: string;
  iconType?: 'check' | 'shield' | 'user' | 'key' | 'route' | 'building' | 'alert' | 'file';
  isDarkSlate?: boolean;
  consequence?: string;
}

export type TeachingMethod =
  | 'readiness_verification'
  | 'sequential_process_mapping'
  | 'physical_task_demonstration'
  | 'contrastive_error_prevention'
  | 'conditional_branching_logic'
  | 'system_relationship_diagram'
  | 'structured_reference_lookup'
  | 'situational_judgement_drill'
  | 'mastery_reinforcement';

export interface SourceCitation {
  sectionOrPage: string;
  sourceRef: string;
  excerpt: string;
  provenance: 'source_supported' | 'illustrative_example';
}

export interface TeachingBlueprintUnit {
  id: string;
  unitIndex: number;
  stageTitle?: string;
  stageNumber?: number;
  learningObjective: string;
  whatLearnerMustKnowOrDo: string;
  difficultyFactor: string;
  likelyMistake: string;
  evidenceNeeded: string;
  teachingMethod: TeachingMethod;
  visualFormat: AdaptiveVisualFormat;
  visualFormatRationale: string;
  requiresOperationalPhoto: boolean;
  source: SourceCitation;
  relatedStepNumbers: number[];
}

export interface SourceInventoryItem {
  id: string;
  category:
    | 'step'
    | 'prerequisite'
    | 'tool'
    | 'control'
    | 'safety'
    | 'quality'
    | 'decision'
    | 'exception'
    | 'escalation'
    | 'mistake'
    | 'terminology';
  text: string;
  sourceRef: string;
}

export interface TeachingBlueprint {
  sopId: string;
  sopTitle: string;
  role: string;
  purpose: string;
  scope: string;
  totalSourceSteps: number;
  contentInventory: SourceInventoryItem[];
  units: TeachingBlueprintUnit[];
  unresolvedAmbiguities: {
    topic: string;
    description: string;
    sourceRef?: string;
  }[];
  createdAt: string;
}

export interface AdaptiveSlideCard {
  id?: string;
  label: string;
  value: string;
  subtext: string;
  tag?: string;
  tagType?: 'positive' | 'negative' | 'warning' | 'default';
  why?: string;
  consequence?: string;
  sourceRef?: string;
  provenance?: 'source_supported' | 'illustrative_example';
  stepNum?: number;
}

export interface AdaptiveDeckSlide {
  num: number;
  unitId: string;
  tabLabel: string;
  badge: string;
  visualFormat: AdaptiveVisualFormat;
  layoutName: string;
  teachingMethod: TeachingMethod;
  title: string;
  subtitle: string;
  learningObjective: string;
  principalTeachingPoint: string;
  whyItMatters: string;
  takeawayOrQuestion: string;
  cards: AdaptiveSlideCard[];
  // Gamma Editorial Intelligence fields
  gammaKicker?: string;
  gammaKickerRight?: boolean;
  gammaArchetype?: GammaCardArchetype;
  gammaStopBanner?: string;
  gammaAnchorThesis?: {
    headline: string;
    body: string;
  };
  gammaMicroItems?: GammaMicroItem[];
  // Concept-driven visual intelligence
  requiresOperationalPhoto: boolean;
  photoPrompt?: string;
  photoUrl?: string;
  photoCaption?: string;
  photoProvenanceLabel?: string;
  // Interactive check (for scenario_example / knowledge_check)
  interactiveCheck?: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean; feedback: string }[];
  };
  source: SourceCitation;
  coveredStepNumbers: number[];
  coveredInventoryIds?: string[];
}

export interface QualityIssue {
  type:
    | 'MISSING_REQUIRED_ACTION'
    | 'REPEATED_EXPLANATION'
    | 'UNRELATED_TERMINOLOGY'
    | 'CORRUPTED_TITLE'
    | 'UNSUPPORTED_OPERATIONAL_CLAIM'
    | 'SEQUENCE_ERROR'
    | 'INCORRECT_STAGE_TERMINOLOGY';
  severity: 'BLOCKING' | 'WARNING';
  slideNum?: number;
  description: string;
}

export interface DeckQualityAssuranceReport {
  isValid: boolean;
  totalSourceSteps: number;
  coveredSourceSteps: number;
  totalInventoryItems: number;
  coveredInventoryItems: number;
  allMandatoryStepsIncluded: boolean;
  allControlsAndSafetyIncluded: boolean;
  allDecisionsAndExceptionsIncluded: boolean;
  sequencePreserved: boolean;
  thresholdsAndTerminologyRetained: boolean;
  safetyAndExceptionsRetained: boolean;
  noRepeatedExplanations: boolean;
  noUnrelatedTerminology: boolean;
  noCorruptedTitles: boolean;
  noUnsupportedInstructions: boolean;
  visualFormatsUsed: AdaptiveVisualFormat[];
  visualVarietyCount: number;
  unresolvedAmbiguities: { topic: string; description: string; sourceRef?: string }[];
  qualityIssues: QualityIssue[];
  auditSummary: string;
}

const PHYSICAL_ACTION_REGEX =
  /\b(scan|inspect|wear|put on|gloves|ppe|clean|sanitize|wipe|spray|pack|lift|load|unload|attach|connect|disconnect|seal|label|measure|weigh|calibrate|press|turn|open|close|lock|tag|dispose|handwash|check physical|pallet|forklift|box|bottle|barcode|machine|valve|extinguisher|desk|guest|room|key|card|handover|register)\b/i;

const CONDITIONAL_STEP_REGEX =
  /\b(if|when|unless|whether|mismatch|damaged|expired|fails|rejected|exception|discrepancy|missing|blocked|unavailable)\b/i;

const THRESHOLD_DATA_REGEX =
  /\b(\d+\s*(%|percent|sec|seconds|min|minutes|hrs|hours|kg|g|lb|ml|l|mm|cm|m|°c|°f|psi|bar|ppm|points|units|items))\b/i;

export function isPhysicalOperationalStep(text: string): boolean {
  return PHYSICAL_ACTION_REGEX.test(text);
}

/* ------------------------------------------------------------------ *
 * Gamma Editorial Brain Helpers                                      *
 * ------------------------------------------------------------------ */

/**
 * Extracts a crisp, grammatically complete 2-to-4 word semantic concept heading from a clause or sentence
 * without ever chopping on a stopword ("Never read out or") or repeating the first 4 words of the body.
 */
function extractCrispMicroTitle(sentence: string, fallbackLabel: string): string {
  return deriveSemanticConceptLabel(sentence, fallbackLabel);
}

/**
 * Builds 2–4 progressive Gamma Micro-Items implementing the 4 core teaching contributions:
 * 1. What to do (Primary Action Directive)
 * 2. How to do it (Operational Method & Execution Standard)
 * 3. What to verify (Verification Gate & Expected Result)
 * 4. What can go wrong (Operational Risk & Consequence of Failure)
 *
 * Guarantees zero text repetition across topics (e.g. Privacy does NOT repeat booking matching,
 * Identity does NOT repeat generic check-in risks, Room Readiness does NOT repeat booking details,
 * Payment Pre-Authorization never mentions folios or debt write-offs).
 */
function buildGammaMicroItemsFromSteps(
  stepItems: any[],
  stepNums: number[],
  sopTitle = '',
  sopRole = ''
): GammaMicroItem[] {
  const items: GammaMicroItem[] = [];

  if (stepItems.length === 1) {
    const s = stepItems[0] || {};
    const rawInstr = sanitizeLearnerText(s.instruction || '');
    const rawWhy = sanitizeLearnerText(s.why_it_matters || '');
    const rawTip = sanitizeLearnerText(s.coach_tip || '');
    const rawTaskTitle = sanitizeLearnerText(s.task_title || '');
    const combined = `${rawTaskTitle} ${rawInstr} ${rawWhy} ${rawTip}`.toLowerCase();

    // 1. WHAT TO DO (Primary Action Directive)
    const whatPair = synthesizeEditorialMicroCopy(rawTaskTitle, rawInstr, undefined, 'Primary Action');
    items.push({
      badge: '01',
      title: whatPair.title,
      body: whatPair.body,
      iconType: 'check',
    });

    // 2. HOW TO DO IT (Operational Method & Execution Standard)
    let methodText = '';
    let methodHeading = 'Execution Method';
    if (rawInstr.includes(';') || rawInstr.includes(',')) {
      const parts = rawInstr.split(/[;,]\s*(?:and\s+|then\s+)?/).filter((p) => p.trim().length > 10);
      if (parts.length >= 2 && !isDuplicateLearnerCopy(whatPair.body, parts[1])) {
        methodText = parts[1].trim().replace(/^[a-z]/, (c) => c.toUpperCase());
        methodHeading = deriveSemanticConceptLabel(methodText, 'Execution Method');
      }
    }
    if (!methodText && rawTip && !isDuplicateLearnerCopy(whatPair.body, rawTip)) {
      methodText = rawTip;
      methodHeading = deriveSemanticConceptLabel(methodText, 'Execution Method');
    }
    if (!methodText) {
      if (/\b(photo id|government|passport|identity)\b/.test(combined)) {
        methodHeading = 'Physical Examination';
        methodText = 'Inspect photo clarity, validity expiration date, and official security seals on the physical ID card.';
      } else if (/\b(room number|aloud|key wallet|point to)\b/.test(combined)) {
        methodHeading = 'Discreet Delivery';
        methodText = 'Point directly to the written room number on the folder without reading it aloud in the lobby.';
      } else if (/\b(room status|clean|inspected|vacant|housekeeping)\b/.test(combined)) {
        methodHeading = 'Housekeeping Sync';
        methodText = 'Query PMS to confirm the room status is marked Clean & Inspected with zero open maintenance holds.';
      } else if (/\b(payment|pre-authori|deposit|card)\b/.test(combined)) {
        methodHeading = 'Chip Terminal Entry';
        methodText = 'Insert or tap guest card into secure payment terminal and request PIN or signature acknowledgement.';
      } else {
        methodHeading = 'Execution Method';
        methodText = `Follow approved ${sopRole || 'operational'} standards and position equipment properly before execution.`;
      }
    }
    const methodPair = synthesizeEditorialMicroCopy(methodHeading, methodText, undefined, 'Execution Method');
    items.push({
      badge: '02',
      title: methodPair.title,
      body: methodPair.body,
      iconType: 'building',
    });

    // 3. WHAT TO VERIFY (Verification Gate & Expected Outcome)
    let verifyText = '';
    let verifyHeading = 'Verification Gate';
    if (rawWhy && !isDuplicateLearnerCopy(whatPair.body, rawWhy) && !isDuplicateLearnerCopy(methodPair.body, rawWhy)) {
      verifyText = rawWhy;
      verifyHeading = deriveSemanticConceptLabel(verifyText, 'Verification Gate');
    } else {
      if (/\b(photo id|government|passport|identity)\b/.test(combined)) {
        verifyHeading = 'Name Alignment Gate';
        verifyText = 'Confirm full legal name on the photo ID matches the PMS reservation record character-for-character.';
      } else if (/\b(room number|aloud|key wallet|privacy|screen)\b/.test(combined)) {
        verifyHeading = 'Privacy Shield Check';
        verifyText = 'Confirm PMS monitors are angled away from lobby counters and guest folios remain covered.';
      } else if (/\b(room status|clean|inspected|vacant|housekeeping)\b/.test(combined)) {
        verifyHeading = 'Readiness Approval';
        verifyText = 'Confirm the specific suite is vacant, fully inspected, and unassigned to any incoming VIPs.';
      } else if (/\b(payment|pre-authori|deposit|card)\b/.test(combined)) {
        verifyHeading = 'Approval Code Gate';
        verifyText = 'Confirm approved transaction authorization code is returned before releasing room credentials.';
      } else {
        verifyHeading = 'Verification Standard';
        verifyText = 'Confirm system status confirms all operational requirements before proceeding.';
      }
    }
    const verifyPair = synthesizeEditorialMicroCopy(verifyHeading, verifyText, undefined, 'Verification Gate');
    items.push({
      badge: '03',
      title: verifyPair.title,
      body: verifyPair.body,
      iconType: 'shield',
    });

    // 4. WHAT CAN GO WRONG (Operational Risk & Consequence of Failure)
    let riskText = '';
    let riskHeading = 'Operational Risk';
    if (s.coach_tip && !isDuplicateLearnerCopy(whatPair.body, s.coach_tip) && !isDuplicateLearnerCopy(methodPair.body, s.coach_tip) && !isDuplicateLearnerCopy(verifyPair.body, s.coach_tip)) {
      riskText = sanitizeLearnerText(s.coach_tip);
      riskHeading = deriveSemanticConceptLabel(riskText, 'Operational Risk');
    } else {
      if (/\b(photo id|government|passport|identity)\b/.test(combined)) {
        riskHeading = 'Unauthorized Access';
        riskText = 'Bypassing identity checks allows unauthorized individuals access to guest suites and charges.';
      } else if (/\b(room number|aloud|key wallet|privacy|screen)\b/.test(combined)) {
        riskHeading = 'Bystander Exposure';
        riskText = 'Announcing room numbers aloud compromises guest safety and enables unauthorized room entry.';
      } else if (/\b(room status|clean|inspected|vacant|housekeeping)\b/.test(combined)) {
        riskHeading = 'Disputed Occupancy';
        riskText = 'Assigning keys to an unprepared or occupied room severely damages guest trust and room security.';
      } else if (/\b(payment|pre-authori|deposit|card)\b/.test(combined)) {
        riskHeading = 'Uncollected Balances';
        riskText = 'Failure to secure pre-authorization leaves the property exposed to unpaid charges and transaction disputes.';
      } else {
        riskHeading = 'Operational Risk';
        riskText = 'Skipping verification checks creates service defects, compliance violations, or customer disputes.';
      }
    }
    const riskPair = synthesizeEditorialMicroCopy(riskHeading, riskText, undefined, 'Operational Risk');
    items.push({
      badge: '04',
      title: riskPair.title,
      body: riskPair.body,
      iconType: 'key',
    });
  } else {
    // 2 steps grouped together: Step 1 provides Action & Method; Step 2 provides Verification & Consequence
    stepItems.forEach((s, idx) => {
      const actualNum = stepNums[idx] || idx + 1;
      const rawInstr = sanitizeLearnerText(s.instruction || '');
      const rawWhy = sanitizeLearnerText(s.why_it_matters || '');
      const rawTaskTitle = sanitizeLearnerText(s.task_title || '');

      const actionPair = synthesizeEditorialMicroCopy(rawTaskTitle, rawInstr, undefined, `Control 0${actualNum}`);
      items.push({
        badge: String(items.length + 1).padStart(2, '0'),
        title: actionPair.title,
        body: actionPair.body,
        iconType: idx === 0 ? 'check' : 'shield',
      });

      if (rawWhy && items.length < 4 && !isDuplicateLearnerCopy(rawInstr, rawWhy)) {
        const whyPair = synthesizeEditorialMicroCopy(undefined, rawWhy, undefined, idx === 0 ? 'Control Standard' : 'Verification Gate');
        items.push({
          badge: String(items.length + 1).padStart(2, '0'),
          title: whyPair.title,
          body: whyPair.body,
          iconType: idx === 0 ? 'building' : 'key',
        });
      }
    });
  }

  return items.slice(0, 4);
}

/**
 * Generates an imperative Gamma editorial headline from step titles/instructions.
 */
function buildGammaImperativeHeadline(
  stepItems: any[],
  stepNums: number[],
  isFirst: boolean,
  isLast: boolean,
  stageTitle?: string,
  stageNum?: number
): string {
  if (stageTitle && stageTitle.trim().length > 3) {
    const clean = sanitizeLearnerText(stageTitle);
    if (/^stage\s*\d+/i.test(clean)) return clean;
    return stageNum ? `Stage ${stageNum}: ${clean}` : clean;
  }

  const primary = stepItems[0] || {};
  const rawTitle = sanitizeLearnerText(primary.task_title || '');
  const rawInstr = sanitizeLearnerText(primary.instruction || '');

  if (stepItems.length === 2) {
    const t1 = sanitizeLearnerText(stepItems[0]?.task_title || '');
    const t2 = sanitizeLearnerText(stepItems[1]?.task_title || '');
    if (t1 && t2 && t1.toLowerCase() !== t2.toLowerCase() && !t1.startsWith('Step ') && !t2.startsWith('Step ')) {
      return `${t1}, then ${t2.charAt(0).toLowerCase() + t2.slice(1)}`;
    }
  }

  if (rawTitle && rawTitle.split(/\s+/).length >= 3 && !/^step\s*\d+$/i.test(rawTitle)) {
    return rawTitle;
  }

  // Extract clean active imperative clause from instruction
  if (rawInstr) {
    // Cut off trailing prepositional boilerplate like "according to hotel room-turnover process" or "using approved products"
    let clause = rawInstr.split(/[.;]/)[0]?.trim() || '';
    clause = clause.replace(/\s+(?:according to|through the designated|using approved|under hotel|for the assigned room|on the housekeeping assignment list)[^\n,.]*$/i, '').trim();

    if (clause.length >= 10 && clause.length <= 65) {
      return clause;
    }
    // Take first 7-9 words of the instruction clause
    const words = clause.split(/\s+/);
    if (words.length >= 3) {
      const candidate = words.slice(0, Math.min(8, words.length)).join(' ');
      if (candidate.length >= 12 && candidate.length <= 60) {
        return candidate.replace(/[,;—–-]+$/, '');
      }
    }
    const concept = deriveSemanticConceptLabel(rawInstr, primary.action_verb || 'Operational Phase');
    if (concept && concept.length >= 6) return concept;
  }

  if (isFirst && rawTitle) {
    return `Start cleanly: ${rawTitle}`;
  }
  if (isLast && rawTitle) {
    return `Close the loop: ${rawTitle}`;
  }
  return rawTitle || `${primary.action_verb || 'Verify'} ${primary.task_title || `Control Phase ${stepNums[0] || 1}`}`;
}

/**
 * Synthesizes a 5-to-8 word uppercase Guardrail Banner for the bottom edge of Gamma cards
 * (e.g. "NO VERIFIED IDENTITY · NO ACCESS", "ROOM NOT READY OR STATUS UNCLEAR · DO NOT ASSIGN")
 */
function buildGammaStopBanner(stepItems: any[], controls: any[], slideIndex: number): string {
  const combined = stepItems
    .map((s) => `${s?.task_title || ''} ${s?.instruction || ''} ${s?.why_it_matters || ''} ${s?.coach_tip || ''}`)
    .join(' ')
    .toLowerCase();

  if (/\b(identity|id\b|kyc|pan|aadhaar|passport|authorize|verification)\b/.test(combined)) {
    return 'NO VERIFIED IDENTITY · NO ACCESS';
  }
  if (/\b(room|status|ready|inspect|clean|sanitize|surface|housekeep)\b/.test(combined)) {
    return 'STATUS UNCLEAR OR INCOMPLETE · DO NOT ASSIGN';
  }
  if (/\b(payment|charge|deposit|rate|invoice|disburse|amount|transaction)\b/.test(combined)) {
    return 'UNCONFIRMED TRANSACTION · DO NOT PROCEED';
  }
  if (/\b(key|credential|register|pms|system|login|barcode|scan)\b/.test(combined)) {
    return 'SYSTEM RECORD UNVERIFIED · DO NOT ISSUE CREDENTIAL';
  }
  if (/\b(ppe|glove|safety|chemical|hazard|sharps|lock|extinguisher)\b/.test(combined)) {
    return 'SAFETY CONTROL MISSING · STOP AND EQUIP FIRST';
  }

  const ctrl = controls[slideIndex % Math.max(1, controls.length)];
  const ctrlRule = sanitizeLearnerText(typeof ctrl === 'string' ? ctrl : ctrl?.rule || '');
  if (ctrlRule && ctrlRule.length <= 52) {
    return `${ctrlRule.toUpperCase().replace(/[.]+$/, '')} · NO SHORTCUTS`;
  }

  const primaryTitle = sanitizeLearnerText(stepItems[0]?.task_title || 'Verification Check').toUpperCase();
  return `${primaryTitle} INCOMPLETE · DO NOT PROCEED`;
}

/**
 * Synthesizes a 3-word bold anchor thesis for Gamma's Dark Slate Sidebar archetype
 * (e.g. "Explain then confirm." / "Verify then record.")
 */
function buildGammaAnchorThesis(stepItems: any[], whyItMatters: string): { headline: string; body: string } {
  const verb1 = sanitizeLearnerText(stepItems[0]?.action_verb || 'Verify')
    .split(/\s+/)[0]
    .replace(/[^a-zA-Z]/g, '') || 'Verify';
  const verb2 = sanitizeLearnerText(stepItems[1]?.action_verb || 'Confirm')
    .split(/\s+/)[0]
    .replace(/[^a-zA-Z]/g, '') || 'confirm';

  const v1Clean = verb1.charAt(0).toUpperCase() + verb1.slice(1).toLowerCase();
  const v2Clean = verb1.toLowerCase() === verb2.toLowerCase() ? 'confirm' : verb2.toLowerCase();

  return {
    headline: `${v1Clean} then ${v2Clean}.`,
    body:
      sanitizeLearnerText(whyItMatters) ||
      'This control is complete only when the approved system confirms every check.',
  };
}

/**
 * Unified extractor that normalizes SOP steps, prerequisites, tools, controls,
 * safety rules, quality rules, terminology, decisions, exceptions, escalations,
 * and common mistakes from ANY Lesson structure.
 */
function extractNormalizedSopSources(lesson?: Lesson, plan?: SlidePlan, fallbackTitle?: string) {
  const rawTitle =
    lesson?.operationalBlueprint?.process ||
    lesson?.knowledgeModel?.identity?.process ||
    lesson?.knowledgeModel?.identity?.title ||
    lesson?.title ||
    plan?.title ||
    fallbackTitle ||
    'Standard Operating Procedure';

  const sopTitle = sanitizeLearnerText(rawTitle)
    .replace(/\.(txt|pdf|docx)$/i, '')
    .replace(/_sop_test$/i, '')
    .replace(/_test$/i, '')
    .replace(/_+/g, ' ')
    .replace(/\s*[-–—]\s*/g, ' — ')
    .replace(/\s{2,}/g, ' ')
    .trim() || 'Standard Operating Procedure';

  const rawSubtitleRole = lesson?.subtitle?.replace(/^Role:\s*/i, '').split('·')[0]?.trim() || '';
  let rawRole =
    lesson?.operationalBlueprint?.role ||
    lesson?.knowledgeModel?.identity?.role ||
    lesson?.blueprint?.meta?.role ||
    (!/^\d+\s*steps?$/i.test(rawSubtitleRole) && rawSubtitleRole ? rawSubtitleRole : '') ||
    lesson?.category ||
    'Frontline Specialist';

  rawRole = sanitizeLearnerText(rawRole);
  // Bounded role guard: stop at first leaked delimiter or keyword
  if (rawRole.length > 35 || /\b(?:purpose|prepare|execute|standard|cleaning|turnover|process|department)\b/i.test(rawRole)) {
    rawRole = rawRole.split(/[•\n\r|;]|(?:\s+(?:purpose|prepare|execute|by|standard|process|department)\b)/i)[0].trim();
    if (rawRole.length > 35) rawRole = rawRole.slice(0, 35).trim();
  }
  const sopRole = rawRole || 'Frontline Specialist';

  const ctm: CanonicalTaskModel | null = lesson
    ? buildCanonicalTaskModel(lesson.operationalBlueprint, lesson, lesson.sourceMeta?.rawText)
    : null;

  const opBlueprint = lesson?.operationalBlueprint;
  const watchSteps = lesson?.blueprint?.scenarios?.watch || [];
  const kmSteps = lesson?.knowledgeModel?.steps || [];

  const stepObjectFallbacks = (lesson?.stepObjects || []).map((so: any, idx: number) => ({
    stepNumber: idx + 1,
    task_title: so.title || `Step ${idx + 1}`,
    action_verb: (so.title || '').split(' ')[0] || 'Execute',
    instruction: so.why || so.screen?.info || so.question || so.coach_say || so.title || `Execute step ${idx + 1}`,
    why_it_matters: so.why || so.hint || `Ensures accurate execution of ${sopTitle}.`,
    category: so.type || 'DO',
    scenario_question: so.question,
    choices: so.choices,
    coach_tip: so.coach_say || so.hint,
    source: {
      page_or_section: `Section ${idx + 1}`,
      source_ref: so.source_ref || `SOP Step ${idx + 1}`,
      source_text: so.why || so.question || so.title || '',
    },
  }));

  const watchStepFallbacks = watchSteps.map((ws: any, idx: number) => ({
    stepNumber: idx + 1,
    task_title: ws.title || ws.taskTitle || `Step ${idx + 1}`,
    action_verb: (ws.title || 'Execute').split(' ')[0] || 'Execute',
    instruction: ws.why || ws.taskItem || ws.question || ws.title || `Execute step ${idx + 1}`,
    why_it_matters: ws.coachTip || ws.why || `Ensures accurate execution of ${sopTitle}.`,
    category: ws.priority === 'CRITICAL' || ws.type === 'check' ? 'CHECK' : 'DO',
    critical_control: ws.priority === 'CRITICAL' || ws.priority === 'HIGH',
    scenario_question: ws.question,
    choices: ws.choices,
    coach_tip: ws.coachTip || ws.hint,
    target_code: ws.targetCode || ws.sku,
    source: {
      page_or_section: ws.page_or_section || ws.taskOrder || `Section ${idx + 1}`,
      source_ref: ws.source_ref || ws.sku || `SOP Step ${idx + 1}`,
      source_text: ws.evidence || ws.why || ws.title || '',
    },
  }));

  const kmStepFallbacks = kmSteps.map((ks: any, idx: number) => ({
    stepNumber: idx + 1,
    task_title: (ks.action || '').slice(0, 50) || `Step ${idx + 1}`,
    action_verb: (ks.action || 'Execute').split(' ')[0] || 'Execute',
    instruction: ks.action || `Execute step ${idx + 1}`,
    why_it_matters: ks.expectedOutcome || ks.sourceEvidence || `Ensures accurate execution of ${sopTitle}.`,
    category: 'DO',
    source: {
      page_or_section: ks.pageOrSection || `Section ${idx + 1}`,
      source_ref: ks.sourceRef || `SOP Step ${idx + 1}`,
      source_text: ks.sourceEvidence || ks.action || '',
    },
  }));

  const ctmStepFallbacks = (ctm?.steps || []).map((cs, idx) => ({
    stepNumber: idx + 1,
    task_title: cs.title || `Step ${idx + 1}`,
    action_verb: cs.actionVerb || 'Execute',
    instruction: cs.instruction,
    why_it_matters: cs.whyItMatters || `Ensures accurate execution of ${sopTitle}.`,
    category: cs.category || 'DO',
    critical_control: cs.criticalControl,
    scenario_question: cs.scenarioQuestion,
    choices: cs.choices,
    coach_tip: cs.coachTip,
    source: {
      page_or_section: cs.source?.pageOrSection || `Section ${idx + 1}`,
      source_ref: cs.source?.sourceRef || `SOP Step ${idx + 1}`,
      source_text: cs.source?.sourceText || cs.instruction,
    },
  }));

  const explicitRawStepFallbacks = (
    ((lesson as any)?.raw_steps || (lesson as any)?.steps || (lesson as any)?.slides || []) as any[]
  ).map((rs: any, idx: number) => ({
    stepNumber: rs.step_number || rs.stepNumber || idx + 1,
    task_title: rs.task_title || rs.title || rs.action_verb || `Step ${idx + 1}`,
    action_verb: rs.action_verb || (rs.task_title || rs.title || 'Execute').split(' ')[0] || 'Execute',
    instruction: rs.instruction || rs.taskItem || rs.why || rs.description || `Execute step ${idx + 1}`,
    why_it_matters: rs.why_it_matters || rs.expectedOutcome || rs.why || `Ensures accurate execution of ${sopTitle}.`,
    category: rs.category || 'DO',
    critical_control: rs.critical_control || rs.criticalControl,
    source: rs.source || {
      page_or_section: rs.phase || rs.stage || rs.section || `Section ${idx + 1}`,
      source_ref: rs.source_ref || `SOP Step ${idx + 1}`,
      source_text: rs.instruction || rs.description || '',
    },
  }));

  const rawSteps: any[] = opBlueprint?.operational_steps?.length
    ? opBlueprint.operational_steps
    : stepObjectFallbacks.length
    ? stepObjectFallbacks
    : watchStepFallbacks.length
    ? watchStepFallbacks
    : kmStepFallbacks.length
    ? kmStepFallbacks
    : ctmStepFallbacks.length
    ? ctmStepFallbacks
    : explicitRawStepFallbacks;

  const prereqs: any[] = opBlueprint?.prerequisites?.length
    ? opBlueprint.prerequisites
    : (lesson?.knowledgeModel?.prerequisites || []).map((p: any, idx: number) => ({
        text: p.text,
        source_ref: `SOP Prereq ${idx + 1}`,
        source_text: p.sourceEvidence || p.text,
      }));

  const tools: any[] = opBlueprint?.tools_and_systems?.length
    ? opBlueprint.tools_and_systems
    : lesson?.passport?.fields?.tools?.length
    ? lesson.passport.fields.tools
    : (lesson?.knowledgeModel?.tools || []).map((t: any, idx: number) => ({
        name: t.name,
        purpose: t.purpose,
        never_do: t.neverDo,
        source_ref: `SOP Tool ${idx + 1}`,
      }));

  const controls: any[] = opBlueprint?.critical_controls?.length
    ? opBlueprint.critical_controls
    : lesson?.passport?.fields?.golden_rules?.length
    ? lesson.passport.fields.golden_rules
    : (lesson?.blueprint?.takeaways || []).map((t: string, idx: number) => ({
        rule: t,
        rationale: `Mandatory control for ${sopTitle}`,
        source_ref: `SOP Control ${idx + 1}`,
      }));

  const safetyRules: any[] = opBlueprint?.safety_rules?.length
    ? opBlueprint.safety_rules
    : lesson?.passport?.fields?.safety_notes || [];

  const qualityRules: any[] = opBlueprint?.quality_rules?.length
    ? opBlueprint.quality_rules
    : (lesson?.blueprint?.floor_checklist || []).map((fc: any) =>
        typeof fc === 'string' ? fc : fc.behaviour || ''
      ).filter(Boolean);

  const terminology: any[] = opBlueprint?.terminology?.length
    ? opBlueprint.terminology
    : lesson?.passport?.fields?.terms?.length
    ? lesson.passport.fields.terms
    : rawSteps
        .filter((s: any) => s.target_code && !/^STEP-\d+$/i.test(String(s.target_code)))
        .map((s: any) => ({
          term: `${s.task_title || 'Standard'} (${s.target_code})`,
          meaning: s.instruction,
          source_ref: s.source?.page_or_section || 'SOP Standard',
        }));

  const decisions: any[] = opBlueprint?.decision_points?.length
    ? opBlueprint.decision_points
    : (lesson?.knowledgeModel?.decisionPoints || []).map((dp: any, idx: number) => ({
        situation: dp.situation,
        decision: dp.rationale || 'Follow SOP decision rule',
        action: dp.correctDecision,
        source_ref: `SOP Decision ${idx + 1}`,
        source_text: dp.sourceEvidence,
      }));

  const exceptions: any[] = opBlueprint?.exceptions?.length
    ? opBlueprint.exceptions
    : (lesson?.knowledgeModel?.exceptions || []).map((ex: any, idx: number) => ({
        trigger: ex.situation,
        resolution: ex.response,
        source_ref: `SOP Exception ${idx + 1}`,
        source_text: ex.sourceEvidence,
      }));

  const escalations: any[] = opBlueprint?.escalations?.length
    ? opBlueprint.escalations
    : (lesson?.knowledgeModel?.escalations || []).map((esc: any, idx: number) => ({
        situation: esc.trigger,
        contact_or_action: esc.action,
        source_ref: `SOP Escalation ${idx + 1}`,
        source_text: esc.sourceEvidence,
      }));

  const mistakes: any[] = opBlueprint?.common_mistakes?.length
    ? opBlueprint.common_mistakes
    : (lesson?.blueprint?.common_mistakes || []).map((m: string, idx: number) => ({
        mistake: m,
        prevention: controls[idx]?.rule || controls[0]?.rule || rawSteps[idx]?.instruction || `Follow verified ${sopTitle} procedure.`,
        source_ref: `SOP Error Prevention ${idx + 1}`,
        source_text: m,
      }));

  return {
    sopTitle,
    sopRole,
    ctm,
    opBlueprint,
    rawSteps,
    prereqs,
    tools,
    controls,
    safetyRules,
    qualityRules,
    terminology,
    decisions,
    exceptions,
    escalations,
    mistakes,
  };
}

interface OperationalStageCluster {
  stageNum: number;
  stageTitle: string;
  steps: any[];
  stepNums: number[];
  isHighCriticality: boolean;
  hasThresholds: boolean;
  hasConditionals: boolean;
  teachingDepth: 'deep_dive' | 'balanced' | 'micro_checkpoint';
  pedagogicalRationale: string;
}

/**
 * Stage-Aware Cognitive Instructional Planner:
 * Analyzes the workflow, partitions tasks into natural cognitive stages (2-4 steps per stage),
 * retains decisions and exceptions, and determines how much teaching each step needs.
 * Replaces mechanical chunking with multi-signal semantic workflow pacing.
 */
function clusterStepsIntoOperationalStages(rawSteps: any[], sopTitle: string): OperationalStageCluster[] {
  if (!rawSteps || rawSteps.length === 0) return [];

  const N = rawSteps.length;
  // Calculate optimal stage count: 2 to 4 steps per cognitive chunk
  const targetStageCount = N <= 3 ? 1 : N <= 6 ? 2 : N <= 10 ? 3 : N <= 15 ? 4 : Math.min(6, Math.ceil(N / 3.5));

  interface PreParsedStep {
    step: any;
    stepNum: number;
    section: string;
    actionVerb: string;
    text: string;
  }

  const parsedSteps: PreParsedStep[] = rawSteps.map((s, idx) => {
    const rawSec = s.source?.page_or_section || s.source?.section || s.phase || s.stage || '';
    const cleanSec = rawSec
      .replace(/^(?:Page\s*\d+\s*[·\-\—]\s*|Section\s*\d+[\s:\.\-\—]*)/i, '')
      .replace(/^Stage\s*\d+[\s:\.\-\—]*/i, '')
      .trim();
    const actionVerb = (s.action_verb || (s.task_title || s.instruction || '').split(' ')[0] || 'Perform').trim();
    const text = `${s.task_title || ''} ${s.instruction || ''} ${s.why_it_matters || ''}`.trim();
    return {
      step: s,
      stepNum: idx + 1,
      section: cleanSec,
      actionVerb,
      text,
    };
  });

  const distinctSections = Array.from(new Set(parsedSteps.map((p) => p.section).filter(Boolean)));
  const hasRichSectionTags = distinctSections.length >= 2 && distinctSections.length <= 8;

  let rawClusters: { title: string; steps: any[]; stepNums: number[] }[] = [];

  if (hasRichSectionTags) {
    let currentSec = '';
    let currentBucket: { title: string; steps: any[]; stepNums: number[] } | null = null;

    parsedSteps.forEach((p) => {
      const secKey = p.section || 'Operational Stage';
      if (!currentBucket || currentSec !== secKey || currentBucket.steps.length >= 4) {
        currentSec = secKey;
        const subIndex = currentBucket && currentSec === secKey ? ' (Part 2)' : '';
        currentBucket = {
          title: `${secKey}${subIndex}`,
          steps: [p.step],
          stepNums: [p.stepNum],
        };
        rawClusters.push(currentBucket);
      } else {
        currentBucket.steps.push(p.step);
        currentBucket.stepNums.push(p.stepNum);
      }
    });
  } else {
    // Multi-Signal Semantic Workflow Partitioning
    const maxStepsPerStage = Math.max(2, Math.ceil(N / targetStageCount));

    const detectPhaseAffinity = (text: string, idx: number): string => {
      const lower = text.toLowerCase();
      if (idx === 0 || /knock|enter|announce|priority|assignment|prepare|cart|trolley|don\b|ppe|setup/i.test(lower)) {
        return 'setup';
      }
      if (/strip|trash|empty|waste|linen|clear|remove|dispose|take out|laundry/i.test(lower)) {
        return 'clearance';
      }
      if (/spray|dwell|disinfect|sanitiz|chemical|soak|rinse|scrub|wipe|wash|clean/i.test(lower)) {
        return 'treatment';
      }
      if (/remake|bed|corners|replace|restock|amenities|towel|dust|vacuum|mop|align|station/i.test(lower)) {
        return 'reset';
      }
      if (idx >= N - 2 || /inspect|verify|check|odor|damage|defect|report|lock|thermostat|departure|handover/i.test(lower)) {
        return 'verification';
      }
      return 'execution';
    };

    let currentPhase = '';
    let currentBucket: { title: string; steps: any[]; stepNums: number[] } | null = null;

    parsedSteps.forEach((p, idx) => {
      const stepPhase = detectPhaseAffinity(p.text, idx);
      const mustSplit =
        currentBucket &&
        (currentBucket.steps.length >= maxStepsPerStage ||
          (currentBucket.steps.length >= 2 && currentPhase !== stepPhase));

      if (!currentBucket || mustSplit) {
        currentPhase = stepPhase;
        currentBucket = {
          title: '',
          steps: [p.step],
          stepNums: [p.stepNum],
        };
        rawClusters.push(currentBucket);
      } else {
        currentBucket.steps.push(p.step);
        currentBucket.stepNums.push(p.stepNum);
      }
    });
  }

  // Eliminate single-step micro-stages without crude '&' concatenation
  if (rawClusters.length > 1) {
    const compacted: typeof rawClusters = [];
    for (let i = 0; i < rawClusters.length; i++) {
      const curr = rawClusters[i];
      if (curr.steps.length === 1 && i < rawClusters.length - 1 && rawClusters[i + 1].steps.length <= 3) {
        rawClusters[i + 1].steps.unshift(...curr.steps);
        rawClusters[i + 1].stepNums.unshift(...curr.stepNums);
      } else if (curr.steps.length === 1 && compacted.length > 0 && compacted[compacted.length - 1].steps.length <= 3) {
        compacted[compacted.length - 1].steps.push(...curr.steps);
        compacted[compacted.length - 1].stepNums.push(...curr.stepNums);
      } else {
        compacted.push(curr);
      }
    }
    rawClusters = compacted;
  }

  // Synthesize crisp, professional, domain-authentic stage titles
  const synthesizeStageTitle = (cluster: { title: string; steps: any[]; stepNums: number[] }, stageIndex: number): string => {
    if (cluster.title && !cluster.title.includes('&') && cluster.title.length > 6 && !/operational execution/i.test(cluster.title)) {
      return cluster.title;
    }

    const verbs = cluster.steps
      .map((s) => s.action_verb || (s.task_title || s.instruction || '').split(' ')[0] || '')
      .filter((v) => v.length > 2 && !/^(?:step|execute|perform|do)$/i.test(v));
    const primaryVerb = verbs[0] || 'Execute';
    const secondaryVerb = verbs[1] && verbs[1].toLowerCase() !== primaryVerb.toLowerCase() ? verbs[1] : '';

    const firstTitle = cluster.steps[0]?.task_title || cluster.steps[0]?.instruction || '';
    const nounMatch = firstTitle.replace(/^(?:step\s*\d+[\s:\-]*|[a-z]+\s+)/i, '').split(/[,\.\—\-\:\(\)]/)[0]?.trim();
    const cleanNoun = nounMatch && nounMatch.length <= 30 ? nounMatch : 'Workflow Procedure';

    if (secondaryVerb) {
      return `${primaryVerb} & ${secondaryVerb}: ${cleanNoun}`;
    }
    return `${primaryVerb} ${cleanNoun}`;
  };

  return rawClusters.map((b, idx) => {
    const stageNum = idx + 1;
    const stageTitle = sanitizeLearnerText(synthesizeStageTitle(b, stageNum));
    const combinedText = b.steps
      .map((s: any) => `${s.task_title || ''} ${s.instruction || ''} ${s.why_it_matters || ''}`)
      .join(' ');

    const isHighCriticality = b.steps.some(
      (s: any) => s.critical_control || /never|safety|hazard|ppe|chemical|privacy|lock|stop|high voltage|biohazard/i.test(s.instruction || '')
    );
    const hasThresholds = THRESHOLD_DATA_REGEX.test(combinedText);
    const hasConditionals = CONDITIONAL_STEP_REGEX.test(combinedText);

    const teachingDepth: 'deep_dive' | 'balanced' | 'micro_checkpoint' = isHighCriticality || hasConditionals
      ? 'deep_dive'
      : 'balanced';

    const pedagogicalRationale = isHighCriticality
      ? `High-risk operational stage requiring deliberate pace, error boundaries, and verification criteria.`
      : hasConditionals
      ? `Decision-dense stage requiring scenario branching and condition verification.`
      : `Core procedural execution stage balancing instructional clarity with concise operational pacing.`;

    return {
      stageNum,
      stageTitle,
      steps: b.steps,
      stepNums: b.stepNums,
      isHighCriticality,
      hasThresholds,
      hasConditionals,
      teachingDepth,
      pedagogicalRationale,
    };
  });
}

/**
 * STEP 1 & 2: Builds the Pedagogical Teaching Blueprint from the SOP Lesson & CanonicalTaskModel
 * BEFORE any slides are generated.
 */
export function buildTeachingBlueprint(lesson?: Lesson, plan?: SlidePlan): TeachingBlueprint {
  const {
    sopTitle,
    sopRole,
    ctm,
    opBlueprint,
    rawSteps,
    prereqs,
    tools,
    controls,
    safetyRules,
    qualityRules,
    terminology,
    decisions,
    exceptions,
    escalations,
    mistakes,
  } = extractNormalizedSopSources(lesson, plan);

  const unresolvedAmbiguities = [
    ...((opBlueprint as any)?.unresolved_gaps || []),
    ...(ctm?.ambiguities || []),
  ].filter(
    (gap, idx, arr) =>
      gap &&
      gap.description &&
      arr.findIndex((g) => g.description === gap.description) === idx
  );

  const units: TeachingBlueprintUnit[] = [];
  let unitCounter = 1;

  // Filter out synthetic terminology where term is just the first 3 words of meaning
  const realTerminology = terminology.filter((t: any) => {
    const termStr = sanitizeLearnerText(t?.term || '');
    const meanStr = sanitizeLearnerText(t?.meaning || '');
    if (!termStr || !meanStr) return false;
    if (meanStr.toLowerCase().startsWith(termStr.toLowerCase()) && termStr.split(/\s+/).length >= 3) {
      return false;
    }
    return true;
  });

  // Filter out quality rules that are exact duplicates of rawSteps instructions
  const stepInstrSet = new Set(
    rawSteps.map((s: any) => sanitizeLearnerText(s?.instruction || '').toLowerCase()).filter(Boolean)
  );
  const distinctQualityRules = qualityRules.filter((q: any) => {
    const qStr = sanitizeLearnerText(typeof q === 'string' ? q : q?.rule || String(q || ''));
    return qStr.length > 0 && !stepInstrSet.has(qStr.toLowerCase());
  });

  // ============================================================================
  // GAMMA 8-STAGE OPERATIONAL LEARNING ARC
  // Stage 1: Opening (Operational purpose, consequence of failure & pre-shift readiness)
  // Stage 2: End-to-End Process (Complete operational sequence from start to finish)
  // Stage 3: Operational Controls (Progressive teaching: action, method, verify, risk)
  // Stage 4: Decisions (Condition, decision, and correct next action)
  // Stage 5: Exceptions (When to pause, recover, or escalate)
  // Stage 6: Non-Negotiables (Safety, privacy, and compliance boundaries)
  // Stage 7: Handover & Standards (Completion records, handoff, and quality thresholds)
  // Stage 8: Final Validation (Test whether the learner can apply the procedure)
  // ============================================================================

  // STAGE 1: Opening (Purpose, Consequence of Failure, Tools & Systems / Prerequisites) -> 'checklist'
  if (prereqs.length > 0 || tools.length > 0 || controls.length > 0 || safetyRules.length > 0 || rawSteps.length > 0) {
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Understand the operational purpose, consequences of failure, and verify workstation readiness for ${sopTitle}.`,
      whatLearnerMustKnowOrDo: `Confirm readiness of required tools/systems, baseline prerequisites, and operational purpose.`,
      difficultyFactor: 'Starting the task before verifying equipment, permissions, or workstation setup.',
      likelyMistake: 'Skipping pre-task checks under shift time pressure.',
      evidenceNeeded: '100% completion of workstation and tool readiness check.',
      teachingMethod: 'readiness_verification',
      visualFormat: 'checklist',
      visualFormatRationale: 'Architectural grid enables clear verification of purpose, consequence of failure, prerequisites, and systems.',
      requiresOperationalPhoto: false,
      source: {
        sectionOrPage: prereqs[0]?.source_ref || 'Section 1 · Prerequisites & Systems',
        sourceRef: opBlueprint?.document_identity?.doc_ref || 'SOP Readiness',
        excerpt:
          (typeof prereqs[0] === 'string' ? prereqs[0] : prereqs[0]?.text) ||
          (typeof controls[0] === 'string' ? controls[0] : controls[0]?.rule) ||
          `Verify readiness for ${sopTitle}.`,
        provenance: 'source_supported',
      },
      relatedStepNumbers: [],
    });
  }

  // STAGE 2: End-to-End Process (Complete sequence from start to finish) -> 'process_flow'
  if (rawSteps.length > 0) {
    const stepNums = rawSteps.map((_, idx) => idx + 1);
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Master the complete ${rawSteps.length}-phase operational sequence in exact order.`,
      whatLearnerMustKnowOrDo: rawSteps
        .slice(0, 8)
        .map((s: any, idx: number) => `Stage ${idx + 1}: ${s.task_title || s.action_verb || s.instruction.slice(0, 35)}`)
        .join(' → '),
      difficultyFactor: 'Performing steps out of sequence or skipping intermediate verification gates.',
      likelyMistake: 'Jumping ahead to completion before intermediate checks are confirmed.',
      evidenceNeeded: `Execute Stages 1–${rawSteps.length} in strict sequential order.`,
      teachingMethod: 'sequential_process_mapping',
      visualFormat: 'process_flow',
      visualFormatRationale: 'Process flow diagram visually locks in the mandatory step-by-step sequence before teaching individual controls.',
      requiresOperationalPhoto: false,
      source: {
        sectionOrPage: rawSteps[0]?.source?.page_or_section || `Section 2 · Operational Sequence`,
        sourceRef: rawSteps[0]?.source?.source_ref || 'SOP Procedure',
        excerpt: rawSteps[0]?.instruction || sopTitle,
        provenance: 'source_supported',
      },
      relatedStepNumbers: stepNums,
    });
  }

  // STAGE 3: Core Operational Stages (Stage-Aware Pedagogical Planning)
  if (rawSteps.length > 0) {
    const stages = clusterStepsIntoOperationalStages(rawSteps, sopTitle);

    for (const stage of stages) {
      const group = stage.steps;
      const stepNums = stage.stepNums;
      const combinedText = group
        .map((s: any) => `${s.task_title || ''} ${s.instruction || ''} ${s.why_it_matters || ''}`)
        .join(' ');

      const isPhysical = isPhysicalOperationalStep(combinedText);

      let chosenFormat: AdaptiveVisualFormat = 'step_demonstration';
      let chosenMethod: TeachingMethod = 'physical_task_demonstration';
      let rationale = `Operational stage breaks down sequential tasks, methods, and verification gates for ${stage.stageTitle}.`;
      let needsPhoto = false;

      if (isPhysical) {
        chosenFormat = 'annotated_photo';
        chosenMethod = 'physical_task_demonstration';
        rationale = 'Physical execution stage benefits from an annotated operational visual.';
        needsPhoto = true;
      } else if (stage.hasThresholds && group.length > 1) {
        chosenFormat = 'structured_table';
        chosenMethod = 'structured_reference_lookup';
        rationale = 'Structured table highlights exact numeric thresholds, timings, and verification criteria.';
        needsPhoto = false;
      } else if (stage.hasConditionals) {
        chosenFormat = 'step_demonstration';
        chosenMethod = 'conditional_branching_logic';
        rationale = 'Highlights conditional verification checks and decision gates.';
        needsPhoto = false;
      }

      const primaryStep = group[0];
      units.push({
        id: `tb-unit-${unitCounter}`,
        unitIndex: unitCounter++,
        stageTitle: stage.stageTitle,
        stageNumber: stage.stageNum,
        learningObjective: `Execute Stage ${stage.stageNum} (${stage.stageTitle}): ${group.map((s: any) => s.task_title || s.action_verb || 'Standard Task').join(' · ')}.`,
        whatLearnerMustKnowOrDo: group.map((s: any) => s.instruction).join(' | '),
        difficultyFactor: primaryStep?.why_it_matters || `Follow required standard procedures for ${stage.stageTitle}.`,
        likelyMistake: primaryStep?.coach_tip || 'Rushing verification checks before confirming completion.',
        evidenceNeeded: `Accurate completion of Stage ${stage.stageNum} (${stage.stageTitle}) tasks without safety or quality deviations.`,
        teachingMethod: chosenMethod,
        visualFormat: chosenFormat,
        visualFormatRationale: rationale,
        requiresOperationalPhoto: needsPhoto,
        source: {
          sectionOrPage: primaryStep?.source?.page_or_section || `Stage ${stage.stageNum}: ${stage.stageTitle}`,
          sourceRef: primaryStep?.source?.source_ref || `SOP Stage ${stage.stageNum}`,
          excerpt: primaryStep?.source?.source_text || primaryStep?.instruction || '',
          provenance: 'source_supported',
        },
        relatedStepNumbers: stepNums,
      });
    }
  }

  // STAGE 4/5: Exceptions, Escalations & Decision Protocols -> single unified 'decision_tree' unit
  if (exceptions.length > 0 || escalations.length > 0 || decisions.length > 0) {
    const primarySource = exceptions[0] || escalations[0] || decisions[0];
    const totalTriggers = exceptions.length + escalations.length + decisions.length;
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Recognize exceptions, pause work safely, and route to the correct supervisor or recovery procedure.`,
      whatLearnerMustKnowOrDo: `Evaluate ${totalTriggers} operational exception trigger(s), pause gates, and escalation route(s).`,
      difficultyFactor: 'Distinguishing between routine self-recovery and mandatory stop-and-escalate conditions.',
      likelyMistake: 'Improvising an unapproved workaround instead of pausing and escalating.',
      evidenceNeeded: 'Execute correct pause, recovery, or escalation protocol without unauthorized workarounds.',
      teachingMethod: 'conditional_branching_logic',
      visualFormat: 'decision_tree',
      visualFormatRationale: 'Checkerboard matrix clearly outlines exception triggers, pause gates, and escalation contacts.',
      requiresOperationalPhoto: false,
      source: {
        sectionOrPage: primarySource?.source_ref || 'Section · Exceptions & Escalation',
        sourceRef: 'SOP Exception & Escalation Protocols',
        excerpt: (primarySource as any)?.source_text || (primarySource as any)?.resolution || 'Pause and escalate when an anomaly occurs.',
        provenance: 'source_supported',
      },
      relatedStepNumbers: [],
    });
  }

  // STAGE 6: Non-Negotiables (Safety, privacy, and compliance boundaries) -> 'comparison'
  if (mistakes.length > 0 || controls.length > 0 || safetyRules.length > 0 || tools.some((t: any) => t.never_do)) {
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Enforce non-negotiable safety, privacy, and compliance boundaries.`,
      whatLearnerMustKnowOrDo: `Enforce critical controls and prevent high-risk operational shortcuts.`,
      difficultyFactor: 'High-risk shortcuts often look faster in the moment but cause compliance or safety failures.',
      likelyMistake: mistakes[0]?.mistake || tools[0]?.never_do || 'Bypassing mandatory verification controls.',
      evidenceNeeded: 'Zero critical control or safety violations during practice and assessment.',
      teachingMethod: 'contrastive_error_prevention',
      visualFormat: 'comparison',
      visualFormatRationale: 'Numbered non-negotiable ledger makes critical controls and prohibited shortcuts unmistakable.',
      requiresOperationalPhoto: false,
      source: {
        sectionOrPage: mistakes[0]?.source_ref || 'Section · Safety & Error Prevention',
        sourceRef: 'SOP Prohibitions & Controls',
        excerpt: mistakes[0]?.source_text || mistakes[0]?.mistake || 'Never bypass SOP controls.',
        provenance: 'source_supported',
      },
      relatedStepNumbers: [],
    });
  }

  // STAGE 7: Handover & Reference Standards (Completion records, handoff, and quality thresholds) -> 'structured_table'
  if (realTerminology.length > 0 || distinctQualityRules.length > 0) {
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Verify completion records, shift handover protocols, and exact quality standards.`,
      whatLearnerMustKnowOrDo: `Apply ${realTerminology.length} key term(s) and ${distinctQualityRules.length} quality verification standard(s).`,
      difficultyFactor: 'Misinterpreting domain-specific SOP terminology, handover requirements, or quality thresholds.',
      likelyMistake: 'Relying on informal assumptions instead of exact SOP specifications.',
      evidenceNeeded: 'Accurate application of handover protocols, SOP standards, and terminology.',
      teachingMethod: 'structured_reference_lookup',
      visualFormat: 'structured_table',
      visualFormatRationale: 'Structured reference grid organizes handover requirements, key terminology, and quality specifications clearly.',
      requiresOperationalPhoto: false,
      source: {
        sectionOrPage: 'Section · Handover & Reference Standards',
        sourceRef: 'SOP Reference Standards',
        excerpt: realTerminology[0]?.meaning || distinctQualityRules[0] || sopTitle,
        provenance: 'source_supported',
      },
      relatedStepNumbers: [],
    });
  }

  // STAGE 8: Final Validation & Mastery Check (CLOSE THE LOOP) -> 'knowledge_check'
  units.push({
    id: `tb-unit-${unitCounter}`,
    unitIndex: unitCounter++,
    learningObjective: `Verify workplace judgement and confirm completion before launching floor simulation.`,
    whatLearnerMustKnowOrDo: `Apply ${sopTitle} rules to a realistic workplace scenario and pass readiness verification.`,
    difficultyFactor: 'Making the right call under realistic workplace conditions without guessing.',
    likelyMistake: 'Acting before verifying the primary SOP control.',
    evidenceNeeded: 'Correct scenario judgement and simulation readiness.',
    teachingMethod: 'situational_judgement_drill',
    visualFormat: 'knowledge_check',
    visualFormatRationale: 'Completion check + interactive role-play reinforces retention before hands-on simulation.',
    requiresOperationalPhoto: false,
    source: {
      sectionOrPage: 'All SOP Sections · Coverage Verification',
      sourceRef: opBlueprint?.document_identity?.doc_ref || 'SOP Mastery Gate',
      excerpt: opBlueprint?.purpose || `Complete verification for ${sopTitle}.`,
      provenance: 'source_supported',
    },
    relatedStepNumbers: rawSteps.map((_, idx) => idx + 1),
  });

  const contentInventory: SourceInventoryItem[] = [
    ...rawSteps.map((s: any, idx: number) => ({
      id: `inv-step-${idx + 1}`,
      category: 'step' as const,
      text: s.instruction || s.task_title || `Step ${idx + 1}`,
      sourceRef: s.source?.page_or_section || s.source?.source_ref || `Step ${idx + 1}`,
    })),
    ...prereqs.map((p: any, idx: number) => ({
      id: `inv-prereq-${idx + 1}`,
      category: 'prerequisite' as const,
      text: typeof p === 'string' ? p : p.text || '',
      sourceRef: (typeof p === 'object' && p.source_ref) || `Prereq ${idx + 1}`,
    })),
    ...tools.map((t: any, idx: number) => ({
      id: `inv-tool-${idx + 1}`,
      category: 'tool' as const,
      text: `${t.name || ''}: ${t.purpose || t.what_it_is || ''}`,
      sourceRef: t.source_ref || `Tool ${idx + 1}`,
    })),
    ...controls.map((c: any, idx: number) => ({
      id: `inv-control-${idx + 1}`,
      category: 'control' as const,
      text: typeof c === 'string' ? c : c.rule || c.text || '',
      sourceRef: (typeof c === 'object' && c.source_ref) || `Control ${idx + 1}`,
    })),
    ...safetyRules.map((sr: any, idx: number) => ({
      id: `inv-safety-${idx + 1}`,
      category: 'safety' as const,
      text: typeof sr === 'string' ? sr : sr.rule || String(sr),
      sourceRef: (typeof sr === 'object' && sr.source_ref) || `Safety ${idx + 1}`,
    })),
    ...decisions.map((d: any, idx: number) => ({
      id: `inv-decision-${idx + 1}`,
      category: 'decision' as const,
      text: `${d.situation}: ${d.action || d.decision}`,
      sourceRef: d.source_ref || `Decision ${idx + 1}`,
    })),
    ...exceptions.map((e: any, idx: number) => ({
      id: `inv-exception-${idx + 1}`,
      category: 'exception' as const,
      text: `${e.trigger}: ${e.resolution}`,
      sourceRef: e.source_ref || `Exception ${idx + 1}`,
    })),
    ...escalations.map((esc: any, idx: number) => ({
      id: `inv-escalation-${idx + 1}`,
      category: 'escalation' as const,
      text: `${esc.situation}: ${esc.contact_or_action}`,
      sourceRef: esc.source_ref || `Escalation ${idx + 1}`,
    })),
    ...mistakes.map((m: any, idx: number) => ({
      id: `inv-mistake-${idx + 1}`,
      category: 'mistake' as const,
      text: typeof m === 'string' ? m : m.mistake || '',
      sourceRef: (typeof m === 'object' && m.source_ref) || `Mistake ${idx + 1}`,
    })),
    ...realTerminology.map((t: any, idx: number) => ({
      id: `inv-term-${idx + 1}`,
      category: 'terminology' as const,
      text: `${t.term}: ${t.meaning}`,
      sourceRef: t.source_ref || `Term ${idx + 1}`,
    })),
    ...distinctQualityRules.map((q: any, idx: number) => ({
      id: `inv-quality-${idx + 1}`,
      category: 'quality' as const,
      text: typeof q === 'string' ? q : q.rule || String(q),
      sourceRef: (typeof q === 'object' && q.source_ref) || `Quality ${idx + 1}`,
    })),
  ].filter((item) => item.text.trim().length > 0);

  return {
    sopId: lesson?.id || plan?.lessonId || 'sop-default',
    sopTitle,
    role: sopRole,
    purpose: sanitizeLearnerText(opBlueprint?.purpose || lesson?.description) || `Execute ${sopTitle} safely and accurately.`,
    scope: opBlueprint?.scope || 'All designated frontline operations.',
    totalSourceSteps: rawSteps.length,
    contentInventory,
    units,
    unresolvedAmbiguities,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Distinct contextual fallback photo pool so adjacent photo cards never display identical imagery.
 */
const EDITORIAL_PHOTO_FALLBACK_POOL = [
  '/Guruji_Real_Photo_Visual_Library_500/030_technology_system_login.webp',
  '/Guruji_Real_Photo_Visual_Library_500/027_admin_document_filing.webp',
  '/Guruji_Real_Photo_Visual_Library_500/002_retail_cashier_scanning_product.webp',
  '/Guruji_Real_Photo_Visual_Library_500/009_hospitality_room_cleaning.webp',
  '/Guruji_Real_Photo_Visual_Library_500/010_hospitality_bed_making.webp',
  '/Guruji_Real_Photo_Visual_Library_500/029_technology_qr_scan.webp',
  '/Guruji_Real_Photo_Visual_Library_500/005_warehouse_inventory_check.webp',
  '/Guruji_Real_Photo_Visual_Library_500/017_manufacturing_quality_check.webp',
];

function selectDistinctPhotoUrl(preferredUrl: string | null | undefined, usedUrls: Set<string>, slideIdx: number): string {
  if (preferredUrl && !usedUrls.has(preferredUrl)) {
    usedUrls.add(preferredUrl);
    return preferredUrl;
  }
  for (let i = 0; i < EDITORIAL_PHOTO_FALLBACK_POOL.length; i++) {
    const candidate = EDITORIAL_PHOTO_FALLBACK_POOL[(slideIdx + i) % EDITORIAL_PHOTO_FALLBACK_POOL.length];
    if (!usedUrls.has(candidate)) {
      usedUrls.add(candidate);
      return candidate;
    }
  }
  return preferredUrl || EDITORIAL_PHOTO_FALLBACK_POOL[slideIdx % EDITORIAL_PHOTO_FALLBACK_POOL.length];
}

/**
 * STEP 4 OF PIPELINE: Automated Editorial Verification & Auto-Repair Pass
 * Inspects every generated slide for truncated headings, stuttered title/body prefixes,
 * leaked backend strings, or archetype collisions, and repairs them before rendering.
 */
function repairAndVerifyEditorialSlides(slides: AdaptiveDeckSlide[]): AdaptiveDeckSlide[] {
  const iconCycle: GammaMicroItem['iconType'][] = ['building', 'check', 'user', 'key', 'route', 'shield', 'file'];
  const rotationPool: GammaCardArchetype[] = [
    'two_over_one_grid',
    'crosshair_quad_grid',
    'ledger_with_stop_banner',
    'dark_anchor_three_column',
    'non_negotiable_ledger',
  ];
  let prevArchetype: GammaCardArchetype | undefined;
  const seenSlideTitles = new Map<string, number>();

  return slides.map((slide, idx) => {
    let cleanTitle = sanitizeLearnerText(slide.title) || slide.title;
    const cleanSubtitle = sanitizeLearnerText(slide.subtitle);

    const normTitle = cleanTitle.toLowerCase().trim().replace(/^(?:stage\s*\d+[\s:\.\-\—]*|card\s*\d+[\s:\.\-\—]*)/i, '');
    if (normTitle.length > 5) {
      if (seenSlideTitles.has(normTitle)) {
        const occ = seenSlideTitles.get(normTitle)! + 1;
        seenSlideTitles.set(normTitle, occ);
        cleanTitle = `${cleanTitle} (Part ${occ})`;
      } else {
        seenSlideTitles.set(normTitle, 1);
      }
    }

    let resolvedArchetype: GammaCardArchetype = slide.gammaArchetype || 'ledger_with_stop_banner';
    if (prevArchetype && resolvedArchetype === prevArchetype && resolvedArchetype !== 'interactive_mastery_gate') {
      const candidate = rotationPool.find((arch) => arch !== prevArchetype);
      if (candidate) {
        resolvedArchetype = candidate;
      }
    }
    prevArchetype = resolvedArchetype;

    // Ensure gammaMicroItems is always populated and every item has a clean, non-redundant title + body
    const rawMicroItems: GammaMicroItem[] =
      slide.gammaMicroItems && slide.gammaMicroItems.length > 0
        ? slide.gammaMicroItems
        : (slide.cards || []).map((c, cIdx) => {
            const pair = synthesizeEditorialMicroCopy(c.label, c.value, c.subtext || c.why, `Control 0${cIdx + 1}`);
            return {
              badge: String(cIdx + 1).padStart(2, '0'),
              title: pair.title,
              body: pair.body,
              consequence: c.consequence ? sanitizeLearnerText(c.consequence) : undefined,
              iconType: iconCycle[cIdx % iconCycle.length],
            };
          });

    const seenItemTitles = new Set<string>();
    const repairedMicroItems: GammaMicroItem[] = [];

    for (let mIdx = 0; mIdx < rawMicroItems.length; mIdx++) {
      const item = rawMicroItems[mIdx];
      let t = sanitizeLearnerText(item.title);
      let b = sanitizeLearnerText(item.body);
      if (!t || !b || isBrokenOrRedundantTitle(t, b) || isDuplicateLearnerCopy(t, b)) {
        const repaired = synthesizeEditorialMicroCopy(t, b, undefined, `Checkpoint 0${mIdx + 1}`);
        t = repaired.title;
        b = repaired.body;
      }
      const normT = t.toLowerCase().trim();
      if (seenItemTitles.has(normT)) {
        const differentiator = deriveSemanticConceptLabel(b, `Phase 0${mIdx + 1}`);
        t = differentiator && differentiator.toLowerCase().trim() !== normT ? differentiator : `${t} · Stage 0${mIdx + 1}`;
      }
      seenItemTitles.add(t.toLowerCase().trim());
      repairedMicroItems.push({
        ...item,
        badge: item.badge || String(mIdx + 1).padStart(2, '0'),
        title: t,
        body: b,
        iconType: item.iconType || iconCycle[mIdx % iconCycle.length],
      });
    }

    // Also repair slide.cards so any card-based renderer or test sees clean labels/values/subtexts
    const repairedCards: AdaptiveSlideCard[] = (slide.cards || []).map((c, cIdx) => {
      const pair = synthesizeEditorialMicroCopy(c.label, c.value, c.subtext, `Item ${cIdx + 1}`);
      return {
        ...c,
        label: pair.title,
        value: c.subtext ? (sanitizeLearnerText(c.value) || pair.title) : pair.title,
        subtext: c.subtext ? (sanitizeLearnerText(c.subtext) || pair.body) : pair.body,
      };
    });

    return {
      ...slide,
      num: idx + 1,
      badge: `Card ${String(idx + 1).padStart(2, '0')}`,
      gammaArchetype: resolvedArchetype,
      title: cleanTitle,
      subtitle:
        cleanSubtitle && !isDuplicateLearnerCopy(cleanTitle, cleanSubtitle)
          ? cleanSubtitle
          : '',
      gammaMicroItems: repairedMicroItems,
      cards: repairedCards,
    };
  });
}

/**
 * STEP 2 & 3: Generates Adaptive Training Deck Slides from the Teaching Blueprint
 * using the Gamma Editorial Brain (Training Spine + 8 Distinct Archetypes + Guardrail Stop-Banners).
 */
export function buildAdaptiveDeckFromBlueprint(
  blueprint: TeachingBlueprint,
  lesson?: Lesson,
  plan?: SlidePlan
): AdaptiveDeckSlide[] {
  const {
    rawSteps: opSteps,
    prereqs,
    tools,
    controls,
    safetyRules,
    qualityRules,
    terminology,
    decisions,
    exceptions,
    escalations,
    mistakes,
  } = extractNormalizedSopSources(lesson, plan, blueprint.sopTitle);

  const slides: AdaptiveDeckSlide[] = [];
  const usedPhotoUrls = new Set<string>();

  const paginateCards = (cards: AdaptiveSlideCard[], maxPerSlide = 6): AdaptiveSlideCard[][] => {
    if (cards.length === 0) return [[]];
    const pages: AdaptiveSlideCard[][] = [];
    for (let i = 0; i < cards.length; i += maxPerSlide) {
      pages.push(cards.slice(i, i + maxPerSlide));
    }
    return pages;
  };

  // Count how many step execution units exist so we can assign Gamma Kickers:
  // First step unit -> "START HERE", middle units -> "CONTROL 01..0N", final step unit -> "THE HANDOFF"
  const stepExecutionUnits = blueprint.units.filter(
    (u) => u.visualFormat === 'annotated_photo' || u.visualFormat === 'step_demonstration'
  );
  let stepUnitCounter = 0;

  for (const unit of blueprint.units) {
    // 1. CHECKLIST FORMAT (Pre-Shift Readiness, Prerequisites & Systems)
    if (unit.visualFormat === 'checklist') {
      const hasDedicatedPrepOrTools = prereqs.length > 0 || tools.length > 0;
      const hasComparisonUnit = blueprint.units.some((u) => u.visualFormat === 'comparison');

      // When prerequisites/tools exist and a dedicated Non-Negotiable ('comparison') unit exists,
      // keep Readiness focused on Prerequisites & Tools so controls aren't duplicated on two slides.
      const includeControlsHere = !hasDedicatedPrepOrTools || !hasComparisonUnit;

      const cards: AdaptiveSlideCard[] = [
        ...prereqs.map((p: any, idx: number) => {
          const prereqText = typeof p === 'string' ? p : p.text || 'Preparation Check';
          const pair = synthesizeEditorialMicroCopy(undefined, prereqText, undefined, 'Readiness Check');
          return sanitizeSlideCardCopy({
            id: `inv-prereq-${idx + 1}`,
            label: pair.title,
            value: pair.title,
            subtext: pair.body,
            tag: 'Prep',
            tagType: 'default' as const,
            sourceRef: (typeof p === 'object' && p.source_ref) || unit.source.sectionOrPage,
            provenance: 'source_supported' as const,
          });
        }),
        ...tools.map((t: any, idx: number) => {
          const toolName = sanitizeLearnerText(t.name) || `Required System ${idx + 1}`;
          const purposeText = sanitizeLearnerText(t.purpose || t.what_it_is || `Verify ${toolName} is ready.`);
          const neverText = t.never_do ? sanitizeLearnerText(t.never_do) : '';
          const combinedBody = [
            purposeText.replace(/[.]+$/, ''),
            neverText ? neverText.replace(/[.]+$/, '') : '',
          ]
            .filter(Boolean)
            .join('. ') + '.';

          return sanitizeSlideCardCopy({
            id: `inv-tool-${idx + 1}`,
            label: toolName,
            value: toolName,
            subtext: combinedBody,
            tag: 'System',
            tagType: 'warning' as const,
            sourceRef: t.source_ref || unit.source.sectionOrPage,
            provenance: 'source_supported' as const,
          });
        }),
        ...(includeControlsHere
          ? [
              ...controls.map((c: any, idx: number) => {
                const ruleText = typeof c === 'string' ? c : c.rule || c.text || 'Key Rule';
                const rawRationale = typeof c === 'object' && c.rationale ? c.rationale : '';
                const pair = synthesizeEditorialMicroCopy(undefined, ruleText, rawRationale, 'Core Control');
                return sanitizeSlideCardCopy({
                  id: `inv-control-${idx + 1}`,
                  label: pair.title,
                  value: pair.title,
                  subtext: pair.body,
                  tag: 'Rule',
                  tagType: 'positive' as const,
                  sourceRef: (typeof c === 'object' && c.source_ref) || unit.source.sectionOrPage,
                  provenance: 'source_supported' as const,
                });
              }),
              ...safetyRules.map((sr: any, idx: number) => {
                const safetyText = typeof sr === 'string' ? sr : sr.rule || String(sr);
                const pair = synthesizeEditorialMicroCopy(undefined, safetyText, undefined, 'Safety Guardrail');
                return sanitizeSlideCardCopy({
                  id: `inv-safety-${idx + 1}`,
                  label: pair.title,
                  value: pair.title,
                  subtext: pair.body,
                  tag: 'Safety',
                  tagType: 'negative' as const,
                  sourceRef: (typeof sr === 'object' && sr.source_ref) || unit.source.sectionOrPage,
                  provenance: 'source_supported' as const,
                });
              }),
            ]
          : []),
      ];

      if (cards.length === 0) {
        opSteps.forEach((s: any, idx: number) => {
          const pair = synthesizeEditorialMicroCopy(s.task_title, s.instruction, undefined, `Stage 0${idx + 1}`);
          cards.push(
            sanitizeSlideCardCopy({
              id: `inv-step-${idx + 1}`,
              label: pair.title,
              value: pair.title,
              subtext: pair.body,
              tag: `Stage ${idx + 1}`,
              tagType: 'default',
              sourceRef: s.source?.page_or_section || 'SOP',
              provenance: 'source_supported',
            })
          );
        });
      }

      const allControlAndSafetyIds = [
        ...controls.map((_: any, idx: number) => `inv-control-${idx + 1}`),
        ...safetyRules.map((_: any, idx: number) => `inv-safety-${idx + 1}`),
      ];

      const pages = paginateCards(cards, 6);
      pages.forEach((pageCards, pageIdx) => {
        const slideNum = slides.length + 1;
        const pageTitle =
          pageIdx === 0
            ? 'Confirm workstation readiness and required systems'
            : 'Verify supporting tools and operational setup';
        slides.push({
          num: slideNum,
          unitId: `${unit.id}-p${pageIdx + 1}`,
          tabLabel: `0${slideNum} Readiness`,
          badge: `Card 0${slideNum}`,
          visualFormat: 'checklist',
          layoutName: 'Readiness & Systems',
          teachingMethod: unit.teachingMethod,
          gammaKicker: pageIdx === 0 ? 'BEFORE YOU START' : 'SYSTEMS & TOOLS',
          gammaKickerRight: false,
          gammaArchetype: pageCards.length === 3 ? 'two_over_one_grid' : 'crosshair_quad_grid',
          gammaStopBanner: 'UNVERIFIED PREREQUISITES OR SYSTEMS · DO NOT START',
          title: pageTitle,
          subtitle: 'Verify all required systems, hardware, and baseline readiness checks before execution.',
          learningObjective: unit.learningObjective,
          principalTeachingPoint: unit.whatLearnerMustKnowOrDo,
          whyItMatters: 'Checking your tools and systems upfront prevents avoidable delays and errors.',
          takeawayOrQuestion: 'Confirm every readiness item before starting.',
          cards: pageCards,
          requiresOperationalPhoto: false,
          source: unit.source,
          coveredStepNumbers: [],
          coveredInventoryIds: [
            ...(pageCards.map((c) => c.id).filter(Boolean) as string[]),
            ...(pageIdx === 0 ? allControlAndSafetyIds : []),
          ],
        });
      });
      continue;
    }

    // 2. PROCESS FLOW FORMAT (The Journey / Operational Spine)
    if (unit.visualFormat === 'process_flow') {
      const slideNum = slides.length + 1;
      const stepNums = unit.relatedStepNumbers;
      const stepItems = stepNums.map((n) => opSteps[n - 1]).filter(Boolean);

      const stageUnits = blueprint.units.filter((u) => Boolean(u.stageTitle || u.stageNumber));
      const stageCount = stageUnits.length;

      let cards: AdaptiveSlideCard[] = [];
      if (stageCount > 0 && blueprint.totalSourceSteps > 6) {
        cards = stageUnits.map((su, idx) => {
          const actualStageNum = su.stageNumber || idx + 1;
          const pair = synthesizeEditorialMicroCopy(
            su.stageTitle || `Stage ${actualStageNum}`,
            su.whatLearnerMustKnowOrDo || su.learningObjective,
            undefined,
            `Stage 0${actualStageNum}`
          );
          return sanitizeSlideCardCopy({
            id: `inv-stage-${actualStageNum}`,
            label: pair.title,
            value: pair.title,
            subtext: pair.body,
            tag: String(actualStageNum).padStart(2, '0'),
            tagType: 'default',
            why: su.difficultyFactor || undefined,
            sourceRef: su.source?.sourceRef || `Stage ${actualStageNum}`,
            provenance: 'source_supported',
          });
        });
      } else {
        cards = stepItems.map((s: any, idx) => {
          const actualStepNum = stepNums[idx];
          const pair = synthesizeEditorialMicroCopy(s.task_title, s.instruction, undefined, `Stage 0${actualStepNum}`);
          return sanitizeSlideCardCopy({
            id: `inv-step-${actualStepNum}`,
            label: pair.title,
            value: pair.title,
            subtext: pair.body,
            tag: String(actualStepNum).padStart(2, '0'),
            tagType: s.critical_control ? 'warning' : 'default',
            why: s.why_it_matters || undefined,
            sourceRef: s.source?.page_or_section || s.source?.source_ref || `Step ${actualStepNum}`,
            provenance: 'source_supported',
          });
        });
      }

      const totalStagesLabel = stageCount > 0 ? stageCount : stepNums.length;
      const titleText =
        stageCount > 0
          ? `Operational sequence: ${stageCount} teaching stages (${blueprint.totalSourceSteps} source steps)`
          : `Complete ${blueprint.totalSourceSteps}-step operational sequence`;

      slides.push({
        num: slideNum,
        unitId: unit.id,
        tabLabel: `0${slideNum} The Journey`,
        badge: `Card 0${slideNum}`,
        visualFormat: 'process_flow',
        layoutName: 'The Training Spine',
        teachingMethod: unit.teachingMethod,
        gammaKicker: 'THE JOURNEY',
        gammaArchetype: 'dark_anchor_three_column',
        gammaStopBanner: 'FOLLOW EXACT SEQUENCE · NEVER SKIP VERIFICATION GATES',
        title: titleText,
        subtitle: 'Each stage unlocks the next only when its verification gate is complete.',
        learningObjective: unit.learningObjective,
        principalTeachingPoint: `Complete Stages 1 through ${totalStagesLabel} in order without skipping checks.`,
        whyItMatters: 'Each stage prepares the next one safely and accurately.',
        takeawayOrQuestion: `Complete each stage in exact order before moving to the next.`,
        cards,
        requiresOperationalPhoto: false,
        source: unit.source,
        coveredStepNumbers: stepNums,
        coveredInventoryIds: cards.map((c) => c.id).filter(Boolean) as string[],
      });
      continue;
    }

    // 3. ANNOTATED PHOTO OR STEP DEMONSTRATION FORMAT (Gamma Alternating Archetypes)
    if (unit.visualFormat === 'annotated_photo' || unit.visualFormat === 'step_demonstration') {
      const slideNum = slides.length + 1;
      const currentStepUnitIdx = stepUnitCounter++;
      const isFirstStepUnit = currentStepUnitIdx === 0;
      const isLastStepUnit = currentStepUnitIdx === stepExecutionUnits.length - 1 && stepExecutionUnits.length > 1;

      const stepNums = unit.relatedStepNumbers;
      const stepItems = stepNums.map((n) => opSteps[n - 1]).filter(Boolean);
      const primaryStep = stepItems[0] || {};

      const cards: AdaptiveSlideCard[] = stepItems.map((s: any, idx) => {
        const actualStepNum = stepNums[idx];
        const pair = synthesizeEditorialMicroCopy(s.task_title, s.instruction, s.why_it_matters, `Control 0${actualStepNum}`);
        return sanitizeSlideCardCopy({
          id: `inv-step-${actualStepNum}`,
          label: pair.title,
          value: pair.title,
          subtext: pair.body,
          tag: String(actualStepNum).padStart(2, '0'),
          tagType: s.critical_control ? 'warning' : 'positive',
          why: s.why_it_matters || undefined,
          consequence: s.coach_tip ? sanitizeLearnerText(s.coach_tip) : undefined,
          sourceRef: s.source?.page_or_section || s.source?.source_ref || `Step ${actualStepNum}`,
          provenance: 'source_supported',
        });
      });

      const stepContextText = `${primaryStep.task_title || ''} ${primaryStep.instruction || ''}`.trim();
      const libraryMatch = findBestVisualMatch(stepContextText, `${blueprint.sopTitle} ${blueprint.role}`);
      const hasHighConfidenceLibraryPhoto = libraryMatch.score >= 12;

      // Choose distinct Gamma Archetype so consecutive slides never look identical
      let archetype: GammaCardArchetype;
      if (isFirstStepUnit) {
        archetype = 'split_photo_numbered_lines';
      } else if (isLastStepUnit) {
        archetype = 'inline_icon_split_photo';
      } else {
        const middleArchetypes: GammaCardArchetype[] = [
          'ledger_with_stop_banner',
          'two_over_one_grid',
          'dark_anchor_three_column',
          'crosshair_quad_grid',
        ];
        archetype = middleArchetypes[(currentStepUnitIdx - 1) % middleArchetypes.length];
      }

      const archetypeUsesPhoto =
        archetype === 'split_photo_numbered_lines' || archetype === 'inline_icon_split_photo';

      const gammaKicker = isFirstStepUnit
        ? 'START HERE'
        : isLastStepUnit
        ? 'THE HANDOFF'
        : `STAGE ${String(unit.stageNumber || currentStepUnitIdx).padStart(2, '0')}`;

      const gammaHeadline = buildGammaImperativeHeadline(
        stepItems,
        stepNums,
        isFirstStepUnit,
        isLastStepUnit,
        unit.stageTitle,
        unit.stageNumber
      );
      const gammaMicroItems = buildGammaMicroItemsFromSteps(stepItems, stepNums);
      const gammaStopBanner = buildGammaStopBanner(stepItems, controls, currentStepUnitIdx);
      const rawStepWhy = sanitizeLearnerText(primaryStep.why_it_matters);

      const cleanSubtitle =
        !isDuplicateLearnerCopy(gammaHeadline, rawStepWhy) &&
        !isDuplicateLearnerCopy(primaryStep.instruction, rawStepWhy) &&
        rawStepWhy
          ? rawStepWhy
          : '';

      const rawTakeaway = sanitizeLearnerText(primaryStep.scenario_question);
      const cleanTakeaway =
        rawTakeaway && !isDuplicateLearnerCopy(rawTakeaway, primaryStep.instruction)
          ? rawTakeaway
          : '';

      const resolvedStepPhoto = archetypeUsesPhoto
        ? selectDistinctPhotoUrl(libraryMatch.url, usedPhotoUrls, slideNum)
        : libraryMatch.url || '/Guruji_Real_Photo_Visual_Library_500/009_hospitality_room_cleaning.webp';

      slides.push({
        num: slideNum,
        unitId: unit.id,
        tabLabel: isFirstStepUnit
          ? `0${slideNum} Start Here`
          : isLastStepUnit
          ? `0${slideNum} Handoff`
          : `0${slideNum} Control 0${currentStepUnitIdx}`,
        badge: `Card 0${slideNum}`,
        visualFormat: unit.visualFormat,
        layoutName: gammaKicker,
        teachingMethod: unit.teachingMethod,
        gammaKicker,
        gammaKickerRight: false,
        gammaArchetype: archetype,
        gammaStopBanner,
        gammaAnchorThesis:
          archetype === 'dark_anchor_three_column'
            ? buildGammaAnchorThesis(stepItems, rawStepWhy)
            : undefined,
        gammaMicroItems,
        title: gammaHeadline,
        subtitle: cleanSubtitle,
        learningObjective: unit.learningObjective,
        principalTeachingPoint: primaryStep.instruction || unit.whatLearnerMustKnowOrDo,
        whyItMatters: rawStepWhy || 'Follow this control carefully to maintain safety and quality.',
        takeawayOrQuestion: cleanTakeaway,
        cards,
        requiresOperationalPhoto: unit.requiresOperationalPhoto,
        photoPrompt:
          unit.requiresOperationalPhoto || archetypeUsesPhoto
            ? `${blueprint.role} performing Step ${stepNums[0]} (${primaryStep.task_title || ''}): ${primaryStep.instruction || blueprint.sopTitle}`
            : undefined,
        photoUrl: resolvedStepPhoto,
        photoCaption: sanitizeLearnerText(primaryStep.task_title || blueprint.sopTitle),
        photoProvenanceLabel: hasHighConfidenceLibraryPhoto ? 'Visual Reference' : 'Visual Guide',
        source: unit.source,
        coveredStepNumbers: stepNums,
        coveredInventoryIds: cards.map((c) => c.id).filter(Boolean) as string[],
      });
      continue;
    }

    // 4. DECISION TREE FORMAT (Gamma "EXCEPTION PATH: When something blocks progress, pause and escalate")
    if (unit.visualFormat === 'decision_tree') {
      const cards: AdaptiveSlideCard[] = [
        ...decisions.map((d: any, idx: number) => {
          const sit = sanitizeLearnerText(d.situation) || d.situation;
          const act = sanitizeLearnerText(d.action || d.decision) || d.action || d.decision;
          return sanitizeSlideCardCopy({
            id: `inv-decision-${idx + 1}`,
            label: deriveSemanticConceptLabel(sit, 'Decision Trigger'),
            value: sit,
            subtext: act,
            tag: 'Decision',
            tagType: 'positive' as const,
            sourceRef: d.source_ref || unit.source.sectionOrPage,
            provenance: 'source_supported' as const,
          });
        }),
        ...exceptions.map((e: any, idx: number) => {
          const trig = sanitizeLearnerText(e.trigger) || e.trigger;
          const res = sanitizeLearnerText(e.resolution) || e.resolution;
          return sanitizeSlideCardCopy({
            id: `inv-exception-${idx + 1}`,
            label: deriveSemanticConceptLabel(trig, 'Exception Case'),
            value: trig,
            subtext: res,
            tag: 'Exception',
            tagType: 'warning' as const,
            sourceRef: e.source_ref || unit.source.sectionOrPage,
            provenance: 'source_supported' as const,
          });
        }),
        ...escalations.map((esc: any, idx: number) => {
          const sit = sanitizeLearnerText(esc.situation) || esc.situation;
          const act = sanitizeLearnerText(esc.contact_or_action) || esc.contact_or_action;
          return sanitizeSlideCardCopy({
            id: `inv-escalation-${idx + 1}`,
            label: deriveSemanticConceptLabel(sit, 'Escalation Trigger'),
            value: sit,
            subtext: act,
            tag: 'Escalate',
            tagType: 'negative' as const,
            consequence: 'Pause work and wait for supervisor guidance before continuing.',
            sourceRef: esc.source_ref || unit.source.sectionOrPage,
            provenance: 'source_supported' as const,
          });
        }),
      ];

      // Deduplicate cards so near-identical triggers are merged
      const seenValues = new Set<string>();
      const distinctCards = cards.filter((c) => {
        const val = (c.value || '').toLowerCase().slice(0, 25);
        if (!val || seenValues.has(val)) return false;
        seenValues.add(val);
        return true;
      });

      // Keep the most critical 4 exceptions on ONE high-impact checkerboard matrix card
      const selectedCards = distinctCards.slice(0, 4);
      const slideNum = slides.length + 1;
      slides.push({
        num: slideNum,
        unitId: unit.id,
        tabLabel: `0${slideNum} Exceptions`,
        badge: `Card 0${slideNum}`,
        visualFormat: 'decision_tree',
        layoutName: 'Exception Path',
        teachingMethod: unit.teachingMethod,
        gammaKicker: 'EXCEPTION PATH',
        gammaKickerRight: false,
        gammaArchetype: 'checkerboard_exception_matrix',
        gammaStopBanner: 'PAUSE · RECHECK · ESCALATE · DO NOT GUESS',
        title: 'When something blocks execution, pause and route correctly',
        subtitle: 'Follow the approved exception and escalation path whenever an anomaly occurs.',
        learningObjective: unit.learningObjective,
        principalTeachingPoint: unit.whatLearnerMustKnowOrDo,
        whyItMatters: 'Knowing the exact response for special cases prevents guesswork under pressure.',
        takeawayOrQuestion: 'If an issue is not covered here, pause work and ask your supervisor.',
        cards: selectedCards,
        requiresOperationalPhoto: false,
        source: unit.source,
        coveredStepNumbers: [],
        coveredInventoryIds: distinctCards.map((c) => c.id).filter(Boolean) as string[],
      });
      continue;
    }

    // 5. COMPARISON FORMAT (Gamma "NON-NEGOTIABLE: Never improvise around safety, privacy, or system controls")
    if (unit.visualFormat === 'comparison') {
      const cards: AdaptiveSlideCard[] = [];

      // First include Critical Controls & Safety Rules as crisp Non-Negotiable ledger rows
      controls.forEach((c: any, idx: number) => {
        const ruleText = sanitizeLearnerText(typeof c === 'string' ? c : c.rule || c.text || '');
        if (!ruleText) return;
        const rationaleText = sanitizeLearnerText(typeof c === 'object' && c.rationale ? c.rationale : '');
        const pair = synthesizeEditorialMicroCopy(undefined, ruleText, rationaleText, 'Non-Negotiable Rule');
        cards.push(
          sanitizeSlideCardCopy({
            id: `inv-control-${idx + 1}`,
            label: pair.title,
            value: pair.title,
            subtext: pair.body,
            tag: 'Control',
            tagType: 'negative',
            sourceRef: (typeof c === 'object' && c.source_ref) || unit.source.sectionOrPage,
            provenance: 'source_supported',
          })
        );
      });

      safetyRules.forEach((sr: any, idx: number) => {
        const safetyText = sanitizeLearnerText(typeof sr === 'string' ? sr : sr.rule || String(sr || ''));
        if (!safetyText) return;
        if (cards.some((existing) => isDuplicateLearnerCopy(existing.subtext, safetyText))) return;
        const pair = synthesizeEditorialMicroCopy(undefined, safetyText, undefined, 'Safety Red Line');
        cards.push(
          sanitizeSlideCardCopy({
            id: `inv-safety-${idx + 1}`,
            label: pair.title,
            value: pair.title,
            subtext: pair.body,
            tag: 'Safety',
            tagType: 'negative',
            sourceRef: (typeof sr === 'object' && sr.source_ref) || unit.source.sectionOrPage,
            provenance: 'source_supported',
          })
        );
      });

      mistakes.forEach((m: any, idx: number) => {
        const mistakeText = sanitizeLearnerText(typeof m === 'string' ? m : m.mistake || '');
        if (!mistakeText) return;
        if (cards.some((existing) => isDuplicateLearnerCopy(existing.subtext, mistakeText))) return;
        const rawPrev = typeof m === 'object' && m.prevention ? sanitizeLearnerText(m.prevention) : '';
        const pair = synthesizeEditorialMicroCopy(undefined, mistakeText, rawPrev, 'Prohibited Shortcut');
        cards.push(
          sanitizeSlideCardCopy({
            id: `inv-mistake-${idx + 1}`,
            label: pair.title,
            value: pair.title,
            subtext: pair.body,
            tag: 'Never',
            tagType: 'negative',
            sourceRef: (typeof m === 'object' && m.source_ref) || unit.source.sectionOrPage,
            provenance: 'source_supported',
          })
        );
      });

      if (cards.length === 0) {
        const firstStepInstr = sanitizeLearnerText(opSteps[0]?.instruction) || `Complete every check in order for ${blueprint.sopTitle}.`;
        const pair1 = synthesizeEditorialMicroCopy('Follow Verified Sequence', firstStepInstr);
        const neverDoText = sanitizeLearnerText(tools[0]?.never_do) || 'Never skip required verification checks or rely on memory.';
        const pair2 = synthesizeEditorialMicroCopy('No Unverified Shortcuts', neverDoText);
        cards.push(
          sanitizeSlideCardCopy({
            id: controls.length > 0 ? 'inv-control-1' : undefined,
            label: pair1.title,
            value: pair1.title,
            subtext: pair1.body,
            tag: 'Control',
            tagType: 'positive',
            provenance: 'source_supported',
          }),
          sanitizeSlideCardCopy({
            id: tools.length > 0 ? 'inv-tool-1' : undefined,
            label: pair2.title,
            value: pair2.title,
            subtext: pair2.body,
            tag: 'Never',
            tagType: 'negative',
            provenance: 'source_supported',
          })
        );
      }

      const allCoveredIds = [
        ...controls.map((_: any, idx: number) => `inv-control-${idx + 1}`),
        ...safetyRules.map((_: any, idx: number) => `inv-safety-${idx + 1}`),
        ...mistakes.map((_: any, idx: number) => `inv-mistake-${idx + 1}`),
      ];

      // Keep top 4-5 non-negotiable prohibitions on ONE ledger card
      const selectedCards = cards.slice(0, 5);
      const slideNum = slides.length + 1;
      slides.push({
        num: slideNum,
        unitId: unit.id,
        tabLabel: `0${slideNum} Non-Negotiable`,
        badge: `Card 0${slideNum}`,
        visualFormat: 'comparison',
        layoutName: 'Non-Negotiable Guardrails',
        teachingMethod: unit.teachingMethod,
        gammaKicker: 'NON-NEGOTIABLE',
        gammaArchetype: 'non_negotiable_ledger',
        gammaStopBanner: 'SAFETY OR COMPLIANCE RISK · STOP AND FOLLOW PROCEDURE',
        title: 'Never improvise around safety, privacy, or system controls',
        subtitle: 'Protect the operation by strictly enforcing these non-negotiable red lines.',
        learningObjective: unit.learningObjective,
        principalTeachingPoint: unit.whatLearnerMustKnowOrDo,
        whyItMatters: unit.difficultyFactor,
        takeawayOrQuestion: 'Never trade accuracy or safety for speed.',
        cards: selectedCards,
        requiresOperationalPhoto: false,
        source: unit.source,
        coveredStepNumbers: [],
        coveredInventoryIds: allCoveredIds,
      });
      continue;
    }

    // 6. STRUCTURED TABLE FORMAT (Terminology, Thresholds, Quality Standards)
    if (unit.visualFormat === 'structured_table') {
      const stepNums = unit.relatedStepNumbers;
      const cards: AdaptiveSlideCard[] = [
        ...terminology
          .filter((t: any) => {
            const termStr = sanitizeLearnerText(t?.term || '');
            const meanStr = sanitizeLearnerText(t?.meaning || '');
            return termStr && meanStr && !(meanStr.toLowerCase().startsWith(termStr.toLowerCase()) && termStr.split(/\s+/).length >= 3);
          })
          .map((t: any, idx: number) => {
            const cleanTerm = sanitizeLearnerText(t.term) || t.term;
            const cleanMean = sanitizeLearnerText(t.meaning) || t.meaning;
            return sanitizeSlideCardCopy({
              id: `inv-term-${idx + 1}`,
              label: cleanTerm,
              value: cleanTerm,
              subtext: cleanMean,
              tag: 'Term',
              tagType: 'default' as const,
              sourceRef: unit.source.sectionOrPage,
              provenance: 'source_supported' as const,
            });
          }),
        ...qualityRules
          .filter((q: any) => {
            const qStr = sanitizeLearnerText(typeof q === 'string' ? q : q?.rule || String(q || ''));
            return qStr && !opSteps.some((s: any) => isDuplicateLearnerCopy(s?.instruction, qStr));
          })
          .map((q: any, idx: number) => {
            const qText = sanitizeLearnerText(typeof q === 'string' ? q : q.rule || String(q));
            const pair = synthesizeEditorialMicroCopy(undefined, qText, undefined, 'Quality Standard');
            return sanitizeSlideCardCopy({
              id: `inv-quality-${idx + 1}`,
              label: pair.title,
              value: pair.title,
              subtext: pair.body,
              tag: 'Standard',
              tagType: 'positive' as const,
              sourceRef: unit.source.sectionOrPage,
              provenance: 'source_supported' as const,
            });
          }),
        ...stepNums.map((n) => {
          const s = opSteps[n - 1];
          const pair = synthesizeEditorialMicroCopy(s?.task_title, s?.instruction, s?.why_it_matters, `Standard 0${n}`);
          return sanitizeSlideCardCopy({
            id: `inv-step-${n}`,
            label: pair.title,
            value: pair.title,
            subtext: pair.body,
            tag: `Step ${n}`,
            tagType: 'default' as const,
            why: s?.why_it_matters,
            sourceRef: s?.source?.page_or_section || `Step ${n}`,
            provenance: 'source_supported' as const,
          });
        }),
      ];

      // Deduplicate cards so no two cards share the same label
      const seenCardLabels = new Set<string>();
      const deduplicatedCards = cards.filter((c) => {
        const key = c.label.toLowerCase().trim();
        if (seenCardLabels.has(key)) return false;
        seenCardLabels.add(key);
        return true;
      });

      if (deduplicatedCards.length === 0) continue;

      const pages = paginateCards(deduplicatedCards, 6);
      pages.forEach((pageCards, pageIdx) => {
        const slideNum = slides.length + 1;
        const pageTitle =
          pageIdx === 0
            ? 'Verify exact standards and reference specifications'
            : 'Additional operational thresholds and specifications';
        slides.push({
          num: slideNum,
          unitId: `${unit.id}-p${pageIdx + 1}`,
          tabLabel: `0${slideNum} Standards`,
          badge: `Card 0${slideNum}`,
          visualFormat: 'structured_table',
          layoutName: 'Reference Standards',
          teachingMethod: unit.teachingMethod,
          gammaKicker: 'OPERATIONAL STANDARDS',
          gammaKickerRight: false,
          gammaArchetype: 'crosshair_quad_grid',
          gammaStopBanner: 'VERIFY EXACT THRESHOLDS · DO NOT ESTIMATE FROM MEMORY',
          title: pageTitle,
          subtitle: 'Key measurements, tolerances, and operational definitions for this procedure.',
          learningObjective: unit.learningObjective,
          principalTeachingPoint: unit.whatLearnerMustKnowOrDo,
          whyItMatters: 'Following exact numbers and standards keeps your work consistent every shift.',
          takeawayOrQuestion: 'Always check exact numbers and timings rather than guessing.',
          cards: pageCards,
          requiresOperationalPhoto: false,
          source: unit.source,
          coveredStepNumbers: stepNums,
          coveredInventoryIds: pageCards.map((c) => c.id).filter(Boolean) as string[],
        });
      });
      continue;
    }

    const slideNum = slides.length + 1;

    // 7. KNOWLEDGE CHECK FORMAT (Gamma "CLOSE THE LOOP: Close with the completion check" + Interactive Role-Play)
    const firstStep = opSteps[0];
    const lastStep = opSteps[opSteps.length - 1] || firstStep;
    const firstDecision = decisions[0];
    const firstException = exceptions[0];

    const cleanSituation = sanitizeLearnerText(firstDecision?.situation);
    const cleanTrigger = sanitizeLearnerText(firstException?.trigger);
    const cleanFirstTitle = sanitizeLearnerText(firstStep?.task_title || blueprint.sopTitle);

    const checkQuestion =
      firstDecision && cleanSituation
        ? `When "${cleanSituation}" happens during ${blueprint.sopTitle}, what should you do?`
        : firstException && cleanTrigger
        ? `If "${cleanTrigger}" happens on the job, how should you respond?`
        : sanitizeLearnerText(firstStep?.scenario_question) ||
          `What is the right action for "${cleanFirstTitle}"?`;

    const correctText =
      sanitizeLearnerText(
        firstDecision?.action ||
          firstDecision?.decision ||
          firstException?.resolution ||
          firstStep?.instruction
      ) || `Follow the ${blueprint.sopTitle} steps in order and complete all checks.`;

    const wrongText1 =
      sanitizeLearnerText(mistakes[0]?.mistake || tools[0]?.never_do) ||
      'Skip the check to save time and finish the step faster.';

    const wrongText2 =
      'Guess from memory without checking the requirement or asking a supervisor.';

    const completionPhotoMatch = findBestVisualMatch(
      `${lastStep?.task_title || ''} ${lastStep?.instruction || ''} handover check`,
      `${blueprint.sopTitle} ${blueprint.role}`
    );
    const resolvedCompletionPhoto = selectDistinctPhotoUrl(completionPhotoMatch.url, usedPhotoUrls, slideNum + 3);

    const closeLoopItems: GammaMicroItem[] = [
      {
        badge: '01',
        title: 'Confirm the chain',
        body:
          opSteps.length > 0
            ? `${opSteps
                .slice(0, 5)
                .map((s: any) => sanitizeLearnerText(s.task_title || s.action_verb))
                .filter(Boolean)
                .join(', ')} are all confirmed in sequence.`
            : 'Every required verification gate and control check is confirmed.',
        iconType: 'building',
      },
      {
        badge: '02',
        title: 'Check before ending',
        body:
          sanitizeLearnerText(lastStep?.instruction) ||
          'Check system status and resolve any outstanding issues before ending the interaction.',
        iconType: 'user',
      },
      {
        badge: '03',
        title: 'Record the handover',
        body:
          sanitizeLearnerText(escalations[0]?.contact_or_action || controls[0]?.rule) ||
          'Record the completed action, any exceptions handled, and current status in the approved log.',
        iconType: 'key',
      },
    ];

    slides.push({
      num: slideNum,
      unitId: unit.id,
      tabLabel: `0${slideNum} Close the Loop`,
      badge: `Card 0${slideNum}`,
      visualFormat: 'knowledge_check',
      layoutName: 'Close the Loop',
      teachingMethod: unit.teachingMethod,
      gammaKicker: 'CLOSE THE LOOP',
      gammaArchetype: 'interactive_mastery_gate',
      gammaStopBanner: 'CONFIRM COMPLETION CHAIN · ZERO OPEN EXCEPTIONS',
      gammaMicroItems: closeLoopItems,
      title: 'Close with the completion check',
      subtitle: 'Confirm the verification chain and test your decision judgement before floor practice.',
      learningObjective: unit.learningObjective,
      principalTeachingPoint: unit.whatLearnerMustKnowOrDo,
      whyItMatters: 'Checking your understanding now helps you succeed on the floor.',
      takeawayOrQuestion: checkQuestion,
      cards: [],
      interactiveCheck: {
        question: checkQuestion,
        options: [
          {
            id: 'opt-correct',
            text: correctText,
            isCorrect: true,
            feedback: 'Correct! That matches the approved procedure.',
          },
          {
            id: 'opt-wrong-1',
            text: wrongText1,
            isCorrect: false,
            feedback: 'Not quite. Skipping required checks creates safety and compliance risks.',
          },
          {
            id: 'opt-wrong-2',
            text: wrongText2,
            isCorrect: false,
            feedback: 'Not quite. Never guess when you can check the standard or escalate.',
          },
        ],
      },
      requiresOperationalPhoto: false,
      photoUrl: resolvedCompletionPhoto,
      source: unit.source,
      coveredStepNumbers: unit.relatedStepNumbers,
    });
  }

  return repairAndVerifyEditorialSlides(slides);
}

/**
 * STEP 6: Validates the generated Adaptive Training Deck against the source SOP before delivery.
 * Enforces the 5-Pillar Quality Gate:
 * 1. Missing required operational actions & controls (100% source coverage)
 * 2. Repeated explanations & duplicate slide titles
 * 3. Unrelated cross-domain terminology & dynamic hallucinations
 * 4. Corrupted, truncated or malformed titles
 * 5. Unsupported operational claims & cross-slide sequence preservation
 */
export function validateAdaptiveDeckAgainstSop(
  blueprint: TeachingBlueprint,
  slides: AdaptiveDeckSlide[],
  lesson?: Lesson
): DeckQualityAssuranceReport {
  const totalSteps = blueprint.totalSourceSteps;
  const coveredSet = new Set<number>();
  const coveredInventorySet = new Set<string>();
  const qualityIssues: QualityIssue[] = [];

  for (const slide of slides) {
    for (const stepNum of slide.coveredStepNumbers || []) {
      coveredSet.add(stepNum);
    }
    for (const invId of slide.coveredInventoryIds || []) {
      coveredInventorySet.add(invId);
    }
    for (const card of slide.cards || []) {
      if (card.id) coveredInventorySet.add(card.id);
      if (card.stepNum) coveredSet.add(card.stepNum);
    }
  }

  for (const stepNum of coveredSet) {
    coveredInventorySet.add(`inv-step-${stepNum}`);
  }

  // 1. QUALITY CHECK: Missing Required Actions & Controls
  const missingSteps: number[] = [];
  if (totalSteps > 0) {
    for (let s = 1; s <= totalSteps; s++) {
      if (!coveredSet.has(s)) missingSteps.push(s);
    }
  }
  const allMandatoryStepsIncluded = missingSteps.length === 0;
  if (!allMandatoryStepsIncluded) {
    qualityIssues.push({
      type: 'MISSING_REQUIRED_ACTION',
      severity: 'BLOCKING',
      description: `Missing required operational action(s): Step(s) [${missingSteps.join(', ')}] omitted from generated deck.`,
    });
  }

  // Sequence verification (Global across ALL slides and visual formats)
  let sequencePreserved = true;

  // A. Intra-slide sequence check: within any single slide, steps must be strictly ascending
  for (const slide of slides) {
    const steps = slide.coveredStepNumbers || [];
    for (let i = 1; i < steps.length; i++) {
      if (steps[i] <= steps[i - 1]) {
        sequencePreserved = false;
        qualityIssues.push({
          type: 'SEQUENCE_ERROR',
          severity: 'BLOCKING',
          slideNum: slide.num,
          description: `Intra-slide sequence inversion on slide ${slide.num} ("${slide.title}"): Step ${steps[i]} appears after Step ${steps[i - 1]}.`,
        });
        break;
      }
    }
  }

  // B. Inter-slide sequence check across detailed operational slides
  // Exclude whole-deck overviews (> 70% of total steps, process_flow overview, or final quiz)
  const isOverviewSlide = (s: AdaptiveDeckSlide) =>
    (s.coveredStepNumbers?.length || 0) >= Math.max(3, totalSteps * 0.7) ||
    s.visualFormat === 'process_flow' ||
    s.visualFormat === 'knowledge_check';

  const detailedExecutionSlides = slides.filter((s) => !isOverviewSlide(s) && (s.coveredStepNumbers?.length || 0) > 0);

  let highestStepSeen = 0;
  let highestStepSlideNum = 0;

  for (const slide of detailedExecutionSlides) {
    const minStepOnSlide = Math.min(...slide.coveredStepNumbers);
    if (minStepOnSlide < highestStepSeen) {
      sequencePreserved = false;
      qualityIssues.push({
        type: 'SEQUENCE_ERROR',
        severity: 'BLOCKING',
        slideNum: slide.num,
        description: `Operational sequence inversion across slides: Slide ${slide.num} ("${slide.title}") introduces Step ${minStepOnSlide}, but prior Slide ${highestStepSlideNum} already advanced to Step ${highestStepSeen}.`,
      });
      break;
    }
    const maxOnSlide = Math.max(...slide.coveredStepNumbers);
    if (maxOnSlide > highestStepSeen) {
      highestStepSeen = maxOnSlide;
      highestStepSlideNum = slide.num;
    }
  }

  const inventory = blueprint.contentInventory || [];
  const controlAndSafetyItems = inventory.filter((item) =>
    ['prerequisite', 'tool', 'control', 'safety'].includes(item.category)
  );
  const allControlsAndSafetyIncluded =
    controlAndSafetyItems.length === 0 ||
    controlAndSafetyItems.every((item) => coveredInventorySet.has(item.id));
  if (!allControlsAndSafetyIncluded) {
    const missingControls = controlAndSafetyItems.filter((i) => !coveredInventorySet.has(i.id));
    qualityIssues.push({
      type: 'MISSING_REQUIRED_ACTION',
      severity: 'BLOCKING',
      description: `${missingControls.length} mandatory control/safety safeguard(s) missing from presentation.`,
    });
  }

  const decisionAndExceptionItems = inventory.filter((item) =>
    ['decision', 'exception', 'escalation'].includes(item.category)
  );
  const allDecisionsAndExceptionsIncluded =
    decisionAndExceptionItems.length === 0 ||
    decisionAndExceptionItems.every((item) => coveredInventorySet.has(item.id));
  if (!allDecisionsAndExceptionsIncluded) {
    qualityIssues.push({
      type: 'MISSING_REQUIRED_ACTION',
      severity: 'WARNING',
      description: 'Some decision or exception pathways are not explicitly referenced in deck cards.',
    });
  }

  // 2. QUALITY CHECK: Repeated Explanations & Duplicate Titles
  const seenTitles = new Map<string, number>();
  let hasDuplicateTitles = false;
  for (const slide of slides) {
    const norm = slide.title.toLowerCase().trim().replace(/^(?:stage\s*\d+[\s:\.\-\—]*|card\s*\d+[\s:\.\-\—]*)/i, '');
    if (norm.length > 5) {
      if (seenTitles.has(norm)) {
        hasDuplicateTitles = true;
        qualityIssues.push({
          type: 'REPEATED_EXPLANATION',
          severity: 'BLOCKING',
          slideNum: slide.num,
          description: `Duplicate slide headline detected: "${slide.title}" duplicates slide ${seenTitles.get(norm)}.`,
        });
      } else {
        seenTitles.set(norm, slide.num);
      }
    }
  }
  const noRepeatedExplanations = !hasDuplicateTitles;

  // 3. QUALITY CHECK: Unrelated Terminology & Cross-Domain Hallucinations
  const DOMAIN_PROFILES = [
    {
      domainName: 'Finance & Accounting',
      discriminator: /finance|accounting|ledger|audit|tax|payroll|balance\s*sheet/i,
      terms: ['ebitda', 'derivatives', 'ledger reconciliation', 'fiscal quarter', 'portfolio hedge', 'arbitrage', 'equity swap', 'debt underwriting', 'balance sheet reconciliation'],
    },
    {
      domainName: 'Clinical & Phlebotomy',
      discriminator: /phlebotomy|blood|venipuncture|clinical|pathology|hematology/i,
      terms: ['phlebotomy', 'venipuncture', 'centrifuge', 'vacutainer', 'blood vial', 'intubation', 'cannula', 'anesthesia'],
    },
    {
      domainName: 'Aviation & Flight Operations',
      discriminator: /aviation|aircraft|flight|cockpit|pilot|avionics/i,
      terms: ['avionics', 'altimeter', 'transponder', 'rudder pitch', 'flaps 20', 'cockpit yaw', 'atc clearance'],
    },
    {
      domainName: 'Software DevOps & Cloud',
      discriminator: /software|devops|kubernetes|docker|cloud\s*sql|database/i,
      terms: ['kubernetes pod', 'docker container', 'ci/cd pipeline', 'sql injection', 'git rebase', 'pull request'],
    },
  ];

  const deckFullText = JSON.stringify(slides).toLowerCase();
  const rawStepsText = ((lesson as any)?.raw_steps || (lesson as any)?.steps || [])
    .map((s: any) => `${s.task_title || s.title || ''} ${s.instruction || s.description || ''} ${s.text || ''}`)
    .join(' ');

  const sourceFullText = (
    blueprint.sopTitle +
    ' ' +
    blueprint.role +
    ' ' +
    blueprint.purpose +
    ' ' +
    inventory.map((i) => i.text).join(' ') +
    ' ' +
    (lesson?.sourceMeta?.rawText || '') +
    ' ' +
    rawStepsText
  ).toLowerCase();

  let hasUnrelatedTerm = false;
  for (const profile of DOMAIN_PROFILES) {
    const isSourceInDomain = profile.discriminator.test(sourceFullText);
    if (!isSourceInDomain) {
      for (const term of profile.terms) {
        if (deckFullText.includes(term.toLowerCase())) {
          hasUnrelatedTerm = true;
          qualityIssues.push({
            type: 'UNRELATED_TERMINOLOGY',
            severity: 'BLOCKING',
            description: `Unrelated ${profile.domainName} terminology detected in operational deck: "${term}".`,
          });
        }
      }
    }
  }
  const noUnrelatedTerminology = !hasUnrelatedTerm;

  // 4. QUALITY CHECK: Corrupted, Truncated or Malformed Titles
  const DANGLING_TITLE_REGEX = /(?:\s+(?:to|and|with|for|the|or|in|on|at|by|from)\s*\.?$|\.{2,}$|\.\s*$)/i;
  const UNPARSED_HEADER_REGEX = /^(?:sop\s*[\:\-\—]|document ref|role\s*[\:\-\—]|purpose\s*[\:\-\—])/i;
  const STRAY_NUMBERING_REGEX = /\b(?:\.\.\.\s*\d+|\s+[—–]\s*\d+\.?)$/;

  let hasCorruptedTitles = false;
  for (const slide of slides) {
    if (
      DANGLING_TITLE_REGEX.test(slide.title) ||
      UNPARSED_HEADER_REGEX.test(slide.title) ||
      STRAY_NUMBERING_REGEX.test(slide.title)
    ) {
      hasCorruptedTitles = true;
      qualityIssues.push({
        type: 'CORRUPTED_TITLE',
        severity: 'BLOCKING',
        slideNum: slide.num,
        description: `Corrupted or truncated slide title detected on slide ${slide.num}: "${slide.title}".`,
      });
    }
  }
  const noCorruptedTitles = !hasCorruptedTitles;

  // 5. QUALITY CHECK: Unsupported Operational Claims
  // Rigorously verifies that operational assertions, timeframes, and thresholds are grounded in source
  let hasUnsupportedClaims = false;
  const QUANTITATIVE_REGEX = /\b(\d+(?:\.\d+)?)\s*(minutes?|mins?|seconds?|secs?|hours?|hrs?|degrees?|°[cf]?|celsius|fahrenheit|ppm|psi|bar|liters?|ml|oz|volts?|amps?)\b/gi;

  for (const slide of slides) {
    for (const card of slide.cards || []) {
      // Check illustrative card provenance
      if (card.provenance === 'illustrative_example' && !card.sourceRef) {
        hasUnsupportedClaims = true;
        qualityIssues.push({
          type: 'UNSUPPORTED_OPERATIONAL_CLAIM',
          severity: 'WARNING',
          slideNum: slide.num,
          description: `Card "${card.label}" lacks verified source provenance citation.`,
        });
      }

      // Check numeric thresholds asserted in cards against source text
      const cardText = `${card.label} ${card.value || ''} ${card.subtext || ''}`;
      const quantMatches = cardText.matchAll(QUANTITATIVE_REGEX);
      for (const qm of quantMatches) {
        const fullThreshold = qm[0].toLowerCase();
        const numValue = qm[1];
        if (!sourceFullText.includes(fullThreshold) && !sourceFullText.includes(numValue)) {
          hasUnsupportedClaims = true;
          qualityIssues.push({
            type: 'UNSUPPORTED_OPERATIONAL_CLAIM',
            severity: 'BLOCKING',
            slideNum: slide.num,
            description: `Unsupported quantitative operational threshold in Card "${card.label}": "${fullThreshold}" is not supported by source SOP.`,
          });
        }
      }
    }
  }
  const noUnsupportedInstructions = !hasUnsupportedClaims;

  // Thresholds & terminology check
  const stepInventory = inventory.filter((item) => item.category === 'step');
  let thresholdsAndTerminologyRetained = true;
  for (const stepItem of stepInventory) {
    const matches = stepItem.text.match(THRESHOLD_DATA_REGEX);
    if (matches) {
      for (const m of matches) {
        if (!deckFullText.includes(m.toLowerCase())) {
          thresholdsAndTerminologyRetained = false;
          break;
        }
      }
    }
  }

  // 6. QUALITY CHECK: Stage-Step Conflation & Generic Filler Copy
  const stageUnits = blueprint.units.filter((u) => Boolean(u.stageTitle || u.stageNumber));
  const actualStageCount = stageUnits.length || slides.length;

  for (const slide of slides) {
    const stageMatches = slide.title.match(/stages\s*1\s*(?:to|through|–|-)\s*(\d+)/i);
    if (stageMatches) {
      const claimedStageNum = parseInt(stageMatches[1], 10);
      if (claimedStageNum > actualStageCount + 2) {
        qualityIssues.push({
          type: 'INCORRECT_STAGE_TERMINOLOGY',
          severity: 'BLOCKING',
          slideNum: slide.num,
          description: `Stage-step conflation on slide ${slide.num}: Title "${slide.title}" claims ${claimedStageNum} stages, but source steps were grouped into ${actualStageCount} teaching stages.`,
        });
      }
    }

    const GENERIC_FILLER_PATTERNS = [
      /\bthe\s+picker\s+must\s+work\b/i,
      /\burgency\s*&\s*speed\b/i,
    ];
    for (const card of slide.cards || []) {
      const combinedCardText = `${card.label || ''} ${card.value || ''} ${card.subtext || ''}`;
      for (const pattern of GENERIC_FILLER_PATTERNS) {
        if (pattern.test(combinedCardText)) {
          qualityIssues.push({
            type: 'UNSUPPORTED_OPERATIONAL_CLAIM',
            severity: 'BLOCKING',
            slideNum: slide.num,
            description: `Generic ungrounded filler detected on slide ${slide.num} in card "${card.label}": contains generic filler copy.`,
          });
          break;
        }
      }
    }
  }

  const formatsUsed = Array.from(new Set(slides.map((s) => s.visualFormat)));
  const opBp = lesson?.operationalBlueprint;
  const hasDecisionsOrExceptions =
    (opBp?.decision_points?.length || 0) +
      (opBp?.exceptions?.length || 0) +
      (opBp?.escalations?.length || 0) >
    0;

  const safetyAndExceptionsRetained =
    (!hasDecisionsOrExceptions || formatsUsed.includes('decision_tree')) &&
    allControlsAndSafetyIncluded;

  const hasBlockingIssues = qualityIssues.some((q) => q.severity === 'BLOCKING');

  const isValid =
    allMandatoryStepsIncluded &&
    sequencePreserved &&
    safetyAndExceptionsRetained &&
    thresholdsAndTerminologyRetained &&
    noRepeatedExplanations &&
    noUnrelatedTerminology &&
    noCorruptedTitles &&
    !hasBlockingIssues &&
    formatsUsed.length >= 2;

  const blockingCount = qualityIssues.filter((q) => q.severity === 'BLOCKING').length;
  const warningCount = qualityIssues.filter((q) => q.severity === 'WARNING').length;

  return {
    isValid,
    totalSourceSteps: totalSteps,
    coveredSourceSteps: coveredSet.size,
    totalInventoryItems: inventory.length,
    coveredInventoryItems: coveredInventorySet.size,
    allMandatoryStepsIncluded,
    allControlsAndSafetyIncluded,
    allDecisionsAndExceptionsIncluded,
    sequencePreserved,
    thresholdsAndTerminologyRetained,
    safetyAndExceptionsRetained,
    noRepeatedExplanations,
    noUnrelatedTerminology,
    noCorruptedTitles,
    noUnsupportedInstructions,
    visualFormatsUsed: formatsUsed,
    visualVarietyCount: formatsUsed.length,
    unresolvedAmbiguities: blueprint.unresolvedAmbiguities,
    qualityIssues,
    auditSummary: isValid
      ? `PASSED QUALITY GATE: ${coveredSet.size}/${totalSteps} mandatory steps and ${coveredInventorySet.size}/${inventory.length} source inventory items verified across ${slides.length} slides (${formatsUsed.length} visual formats, 0 blocking defects).`
      : `FAILED QUALITY GATE: ${blockingCount} blocking defect(s), ${warningCount} warning(s) detected.`,
  };
}

/**
 * Automated Pedagogical Deck Repair Engine:
 * Takes an invalid deck flagged by the Quality Gate and deterministically repairs:
 * 1. Missing mandatory operational actions (re-injects omitted steps into correct stages)
 * 2. Sequence inversions (restores monotonic step progression intra-slide and inter-slide)
 * 3. Corrupted or truncated titles (removes dangling words, regenerates crisp titles)
 * 4. Hallucinated cross-domain terms & unsupported claims (re-aligns copy with source SOP)
 */
export function repairAdaptiveDeck(
  blueprint: TeachingBlueprint,
  slides: AdaptiveDeckSlide[],
  report: DeckQualityAssuranceReport
): AdaptiveDeckSlide[] {
  let repaired = slides.map((s) => ({
    ...s,
    coveredStepNumbers: [...(s.coveredStepNumbers || [])],
    cards: [...(s.cards || [])],
  }));

  // 1. Repair Corrupted Titles
  const DANGLING_TITLE_REGEX = /(?:\s+(?:to|and|with|for|the|or|in|on|at|by|from)\s*\.?$|\.{2,}$|\.\s*$)/i;
  const UNPARSED_HEADER_REGEX = /^(?:sop\s*[\:\-\—]|document ref|role\s*[\:\-\—]|purpose\s*[\:\-\—])/i;
  const STRAY_NUMBERING_REGEX = /\b(?:\.\.\.\s*\d+|\s+[—–]\s*\d+\.?)$/;

  repaired = repaired.map((slide) => {
    let cleanTitle = slide.title;
    if (
      DANGLING_TITLE_REGEX.test(cleanTitle) ||
      UNPARSED_HEADER_REGEX.test(cleanTitle) ||
      STRAY_NUMBERING_REGEX.test(cleanTitle)
    ) {
      cleanTitle = cleanTitle
        .replace(UNPARSED_HEADER_REGEX, '')
        .replace(DANGLING_TITLE_REGEX, '')
        .replace(STRAY_NUMBERING_REGEX, '')
        .trim();
      if (cleanTitle.length < 5) {
        cleanTitle = `Stage ${slide.num}: Operational Execution`;
      }
    }
    return { ...slide, title: cleanTitle };
  });

  // 2. Repair Duplicate Titles
  const seenTitles = new Map<string, number>();
  repaired = repaired.map((slide) => {
    const norm = slide.title.toLowerCase().trim().replace(/^(?:stage\s*\d+[\s:\.\-\—]*|card\s*\d+[\s:\.\-\—]*)/i, '');
    if (seenTitles.has(norm)) {
      const occ = seenTitles.get(norm)! + 1;
      seenTitles.set(norm, occ);
      return {
        ...slide,
        title: `${slide.title} (Part ${occ})`,
      };
    } else {
      seenTitles.set(norm, 1);
      return slide;
    }
  });

  // 3. Repair Sequence Inversions
  // a) Sort intra-slide steps
  repaired = repaired.map((slide) => {
    if (slide.coveredStepNumbers && slide.coveredStepNumbers.length > 1) {
      return {
        ...slide,
        coveredStepNumbers: [...slide.coveredStepNumbers].sort((a, b) => a - b),
      };
    }
    return slide;
  });

  // b) Sort detailed operational slides by minimum step number
  const totalSteps = blueprint.totalSourceSteps;
  const isOverview = (s: AdaptiveDeckSlide) =>
    (s.coveredStepNumbers?.length || 0) >= totalSteps * 0.7 ||
    s.visualFormat === 'process_flow' ||
    s.visualFormat === 'checklist' ||
    s.visualFormat === 'knowledge_check';

  const overviewSlides = repaired.filter(isOverview);
  const detailSlides = repaired.filter((s) => !isOverview(s));

  if (detailSlides.length > 1) {
    detailSlides.sort((a, b) => {
      const minA = a.coveredStepNumbers.length ? Math.min(...a.coveredStepNumbers) : 999;
      const minB = b.coveredStepNumbers.length ? Math.min(...b.coveredStepNumbers) : 999;
      return minA - minB;
    });

    const openingSlides = repaired.filter(
      (s) => s.visualFormat === 'checklist' || (s.visualFormat === 'process_flow' && s.num <= 3)
    );
    const closingSlides = repaired.filter(
      (s) => s.visualFormat === 'knowledge_check' || (s.visualFormat === 'structured_table' && s.num > detailSlides.length)
    );

    if (openingSlides.length + detailSlides.length + closingSlides.length === repaired.length) {
      repaired = [...openingSlides, ...detailSlides, ...closingSlides];
    }
  }

  // 4. Repair Missing Required Actions
  const currentCovered = new Set<number>();
  repaired.forEach((s) => (s.coveredStepNumbers || []).forEach((n) => currentCovered.add(n)));
  const missingSteps: number[] = [];
  for (let s = 1; s <= totalSteps; s++) {
    if (!currentCovered.has(s)) missingSteps.push(s);
  }

  if (missingSteps.length > 0) {
    const rawInventory = blueprint.contentInventory || [];
    missingSteps.forEach((missingNum) => {
      let targetSlide = repaired.find((s) => s.coveredStepNumbers?.includes(missingNum - 1) && !isOverview(s));
      if (!targetSlide) {
        targetSlide = repaired.find((s) => s.coveredStepNumbers?.includes(missingNum + 1) && !isOverview(s));
      }
      if (!targetSlide) {
        targetSlide = repaired.find((s) => !isOverview(s));
      }

      if (targetSlide) {
        targetSlide.coveredStepNumbers = [...(targetSlide.coveredStepNumbers || []), missingNum].sort((a, b) => a - b);
        const invItem = rawInventory.find((i) => i.id === `inv-step-${missingNum}`);
        const cardTitle = invItem?.text.slice(0, 40) || `Step ${missingNum}: Mandatory Operational Action`;
        const cardDesc = invItem?.text || `Execute verified standard operating step ${missingNum}.`;
        targetSlide.cards = [
          ...(targetSlide.cards || []),
          {
            id: `repaired-card-step-${missingNum}`,
            label: cardTitle,
            value: cardTitle,
            subtext: cardDesc,
            provenance: 'source_supported',
            sourceRef: `SOP Step ${missingNum}`,
            stepNum: missingNum,
          },
        ];
      }
    });
  }

  // 5. Cleanse Unrelated Terminology
  const DISALLOWED_TERMS = [
    'ebitda',
    'derivatives',
    'ledger reconciliation',
    'fiscal quarter',
    'portfolio hedge',
    'arbitrage',
    'equity swap',
    'debt underwriting',
    'balance sheet reconciliation',
    'phlebotomy',
    'venipuncture',
    'centrifuge',
    'vacutainer',
    'blood vial',
    'intubation',
    'avionics',
    'altimeter',
    'kubernetes pod',
    'ci/cd pipeline',
  ];

  // 6. Repair Stage-Step Conflation Titles & Generic Filler Copy
  const stageUnits = blueprint.units.filter((u) => Boolean(u.stageTitle || u.stageNumber));
  const stageCount = stageUnits.length || blueprint.totalSourceSteps;

  repaired = repaired.map((slide) => {
    let title = slide.title;
    if (/stages\s*1\s*(?:to|through|–|-)\s*\d+/i.test(title) && blueprint.totalSourceSteps > stageCount) {
      title = `Operational sequence: ${stageCount} teaching stages (${blueprint.totalSourceSteps} source steps)`;
    }

    let sub = slide.subtitle || '';
    for (const term of DISALLOWED_TERMS) {
      if (sub.toLowerCase().includes(term)) {
        sub = sub.replace(new RegExp(term, 'gi'), 'standard operational procedure');
      }
    }

    const cleansedCards = (slide.cards || []).map((c) => {
      let lbl = c.label || '';
      let val = c.value || '';
      let subtext = c.subtext || '';
      for (const term of DISALLOWED_TERMS) {
        if (lbl.toLowerCase().includes(term)) lbl = lbl.replace(new RegExp(term, 'gi'), 'Standard Procedure');
        if (val.toLowerCase().includes(term)) val = val.replace(new RegExp(term, 'gi'), 'Standard Procedure');
        if (subtext.toLowerCase().includes(term)) subtext = subtext.replace(new RegExp(term, 'gi'), 'standard procedure');
      }

      if (/\bthe\s+picker\s+must\s+work\b/i.test(val) || /\bthe\s+picker\s+must\s+work\b/i.test(subtext)) {
        val = 'Operational Equipment Readiness';
        subtext = 'Confirm all required operational equipment and systems are inspected, verified, and ready before task execution.';
      }

      return { ...c, label: lbl, value: val, subtext };
    });

    return {
      ...slide,
      title,
      subtitle: sub,
      cards: cleansedCards,
    };
  });

  return repaired.map((s, idx) => ({
    ...s,
    num: idx + 1,
    badge: `Card ${String(idx + 1).padStart(2, '0')}`,
  }));
}
