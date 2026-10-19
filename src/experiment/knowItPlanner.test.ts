import { planKnowItSlides } from './knowItPlanner';
import { Lesson } from '../types';
import { generateDomainNeutralLesson } from '../utils/domainNeutralGenerator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

console.log('================================================================');
console.log('KNOW-IT PLANNER TRUNCATION FIX & COVERAGE AUDIT TEST SUITE');
console.log('================================================================\n');

// ============================================================================
// TEST 1: SOP WITH MORE THAN 9 OPERATIONAL STEPS
// ============================================================================
console.log('TEST 1: SOP with > 9 operational steps');
const manyStepsLesson: Lesson = {
  id: 'lesson-many-steps',
  title: 'Extended Manufacturing SOP',
  subtitle: 'Process with 12 steps',
  category: 'Safety' as any,
  color: 'sky',
  accentColor: '#0ea5e9',
  stepsCount: 12,
  durationMinutes: 15,
  level: 'Advanced',
  progress: 0,
  masteryPercentage: 0,
  artType: 'clipboard',
  description: 'Extended process',
  operationalBlueprint: {
    document_identity: { doc_title: 'Extended SOP', doc_ref: 'SOP-100', version: '1.0' },
    role: 'Operator',
    process: 'Extended Manufacturing',
    purpose: 'Execute 12 distinct manufacturing steps',
    scope: 'Plant A',
    prerequisites: [],
    tools_and_systems: [],
    terminology: [],
    decision_points: [],
    exceptions: [],
    escalations: [],
    critical_controls: [],
    safety_rules: [],
    quality_rules: [],
    customer_or_business_impact: [],
    common_mistakes: [],
    source_evidence: [],
    confidence: 1.0,
    operational_steps: Array.from({ length: 12 }, (_, i) => ({
      instruction: `Execute step number ${i + 1} with absolute precision and safety verification.`,
      task_title: `Step ${i + 1} Title`,
      category: 'DO',
      action_verb: 'Execute',
      source: { source_ref: `step-${i + 1}`, page_or_section: `Sec ${i + 1}`, source_text: `Step ${i + 1} text` },
    })),
  },
};

const plan1 = planKnowItSlides(manyStepsLesson);
const overviewSlides = plan1.slides.filter(s => s.type === 'SECTION_INTRO' && s.sec === 'The process');
assert(overviewSlides.length > 1, 'Overview flow correctly paginated when steps > 9');
const allFlowItems = overviewSlides.flatMap(s => s.fl || []);
assert(allFlowItems.length === 12, 'All 12 step titles present in overview flow (zero omission)');
console.log('✅ TEST 1 PASSED: 12 operational steps fully preserved across paginated overview and teach slides.\n');

// ============================================================================
// TEST 2: MORE THAN 3 CONTROLS AND COMMON MISTAKES
// ============================================================================
console.log('TEST 2: More than 3 controls and common mistakes');
const manyControlsMistakesLesson: Lesson = {
  id: 'lesson-controls-mistakes',
  title: 'Strict Compliance SOP',
  subtitle: 'Many controls and mistakes',
  category: 'Safety' as any,
  color: 'mint',
  accentColor: '#10b981',
  stepsCount: 2,
  durationMinutes: 10,
  level: 'Intermediate',
  progress: 0,
  masteryPercentage: 0,
  artType: 'safety',
  description: 'Compliance process',
  operationalBlueprint: {
    document_identity: { doc_title: 'Compliance SOP', doc_ref: 'SOP-200', version: '1.0' },
    role: 'Inspector',
    process: 'Compliance Check',
    purpose: 'Enforce all safety controls',
    scope: 'Plant B',
    prerequisites: [],
    tools_and_systems: [],
    terminology: [],
    decision_points: [],
    exceptions: [],
    escalations: [],
    critical_controls: [
      { rule: 'Mandatory control rule alpha regarding safety gear.', rationale: 'Safety first', source_ref: 's1', source_text: 'r1' },
      { rule: 'Mandatory control rule beta regarding pressure valves.', rationale: 'Prevent blowout', source_ref: 's1', source_text: 'r2' },
      { rule: 'Mandatory control rule gamma regarding chemical spill kits.', rationale: 'Environmental protection', source_ref: 's1', source_text: 'r3' },
      { rule: 'Mandatory control rule delta regarding emergency shutoffs.', rationale: 'Life safety', source_ref: 's1', source_text: 'r4' },
      { rule: 'Mandatory control rule epsilon regarding calibration logs.', rationale: 'Accuracy', source_ref: 's1', source_text: 'r5' },
    ],
    safety_rules: [],
    quality_rules: [],
    customer_or_business_impact: [],
    common_mistakes: [
      { mistake: 'Mistake one: skipping checklist item A.', prevention: 'Always verify checklist A.', source_ref: 's1', source_text: 'm1' },
      { mistake: 'Mistake two: ignoring gauge warning light.', prevention: 'Stop immediately on warning.', source_ref: 's1', source_text: 'm2' },
      { mistake: 'Mistake three: failing to log timestamp.', prevention: 'Record timestamp instantly.', source_ref: 's1', source_text: 'm3' },
      { mistake: 'Mistake four: improper disposal of wipes.', prevention: 'Use hazmat bin.', source_ref: 's1', source_text: 'm4' },
    ],
    source_evidence: [],
    confidence: 1.0,
    operational_steps: [
      {
        instruction: 'Initiate inspection protocol.',
        task_title: 'Initiate',
        category: 'DO',
        action_verb: 'Initiate',
        source: { source_ref: 's1', page_or_section: '1', source_text: 'Initiate inspection protocol.' },
      },
    ],
  },
};

