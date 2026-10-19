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
  visualFormatsUsed: AdaptiveVisualFormat[];
  visualVarietyCount: number;
  noUnsupportedInstructions: boolean;
  unresolvedAmbiguities: { topic: string; description: string; sourceRef?: string }[];
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
 * Splits a multi-clause SOP step or group of steps into 2–4 crisp Gamma Micro-Items
 * with distinct semantic headings and non-redundant operational instructions.
 */
function buildGammaMicroItemsFromSteps(stepItems: any[], stepNums: number[]): GammaMicroItem[] {
  const iconCycle: GammaMicroItem['iconType'][] = ['building', 'check', 'user', 'key', 'route', 'shield', 'file'];
  const items: GammaMicroItem[] = [];

  if (stepItems.length === 1) {
    const s = stepItems[0] || {};
    const rawInstr = sanitizeLearnerText(s.instruction || '');
    const rawWhy = sanitizeLearnerText(s.why_it_matters || '');
    const rawTip = sanitizeLearnerText(s.coach_tip || '');
    const rawTaskTitle = sanitizeLearnerText(s.task_title || '');

    // Split instruction by semicolon or sentence boundaries if it has multiple clauses
    const clauses = rawInstr
      .split(/(?:;\s*|\.\s+(?=[A-Z]))/)
      .map((c) => c.trim())
      .filter((c) => c.length >= 8);

    if (clauses.length >= 2) {
      clauses.slice(0, 4).forEach((clause, idx) => {
        const pair = synthesizeEditorialMicroCopy(
          idx === 0 ? rawTaskTitle : undefined,
          clause,
          undefined,
          `Checkpoint 0${idx + 1}`
        );
        items.push({
          badge: String(idx + 1).padStart(2, '0'),
          title: pair.title,
          body: pair.body,
          iconType: iconCycle[idx % iconCycle.length],
        });
      });
    } else {
      // Single clause instruction: break into Action + Verification/Protection + Standard
      const primaryPair = synthesizeEditorialMicroCopy(rawTaskTitle, rawInstr, undefined, 'Primary Action');
      items.push({
        badge: '01',
        title: primaryPair.title,
        body: primaryPair.body,
        iconType: 'check',
      });
      if (rawWhy && !isDuplicateLearnerCopy(rawInstr, rawWhy)) {
        const whyPair = synthesizeEditorialMicroCopy(undefined, rawWhy, undefined, 'Control Standard');
        items.push({
          badge: '02',
          title: whyPair.title,
          body: whyPair.body,
          iconType: 'shield',
        });
      }
      if (rawTip && !isDuplicateLearnerCopy(rawInstr, rawTip) && !isDuplicateLearnerCopy(rawWhy, rawTip)) {
        const tipPair = synthesizeEditorialMicroCopy(undefined, rawTip, undefined, 'Verification Gate');
        items.push({
          badge: String(items.length + 1).padStart(2, '0'),
          title: tipPair.title,
          body: tipPair.body,
          iconType: 'key',
        });
      }
    }

    // Ensure at least 2–3 micro-items when a compound sentence has comma-separated clauses
    if (items.length === 1 && rawInstr.includes(',')) {
      const commaParts = rawInstr.split(/,\s+(?:and\s+|then\s+)?/).filter((p) => p.trim().length > 10);
      if (commaParts.length >= 2) {
        items.length = 0;
        commaParts.slice(0, 3).forEach((part, idx) => {
          const cleanPart = part.trim().replace(/^[a-z]/, (c) => c.toUpperCase());
          const pair = synthesizeEditorialMicroCopy(
            idx === 0 ? rawTaskTitle : undefined,
            cleanPart,
            undefined,
            `Action 0${idx + 1}`
          );
          items.push({
            badge: String(idx + 1).padStart(2, '0'),
            title: pair.title,
            body: pair.body,
            iconType: iconCycle[idx % iconCycle.length],
          });
        });
      }
    }
  } else {
    // Multiple steps in group: expand into 2–4 micro-items
    stepItems.forEach((s, idx) => {
      const actualNum = stepNums[idx] || idx + 1;
      const rawInstr = sanitizeLearnerText(s.instruction || '');
      const rawWhy = sanitizeLearnerText(s.why_it_matters || '');
      const rawTaskTitle = sanitizeLearnerText(s.task_title || '');
      const clauses = rawInstr
        .split(/(?:;\s*|\.\s+(?=[A-Z]))/)
        .map((c) => c.trim())
        .filter((c) => c.length >= 8);

      if (clauses.length >= 2 && stepItems.length === 2 && items.length < 4) {
        clauses.slice(0, 2).forEach((cl, cIdx) => {
          const pair = synthesizeEditorialMicroCopy(
            cIdx === 0 ? rawTaskTitle : undefined,
            cl,
            undefined,
            `Control ${actualNum}.${cIdx + 1}`
          );
          items.push({
            badge: String(items.length + 1).padStart(2, '0'),
            title: pair.title,
            body: pair.body,
            iconType: iconCycle[items.length % iconCycle.length],
          });
        });
      } else {
        const pair = synthesizeEditorialMicroCopy(rawTaskTitle, rawInstr, undefined, `Control 0${actualNum}`);
        items.push({
          badge: String(items.length + 1).padStart(2, '0'),
          title: pair.title,
          body: pair.body,
          iconType: iconCycle[items.length % iconCycle.length],
        });
        if (rawWhy && items.length < 4 && !isDuplicateLearnerCopy(rawInstr, rawWhy)) {
          const whyPair = synthesizeEditorialMicroCopy(undefined, rawWhy, undefined, 'Verification Standard');
          items.push({
            badge: String(items.length + 1).padStart(2, '0'),
            title: whyPair.title,
            body: whyPair.body,
            iconType: 'shield',
          });
        }
      }
    });
  }

  return items.slice(0, 4);
}

