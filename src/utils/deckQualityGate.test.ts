import fs from 'fs';
import path from 'path';
import {
  buildTeachingBlueprint,
  buildAdaptiveDeckFromBlueprint,
  validateAdaptiveDeckAgainstSop,
} from '../experiment/teachingBlueprint';

/**
 * Deck Quality Gate Automated Test Suite
 * Rigorously verifies that the 5-Pillar Quality Gate catches:
 * 1. Missing required operational actions & safeguards
 * 2. Repeated explanations & duplicate slide headlines
 * 3. Unrelated cross-domain terminology & hallucinations
 * 4. Corrupted, truncated or malformed titles
 * 5. Sequence inversions & order violations
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
  const test1Passed = baselineReport.isValid === true && baselineReport.qualityIssues.filter(q => q.severity === 'BLOCKING').length === 0;
  testResults.push({
    testName: 'Baseline Clean Deck Verification',
    passed: test1Passed,
    details: baselineReport.auditSummary,
  });

  // TEST 2: Missing Required Action Must FAIL
  const deckMissingStep = cleanDeck.map(s => ({
    ...s,
    coveredStepNumbers: s.coveredStepNumbers.filter(n => n !== 5),
  }));
  const reportMissingStep = validateAdaptiveDeckAgainstSop(blueprint, deckMissingStep, rawDoc);
  const test2Passed =
    reportMissingStep.isValid === false &&
    reportMissingStep.qualityIssues.some(q => q.type === 'MISSING_REQUIRED_ACTION' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Missing Required Action (Step 5 omitted)',
    passed: test2Passed,
    defectCaught: reportMissingStep.qualityIssues.find(q => q.type === 'MISSING_REQUIRED_ACTION')?.description,
  });

  // TEST 3: Duplicate Slide Headline Must FAIL
  const deckDuplicateTitles = cleanDeck.map((s, idx) =>
    idx === 3 ? { ...s, title: cleanDeck[2].title } : s
  );
  const reportDuplicateTitles = validateAdaptiveDeckAgainstSop(blueprint, deckDuplicateTitles, rawDoc);
  const test3Passed =
    reportDuplicateTitles.isValid === false &&
    reportDuplicateTitles.qualityIssues.some(q => q.type === 'REPEATED_EXPLANATION' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Repeated Explanation / Duplicate Title',
    passed: test3Passed,
    defectCaught: reportDuplicateTitles.qualityIssues.find(q => q.type === 'REPEATED_EXPLANATION')?.description,
  });

  // TEST 4: Unrelated Domain Terminology (Finance Hallucination) Must FAIL
  const deckFinanceHallucination = cleanDeck.map((s, idx) =>
    idx === 4 ? { ...s, subtitle: 'Verify monthly EBITDA reconciliation before proceeding' } : s
  );
  const reportFinance = validateAdaptiveDeckAgainstSop(blueprint, deckFinanceHallucination, rawDoc);
  const test4Passed =
    reportFinance.isValid === false &&
    reportFinance.qualityIssues.some(q => q.type === 'UNRELATED_TERMINOLOGY' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Unrelated Terminology (EBITDA in Housekeeping)',
    passed: test4Passed,
    defectCaught: reportFinance.qualityIssues.find(q => q.type === 'UNRELATED_TERMINOLOGY')?.description,
  });

  // TEST 5: Corrupted Truncated Title (Dangling "to.") Must FAIL
  const deckCorruptedTitle = cleanDeck.map((s, idx) =>
    idx === 2 ? { ...s, title: 'Operational sequence: Stages 1 to.' } : s
  );
  const reportCorruptedTitle = validateAdaptiveDeckAgainstSop(blueprint, deckCorruptedTitle, rawDoc);
  const test5Passed =
    reportCorruptedTitle.isValid === false &&
    reportCorruptedTitle.qualityIssues.some(q => q.type === 'CORRUPTED_TITLE' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Corrupted Truncated Title ("Stages 1 to.")',
    passed: test5Passed,
    defectCaught: reportCorruptedTitle.qualityIssues.find(q => q.type === 'CORRUPTED_TITLE')?.description,
  });

  // TEST 6: Sequence Inversion (Step Order Violation) Must FAIL
  const deckInvertedSequence = cleanDeck.map(s => {
    if (s.coveredStepNumbers.includes(1) && s.coveredStepNumbers.includes(2)) {
      return { ...s, coveredStepNumbers: [2, 1] };
    }
    return s;
  });
  const reportSequence = validateAdaptiveDeckAgainstSop(blueprint, deckInvertedSequence, rawDoc);
  const test6Passed =
    reportSequence.isValid === false &&
    reportSequence.qualityIssues.some(q => q.type === 'SEQUENCE_ERROR' && q.severity === 'BLOCKING');
  testResults.push({
    testName: 'Detection of Sequence Inversion (Step 2 before Step 1)',
    passed: test6Passed,
    defectCaught: reportSequence.qualityIssues.find(q => q.type === 'SEQUENCE_ERROR')?.description,
  });

  const allPassed = testResults.every(t => t.passed);
  return { passed: allPassed, testResults };
}

// Direct CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running Deck Quality Gate Verification Suite...');
  const res = runDeckQualityGateTests();
  res.testResults.forEach((t, i) => {
    console.log(`[${t.passed ? 'PASS' : 'FAIL'}] Test ${i + 1}: ${t.testName}`);
    if (t.defectCaught) console.log(`       Caught: ${t.defectCaught}`);
    if (t.details) console.log(`       Details: ${t.details}`);
  });
  console.log(`\nOverall Result: ${res.passed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  if (!res.passed) process.exit(1);
}