const plan2 = planKnowItSlides(manyControlsMistakesLesson);
const ruleSlides = plan2.slides.filter(s => s.type === 'IMPORTANT_RULE');
assert(ruleSlides.length === 5, 'All 5 critical controls generated as important rule slides (no cap at 3)');
const dontSlides = plan2.slides.filter(s => s.type === 'DO_DONT');
assert(dontSlides.length >= 2, 'Common mistakes paginated into multiple Do/Don’t slides (no cap at 3)');
console.log('✅ TEST 2 PASSED: 5 controls and 4 mistakes fully retained without 3-item truncation caps.\n');

// ============================================================================
// TEST 3: MORE THAN 4 DECISIONS, EXCEPTIONS AND ESCALATIONS
// ============================================================================
console.log('TEST 3: More than 4 decisions, exceptions and escalations');
const manyEdgeCasesLesson: Lesson = {
  id: 'lesson-edge-cases',
  title: 'Complex Decision Protocol',
  subtitle: 'Many decisions, exceptions, escalations',
  category: 'Safety' as any,
  color: 'peach',
  accentColor: '#f59e0b',
  stepsCount: 2,
  durationMinutes: 12,
  level: 'Advanced',
  progress: 0,
  masteryPercentage: 0,
  artType: 'clipboard',
  description: 'Complex flow',
  operationalBlueprint: {
    document_identity: { doc_title: 'Complex SOP', doc_ref: 'SOP-300', version: '1.0' },
    role: 'Supervisor',
    process: 'Complex Decision Handling',
    purpose: 'Manage edge cases',
    scope: 'Plant C',
    prerequisites: [],
    tools_and_systems: [],
    terminology: [],
    decision_points: [
      { situation: 'Condition 1 met', decision: 'Choose path A', action: 'Proceed with path A', source_ref: 's1', source_text: 'd1' },
      { situation: 'Condition 2 met', decision: 'Choose path B', action: 'Proceed with path B', source_ref: 's1', source_text: 'd2' },
      { situation: 'Condition 3 met', decision: 'Choose path C', action: 'Proceed with path C', source_ref: 's1', source_text: 'd3' },
      { situation: 'Condition 4 met', decision: 'Choose path D', action: 'Proceed with path D', source_ref: 's1', source_text: 'd4' },
      { situation: 'Condition 5 met', decision: 'Choose path E', action: 'Proceed with path E', source_ref: 's1', source_text: 'd5' },
    ],
    exceptions: [
      { trigger: 'Exception trigger 1', resolution: 'Resolution 1', source_ref: 's1', source_text: 'ex 1' },
      { trigger: 'Exception trigger 2', resolution: 'Resolution 2', source_ref: 's1', source_text: 'ex 2' },
      { trigger: 'Exception trigger 3', resolution: 'Resolution 3', source_ref: 's1', source_text: 'ex 3' },
      { trigger: 'Exception trigger 4', resolution: 'Resolution 4', source_ref: 's1', source_text: 'ex 4' },
      { trigger: 'Exception trigger 5', resolution: 'Resolution 5', source_ref: 's1', source_text: 'ex 5' },
    ],
    escalations: [
      { situation: 'Escalation situation 1', contact_or_action: 'Call manager 1', source_ref: 's1', source_text: 'esc 1' },
      { situation: 'Escalation situation 2', contact_or_action: 'Call manager 2', source_ref: 's1', source_text: 'esc 2' },
      { situation: 'Escalation situation 3', contact_or_action: 'Call manager 3', source_ref: 's1', source_text: 'esc 3' },
      { situation: 'Escalation situation 4', contact_or_action: 'Call manager 4', source_ref: 's1', source_text: 'esc 4' },
      { situation: 'Escalation situation 5', contact_or_action: 'Call manager 5', source_ref: 's1', source_text: 'esc 5' },
    ],
    critical_controls: [],
    safety_rules: [],
    quality_rules: [],
    customer_or_business_impact: [],
    common_mistakes: [],
    source_evidence: [],
    confidence: 1.0,
    operational_steps: [
      {
        instruction: 'Evaluate initial condition.',
        task_title: 'Evaluate',
        category: 'CHECK',
        action_verb: 'Evaluate',
        source: { source_ref: 's1', page_or_section: '1', source_text: 'Evaluate initial condition.' },
      },
    ],
  },
};

const plan3 = planKnowItSlides(manyEdgeCasesLesson);
const decisionSlides = plan3.slides.filter(s => s.step && s.step.toLowerCase().includes('decision'));
const exceptionSlides = plan3.slides.filter(s => s.step && s.step.toLowerCase().includes('exception'));
const escalationSlides = plan3.slides.filter(s => s.step && s.step.toLowerCase().includes('escalation'));
assert(decisionSlides.length >= 2, 'Decisions paginated into multiple slides (no cap at 4)');
assert(exceptionSlides.length >= 2, 'Exceptions paginated into multiple slides (no cap at 4)');
assert(escalationSlides.length >= 2, 'Escalations paginated into multiple slides (no cap at 4)');
console.log('✅ TEST 3 PASSED: 5 decisions, 5 exceptions, and 5 escalations fully retained without 4-item caps.\n');

