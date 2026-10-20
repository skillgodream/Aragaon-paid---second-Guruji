/**
 * LEARNER COPY SANITIZER & EDITORIAL COPY FIREWALL
 *
 * Single authoritative boundary between internal SOP pipeline data models
 * (OperationalBlueprint, CanonicalTaskModel, TeachingBlueprint, QA Reports)
 * and learner-facing Gamma Editorial Training Deck / Simulation UI.
 *
 * Enforces:
 * 1. Zero internal backend IDs, telemetry strings, or robotic boilerplate wrappers.
 * 2. Zero mid-phrase truncated titles ("Never read out or", "Confirm payment method and", "Working key encoder and").
 * 3. Zero stuttered duplication where a card's heading is just the first 4 words of the body sentence below it.
 * 4. Zero double prefixes ("Never: Never...", "Avoid: Never...").
 */

const BACKEND_BOILERPLATE_PATTERNS: RegExp[] = [
  /^mandatory operational step from the sop\.?$/i,
  /^complete in exact sequence before advancing\.?$/i,
  /^prevents safety or compliance breach\.?$/i,
  /^source-verified conditional rule\.?$/i,
  /^high-risk operational error identified in sop\.?$/i,
  /^authorized exception handling protocol for [^.]+\.?$/i,
  /^apply documented .+ decision rule\.?$/i,
  /^do not improvise outside this exception path\.?$/i,
  /^verify availability and operational status\.?$/i,
  /^protects quality, safety, and audit compliance\.?$/i,
  /^zero tolerance for unapproved workarounds\.?$/i,
  /^follow the verified sop step and confirm all checks\.?$/i,
  /^requires strict adherence to sop verification criteria\.?$/i,
  /^rushing the verification check or assuming visual similarity\.?$/i,
  /^ensures strict adherence to organizational sop standards\.?$/i,
  /^crucial for upholding standard quality and safety compliance\.?$/i,
  /^always verify required criteria before proceeding\.?$/i,
  /^verify sop guideline before proceeding\.?$/i,
  /^follow written .+ sop instructions carefully\.?$/i,
  /^critical requirement for [^.]+\.?$/i,
  /^mandatory control for [^.]+\.?$/i,
  /^ensures accurate execution of [^.]+\.?$/i,
  /^adhere to written sop:.*$/i,
  /^execute ".+" in compliance with written sop\.?$/i,
  /^mandatory operational standard in written sop:.*$/i,
  /^mandatory operational standard:.*$/i,
  /^perform .+ accurately\.?$/i,
  /^standard procedure for [^.]+\.?$/i,
  /^maintains operational compliance\.?$/i,
];

const INLINE_WRAPPER_REPLACEMENTS: Array<[RegExp, string]> = [
  [/^(?:sop requirement|mandatory rule|operational rule|mandatory operational standard|mandatory requirement in written sop|adhere strictly|always enforce written compliance rule|follow the documented requirement)\s*:\s*/i, ''],
  [/^when executing\s*:\s*"?([^"]+)"?$/i, '$1'],
  [/^quality or compliance anomaly\s*:\s*/i, ''],
  [/^execute\s+"([^"]+)"\s+in compliance with written sop\.?$/i, '$1'],
  [/^(?:if condition|if exception|if escalation trigger)\s*\d*\s*:\s*/i, ''],
  [/^(?:then|resolution|stop\s*&\s*escalate)\s*:\s*/i, ''],
  [/^(?:action directive|step)\s*·\s*step\s*\d+/i, ''],
  [/\b(?:S\d+\.(?:sec|pre|tool|term|dec|exp|esc|ctrl|safe|qual|err|overview|impact|control|definition|why|workflow|escalation)\d*)\b/gi, ''],
  [/\b(?:ctrl-crit-\d+|step-\d+|doc-[a-f0-9]+|ret-pu-sop-[a-z0-9_-]+)\b/gi, ''],
  [/\|\s*controlled copy[^\n]*/gi, ''],
  [/controlled copy[^\n]*/gi, ''],
  [/\|\s*page\s*\d+[^\n]*/gi, ''],
  // Eliminate double prefixes like "Never: Never..." or "Avoid: Never..." or "Instead: Follow..."
  [/\bNever:\s*(?=Never\b|Do not\b)/gi, ''],
  [/\bAvoid:\s*(?=Never\b|Do not\b|Avoid\b)/gi, ''],
  [/\bInstead:\s*(?=Instead\b)/gi, ''],
  // Strip mechanical pagination suffixes like "(1/2)" or "(2/2)" from learner titles
  [/\s*\(\d+\/\d+\)\s*$/g, ''],
  // Strip trailing stray numbering from OCR or bullet fragments (e.g., "... 1." or " — 2") without destroying phrases like "Stages 1 to 6" or "Control 1"
  [/(?:\s*\.{3,}|\s+[—–]\s*)\d+\.?\s*$/g, ''],
  // Domain Contamination Firewall: Clean out hallucinated finance/collection terms from check-in contexts
  [/\b(?:folios?,\s*)?debt\s+write-offs?(?:\s+and\s+chargebacks?)?\b/gi, 'payment disputes and uncollected balances'],
  [/\bchargebacks?(?:\s+and\s+debt\s+write-offs?)?\b/gi, 'unauthorized payment disputes'],
  [/\bfolio\s+debt\s+write-offs?\b/gi, 'uncollected balance disputes'],
];

