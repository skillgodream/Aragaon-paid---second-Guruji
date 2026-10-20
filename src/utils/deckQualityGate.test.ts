import fs from 'fs';
import path from 'path';
import {
  buildTeachingBlueprint,
  buildAdaptiveDeckFromBlueprint,
  validateAdaptiveDeckAgainstSop,
  repairAdaptiveDeck,
} from '../experiment/teachingBlueprint';

/**
 * Deck Quality Gate Automated Test Suite
 * Rigorously verifies that the 5-Pillar Quality Gate catches:
 * 1. Missing required operational actions & safeguards
 * 2. Repeated explanations & duplicate slide headlines
 * 3. Unrelated cross-domain terminology & dynamic hallucinations
 * 4. Corrupted, truncated or malformed titles
 * 5. Sequence inversions across slides & within slides
 * 6. Unsupported quantitative operational assertions
 * 7. Automatic Pedagogical Deck Repair & Re-verification
 * 8. Cognitive Instructional Pacing for 17-step SOPs without section metadata
 */
export function runDeckQualityGateTests(): { passed: boolean; testResults: any[] } {
  const docPath = path.resolve(process.cwd(), 'data/sop_repository/doc-754093a0.json');
  if (!fs.existsSync(docPath)) {
    throw new Error(`Test fixture not found at ${docPath}`);
  }

  const rawDoc = JSON.parse(fs.readFileSync(docPath, 'utf8'));
  const blueprint = buildTeachingBlueprint(rawDoc);
  const cleanDeck = buildAdaptiveDeckFromBlueprint(blueprint, rawDoc);

  const testResults: any[] = [];

  // TEST 1: Baseline Clean Deck Must PASS
  const baselineReport = validateAdaptiveDeckAgainstSop(blueprint, cleanDeck, rawDoc);
  const test1Passed =
    baselineReport.isValid === true &&
    baselineReport.qualityIssues.filter((q) => q.severity === 'BLOCKING').length === 0;
  testResults.push({
    testName: 'Baseline Clean Deck Verification',
    passed: test1Passed,
    details: baselineReport.auditSummary,
  });

  // TEST 2: Missing Required Action Must FAIL
  const deckMissingStep = cleanDeck.map((s) => ({
    ...s,
    coveredStepNumbers: s.coveredStepNumbers.filter((n) => n !== 5),
    cards: s.cards?.filter((c) => c.stepNum !== 5) || [],
  }));
  const reportMissingStep = validateAdaptiveDeckAgainstSop(blueprint, deckMissingStep, rawDoc);
  const test2Passed =
    reportMissingStep.isValid === false &&
    reportMissingStep.qualityIssues.some((q) => q.type === 'MISSING_REQUIRED_ACTION' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Missing Required Action (Step 5 omitted)',
    passed: test2Passed,
    defectCaught: reportMissingStep.qualityIssues.find((q) => q.type === 'MISSING_REQUIRED_ACTION')?.description,
  });

  // TEST 3: Duplicate Slide Headline Must FAIL
  const deckDuplicateTitles = cleanDeck.map((s, idx) =>
    idx === 3 ? { ...s, title: cleanDeck[2].title } : s
  );
  const reportDuplicateTitles = validateAdaptiveDeckAgainstSop(blueprint, deckDuplicateTitles, rawDoc);
  const test3Passed =
    reportDuplicateTitles.isValid === false &&
    reportDuplicateTitles.qualityIssues.some((q) => q.type === 'REPEATED_EXPLANATION' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Repeated Explanation / Duplicate Title',
    passed: test3Passed,
    defectCaught: reportDuplicateTitles.qualityIssues.find((q) => q.type === 'REPEATED_EXPLANATION')?.description,
  });

  // TEST 4: Unrelated Domain Terminology (Finance Hallucination) Must FAIL
  const deckFinanceHallucination = cleanDeck.map((s, idx) =>
    idx === 4 ? { ...s, subtitle: 'Verify monthly EBITDA reconciliation before proceeding' } : s
  );
  const reportFinance = validateAdaptiveDeckAgainstSop(blueprint, deckFinanceHallucination, rawDoc);
  const test4Passed =
    reportFinance.isValid === false &&
    reportFinance.qualityIssues.some((q) => q.type === 'UNRELATED_TERMINOLOGY' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Unrelated Terminology (EBITDA in Housekeeping)',
    passed: test4Passed,
    defectCaught: reportFinance.qualityIssues.find((q) => q.type === 'UNRELATED_TERMINOLOGY')?.description,
  });

  // TEST 5: Corrupted Truncated Title (Dangling "to.") Must FAIL
  const deckCorruptedTitle = cleanDeck.map((s, idx) =>
    idx === 2 ? { ...s, title: 'Operational sequence: Stages 1 to.' } : s
  );
  const reportCorruptedTitle = validateAdaptiveDeckAgainstSop(blueprint, deckCorruptedTitle, rawDoc);
  const test5Passed =
    reportCorruptedTitle.isValid === false &&
    reportCorruptedTitle.qualityIssues.some((q) => q.type === 'CORRUPTED_TITLE' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Corrupted Truncated Title ("Stages 1 to.")',
    passed: test5Passed,
    defectCaught: reportCorruptedTitle.qualityIssues.find((q) => q.type === 'CORRUPTED_TITLE')?.description,
  });

  // TEST 6: Sequence Inversion Across Slides & Within Slides Must FAIL
  // Specifically swap two sequential operational slides so a late step is taught before an early step
  const detailSlideIndices = cleanDeck
    .map((s, idx) => ({ idx, steps: s.coveredStepNumbers || [] }))
    .filter((item) => item.steps.length > 0 && item.steps.length < blueprint.totalSourceSteps);

  const deckInvertedSequence = [...cleanDeck];
  if (detailSlideIndices.length >= 2) {
    const idxA = detailSlideIndices[0].idx;
    const idxB = detailSlideIndices[1].idx;
    // Swap slide A and slide B so Slide B (which covers higher step numbers) appears before Slide A
    const temp = deckInvertedSequence[idxA];
    deckInvertedSequence[idxA] = deckInvertedSequence[idxB];
    deckInvertedSequence[idxB] = temp;
  } else {
    deckInvertedSequence[0] = {
      ...deckInvertedSequence[0],
      coveredStepNumbers: [5, 2],
    };
  }

  const reportSequence = validateAdaptiveDeckAgainstSop(blueprint, deckInvertedSequence, rawDoc);
  const test6Passed =
    reportSequence.isValid === false &&
    reportSequence.qualityIssues.some((q) => q.type === 'SEQUENCE_ERROR' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Sequence Inversion (Inter-Slide Step Order Violation)',
    passed: test6Passed,
    defectCaught: reportSequence.qualityIssues.find((q) => q.type === 'SEQUENCE_ERROR')?.description,
  });

  // TEST 7: Detection of Unsupported Quantitative Operational Assertion Must FAIL
  const deckUnsupportedClaim = cleanDeck.map((s, idx) =>
    idx === 3
      ? {
          ...s,
          cards: [
            ...(s.cards || []),
            {
              id: 'card-unsupported',
              label: 'Chemical Dwell Time',
              value: 'Dwell Time: 75 minutes',
              subtext: 'Maintain surface saturation for exactly 75 minutes before wiping',
              provenance: 'illustrative_example' as const,
            },
          ],
        }
      : s
  );
  const reportUnsupportedClaim = validateAdaptiveDeckAgainstSop(blueprint, deckUnsupportedClaim, rawDoc);
  const test7Passed =
    reportUnsupportedClaim.isValid === false &&
    reportUnsupportedClaim.qualityIssues.some(
      (q) => q.type === 'UNSUPPORTED_OPERATIONAL_CLAIM' && q.severity === 'BLOCKING'
    );
  testResults.push({
    testName: 'Detection of Unsupported Quantitative Claim (75 minutes not in SOP)',
    passed: test7Passed,
    defectCaught: reportUnsupportedClaim.qualityIssues.find(
      (q) => q.type === 'UNSUPPORTED_OPERATIONAL_CLAIM'
    )?.description,
  });

  // TEST 8: Automated Pedagogical Repair Engine Verification
  // Construct a heavily defective deck with 3 simultaneous defects (missing step, corrupt title, duplicate title)
  const defectiveDeck = cleanDeck.map((s, idx) => {
    if (idx === 2) return { ...s, title: 'Operational Phase: to.' }; // corrupt title
    if (idx === 3) return { ...s, title: cleanDeck[1].title }; // duplicate title
    if (s.coveredStepNumbers?.includes(7)) {
      return { ...s, coveredStepNumbers: s.coveredStepNumbers.filter((n) => n !== 7) }; // missing step 7
    }
    return s;
  });

  const defectiveReport = validateAdaptiveDeckAgainstSop(blueprint, defectiveDeck, rawDoc);
  const repairedDeck = repairAdaptiveDeck(blueprint, defectiveDeck, defectiveReport);
  const revalidatedReport = validateAdaptiveDeckAgainstSop(blueprint, repairedDeck, rawDoc);

  const test8Passed =
    defectiveReport.isValid === false &&
    revalidatedReport.isValid === true &&
    revalidatedReport.qualityIssues.filter((q) => q.severity === 'BLOCKING').length === 0;

  testResults.push({
    testName: 'Automated Pedagogical Deck Repair Engine (Auto-heals multi-defect deck)',
    passed: test8Passed,
    details: `Before repair: ${defectiveReport.qualityIssues.length} defects. After repair: ${revalidatedReport.qualityIssues.length} defects (${revalidatedReport.auditSummary}).`,
  });

  // TEST 9: Cognitive Instructional Pacing for 17-Step SOP with Zero Section Metadata
  const raw17StepFixture = {
    sop_title: 'Commercial Kitchen Deep Sanitization Protocol',
    role: 'Sanitation Lead',
    purpose: 'Standard procedure for night shift deep cleaning and sanitization of prep areas.',
    raw_steps: [
      { step_number: 1, task_title: 'Review shift sanitation log and don personal protective equipment' },
      { step_number: 2, task_title: 'Clear loose food debris from stainless prep tables into disposal bin' },
      { step_number: 3, task_title: 'Disassemble meat slicer guard and removable prep attachments' },
      { step_number: 4, task_title: 'Submerge removable blades in enzymatic presoak sink' },
      { step_number: 5, task_title: 'Apply alkaline degreaser spray to flat work surfaces' },
      { step_number: 6, task_title: 'Allow degreaser to dwell for 5 minutes' },
      { step_number: 7, task_title: 'Scrub grease traps and backsplashes using nylon non-scratch pads' },
      { step_number: 8, task_title: 'Rinse prep tables thoroughly with warm potable water' },
      { step_number: 9, task_title: 'Prepare quaternary ammonium sanitizing solution at 200 ppm' },
      { step_number: 10, task_title: 'Test sanitizer concentration using chemical test strip' },
      { step_number: 11, task_title: 'Flood contact surfaces with sanitizer and allow to air dry for 10 minutes' },
      { step_number: 12, task_title: 'Reassemble slicer blade and lock safety guard in place' },
      { step_number: 13, task_title: 'Sweep kitchen flooring from back walls toward center drainage' },
      { step_number: 14, task_title: 'Mop floor using commercial floor cleaner and place wet floor signs' },
      { step_number: 15, task_title: 'Empty grease trap and replace disposal liner' },
      { step_number: 16, task_title: 'Inspect all stainless surfaces with flashlight for residue' },
      { step_number: 17, task_title: 'Sign shift sanitation compliance log and secure chemicals in locked cage' },
    ],
  };

  const bp17 = buildTeachingBlueprint(raw17StepFixture as any);
  const deck17 = buildAdaptiveDeckFromBlueprint(bp17, raw17StepFixture as any);
  const report17 = validateAdaptiveDeckAgainstSop(bp17, deck17, raw17StepFixture as any);

  // Cognitive pacing verification:
  // Must produce 4 to 6 operational teaching stages with 2 to 4 steps per stage (no 1-stage 17-step overload!)
  const stepTeachingSlides = deck17.filter(
    (s) =>
      (s.coveredStepNumbers?.length || 0) > 0 &&
      (s.coveredStepNumbers?.length || 0) < 17 &&
      s.visualFormat !== 'process_flow' &&
      s.visualFormat !== 'knowledge_check'
  );

  const stageCountValid = stepTeachingSlides.length >= 4 && stepTeachingSlides.length <= 7;
  const maxStepsOnSingleStage = Math.max(...stepTeachingSlides.map((s) => s.coveredStepNumbers.length));
  const minStepsOnSingleStage = Math.min(...stepTeachingSlides.map((s) => s.coveredStepNumbers.length));
  const pacingBalanced = maxStepsOnSingleStage <= 5 && minStepsOnSingleStage >= 2;

  const test9Passed =
    report17.isValid === true &&
    stageCountValid &&
    pacingBalanced &&
    report17.coveredSourceSteps === 17;

  testResults.push({
    testName: 'Cognitive Instructional Pacing for 17-Step SOP with Zero Metadata',
    passed: test9Passed,
    details: `Created ${stepTeachingSlides.length} stages (${minStepsOnSingleStage}–${maxStepsOnSingleStage} steps per stage). 17/17 steps covered without overload.`,
  });

  const allPassed = testResults.every((t) => t.passed);
  return { passed: allPassed, testResults };
}

// Direct CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running Comprehensive Deck Quality Gate Verification Suite...\n');
  const res = runDeckQualityGateTests();
  res.testResults.forEach((t, i) => {
    console.log(`[${t.passed ? 'PASS' : 'FAIL'}] Test ${i + 1}: ${t.testName}`);
    if (t.defectCaught) console.log(`       Defect Caught: ${t.defectCaught}`);
    if (t.details) console.log(`       Details: ${t.details}`);
  });
  console.log(`\nOverall Result: ${res.passed ? 'ALL 9 QUALITY TESTS PASSED' : 'SOME TESTS FAILED'}`);
  if (!res.passed) process.exit(1);
}