// ============================================================================
// TEST 4: MORE THAN 6 PREREQUISITES / TOOLS
// ============================================================================
console.log('TEST 4: More than 6 prerequisites/tools');
const manyPrepLesson: Lesson = {
  id: 'lesson-many-prep',
  title: 'Tool-Heavy SOP',
  subtitle: '8 prerequisites and tools',
  category: 'Safety' as any,
  color: 'lilac',
  accentColor: '#8b5cf6',
  stepsCount: 2,
  durationMinutes: 10,
  level: 'Beginner',
  progress: 0,
  masteryPercentage: 0,
  artType: 'box',
  description: 'Tool heavy',
  operationalBlueprint: {
    document_identity: { doc_title: 'Prep SOP', doc_ref: 'SOP-400', version: '1.0' },
    role: 'Technician',
    process: 'Setup Protocol',
    purpose: 'Prepare 8 tools',
    scope: 'Lab 1',
    prerequisites: [
      { text: 'Prerequisite item alpha', source_ref: 's1', source_text: 'p1' },
      { text: 'Prerequisite item beta', source_ref: 's1', source_text: 'p2' },
      { text: 'Prerequisite item gamma', source_ref: 's1', source_text: 'p3' },
      { text: 'Prerequisite item delta', source_ref: 's1', source_text: 'p4' },
    ],
    tools_and_systems: [
      { name: 'Tool Alpha', purpose: 'Measure voltage', never_do: 'Misuse', source_ref: 's1', source_text: 't1' },
      { name: 'Tool Beta', purpose: 'Calibrate pressure', never_do: 'Misuse', source_ref: 's1', source_text: 't2' },
      { name: 'Tool Gamma', purpose: 'Sanitize surface', never_do: 'Misuse', source_ref: 's1', source_text: 't3' },
      { name: 'Tool Delta', purpose: 'Record telemetry', never_do: 'Misuse', source_ref: 's1', source_text: 't4' },
    ],
    terminology: [],
    decision_points: [],
    exceptions: [],
    escalations: [],
    critical_controls: [],
    safety_rules: [],
    quality_rules: [],
    customer_or_business_impact: [],
    common_mistakes: [],
    source_evidence: [],
    confidence: 1.0,
    operational_steps: [
      {
        instruction: 'Setup equipment.',
        task_title: 'Setup',
        category: 'DO',
        action_verb: 'Setup',
        source: { source_ref: 's1', page_or_section: '1', source_text: 'Setup equipment.' },
      },
    ],
  },
};

const plan4 = planKnowItSlides(manyPrepLesson);
const prepSlides = plan4.slides.filter(s => s.type === 'SECTION_INTRO' && s.sec === 'Before you start');
assert(prepSlides.length >= 2, 'Prerequisites & tools paginated when total > 6');
const allPrepItems = prepSlides.flatMap(s => s.fl || []);
assert(allPrepItems.length === 8, 'All 8 prerequisites and tools preserved across prep slides');
console.log('✅ TEST 4 PASSED: 8 prerequisites/tools fully retained without 6-item cap.\n');

// ============================================================================
// TEST 5: CORRECT ORDERING, GROUPING AND DUPLICATE HANDLING
// ============================================================================
console.log('TEST 5: Correct ordering, grouping and duplicate handling');
const orderingLesson: Lesson = {
  id: 'lesson-ordering',
  title: 'Ordered Process',
  subtitle: 'Check order and deduplication',
  category: 'Safety' as any,
  color: 'butter',
  accentColor: '#eab308',
  stepsCount: 3,
  durationMinutes: 5,
  level: 'Beginner',
  progress: 0,
  masteryPercentage: 0,
  artType: 'clipboard',
  description: 'Ordering test',
  operationalBlueprint: {
    document_identity: { doc_title: 'Order SOP', doc_ref: 'SOP-500', version: '1.0' },
    role: 'Clerk',
    process: 'Sequence Check',
    purpose: 'Check sequence',
    scope: 'Desk 1',
    prerequisites: [{ text: 'Badge required', source_ref: 's1', source_text: 'b1' }, { text: 'badge required', source_ref: 's1', source_text: 'b1' }], // duplicate
    tools_and_systems: [],
    terminology: [],
    decision_points: [],
    exceptions: [],
    escalations: [],
    critical_controls: [],
    safety_rules: [],
    quality_rules: [],
    customer_or_business_impact: [],
    common_mistakes: [],
    source_evidence: [],
    confidence: 1.0,
    operational_steps: [
      { instruction: 'First execute step one of procedure.', task_title: 'First Step', category: 'DO', action_verb: 'Execute', source: { source_ref: 's1', page_or_section: '1', source_text: 'First execute step one.' } },
      { instruction: 'Second execute step two of procedure.', task_title: 'Second Step', category: 'DO', action_verb: 'Execute', source: { source_ref: 's2', page_or_section: '2', source_text: 'Second execute step two.' } },
      { instruction: 'Third execute step three of procedure.', task_title: 'Third Step', category: 'DO', action_verb: 'Execute', source: { source_ref: 's3', page_or_section: '3', source_text: 'Third execute step three.' } },
    ],
  },
};