/** Words that must NEVER appear at the end of a card or micro-item title */
const DANGLING_TITLE_END_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'nor', 'but', 'to', 'of', 'in', 'on', 'for', 'with',
  'by', 'at', 'from', 'into', 'onto', 'upon', 'within', 'without', 'before', 'after',
  'during', 'under', 'over', 'between', 'through', 'against', 'among', 'around', 'behind',
  'below', 'beside', 'beyond', 'despite', 'down', 'except', 'inside', 'near', 'off', 'out',
  'outside', 'past', 'since', 'throughout', 'toward', 'towards', 'until', 'up', 'via',
  'while', 'that', 'this', 'these', 'those', 'which', 'who', 'whom', 'whose', 'what',
  'when', 'where', 'why', 'how', 'if', 'unless', 'whether', 'as', 'than', 'so', 'very',
  'too', 'only', 'also', 'even', 'just', 'still', 'not', 'never', 'always', 'every',
  'each', 'all', 'any', 'some', 'no', 'both', 'either', 'neither', 'is', 'are', 'was',
  'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'need',
  // Common modifiers that leave broken compound nouns if cut right after them
  'duty', 'front', 'property', 'management', 'blank', 'current', 'required', 'valid',
  'proper', 'correct', 'approved', 'authorized', 'authorised', 'standard', 'full',
  'complete', 'visible', 'clean', 'fresh', 'used', 'open', 'unverified', 'manual',
]);

/**
 * Cleans a learner-facing string by removing internal backend prefixes,
 * source reference codes, double prefixes, stray numbers, and meta-SOP wrapper phrases.
 */
export function sanitizeLearnerText(input?: string | null): string {
  if (!input) return '';
  let text = String(input).trim();
  if (!text) return '';

  for (const [pattern, replacement] of INLINE_WRAPPER_REPLACEMENTS) {
    text = text.replace(pattern, replacement).trim();
  }

  // Strip surrounding quotes if the whole string was quoted by a backend template
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    text = text.slice(1, -1).trim();
  }

  // Strip trailing stray numbering from OCR or bullet fragments without destroying legitimate phrases
  text = text.replace(/(?:\s*\.{3,}|\s+[—–]\s*)\d+\.?\s*$/, '').trim();
  text = text.replace(/\.{2,}/g, '.').replace(/\s+([.,;:])/g, '$1');

  for (const bp of BACKEND_BOILERPLATE_PATTERNS) {
    if (bp.test(text)) {
      return '';
    }
  }

  return text.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Normalizes a string for near-duplicate comparison so a card never repeats
 * the same sentence in its title, body, and "Why it matters" footer.
 */