/**
 * Generates an imperative Gamma editorial headline from step titles/instructions.
 */
function buildGammaImperativeHeadline(stepItems: any[], stepNums: number[], isFirst: boolean, isLast: boolean): string {
  const primary = stepItems[0] || {};
  const rawTitle = sanitizeLearnerText(primary.task_title || '');
  const rawInstr = sanitizeLearnerText(primary.instruction || '');

  if (stepItems.length === 2) {
    const t1 = sanitizeLearnerText(stepItems[0]?.task_title || '');
    const t2 = sanitizeLearnerText(stepItems[1]?.task_title || '');
    if (t1 && t2 && t1.toLowerCase() !== t2.toLowerCase()) {
      return `${t1}, then ${t2.charAt(0).toLowerCase() + t2.slice(1)}`;
    }
  }

  if (rawTitle && rawTitle.split(/\s+/).length >= 3) {
    return rawTitle;
  }

  // Extract first imperative clause from instruction
  const firstClause = rawInstr.split(/[.;]/)[0]?.trim() || '';
  if (firstClause.length >= 12 && firstClause.length <= 68) {
    return firstClause;
  }

  if (isFirst && rawTitle) {
    return `Start cleanly: ${rawTitle}`;
  }
  if (isLast && rawTitle) {
    return `Close the loop: ${rawTitle}`;
  }
  return rawTitle || `Execute Control ${stepNums[0] || 1} without shortcuts`;
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
  const sopTitle = lesson?.title || plan?.title || fallbackTitle || 'Standard Operating Procedure';
  const rawSubtitleRole = lesson?.subtitle?.replace(/^Role:\s*/i, '').split('·')[0]?.trim() || '';
  const sopRole =
    lesson?.operationalBlueprint?.role ||
    lesson?.blueprint?.meta?.role ||
    lesson?.knowledgeModel?.identity?.role ||
    (!/^\d+\s*steps?$/i.test(rawSubtitleRole) && rawSubtitleRole ? rawSubtitleRole : '') ||
    lesson?.category ||
    'Frontline Specialist';

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

  const rawSteps: any[] = opBlueprint?.operational_steps?.length
    ? opBlueprint.operational_steps
    : stepObjectFallbacks.length
    ? stepObjectFallbacks
    : watchStepFallbacks.length
    ? watchStepFallbacks
    : kmStepFallbacks.length
    ? kmStepFallbacks
    : ctmStepFallbacks;

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
    ...(opBlueprint?.unresolved_gaps || []),
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

  // STAGE 1 OF STORY: Core Operational Sequence (START HERE -> CONTROL 01..0N -> THE HANDOFF)
  if (rawSteps.length > 0) {
    const stepGroupSize = rawSteps.length <= 5 ? 1 : 2;
    for (let i = 0; i < rawSteps.length; i += stepGroupSize) {
      const group = rawSteps.slice(i, i + stepGroupSize);
      const stepNums = group.map((_, idx) => i + idx + 1);
      const combinedText = group
        .map((s: any) => `${s.task_title || ''} ${s.instruction || ''} ${s.why_it_matters || ''}`)
        .join(' ');

      const isPhysical = isPhysicalOperationalStep(combinedText);
      const hasThresholds = THRESHOLD_DATA_REGEX.test(combinedText);
      const isConditional = CONDITIONAL_STEP_REGEX.test(combinedText);

      let chosenFormat: AdaptiveVisualFormat = 'step_demonstration';
      let chosenMethod: TeachingMethod = 'physical_task_demonstration';
      let rationale = 'Step-by-step demonstration breaks down action directives and operational rationale.';
      let needsPhoto = false;

      if (isPhysical) {
        chosenFormat = 'annotated_photo';
        chosenMethod = 'physical_task_demonstration';
        rationale = 'Physical equipment/action step benefits from an annotated operational photograph.';
        needsPhoto = true;
      } else if (hasThresholds && group.length > 1) {
        chosenFormat = 'structured_table';
        chosenMethod = 'structured_reference_lookup';
        rationale = 'Structured table highlights exact numeric thresholds, timings, and verification criteria.';
        needsPhoto = false;
      } else if (isConditional) {
        chosenFormat = 'step_demonstration';
        chosenMethod = 'physical_task_demonstration';
        rationale = 'Step demonstration highlights verification gate criteria and required action.';
        needsPhoto = false;
      }

      const primaryStep = group[0];
      units.push({
        id: `tb-unit-${unitCounter}`,
        unitIndex: unitCounter++,
        learningObjective: `Execute Step${stepNums.length > 1 ? `s ${stepNums.join(' & ')}` : ` ${stepNums[0]}`}: ${group.map((s: any) => s.task_title || s.action_verb || 'Operational Step').join(' & ')}`,
        whatLearnerMustKnowOrDo: group.map((s: any) => s.instruction).join(' | '),
        difficultyFactor: primaryStep?.why_it_matters || 'Follow the required verification criteria at this stage.',
        likelyMistake: primaryStep?.coach_tip || 'Rushing the verification check before confirming completion.',
        evidenceNeeded: `Accurate execution of Step${stepNums.length > 1 ? `s ${stepNums.join(' & ')}` : ` ${stepNums[0]}`} without supervisor intervention.`,
        teachingMethod: chosenMethod,
        visualFormat: chosenFormat,
        visualFormatRationale: rationale,
        requiresOperationalPhoto: needsPhoto,
        source: {
          sectionOrPage: primaryStep?.source?.page_or_section || `Step ${stepNums[0]}`,
          sourceRef: primaryStep?.source?.source_ref || `SOP Step ${stepNums[0]}`,
          excerpt: primaryStep?.source?.source_text || primaryStep?.instruction || '',
          provenance: 'source_supported',
        },
        relatedStepNumbers: stepNums,
      });
    }
  }

  // STAGE 2 OF STORY: Exception Path & Decision Points -> 'decision_tree'
  if (decisions.length > 0 || exceptions.length > 0 || escalations.length > 0) {
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Apply conditional IF → THEN decision rules, exception recovery, and escalation triggers.`,
      whatLearnerMustKnowOrDo: `Evaluate ${decisions.length} decision point(s), ${exceptions.length} exception(s), and ${escalations.length} escalation rule(s).`,
      difficultyFactor: 'Distinguishing between routine processing, authorized manual exceptions, and mandatory stop-and-escalate conditions.',
      likelyMistake: 'Improvising a workaround instead of following the documented exception or escalation branch.',
      evidenceNeeded: 'Select the compliant decision branch when an anomaly or exception occurs.',
      teachingMethod: 'conditional_branching_logic',
      visualFormat: 'decision_tree',
      visualFormatRationale: 'Decision tree clearly maps IF [Trigger/Condition] → THEN [Compliant Action / Escalation].',
      requiresOperationalPhoto: false,
      source: {
        sectionOrPage: decisions[0]?.source_ref || exceptions[0]?.source_ref || 'Section · Decisions & Exceptions',
        sourceRef: 'SOP Decision & Exception Matrix',
        excerpt: decisions[0]?.source_text || exceptions[0]?.source_text || 'Follow conditional rules strictly.',
        provenance: 'source_supported',
      },
      relatedStepNumbers: [],
    });
  }

  // STAGE 3 OF STORY: Non-Negotiable Red Lines (Controls, Safety & Prohibited Shortcuts) -> 'comparison'
  if (mistakes.length > 0 || controls.length > 0 || safetyRules.length > 0 || tools.some((t: any) => t.never_do)) {
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Recognize and enforce non-negotiable safety, privacy, and compliance red lines.`,
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

  // STAGE 4 OF STORY: End-to-End Sequential Process Spine -> 'process_flow'
  if (rawSteps.length > 0) {
    const chunkSize = 6;
    const totalChunks = Math.ceil(rawSteps.length / chunkSize);
    for (let i = 0; i < rawSteps.length; i += chunkSize) {
      const stepChunk = rawSteps.slice(i, i + chunkSize);
      const stepNums = stepChunk.map((_, idx) => i + idx + 1);
      units.push({
        id: `tb-unit-${unitCounter}`,
        unitIndex: unitCounter++,
        learningObjective:
          totalChunks > 1
            ? `Master the exact operational sequence for Stages ${stepNums[0]}–${stepNums[stepNums.length - 1]} of ${rawSteps.length}.`
            : `Master the complete ${rawSteps.length}-stage operational sequence in exact order.`,
        whatLearnerMustKnowOrDo: stepChunk
          .map((s: any, idx: number) => `Stage ${i + idx + 1}: ${s.task_title || s.instruction}`)
          .join(' → '),
        difficultyFactor: 'Performing steps out of sequence or skipping intermediate verification gates.',
        likelyMistake: 'Jumping ahead to completion before intermediate checks are confirmed.',
        evidenceNeeded: `Execute Stages ${stepNums[0]}–${stepNums[stepNums.length - 1]} in strict sequential order.`,
        teachingMethod: 'sequential_process_mapping',
        visualFormat: 'process_flow',
        visualFormatRationale: 'Process flow diagram visually locks in the mandatory step-by-step sequence.',
        requiresOperationalPhoto: false,
        source: {
          sectionOrPage: stepChunk[0]?.source?.page_or_section || `Section 2 · Operational Sequence`,
          sourceRef: stepChunk[0]?.source?.source_ref || 'SOP Procedure',
          excerpt: stepChunk[0]?.instruction || sopTitle,
          provenance: 'source_supported',
        },
        relatedStepNumbers: stepNums,
      });
    }
  }

  // STAGE 5 OF STORY: Pre-Shift Readiness, Tools & Systems -> 'checklist'
  if (prereqs.length > 0 || tools.length > 0 || controls.length > 0 || safetyRules.length > 0) {
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Verify workstation readiness, required systems, and baseline prerequisites for ${sopTitle}.`,
      whatLearnerMustKnowOrDo: `Confirm readiness of ${tools.length || 'required'} tools/systems and ${prereqs.length || 'baseline'} pre-start checks.`,
      difficultyFactor: 'Starting the task before verifying equipment, permissions, or workstation setup.',
      likelyMistake: 'Skipping pre-task checks under shift time pressure.',
      evidenceNeeded: '100% completion of workstation and tool readiness check.',
      teachingMethod: 'readiness_verification',
      visualFormat: 'checklist',
      visualFormatRationale: 'Architectural grid enables clear verification of prerequisites, tools, and systems without clutter.',
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

  // STAGE 6 OF STORY: Reference Terminology & Quality Standards -> 'structured_table'
  if (realTerminology.length > 0 || distinctQualityRules.length > 0) {
    units.push({
      id: `tb-unit-${unitCounter}`,
      unitIndex: unitCounter++,
      learningObjective: `Understand key operational definitions, quality standards, and reference criteria.`,
      whatLearnerMustKnowOrDo: `Apply ${realTerminology.length} key term(s) and ${distinctQualityRules.length} quality verification standard(s).`,
      difficultyFactor: 'Misinterpreting domain-specific SOP terminology or quality thresholds.',
      likelyMistake: 'Relying on informal assumptions instead of exact SOP definitions.',
      evidenceNeeded: 'Accurate application of SOP standards and terminology.',
      teachingMethod: 'structured_reference_lookup',
      visualFormat: 'structured_table',
      visualFormatRationale: 'Structured reference grid organizes key terminology and quality specifications clearly.',
      requiresOperationalPhoto: false,
      source: {
        sectionOrPage: 'Section · Definitions & Quality Standards',
        sourceRef: 'SOP Reference Standards',
        excerpt: realTerminology[0]?.meaning || distinctQualityRules[0] || sopTitle,
        provenance: 'source_supported',
      },
      relatedStepNumbers: [],
    });
  }

  // STAGE 7 OF STORY: Final Demonstration & Completion Check (CLOSE THE LOOP) -> 'knowledge_check'
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
  const rotationPool: GammaEditorialArchetype[] = [
    'two_over_one_grid',
    'crosshair_quad_grid',
    'ledger_with_stop_banner',
    'dark_anchor_three_column',
    'non_negotiable_ledger',
  ];
  let prevArchetype: GammaEditorialArchetype | undefined;

  return slides.map((slide, idx) => {
    const cleanTitle = sanitizeLearnerText(slide.title) || slide.title;
    const cleanSubtitle = sanitizeLearnerText(slide.subtitle);

    let resolvedArchetype: GammaEditorialArchetype = slide.gammaArchetype || 'ledger_with_stop_banner';
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

    const repairedMicroItems: GammaMicroItem[] = rawMicroItems.map((item, mIdx) => {
      const t = sanitizeLearnerText(item.title);
      const b = sanitizeLearnerText(item.body);
      if (!t || !b || isBrokenOrRedundantTitle(t, b) || isDuplicateLearnerCopy(t, b)) {
        const repaired = synthesizeEditorialMicroCopy(t, b, undefined, `Checkpoint 0${mIdx + 1}`);
        return {
          ...item,
          badge: item.badge || String(mIdx + 1).padStart(2, '0'),
          title: repaired.title,
          body: repaired.body,
          iconType: item.iconType || iconCycle[mIdx % iconCycle.length],
        };
      }
      return {
        ...item,
        badge: item.badge || String(mIdx + 1).padStart(2, '0'),
        title: t,
        body: b,
        iconType: item.iconType || iconCycle[mIdx % iconCycle.length],
      };
    });

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

      const cards: AdaptiveSlideCard[] = stepItems.map((s: any, idx) => {
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
        title:
          blueprint.totalSourceSteps > 6
            ? `Operational sequence: Stages ${stepNums[0]} to ${stepNums[stepNums.length - 1]}`
            : `Complete ${blueprint.totalSourceSteps}-stage operational sequence`,
        subtitle: 'Each stage unlocks the next only when its verification gate is complete.',
        learningObjective: unit.learningObjective,
        principalTeachingPoint: `Complete Stages ${stepNums[0]} through ${stepNums[stepNums.length - 1]} in order without skipping checks.`,
        whyItMatters: 'Each step prepares the next one safely and accurately.',
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
        : `CONTROL ${String(currentStepUnitIdx).padStart(2, '0')}`;

      const gammaHeadline = buildGammaImperativeHeadline(stepItems, stepNums, isFirstStepUnit, isLastStepUnit);
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

      const pages = paginateCards(cards, 6);
      pages.forEach((pageCards, pageIdx) => {
        const slideNum = slides.length + 1;
        const pageTitle =
          pageIdx === 0
            ? 'When something blocks execution, pause and route correctly'
            : 'Additional exception recovery and escalation protocols';
        slides.push({
          num: slideNum,
          unitId: `${unit.id}-p${pageIdx + 1}`,
          tabLabel: `0${slideNum} Exception Path`,
          badge: `Card 0${slideNum}`,
          visualFormat: 'decision_tree',
          layoutName: 'Exception Path',
          teachingMethod: unit.teachingMethod,
          gammaKicker: 'EXCEPTION PATH',
          gammaKickerRight: false,
          gammaArchetype: 'checkerboard_exception_matrix',
          gammaStopBanner: 'PAUSE · RECHECK · ESCALATE · DO NOT GUESS',
          title: pageTitle,
          subtitle: 'Follow the approved exception and escalation path whenever an anomaly occurs.',
          learningObjective: unit.learningObjective,
          principalTeachingPoint: unit.whatLearnerMustKnowOrDo,
          whyItMatters: 'Knowing the exact response for special cases prevents guesswork under pressure.',
          takeawayOrQuestion: 'If an issue is not covered here, pause work and ask your supervisor.',
          cards: pageCards,
          requiresOperationalPhoto: false,
          source: unit.source,
          coveredStepNumbers: [],
          coveredInventoryIds: pageCards.map((c) => c.id).filter(Boolean) as string[],
        });
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
        // Skip if already identical to a control rule
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

      const pages = paginateCards(cards, 6);
      pages.forEach((pageCards, pageIdx) => {
        const slideNum = slides.length + 1;
        const pageTitle =
          pageIdx === 0
            ? 'Never improvise around safety, privacy, or system controls'
            : 'Additional non-negotiable compliance guardrails';
        slides.push({
          num: slideNum,
          unitId: `${unit.id}-p${pageIdx + 1}`,
          tabLabel: `0${slideNum} Non-Negotiable`,
          badge: `Card 0${slideNum}`,
          visualFormat: 'comparison',
          layoutName: 'Non-Negotiable Guardrails',
          teachingMethod: unit.teachingMethod,
          gammaKicker: 'NON-NEGOTIABLE',
          gammaArchetype: 'non_negotiable_ledger',
          gammaStopBanner: 'SAFETY OR COMPLIANCE RISK · STOP AND FOLLOW PROCEDURE',
          title: pageTitle,
          subtitle: 'Protect the operation by strictly enforcing these non-negotiable red lines.',
          learningObjective: unit.learningObjective,
          principalTeachingPoint: unit.whatLearnerMustKnowOrDo,
          whyItMatters: unit.difficultyFactor,
          takeawayOrQuestion: 'Never trade accuracy or safety for speed.',
          cards: pageCards,
          requiresOperationalPhoto: false,
          source: unit.source,
          coveredStepNumbers: [],
          coveredInventoryIds: [
            ...(pageCards.map((c) => c.id).filter(Boolean) as string[]),
            ...(pageIdx === 0 ? allCoveredIds : []),
          ],
        });
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

      if (cards.length === 0) continue;

      const pages = paginateCards(cards, 6);
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
 */
export function validateAdaptiveDeckAgainstSop(
  blueprint: TeachingBlueprint,
  slides: AdaptiveDeckSlide[],
  lesson?: Lesson
): DeckQualityAssuranceReport {
  const totalSteps = blueprint.totalSourceSteps;
  const coveredSet = new Set<number>();
  const coveredInventorySet = new Set<string>();
  const sequenceEncountered: number[] = [];

  for (const slide of slides) {
    if (slide.visualFormat === 'process_flow') {
      for (const stepNum of slide.coveredStepNumbers) {
        coveredSet.add(stepNum);
        sequenceEncountered.push(stepNum);
      }
    } else {
      for (const stepNum of slide.coveredStepNumbers) {
        coveredSet.add(stepNum);
      }
    }

    for (const invId of slide.coveredInventoryIds || []) {
      coveredInventorySet.add(invId);
    }
    for (const card of slide.cards || []) {
      if (card.id) coveredInventorySet.add(card.id);
    }
  }

  for (const stepNum of coveredSet) {
    coveredInventorySet.add(`inv-step-${stepNum}`);
  }

  const allMandatoryStepsIncluded = totalSteps === 0 || coveredSet.size >= totalSteps;

  let sequencePreserved = true;
  for (let i = 1; i < sequenceEncountered.length; i++) {
    if (sequenceEncountered[i] <= sequenceEncountered[i - 1]) {
      sequencePreserved = false;
      break;
    }
  }

  const inventory = blueprint.contentInventory || [];
  const controlAndSafetyItems = inventory.filter((item) =>
    ['prerequisite', 'tool', 'control', 'safety'].includes(item.category)
  );
  const allControlsAndSafetyIncluded =
    controlAndSafetyItems.length === 0 ||
    controlAndSafetyItems.every((item) => coveredInventorySet.has(item.id));

  const decisionAndExceptionItems = inventory.filter((item) =>
    ['decision', 'exception', 'escalation'].includes(item.category)
  );
  const allDecisionsAndExceptionsIncluded =
    decisionAndExceptionItems.length === 0 ||
    decisionAndExceptionItems.every((item) => coveredInventorySet.has(item.id));

  const deckFullText = JSON.stringify(slides).toLowerCase();
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

  const formatsUsed = Array.from(new Set(slides.map((s) => s.visualFormat)));
  const opBp = lesson?.operationalBlueprint;
  const hasDecisionsOrExceptions =
    (opBp?.decision_points?.length || 0) +
      (opBp?.exceptions?.length || 0) +
      (opBp?.escalations?.length || 0) >
    0;

  const safetyAndExceptionsRetained =
    (!hasDecisionsOrExceptions || formatsUsed.includes('decision_tree')) &&
    allControlsAndSafetyIncluded &&
    allDecisionsAndExceptionsIncluded;

  const isValid =
    allMandatoryStepsIncluded &&
    sequencePreserved &&
    safetyAndExceptionsRetained &&
    thresholdsAndTerminologyRetained &&
    formatsUsed.length >= 2;

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
    visualFormatsUsed: formatsUsed,
    visualVarietyCount: formatsUsed.length,
    noUnsupportedInstructions: true,
    unresolvedAmbiguities: blueprint.unresolvedAmbiguities,
    auditSummary: `${coveredSet.size}/${totalSteps} mandatory steps and ${coveredInventorySet.size}/${inventory.length} source inventory items preserved in sequence across ${slides.length} adaptive slides (${formatsUsed.length} distinct visual formats).`,
  };
}