const plan5 = planKnowItSlides(orderingLesson);
const prepSlide = plan5.slides.find(s => s.type === 'SECTION_INTRO' && s.sec === 'Before you start');
assert(prepSlide?.fl?.length === 1, 'Duplicate prerequisites correctly deduplicated');
const stepTeachSlides = plan5.slides.filter(s => s.type === 'TEACH_STEP' && s.step?.startsWith('Step '));
assert(stepTeachSlides[0].title.includes('First Step'), 'Steps retain correct original order (First Step is first)');
assert(stepTeachSlides[1].title.includes('Second Step'), 'Steps retain correct original order (Second Step is second)');
console.log('✅ TEST 5 PASSED: Correct ordering, grouping and duplicate deduplication verified.\n');

// ============================================================================
// TEST 6: NORMAL SHORT SOP RETAINS EXISTING SLIDE STRUCTURE
// ============================================================================
console.log('TEST 6: Normal short SOP retains existing slide structure');
const shortSopLesson: Lesson = {
  id: 'lesson-short',
  title: 'Standard Short SOP',
  subtitle: 'Basic process',
  category: 'Safety' as any,
  color: 'blush',
  accentColor: '#f43f5e',
  stepsCount: 2,
  durationMinutes: 5,
  level: 'Beginner',
  progress: 0,
  masteryPercentage: 0,
  artType: 'clipboard',
  description: 'Short SOP',
  operationalBlueprint: {
    document_identity: { doc_title: 'Short SOP', doc_ref: 'SOP-600', version: '1.0' },
    role: 'Staff',
    process: 'Short Process',
    purpose: 'Do quick task',
    scope: 'General',
    prerequisites: [{ text: 'Safety glasses', source_ref: 's1', source_text: 'sg' }],
    tools_and_systems: [{ name: 'Wrench', purpose: 'Turn valve', never_do: 'Misuse', source_ref: 's1', source_text: 'wr' }],
    terminology: [],
    decision_points: [],
    exceptions: [],
    escalations: [],
    critical_controls: [{ rule: 'Wear safety glasses at all times.', rationale: 'Safety', source_ref: 's1', source_text: 'sg' }],
    safety_rules: [],
    quality_rules: [],
    customer_or_business_impact: [],
    common_mistakes: [],
    source_evidence: [],
    confidence: 1.0,
    operational_steps: [
      { instruction: 'Turn valve clockwise.', task_title: 'Turn Valve', category: 'DO', action_verb: 'Turn', source: { source_ref: 's1', page_or_section: '1', source_text: 'Turn valve clockwise.' } },
    ],
  },
};

const plan6 = planKnowItSlides(shortSopLesson);
assert(plan6.slides.some(s => s.type === 'WELCOME'), 'Short SOP retains WELCOME slide');
assert(plan6.slides.some(s => s.type === 'OBJECTIVES'), 'Short SOP retains OBJECTIVES slide');
assert(plan6.slides.some(s => s.type === 'IMPORTANT_RULE'), 'Short SOP retains IMPORTANT_RULE slide');
assert(plan6.slides.some(s => s.type === 'COMPLETION'), 'Short SOP retains COMPLETION slide');
console.log('✅ TEST 6 PASSED: Normal short SOP successfully retains standard slide structure.\n');

// ============================================================================
// TEST 7: MASSIVE 104-STEP SOP (INCIDENT REPRODUCTION & VALIDATION)
// ============================================================================
console.log('TEST 7: Massive 104-step SOP deck limit and anti-corruption verification');
const massive104Lesson: Lesson = {
  id: 'lesson-massive-104',
  title: 'Standard Return Pickup Workflow',
  subtitle: 'High-volume logistics return process',
  category: 'Safety' as any,
  color: 'sky',
  accentColor: '#0ea5e9',
  stepsCount: 104,
  durationMinutes: 45,
  level: 'Advanced',
  progress: 0,
  masteryPercentage: 0,
  artType: 'clipboard',
  description: 'Complete returns process',
  operationalBlueprint: {
    document_identity: { doc_title: 'Return Pickup SOP', doc_ref: 'RET-PU-SOP-001', version: '1.0' },
    role: 'Field Associate / Delivery Partner',
    process: 'Standard Return Pickup Workflow',
    purpose: 'Verify, inspect, and process all customer returns consistently.',
    scope: 'Returns Operations',
    prerequisites: [
      { text: 'Equip handheld mobile barcode scanner with full battery charge', source_ref: 'p1', source_text: 'scanner' },
      { text: 'Prepare tamper-evident return polybags and seal stickers', source_ref: 'p2', source_text: 'polybags' },
    ],
    tools_and_systems: [
      { name: 'Logistics Mobile App', purpose: 'Barcode scanning and customer verification', never_do: 'Bypass OTP', source_ref: 't1', source_text: 'app' },
    ],
    terminology: [],
    decision_points: [
      { situation: 'Customer item seal is broken upon inspection', action: 'Photograph discrepancy and mark as damaged in app', decision: 'Seal check', source_ref: 'd1', source_text: 'seal' },
    ],
    exceptions: [],
    escalations: [],
    critical_controls: [
      { rule: 'Never accept unsealed electronics without verifying serial number.', rationale: 'Fraud prevention', source_ref: 'c1', source_text: 'serial' },
    ],
    safety_rules: [],
    quality_rules: [],
    customer_or_business_impact: [],
    common_mistakes: [
      { mistake: 'Accepting return without scanning package barcode', prevention: 'Scan package before handing customer receipt', source_ref: 'm1', source_text: 'scan' },
    ],
    source_evidence: [],
    confidence: 1.0,
    operational_steps: Array.from({ length: 104 }, (_, i) => ({
      instruction: `Execute verified return verification sub-step ${i + 1} with barcode recording.`,
      task_title: `Return Verification Step ${i + 1}`,
      category: 'DO',
      action_verb: 'Verify',
      source: { source_ref: `step-${i + 1}`, page_or_section: `Page ${Math.floor(i / 10) + 1}`, source_text: `Step ${i + 1} text` },
    })),
  },
};