export function normalizeForComparison(input?: string | null): string {
  if (!input) return '';
  return String(input)
    .toLowerCase()
    .replace(/^(?:step\s*\d+\s*[:·\-]\s*|why it matters\s*:\s*|prevents\s*:\s*|fix\s*:\s*|field watch-out\s*:\s*|never\s*:\s*|instead\s*:\s*)/i, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Returns true if two strings convey the same text (one is identical to or a trivial prefix of the other).
 */
export function isDuplicateLearnerCopy(a?: string | null, b?: string | null): boolean {
  const normA = normalizeForComparison(a);
  const normB = normalizeForComparison(b);
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  if (normA.length > 18 && normB.length > 18) {
    if (normA.includes(normB) || normB.includes(normA)) return true;
  }
  return false;
}

/**
 * Checks whether a candidate title is truncated mid-phrase (e.g. "Never read out or", "Confirm payment method and")
 * or is just a raw prefix of the body sentence.
 */
export function isBrokenOrRedundantTitle(title: string, body: string): boolean {
  const cleanTitle = title.trim().replace(/[.;,:—–-]+$/, '');
  if (!cleanTitle) return true;

  const words = cleanTitle.split(/\s+/);
  const lastWord = words[words.length - 1]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  if (DANGLING_TITLE_END_WORDS.has(lastWord)) {
    return true;
  }

  // If the title ends with a comma or conjunction
  if (/[,;:\-—–]$/.test(title.trim())) {
    return true;
  }

  // If body starts with the exact same words as title (stuttered prefix)
  const normTitle = cleanTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const normBody = body.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  if (normTitle.length >= 10 && normBody.startsWith(normTitle)) {
    return true;
  }

  return false;
}

/**
 * Generates a human-grade, 2-to-4 word Semantic Editorial Concept Heading from an operational sentence
 * so the heading conceptualizes the rule without repeating the first 4 words of the body sentence.
 */
export function deriveSemanticConceptLabel(sentence: string, fallbackLabel = 'Key Control'): string {
  const clean = sanitizeLearnerText(sentence);
  if (!clean) return fallbackLabel;

  // 1. If the sentence already has a natural "Concept: Detail" or "Concept — Detail" prefix (<= 32 chars)
  const colonMatch = clean.match(/^([A-Za-z0-9\s/&()-]{3,32}?)\s*[:—–]\s+(.+)$/);
  if (colonMatch) {
    const candidate = colonMatch[1].trim();
    const candidateWords = candidate.split(/\s+/);
    const lastW = candidateWords[candidateWords.length - 1]?.toLowerCase().replace(/[^a-z]/g, '') || '';
    if (candidateWords.length <= 5 && !DANGLING_TITLE_END_WORDS.has(lastW)) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  const lower = clean.toLowerCase();

  // 2. Semantic Operational Concept Matching (Hospitality, Retail, Logistics, Healthcare, Lab, Manufacturing)
  if (/\b(room number|aloud|public view|point to the written|key wallet)\b/.test(lower)) {
    return /^never\b/i.test(clean) ? 'Room Number Privacy' : 'Discreet Key Handoff';
  }
  if (/\b(screen angled|leave guest records|confidential|bystander|unverified caller)\b/.test(lower)) {
    return 'Guest Data Privacy';
  }
  if (/\b(dirty|out-of-order|out of order|occupied|unverified room|vacant ready|clean, inspected)\b/.test(lower)) {
    return 'Verified Room Readiness';
  }
  if (/\b(housekeeping)\b/.test(lower) && /\b(status|visibility|ready|readiness)\b/.test(lower)) {
    return 'Housekeeping Status Feed';
  }
  if (/\b(photo id|government-issued|identity|passport|aadhaar|kyc)\b/.test(lower)) {
    return 'Identity Verification';
  }
  if (/\b(payment|deposit|pre-authorization|pre-authorisation|pos|settlement|card decline)\b/.test(lower)) {
    return /\b(terminal|pos)\b/.test(lower) && clean.split(/\s+/).length <= 10
      ? 'POS Payment Terminal'
      : 'Payment & Deposit Control';
  }
  if (/\b(key encoder|blank key|encode)\b/.test(lower)) {
    return clean.split(/\s+/).length <= 8 ? 'Key Card Hardware' : 'Key Card Encoding';
  }
  if (/\b(property management system|pms)\b/.test(lower)) {
    if (/\b(access to)\b/.test(lower) && clean.split(/\s+/).length <= 8) return 'PMS System Access';
    if (/\b(update|checked in|mark)\b/.test(lower)) return 'PMS Status Update';
    return 'PMS System Record';
  }
  if (/\b(duty manager|front office supervisor|escalation contact|escalate)\b/.test(lower)) {
    return 'Supervisor Escalation';
  }
  if (/\b(handover log|shift handover|manual override|room move)\b/.test(lower)) {
    return 'Shift Handover Log';
  }
  if (/\b(eye contact|smile|welcome the guest|greet)\b/.test(lower)) {
    return 'Warm Guest Welcome';
  }
  if (/\b(booking reference|locate the reservation|retrieve reservation)\b/.test(lower)) {
    return 'Reservation Lookup';
  }
  if (/\b(arrival and departure|room type|special requests|stay details)\b/.test(lower)) {
    return 'Stay Details Check';
  }
  if (/\b(signature|registration card|policy acknowledgement)\b/.test(lower)) {
    return 'Guest Registration';
  }
  if (/\b(breakfast|wi-fi|elevator|directions|pleasant stay)\b/.test(lower)) {
    return 'Stay Essentials & Directions';
  }
  if (/\b(1:10|dilution|concentrate|applicator bottle)\b/.test(lower)) {
    return '1:10 Chemical Dilution';
  }
  if (/\b(debris|dust|damp microfibre|pre-spray|wipe dirt)\b/.test(lower)) {
    return 'Pre-Spray Debris Wipe';
  }
  if (/\b(high-touch|light switches|door handles|remote controls)\b/.test(lower)) {
    return 'High-Touch Coverage';
  }
  if (/\b(60-second|60 sec|dwell|wet contact)\b/.test(lower)) {
    return '60-Second Dwell Time';
  }
  if (/\b(nitrile|ppe|gloves|safety glasses|goggles|ventilation)\b/.test(lower)) {
    return 'PPE & Safety Prep';
  }
  if (/\b(color-coded|microfibre cloth|reuse.*cloth|laundry bag)\b/.test(lower)) {
    return 'Cloth Hygiene Control';
  }
  if (/\b(centrifuge|rpm|4°c|rotor)\b/.test(lower)) {
    return 'Centrifuge Calibration';
  }
  if (/\b(-80°c|ultra-low freezer|aliquot|cryovial)\b/.test(lower)) {
    return 'Cryogenic Chain Control';
  }
  if (/\b(barcode|scanner|sku|serial|imei|otp|tamper)\b/.test(lower)) {
    return 'Barcode & Seal Check';
  }

  // 3. Grammatical Noun-Phrase / Action-Concept Extraction (never chops mid-phrase)
  const stripped = clean
    .replace(/^(?:step\s*\d+[:.-]?\s*|always\s+|must\s+|ensure\s+that\s+|make\s+sure\s+to\s+|please\s+|never\s+read\s+out\s+or\s+|never\s+|do\s+not\s+)/i, '')
    .trim();

  const clause = stripped.split(/[.;,:—–()]/)[0]?.trim() || stripped;
  const words = clause.split(/\s+/).filter(Boolean);

  // Trim trailing dangling words
  while (
    words.length > 2 &&
    DANGLING_TITLE_END_WORDS.has(words[words.length - 1].toLowerCase().replace(/[^a-z]/g, ''))
  ) {
    words.pop();
  }

  // Cap at 4 words, then trim any newly exposed trailing dangling word
  const capped = words.slice(0, 4);
  while (
    capped.length > 2 &&
    DANGLING_TITLE_END_WORDS.has(capped[capped.length - 1].toLowerCase().replace(/[^a-z]/g, ''))
  ) {
    capped.pop();
  }

  if (capped.length >= 2) {
    const phrase = capped.join(' ').replace(/[.;,:—–-]+$/, '');
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  }

  return fallbackLabel;
}

/**
 * Given a raw label/title and raw body/value/subtext, synthesizes a non-redundant,
 * grammatically complete { title, body } pair worthy of a Gamma Principal Designer.
 */
export function synthesizeEditorialMicroCopy(
  rawLabel?: string | null,
  rawValue?: string | null,
  rawSubtext?: string | null,
  fallbackCategory = 'Operational Control'
): { title: string; body: string } {
  const cleanLabel = sanitizeLearnerText(rawLabel);
  const cleanVal = sanitizeLearnerText(rawValue);
  const cleanSub = sanitizeLearnerText(rawSubtext);

  // Case 1: Both cleanVal and cleanSub exist and are distinct
  if (cleanVal && cleanSub && !isDuplicateLearnerCopy(cleanVal, cleanSub)) {
    // Check if cleanVal is a clean short title (<= 6 words) and not broken
    const valWords = cleanVal.split(/\s+/);
    if (valWords.length <= 6 && !isBrokenOrRedundantTitle(cleanVal, cleanSub)) {
      return {
        title: cleanVal.replace(/[.]+$/, ''),
        body: cleanSub.endsWith('.') ? cleanSub : `${cleanSub}.`,
      };
    }
    // Otherwise derive a semantic concept title for the combined statement
    const semanticTitle =
      cleanLabel && !/^Step \d+|^Action \d+|^Rule$|^Prep$|^Tool$/i.test(cleanLabel) && !isBrokenOrRedundantTitle(cleanLabel, cleanVal)
        ? cleanLabel.replace(/[.]+$/, '')
        : deriveSemanticConceptLabel(cleanVal, fallbackCategory);
    return {
      title: semanticTitle,
      body: `${cleanVal.replace(/[.]+$/, '')}. ${cleanSub.endsWith('.') ? cleanSub : `${cleanSub}.`}`,
    };
  }

  // Case 2: Only one primary text exists (either cleanSub or cleanVal)
  const primaryText = cleanSub || cleanVal || cleanLabel || '';
  if (!primaryText) {
    return { title: fallbackCategory, body: '' };
  }

  // Check if primaryText has an inline "Label: Body" colon split
  const colonMatch = primaryText.match(/^([A-Za-z0-9\s/&()-]{3,34}?)\s*[:—–]\s+(.+)$/);
  if (colonMatch) {
    const prefixTitle = colonMatch[1].trim();
    const restBody = colonMatch[2].trim();
    if (!isBrokenOrRedundantTitle(prefixTitle, restBody)) {
      return {
        title: prefixTitle.charAt(0).toUpperCase() + prefixTitle.slice(1),
        body: restBody.endsWith('.') ? restBody : `${restBody}.`,
      };
    }
  }

  // Check if cleanLabel is already a valid, non-redundant title for primaryText
  if (
    cleanLabel &&
    !/^(?:Step|Stage|Action|Rule|Prep|Tool|Standard|Key Term)\s*\d*$/i.test(cleanLabel) &&
    !isBrokenOrRedundantTitle(cleanLabel, primaryText) &&
    !isDuplicateLearnerCopy(cleanLabel, primaryText)
  ) {
    return {
      title: cleanLabel.replace(/[.]+$/, ''),
      body: primaryText.endsWith('.') ? primaryText : `${primaryText}.`,
    };
  }

  // Derive a semantic concept title so the heading and body never stutter
  const conceptTitle = deriveSemanticConceptLabel(primaryText, fallbackCategory);

  // If primaryText is a short noun phrase (e.g., "Working key encoder and blank key cards"),
  // turn the body into a complete operational verification sentence so it reads naturally.
  const wordCount = primaryText.split(/\s+/).length;
  let finalBody = primaryText.endsWith('.') ? primaryText : `${primaryText}.`;

  if (wordCount <= 8 && !/^(?:verify|confirm|check|ensure|never|do not|use|keep|record|place|encode|apply|allow|wipe|dilute|inspect|put on|stock)\b/i.test(primaryText)) {
    const loweredStart = primaryText.charAt(0).toLowerCase() + primaryText.slice(1).replace(/[.]+$/, '');
    finalBody = `Confirm ${loweredStart} is verified and ready before proceeding.`;
  }

  return {
    title: conceptTitle,
    body: finalBody,
  };
}

/**
 * Deduplicates and cleans a slide card's headline (`value`), body (`subtext`),
 * rationale (`why`), and watch-out (`consequence`) so no card shows backend
 * filler, broken 4-word titles, or repeated sentences.
 */
export function sanitizeSlideCardCopy<T extends {
  label?: string;
  value?: string;
  subtext?: string;
  why?: string;
  consequence?: string;
  tag?: string;
}>(card: T): T {
  const cleanLabel = sanitizeLearnerText(card.label);
  const cleanValue = sanitizeLearnerText(card.value) || card.value || '';
  let cleanSubtext = sanitizeLearnerText(card.subtext);
  let cleanWhy = sanitizeLearnerText(card.why);
  let cleanConsequence = sanitizeLearnerText(card.consequence);

  // Ensure label is never a broken 4-word prefix of value
  const safeLabel =
    cleanLabel && !isBrokenOrRedundantTitle(cleanLabel, cleanValue)
      ? cleanLabel
      : deriveSemanticConceptLabel(cleanValue || cleanSubtext, cleanLabel || 'Key Control');

  // If subtext is identical to value, suppress subtext repetition
  if (isDuplicateLearnerCopy(cleanValue, cleanSubtext)) {
    const finalValue = cleanSubtext.length > cleanValue.length ? cleanSubtext : cleanValue;
    cleanSubtext = '';
    return {
      ...card,
      label: safeLabel,
      value: finalValue,
      subtext: cleanSubtext,
      why: isDuplicateLearnerCopy(finalValue, cleanWhy) ? undefined : (cleanWhy || undefined),
      consequence: isDuplicateLearnerCopy(finalValue, cleanConsequence) ? undefined : (cleanConsequence || undefined),
    };
  }

  // If `why` repeats either `value` or `subtext`, suppress `why`
  if (isDuplicateLearnerCopy(cleanValue, cleanWhy) || isDuplicateLearnerCopy(cleanSubtext, cleanWhy)) {
    cleanWhy = '';
  }

  // If `consequence` repeats `value`, `subtext`, or `why`, suppress `consequence`
  if (
    isDuplicateLearnerCopy(cleanValue, cleanConsequence) ||
    isDuplicateLearnerCopy(cleanSubtext, cleanConsequence) ||
    isDuplicateLearnerCopy(cleanWhy, cleanConsequence)
  ) {
    cleanConsequence = '';
  }

  return {
    ...card,
    label: safeLabel,
    value: cleanValue,
    subtext: cleanSubtext,
    why: cleanWhy || undefined,
    consequence: cleanConsequence || undefined,
  };
}
