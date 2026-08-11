/**
 * Utility function to format program and major names cleanly,
 * preserving degree-level designations (B.S., B.A., M.S., B.B.A., etc.)
 * when available, while standardizing formatting and avoiding word corruption.
 */
export function formatProgramName(programName: string): string {
  if (!programName) return '';
  let cleaned = programName.trim();

  // If trailing degree tag in parentheses like (BS), (B.S.), (M.S.), (B.A.), (Ph.D.), move to front or clean up
  const trailingDegreeMatch = cleaned.match(/^(.*?)\s*\((B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|Ph\.?D\.?|B\.?B\.?A\.?|M\.?B\.?A\.?|B\.?A\.?S\.?|B\.?Eng\.?|M\.?Eng\.?)\)$/i);
  if (trailingDegreeMatch) {
    const mainName = trailingDegreeMatch[1].trim();
    const rawTag = trailingDegreeMatch[2].toUpperCase().replace(/\./g, '');
    let formattedTag = rawTag;
    if (rawTag === 'BS') formattedTag = 'B.S.';
    else if (rawTag === 'BA') formattedTag = 'B.A.';
    else if (rawTag === 'MS') formattedTag = 'M.S.';
    else if (rawTag === 'MA') formattedTag = 'M.A.';
    else if (rawTag === 'PHD') formattedTag = 'Ph.D.';
    else if (rawTag === 'BBA') formattedTag = 'B.B.A.';
    else if (rawTag === 'MBA') formattedTag = 'M.B.A.';
    else if (rawTag === 'BAS') formattedTag = 'B.A.S.';
    else if (rawTag === 'BENG') formattedTag = 'B.Eng.';
    else if (rawTag === 'MENG') formattedTag = 'M.Eng.';
    return `${formattedTag} ${mainName}`;
  }

  // Convert verbose long degree phrases into standardized concise prefixes e.g. "Bachelor of Science in " -> "B.S. "
  cleaned = cleaned.replace(/^\bBachelor\s+of\s+Science\s+(in|of)?\b\s*/i, 'B.S. ');
  cleaned = cleaned.replace(/^\bBachelor\s+of\s+Arts\s+(in|of)?\b\s*/i, 'B.A. ');
  cleaned = cleaned.replace(/^\bBachelor\s+of\s+Business\s+Administration\s+(in|of)?\b\s*/i, 'B.B.A. ');
  cleaned = cleaned.replace(/^\bBachelor\s+of\s+Fine\s+Arts\s+(in|of)?\b\s*/i, 'B.F.A. ');
  cleaned = cleaned.replace(/^\bBachelor\s+of\s+Applied\s+Science\s+(in|of)?\b\s*/i, 'B.A.S. ');
  cleaned = cleaned.replace(/^\bBachelor\s+of\s+Engineering\s+(in|of)?\b\s*/i, 'B.Eng. ');
  cleaned = cleaned.replace(/^\bMaster\s+of\s+Science\s+(in|of)?\b\s*/i, 'M.S. ');
  cleaned = cleaned.replace(/^\bMaster\s+of\s+Arts\s+(in|of)?\b\s*/i, 'M.A. ');
  cleaned = cleaned.replace(/^\bMaster\s+of\s+Business\s+Administration\s+(in|of)?\b\s*/i, 'M.B.A. ');
  cleaned = cleaned.replace(/^\bMaster\s+of\s+Fine\s+Arts\s+(in|of)?\b\s*/i, 'M.F.A. ');
  cleaned = cleaned.replace(/^\bDoctor\s+of\s+Philosophy\s+(in|of)?\b\s*/i, 'Ph.D. ');

  // Clean up extra whitespace and trailing punctuation
  cleaned = cleaned.replace(/^[\s\-:\–\.]+|\s+$/g, '').replace(/\s+/g, ' ');

  return cleaned || programName.trim();
}

/**
 * Legacy compatibility alias. Kept to ensure existing code seamlessly receives
 * cleanly formatted program names with preserved degree levels.
 */
export function stripDegreePrefix(programName: string): string {
  return formatProgramName(programName);
}