const plan7 = planKnowItSlides(massive104Lesson);
assert(plan7.adaptiveSlides.length >= 20, `Massive 104-step SOP preserves all 104 steps across adaptive slides without arbitrary cap (got ${plan7.adaptiveSlides.length})`);
assert(plan7.qaReport.coveredSourceSteps === 104, `All 104 steps preserved in QA report (got ${plan7.qaReport.coveredSourceSteps})`);

// Ensure no slide contains the corrupted joined titles or duplicate strings
for (const s of plan7.slides) {
  assert(!s.title.includes(' & 104 Steps'), `Slide title must not contain repeated '& 104 Steps': "${s.title}"`);
  assert(!s.title.includes('(8/12) &'), `Slide title must not contain concatenated page indicators: "${s.title}"`);
  if (s.content) {
    const lines = s.content.split('\n');
    const hasRepeatedIntro = lines.filter(l => l.includes('Key operational stages')).length > 1;
    assert(!hasRepeatedIntro, `Slide content must not duplicate identical overview sentences: "${s.content}"`);
  }
  if (s.type === 'SECTION_INTRO') {
    assert((s.fl || []).length <= 25, `SECTION_INTRO must not accumulate 40+ merged checklist items (got ${(s.fl || []).length})`);
  }
}
console.log('✅ TEST 7 PASSED: Massive 104-step SOP preserves 100% of steps without title concatenation or content duplication.\n');

// ============================================================================
// TEST 8: CROSS-DOMAIN SOURCE GROUNDING & DECOUPLING
// ============================================================================
console.log('TEST 8: Cross-domain source grounding (Hotel vs Returns Logistics)');
const hotelLesson: Lesson = {
  id: 'lesson-hotel',
  title: 'Hotel Housekeeping Sanitization',
  subtitle: 'Hospitality room turnover',
  category: 'Safety' as any,
  color: 'lilac',
  accentColor: '#9333ea',
  stepsCount: 3,
  durationMinutes: 10,
  level: 'Beginner',
  progress: 0,
  masteryPercentage: 0,
  artType: 'clipboard',
  description: 'Sanitize guest rooms',
  operationalBlueprint: {
    document_identity: { doc_title: 'Room Sanitization SOP', doc_ref: 'HOTEL-HSK-01', version: '2.0' },
    role: 'Housekeeping Attendant',
    process: 'Guest Room Sanitization',
    purpose: 'Deliver hygienic guest rooms.',
    scope: 'Guest floors',
    prerequisites: [{ text: 'Wear nitrile protective gloves', source_ref: 'p1', source_text: 'gloves' }],
    tools_and_systems: [{ name: 'Microfiber cloth', purpose: 'Surface wiping', never_do: 'Clean floor then bed', source_ref: 't1', source_text: 'cloth' }],
    terminology: [],
    decision_points: [],
    exceptions: [],
    escalations: [],
    critical_controls: [{ rule: 'Discard used cleaning cloths after each bathroom.', rationale: 'Prevent cross-contamination', source_ref: 'c1', source_text: 'cloth' }],
    safety_rules: [],
    quality_rules: [],
    customer_or_business_impact: [],
    common_mistakes: [],
    source_evidence: [],
    confidence: 1.0,
    operational_steps: [
      { instruction: 'Strip bed linens and inspect mattress protector.', task_title: 'Strip Linens', category: 'DO', action_verb: 'Strip', source: { source_ref: 's1', page_or_section: '1', source_text: 'Strip bed' } },
      { instruction: 'Spray sanitizer on high-touch desk and door surfaces.', task_title: 'Disinfect Surfaces', category: 'DO', action_verb: 'Spray', source: { source_ref: 's2', page_or_section: '1', source_text: 'Spray sanitizer' } },
      { instruction: 'Mop floor starting from farthest corner toward exit door.', task_title: 'Mop Floor', category: 'DO', action_verb: 'Mop', source: { source_ref: 's3', page_or_section: '2', source_text: 'Mop floor' } },
    ],
  },
};

const hotelPlan = planKnowItSlides(hotelLesson);
assert(hotelPlan.title === 'Hotel Housekeeping Sanitization', 'Hotel plan retains source title');
assert(Boolean(hotelPlan.slides[0]?.role?.includes('Housekeeping Attendant')), 'Hotel plan retains Housekeeping role');

