import { CourseRequirement } from '../types';
import { parseResumeFile } from './parseResumeFile';

export interface ParseDegreePlanResult {
  filename: string;
  success: boolean;
  coursesExtracted: CourseRequirement[];
  message: string;
  error?: string;
}

/**
 * Parses a degree plan, degree audit, or transcript document (PDF, Word, Text)
 * and extracts course requirements to populate the Academic Degree Plan.
 */
export async function parseDegreePlanFile(file: File): Promise<ParseDegreePlanResult> {
  const parseResult = await parseResumeFile(file);

  if (!parseResult.success || !parseResult.text.trim()) {
    return {
      filename: file.name,
      success: false,
      coursesExtracted: [],
      message: 'Failed to read text from file.',
      error: parseResult.error || 'The document contained no readable text.'
    };
  }

  const rawText = parseResult.text;
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const extractedCourses: CourseRequirement[] = [];
  const seenCodes = new Set<string>();

  // Enhanced regular expression to match standard and varied university course code formats
  // Examples: CS 182, CS-101, ECON.201, BIO101, MATH 53, FIN 320, ENG_201, PHYS101A, STAT-134, M 101
  const courseCodeRegex = /\b([A-Z]{1,6})\s*[-:._]?\s*(\d{2,4}[A-Za-z]?)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(courseCodeRegex);

    if (match) {
      const dept = match[1].toUpperCase();
      const num = match[2].toUpperCase();
      const code = `${dept} ${num}`;

      if (seenCodes.has(code)) continue;
      seenCodes.add(code);

      // Extract title from line or nearby line
      let title = line
        .replace(match[0], '')
        .replace(/\b(completed|in\s*progress|planned|passed|enrolled|grade\s*:[a-fA-[#0-9+-]+|\d+\s*cr(edits?|units?))\b/gi, '')
        .replace(/^[-:._\s|]+|[-:._\s|]+$/g, '')
        .trim();

      if (!title || title.length < 3) {
        title = `${dept} Course ${num}`;
      }

      // Extract credits (e.g. "4 credits", "3 cr", "4 units", "3.0", "4.0 hrs")
      let credits = 3;
      const creditMatch = line.match(/(\d(?:\.\d)?)\s*(?:cr|credit|unit|hrs|hours|pts|points)/i) ||
                          line.match(/\b([1-6])\s*(?:u|c|cr|units?|credits?)\b/i);
      if (creditMatch) {
        credits = Math.round(parseFloat(creditMatch[1])) || 3;
      }

      // Extract status
      let status: CourseRequirement['status'] = 'planned';
      let grade: string | undefined = undefined;

      if (/completed|passed|taken|grade\s*:/i.test(line)) {
        status = 'completed';
        const gradeMatch = line.match(/\bgrade\s*:?\s*([A-DF][+-]?)\b/i);
        if (gradeMatch) grade = gradeMatch[1].toUpperCase();
        else grade = 'A';
      } else if (/in\s*progress|enrolled|current/i.test(line)) {
        status = 'in_progress';
      }

      // Determine category
      let category: CourseRequirement['category'] = 'core';
      if (/elective/i.test(line)) category = 'major_elective';
      else if (/gen\s*ed|general|writing|breadth|humanities/i.test(line)) category = 'gen_ed';
      else if (/prereq|prerequisite|intro|math|calculus/i.test(line)) category = 'prereq';

      extractedCourses.push({
        id: `extracted-${dept.toLowerCase()}-${num.toLowerCase()}-${Date.now()}-${extractedCourses.length}`,
        code,
        title,
        credits,
        category,
        status,
        grade,
        termTaken: status === 'completed' ? 'Past Term' : status === 'in_progress' ? 'Current Term' : 'Planned Term'
      });
    }
  }

  // Improved Fallback Parser for documents with non-standard formatting or missing course prefixes
  if (extractedCourses.length === 0) {
    const courseKeywords = [
      'calculus', 'programming', 'algorithms', 'structures', 'finance', 'accounting',
      'economics', 'marketing', 'management', 'physics', 'chemistry', 'biology',
      'psychology', 'ethics', 'capstone', 'algebra', 'statistics', 'database', 'software',
      'writing', 'literature', 'history', 'sociology', 'neuroscience', 'data science'
    ];
    
    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      const hasKeyword = courseKeywords.some(k => lower.includes(k));
      const hasCourseFormat = /^(\d+[.)]|course|req|module)/i.test(line);

      if ((hasKeyword || hasCourseFormat) && line.length > 5 && line.length < 100) {
        // Infer department code from content
        let dept = 'COURSE';
        if (/math|calculus|algebra|stat/i.test(lower)) dept = 'MATH';
        else if (/programming|algorithm|structure|database|software|data|cs/i.test(lower)) dept = 'CS';
        else if (/finance|accounting|economics|business|marketing/i.test(lower)) dept = 'ECON';
        else if (/physics/i.test(lower)) dept = 'PHYS';
        else if (/chemistry/i.test(lower)) dept = 'CHEM';
        else if (/biology|bio/i.test(lower)) dept = 'BIO';
        else if (/psychology/i.test(lower)) dept = 'PSYCH';
        else if (/writing|english|literature/i.test(lower)) dept = 'ENG';

        const codeNum = 100 + ((index + 1) * 10);
        const code = `${dept} ${codeNum}`;

        if (!seenCodes.has(code)) {
          seenCodes.add(code);

          // Intelligently parse credits from line instead of defaulting blindly to 3
          let credits = 3;
          const creditMatch = line.match(/(\d(?:\.\d)?)\s*(?:cr|credit|unit|hrs|hours|pts|points)/i) ||
                              line.match(/\b([1-6])\s*(?:u|c|cr|units?|credits?)\b/i) ||
                              line.match(/\b([1-6])(?:\.0)?\b/);
          if (creditMatch) {
            const parsedVal = Math.round(parseFloat(creditMatch[1]));
            if (parsedVal >= 1 && parsedVal <= 6) {
              credits = parsedVal;
            }
          }

          // Clean title
          const title = line.replace(/^[-*\d.)\s]+/, '').replace(/\s*\(\d+.*?\)/, '').trim() || `Requirement ${index + 1}`;

          extractedCourses.push({
            id: `extracted-fallback-${Date.now()}-${index}`,
            code,
            title,
            credits,
            category: dept === 'MATH' || dept === 'CS' ? 'core' : 'gen_ed',
            status: 'planned',
            termTaken: 'Planned Term'
          });
        }
      }
    });
  }

  if (extractedCourses.length === 0) {
    return {
      filename: file.name,
      success: false,
      coursesExtracted: [],
      message: 'No course requirements could be identified in the document.',
      error: 'Please ensure the document contains course names or course codes (e.g., CS 101, ECON 201).'
    };
  }

  return {
    filename: file.name,
    success: true,
    coursesExtracted: extractedCourses,
    message: `Successfully extracted ${extractedCourses.length} course requirement${extractedCourses.length > 1 ? 's' : ''} from ${file.name}!`
  };
}