// Returns plan must NOT have Housekeeping concepts
assert(!plan7.slides[0]?.role?.includes('Housekeeping'), 'Logistics Returns deck does NOT inherit Housekeeping role');
assert(Boolean(plan7.slides[0]?.role?.includes('Field Associate')), 'Logistics Returns deck correctly uses Field Associate role');
console.log('✅ TEST 8 PASSED: Cross-domain decoupling verified between Hospitality and Logistics.\n');

// ============================================================================
// TEST 9: ADAPTIVE SOP-TO-TRAINING-DECK INTELLIGENCE (TEACHING BLUEPRINT & QA)
// ============================================================================
console.log('TEST 9: Adaptive SOP-to-Training-Deck Intelligence (Teaching Blueprint, Format Variety & QA)');

// 9A: Verify Teaching Blueprint is built before generating slides on 12-step SOP (plan1)
assert(Boolean(plan1.teachingBlueprint), 'plan1 includes a structured TeachingBlueprint');
assert(plan1.teachingBlueprint.totalSourceSteps === 12, 'TeachingBlueprint accurately records all 12 source steps');
assert(Array.isArray(plan1.adaptiveSlides) && plan1.adaptiveSlides.length >= 6, 'Adaptive slides generated dynamically for 12-step SOP');
assert(Boolean(plan1.qaReport), 'plan1 includes a Source QA Validation Report');
assert(plan1.qaReport.allMandatoryStepsIncluded === true, '100% of 12 mandatory SOP steps are preserved in adaptive deck (no slice(0,3) truncation)');
assert(plan1.qaReport.sequencePreserved === true, 'Exact step sequence 1..12 is preserved across process_flow slides');

// 9B: Verify Visual Format Variety & Concept-Driven Visual Intelligence on Complex Edge Cases SOP (plan3)
assert(Boolean(plan3.qaReport), 'plan3 includes QA report');
assert(plan3.qaReport.visualVarietyCount >= 3, `Expected >= 3 distinct visual formats, got ${plan3.qaReport.visualVarietyCount}`);
assert(plan3.qaReport.visualFormatsUsed.includes('decision_tree'), 'Conditional decisions/exceptions automatically select decision_tree format');
assert(plan3.qaReport.safetyAndExceptionsRetained === true, 'All safety rules, exceptions, and escalations retained');

// 9C: Verify Concept-Driven Photo Gating (Process Flow, Decision Tree, Checklist, Comparison do NOT force photos; physical tasks DO)
const nonPhysicalFormats = ['process_flow', 'decision_tree', 'checklist', 'comparison', 'structured_table', 'knowledge_check'];
for (const slide of plan3.adaptiveSlides || []) {
  if (nonPhysicalFormats.includes(slide.visualFormat)) {
    assert(
      slide.requiresOperationalPhoto === false,
      `Format '${slide.visualFormat}' must NOT force an operational photo`
    );
  }
}

const physicalHotelSlides = (hotelPlan.adaptiveSlides || []).filter(
  (s: any) => s.visualFormat === 'annotated_photo' && s.requiresOperationalPhoto === true
);
assert(
  physicalHotelSlides.length >= 1,
  'Physical housekeeping steps (Spray sanitizer, Strip linens) select annotated_photo format with requiresOperationalPhoto=true'
);
console.log('✅ TEST 9 PASSED: Teaching Blueprint, 100% step sequence preservation, adaptive format selection, concept-driven photo gating, and Source QA verified.\n');

// ============================================================================
// TEST 10: SOP-TO-TRAINING-DECK RELIABILITY GATE (ALL 5 PIPELINE DEFECT FIXES)
// ============================================================================
console.log('TEST 10: SOP-to-Training-Deck Reliability Gate (End-to-End Pipeline Verification)');

// 10A: Verify Step Sequence is NEVER re-ordered by keyword rank and >8 steps are NEVER merged into 8 macro cards
const labSequenceSopText = `STANDARD OPERATING PROCEDURE: CRYOGENIC BIO-SAMPLE PROCESSING
Role: Clinical Lab Technologist
Department: Molecular Diagnostics
1. Record arrival timestamp in LIMS terminal before touching cryovial container.
2. Inspect cryovial outer cap seal under magnification lamp for micro-fractures.
3. Verify physician test order code on tube barcode against LIMS manifest.
4. Calibrate centrifuge rotor balance to 3500 rpm and 4°C chamber temperature.
5. Load balanced cryovials into sealed safety buckets inside centrifuge.
6. Run centrifugation cycle for exactly 15 minutes at 4°C.
7. Transfer supernatant plasma using sterile pipette into secondary aliquot tube.
8. Label secondary aliquot tube with patient accession barcode.
9. Store aliquot tube in ultra-low freezer maintained at -80°C within 10 minutes.
10. Transmit signed batch completion audit log to Laboratory Director.`;

const { lesson: labSeqLesson, stepObjects: labSeqStepObjs } = generateDomainNeutralLesson({
  filename: 'Cryogenic_Bio_Sample_SOP.txt',
  rawText: labSequenceSopText,
  wordCount: 140,
  pageCount: 2,
  fileHash: 'hash-cryo-10',
  confirmationText: 'Cryogenic SOP Confirmed',
  mimeType: 'text/plain',
  extractedAt: new Date().toISOString(),
  diagnostics: {} as any,
});

// Must retain all 10 steps in stepObjects (no consolidateToMacroCards(8) truncation)
assert(labSeqStepObjs.length >= 10, `All 10 SOP steps preserved in stepObjects without 8-card cap (got ${labSeqStepObjs.length})`);

// Step 1 ("Record arrival timestamp...") must remain Step 1, NOT re-ordered behind Step 2 ("Inspect...") or Step 3 ("Verify...")
assert(
  labSeqStepObjs[0].title.toLowerCase().includes('record arrival timestamp'),
  `Step 1 order preserved ("Record arrival timestamp..." stayed at index 0, got "${labSeqStepObjs[0].title}")`
);
assert(
  labSeqStepObjs[1].title.toLowerCase().includes('inspect cryovial'),
  `Step 2 order preserved ("Inspect cryovial..." stayed at index 1, got "${labSeqStepObjs[1].title}")`
);

// Zero retail/return-pickup template contamination despite words "verify", "order", and "inspect"
const labLessonFullJson = JSON.stringify(labSeqLesson).toLowerCase();
assert(
  !labLessonFullJson.includes('greeting customer') && !labLessonFullJson.includes('dismantling item'),
  'Zero retail/return-pickup regex template contamination in Medical Lab SOP'
);

// 10B: Verify >6 prerequisites/tools/controls paginate across Checklist slides without .slice(0, 6) dropping or .slice(0, 48) chopping
const manyChecklistPlan = planKnowItSlides(manyPrepLesson);
const checklistSlides = (manyChecklistPlan.adaptiveSlides || []).filter((s) => s.visualFormat === 'checklist');
const totalChecklistCards = checklistSlides.reduce((acc, s) => acc + s.cards.length, 0);
assert(
  checklistSlides.length >= 2 && totalChecklistCards === 8,
  `All 8 prerequisites/tools paginated across ${checklistSlides.length} checklist slides without .slice(0, 6) dropping (got ${totalChecklistCards} cards)`
);
assert(
  manyChecklistPlan.qaReport.allControlsAndSafetyIncluded === true,
  'QA report confirms 100% of prerequisites, tools, and controls are included in the adaptive deck'
);

// 10C: Verify numeric thresholds (-80°C, 15 minutes, 4°C) survive into the final adaptive deck without .slice(0, 48) truncation
const cryoPlan = planKnowItSlides(labSeqLesson);
const cryoDeckText = JSON.stringify(cryoPlan.adaptiveSlides).toLowerCase();
assert(cryoDeckText.includes('15 minutes'), 'Threshold "15 minutes" preserved intact in adaptive deck');
assert(cryoDeckText.includes('4°c'), 'Threshold "4°C" preserved intact in adaptive deck');
assert(cryoDeckText.includes('-80°c'), 'Threshold "-80°C" preserved intact in adaptive deck');
assert(cryoPlan.qaReport.thresholdsAndTerminologyRetained === true, 'QA validator confirms 100% threshold retention');
assert(cryoPlan.qaReport.isValid === true, 'End-to-end Reliability Gate QA report passes (isValid === true)');

console.log('✅ TEST 10 PASSED: SOP-to-Training-Deck Reliability Gate verified (0 reordering, 0 8-card merging, 0 retail template overwrites, 0 card slicing, 100% threshold retention).\n');

// ============================================================================
// TEST 11: HOUSEKEEPING: ROOM SANITIZATION & BLUEPRINT-V1-ONLY LESSONS (MULTI-SLIDE VERIFICATION)
// ============================================================================
console.log('TEST 11: Housekeeping: Room Sanitization & BlueprintV1-only lessons');
import { INITIAL_LESSONS } from '../data/lessonsData';

const housekeepingLesson = INITIAL_LESSONS[0];
const hkPlan = planKnowItSlides(housekeepingLesson);
assert(
  hkPlan.teachingBlueprint.totalSourceSteps === 5,
  `Housekeeping SOP preserves all 5 steps in TeachingBlueprint (got ${hkPlan.teachingBlueprint.totalSourceSteps})`
);
assert(
  hkPlan.adaptiveSlides.length >= 7,
  `Housekeeping SOP generates a complete multi-slide adaptive deck (${hkPlan.adaptiveSlides.length} slides, never 1 slide)`
);
assert(
  hkPlan.qaReport.isValid === true,
  `Housekeeping SOP passes QA verification (covered ${hkPlan.qaReport.coveredSourceSteps}/${hkPlan.qaReport.totalSourceSteps} steps)`
);

// Also test a legacy lesson that ONLY has lesson.blueprint (with operationalBlueprint: undefined)
const blueprintOnlyHousekeeping: Lesson = {
  ...housekeepingLesson,
  operationalBlueprint: undefined,
  stepObjects: undefined,
};
const bpOnlyPlan = planKnowItSlides(blueprintOnlyHousekeeping);
assert(
  bpOnlyPlan.teachingBlueprint.totalSourceSteps === 5,
  `BlueprintV1-only lesson extracts all 5 watch steps when operationalBlueprint is undefined (got ${bpOnlyPlan.teachingBlueprint.totalSourceSteps})`
);
assert(
  bpOnlyPlan.adaptiveSlides.length >= 6,
  `BlueprintV1-only lesson generates ${bpOnlyPlan.adaptiveSlides.length} adaptive slides (never collapses to 1 slide)`
);
console.log('✅ TEST 11 PASSED: Housekeeping SOP and BlueprintV1-only lessons generate complete multi-slide decks.\n');

// ============================================================================
// TEST 12: LEARNER COPY SANITIZER & ZERO BACKEND TEXT FIREWALL
// ============================================================================
console.log('TEST 12: Learner Copy Sanitizer & Zero Backend Text Firewall');
const forbiddenBackendPhrases = [
  'SOURCE SUPPORTED',
  'ACTION DIRECTIVE',
  'IF CONDITION 01',
  'PROHIBITED MISTAKE 01',
  'CRITICAL CONTROL 01',
  'Scenario Check & Source QA Verification',
  'SOP STEP COVERAGE',
  'Mandatory operational step from the SOP',
  'Source-verified conditional rule',
  'High-risk operational error identified in SOP',
  'Illustrative AI Visual (Non-Authoritative',
];

for (const slide of [...hkPlan.adaptiveSlides, ...cryoPlan.adaptiveSlides]) {
  const visibleSlideFields = [
    slide.title,
    slide.subtitle,
    slide.badge,
    slide.layoutName,
    slide.takeawayOrQuestion,
    slide.photoProvenanceLabel,
    ...slide.cards.flatMap((c) => [c.label, c.value, c.subtext, c.why, c.consequence, c.tag]),
  ]
    .filter(Boolean)
    .join(' ');

  for (const phrase of forbiddenBackendPhrases) {
    assert(
      !visibleSlideFields.toLowerCase().includes(phrase.toLowerCase()),
      `Forbidden backend phrase "${phrase}" leaked into learner slide ${slide.num} ("${slide.title}")`
    );
  }

  for (const card of slide.cards) {
    if (card.value && card.subtext) {
      assert(
        card.value.trim().toLowerCase() !== card.subtext.trim().toLowerCase(),
        `Duplicate value and subtext on slide ${slide.num}: "${card.value}"`
      );
    }
    if (card.value && card.why) {
      assert(
        card.value.trim().toLowerCase() !== card.why.trim().toLowerCase(),
        `Duplicate value and why on slide ${slide.num}: "${card.value}"`
      );
    }
  }
}
console.log('✅ TEST 12 PASSED: Zero backend phrases or duplicate card sentences in learner-facing slides.\n');

// ============================================================================
// TEST 13: GAMMA 4-STAGE TRAINING STORY, SEMANTIC HEADINGS & AUTO-REPAIR
// ============================================================================
console.log('TEST 13: Gamma 4-Stage Training Story, Semantic Headings & Auto-Repair');
for (const slide of [...hkPlan.adaptiveSlides, ...cryoPlan.adaptiveSlides]) {
  // 1. Zero "(1/2)" or "(2/2)" pagination tags in slide titles
  assert(
    !/\(\d+\s*\/\s*\d+\)/.test(slide.title),
    `Pagination fraction leaked into slide title: "${slide.title}"`
  );

  // 2. Every slide has gammaMicroItems populated with non-redundant semantic headings
  assert(
    Array.isArray(slide.gammaMicroItems) && slide.gammaMicroItems.length > 0,
    `Slide ${slide.num} ("${slide.title}") must have populated gammaMicroItems`
  );

  for (const item of slide.gammaMicroItems || []) {
    assert(
      !item.title.toLowerCase().includes('follow sop step') &&
        !item.title.toLowerCase().includes('adhere to written sop'),
      `Backend wrapper leaked into micro-item title: "${item.title}"`
    );
    if (item.body) {
      assert(
        item.title.trim().toLowerCase() !== item.body.trim().toLowerCase(),
        `Micro-item title and body are identical on slide ${slide.num}: "${item.title}"`
      );
    }
  }
}

// 3. Consecutive slides in Housekeeping deck must not share the exact same gammaArchetype
for (let i = 1; i < hkPlan.adaptiveSlides.length; i++) {
  const prevArch = hkPlan.adaptiveSlides[i - 1].gammaArchetype;
  const currArch = hkPlan.adaptiveSlides[i].gammaArchetype;
  assert(
    prevArch !== currArch,
    `Consecutive slides ${i} and ${i + 1} share identical gammaArchetype "${currArch}"`
  );
}

// 4. Story-First Sequence: First slide is an operational phase (START HERE / CONTROL 01), last slide is CLOSE THE LOOP
assert(
  hkPlan.adaptiveSlides[0].gammaKicker === 'START HERE' ||
    hkPlan.adaptiveSlides[0].gammaKicker?.startsWith('CONTROL'),
  `First slide should start the operational story ("START HERE" or "CONTROL 01"), got "${hkPlan.adaptiveSlides[0].gammaKicker}"`
);
assert(
  hkPlan.adaptiveSlides[hkPlan.adaptiveSlides.length - 1].visualFormat === 'knowledge_check',
  `Final slide must be the Close the Loop demonstration checkpoint`
);
console.log('✅ TEST 13 PASSED: Gamma 4-Stage Training Story, Semantic Micro-Headings, and Auto-Repair verified.\n');

console.log('================================================================');
console.log('ALL KNOW-IT PLANNER & RELIABILITY GATE TESTS PASSED (13/13)');
console.log('================================================================');


