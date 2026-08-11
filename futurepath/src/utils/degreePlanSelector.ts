import { UniversityInfo, StudentProfile, DegreePlan, CourseRequirement } from '../types';

/**
 * Returns the exact degree plan tailored to the selected University and Student Major.
 * Works dynamically even if university object is not pre-populated in the database.
 */
export function getDegreePlanForProfile(university?: UniversityInfo | null, profile?: StudentProfile | null): DegreePlan | null {
  if (!profile || !profile.major || profile.major.trim() === '') {
    return null;
  }

  const rawMajor = profile.major.trim();
  const majorLower = rawMajor.toLowerCase();
  const uniName = university?.name || profile.customUniversityName || 'University';
  const termType = university?.termType || 'semester';
  const isQuarter = termType === 'quarter';
  const totalCredits = isQuarter ? 180 : 120;

  // 1. Try matching existing pre-configured degree plans for this university
  if (university?.degreePlans && university.degreePlans.length > 0) {
    const exactMatch = university.degreePlans.find(dp => 
      dp.majorName.toLowerCase() === majorLower ||
      dp.majorName.toLowerCase().includes(majorLower) ||
      majorLower.includes(dp.majorName.toLowerCase())
    );
    if (exactMatch && exactMatch.courses && exactMatch.courses.length > 0) {
      return exactMatch;
    }
  }

  // 2. Determine department code and major classification
  let deptPrefix = 'MAJOR';
  let majorCategory: 'tech' | 'business' | 'finance' | 'econ' | 'engineering' | 'bio' | 'psych' | 'math' | 'general' = 'general';

  if (/computer|software|artificial|cyber|tech|information technology|mis/i.test(majorLower)) {
    deptPrefix = 'CS';
    majorCategory = 'tech';
  } else if (/finance|banking|investment|fintech/i.test(majorLower)) {
    deptPrefix = 'FIN';
    majorCategory = 'finance';
  } else if (/accounting|audit|taxation/i.test(majorLower)) {
    deptPrefix = 'ACCT';
    majorCategory = 'finance';
  } else if (/marketing|brand|digital media/i.test(majorLower)) {
    deptPrefix = 'MKT';
    majorCategory = 'business';
  } else if (/management|business|operations|administration|supply chain/i.test(majorLower)) {
    deptPrefix = 'BUS';
    majorCategory = 'business';
  } else if (/mechanical|civil|electrical|aerospace|chemical|biomedical|engineering/i.test(majorLower)) {
    deptPrefix = 'ENG';
    majorCategory = 'engineering';
  } else if (/economics|econ/i.test(majorLower)) {
    deptPrefix = 'ECON';
    majorCategory = 'econ';
  } else if (/biology|health|medical|nursing|bio|pre-med/i.test(majorLower)) {
    deptPrefix = 'BIO';
    majorCategory = 'bio';
  } else if (/psychology|neuroscience|cognitive/i.test(majorLower)) {
    deptPrefix = 'PSY';
    majorCategory = 'psych';
  } else if (/math|statistics|data science|analytics/i.test(majorLower)) {
    deptPrefix = 'MATH';
    majorCategory = 'math';
  }

  const standing = profile.currentStanding || 'Junior';

  // Determine course statuses based on academic standing
  let s1: CourseRequirement['status'] = 'completed';
  let s2: CourseRequirement['status'] = 'completed';
  let s3: CourseRequirement['status'] = 'completed';
  let s4: CourseRequirement['status'] = 'completed';
  let s5: CourseRequirement['status'] = 'in_progress';
  let s6: CourseRequirement['status'] = 'in_progress';
  let s7: CourseRequirement['status'] = 'planned';
  let s8: CourseRequirement['status'] = 'planned';

  if (standing === 'Freshman') {
    s1 = 'completed';
    s2 = 'in_progress';
    s3 = 'planned';
    s4 = 'planned';
    s5 = 'planned';
    s6 = 'planned';
  } else if (standing === 'Sophomore') {
    s1 = 'completed';
    s2 = 'completed';
    s3 = 'in_progress';
    s4 = 'in_progress';
    s5 = 'planned';
    s6 = 'planned';
  } else if (standing === 'Senior' || standing.includes('Graduate')) {
    s1 = 'completed';
    s2 = 'completed';
    s3 = 'completed';
    s4 = 'completed';
    s5 = 'completed';
    s6 = 'in_progress';
    s7 = 'in_progress';
    s8 = 'planned';
  }

  // Generate realistic courses tailored to the specific major family
  let generatedCourses: CourseRequirement[] = [];

  if (majorCategory === 'tech') {
    generatedCourses = [
      { id: 'cs-101', code: 'CS 101', title: 'Structure & Interpretation of Computer Programs', credits: isQuarter ? 4 : 3, category: 'core', status: s1, termTaken: 'Fall 2024', grade: 'A', professor: 'Dr. Alan Turing' },
      { id: 'cs-102', code: 'CS 102', title: 'Data Structures & Object-Oriented Software Design', credits: isQuarter ? 4 : 3, category: 'core', status: s2, termTaken: 'Spring 2025', grade: 'A-', professor: 'Prof. Barbara Liskov' },
      { id: 'cs-201', code: 'CS 201', title: 'Computer Systems Assembly & Hardware Architecture', credits: isQuarter ? 4 : 3, category: 'core', status: s3, termTaken: 'Fall 2025', grade: 'B+', professor: 'Dr. John Hennessy' },
      { id: 'cs-301', code: 'CS 301', title: 'Design & Analysis of Efficient Algorithms', credits: isQuarter ? 4 : 3, category: 'core', status: s4, termTaken: 'Spring 2026', grade: 'A', professor: 'Dr. Donald Knuth' },
      { id: 'cs-330', code: 'CS 330', title: 'Operating Systems Principles & Networking', credits: isQuarter ? 4 : 3, category: 'core', status: s5, termTaken: 'Fall 2026', currentGrade: 'A', professor: 'Prof. Andrew Tanenbaum' },
      { id: 'cs-380', code: 'CS 380', title: 'Artificial Intelligence & Intelligent Agents', credits: isQuarter ? 4 : 3, category: 'major_elective', status: s6, termTaken: 'Fall 2026', currentGrade: 'A-', professor: 'Dr. Peter Norvig' },
      { id: 'cs-489', code: 'CS 489', title: 'Machine Learning & Deep Neural Architectures', credits: isQuarter ? 4 : 3, category: 'major_elective', status: s7, termTaken: 'Spring 2027', professor: 'Dr. Yann LeCun' },
      { id: 'cs-490', code: 'CS 490', title: 'Senior Software Engineering Capstone Practicum', credits: isQuarter ? 5 : 4, category: 'core', status: s8, termTaken: 'Spring 2027', professor: 'Prof. Martin Fowler' },
      { id: 'math-53', code: 'MATH 53', title: 'Linear Algebra & Multivariable Matrix Theory', credits: 4, category: 'prereq', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
      { id: 'stat-100', code: 'STAT 100', title: 'Probability Theory for Engineering & Computing', credits: 3, category: 'prereq', status: 'completed', termTaken: 'Spring 2025', grade: 'A-' },
      { id: 'colwrit-1a', code: 'WRIT 101', title: 'Academic Expository Writing & Critical Discourse', credits: 3, category: 'gen_ed', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
      { id: 'econ-1', code: 'ECON 1', title: 'Principles of Microeconomics & Market Behavior', credits: 3, category: 'gen_ed', status: 'completed', termTaken: 'Spring 2025', grade: 'A' }
    ];
  } else if (majorCategory === 'finance') {
    generatedCourses = [
      { id: 'fin-101', code: 'FIN 101', title: 'Principles of Corporate Finance & Valuation', credits: 3, category: 'core', status: s1, termTaken: 'Fall 2024', grade: 'A', professor: 'Dr. Eugene Fama' },
      { id: 'acct-201', code: 'ACCT 201', title: 'Financial Accounting & Statement Analysis', credits: 3, category: 'core', status: s2, termTaken: 'Spring 2025', grade: 'A', professor: 'Prof. Ray Ball' },
      { id: 'acct-202', code: 'ACCT 202', title: 'Managerial Accounting & Strategic Cost Analysis', credits: 3, category: 'core', status: s3, termTaken: 'Fall 2025', grade: 'A-', professor: 'Dr. Robert Kaplan' },
      { id: 'fin-310', code: 'FIN 310', title: 'Investments, Asset Pricing & Portfolio Management', credits: 3, category: 'core', status: s4, termTaken: 'Spring 2026', grade: 'B+', professor: 'Dr. Harry Markowitz' },
      { id: 'fin-320', code: 'FIN 320', title: 'Financial Modeling, Excel LBO & M&A Valuation', credits: 3, category: 'core', status: s5, termTaken: 'Fall 2026', currentGrade: 'A', professor: 'Prof. Aswath Damodaran' },
      { id: 'fin-410', code: 'FIN 410', title: 'Derivatives, Options Pricing & Risk Management', credits: 3, category: 'major_elective', status: s6, termTaken: 'Fall 2026', currentGrade: 'A-', professor: 'Dr. Myron Scholes' },
      { id: 'fin-480', code: 'FIN 480', title: 'FinTech, Algorithmic Trading & Blockchain Finance', credits: 3, category: 'major_elective', status: s7, termTaken: 'Spring 2027', professor: 'Dr. Andrew Lo' },
      { id: 'fin-490', code: 'FIN 490', title: 'Senior Investment Banking Capstone Project', credits: 4, category: 'core', status: s8, termTaken: 'Spring 2027', professor: 'Prof. Michael Jensen' },
      { id: 'econ-101', code: 'ECON 101', title: 'Intermediate Microeconomic Analysis', credits: 3, category: 'prereq', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
      { id: 'stat-200', code: 'STAT 200', title: 'Business Statistics & Econometric Inference', credits: 3, category: 'prereq', status: 'completed', termTaken: 'Spring 2025', grade: 'A-' }
    ];
  } else if (majorCategory === 'business') {
    generatedCourses = [
      { id: 'bus-101', code: 'BUS 101', title: 'Foundations of Global Business & Leadership', credits: 3, category: 'core', status: s1, termTaken: 'Fall 2024', grade: 'A', professor: 'Dr. Peter Drucker' },
      { id: 'mkt-301', code: 'MKT 301', title: 'Strategic Marketing & Consumer Behavior', credits: 3, category: 'core', status: s2, termTaken: 'Spring 2025', grade: 'A', professor: 'Dr. Philip Kotler' },
      { id: 'acct-201', code: 'ACCT 201', title: 'Financial Accounting for Decision Makers', credits: 3, category: 'core', status: s3, termTaken: 'Fall 2025', grade: 'A-', professor: 'Prof. David Solomon' },
      { id: 'bus-310', code: 'BUS 310', title: 'Organizational Behavior & Change Management', credits: 3, category: 'core', status: s4, termTaken: 'Spring 2026', grade: 'B+', professor: 'Dr. Amy Edmondson' },
      { id: 'bus-350', code: 'BUS 350', title: 'Operations Management & Supply Chain Analytics', credits: 3, category: 'core', status: s5, termTaken: 'Fall 2026', currentGrade: 'A', professor: 'Prof. Steven Spear' },
      { id: 'mkt-350', code: 'MKT 350', title: 'Digital Growth Marketing & Data Analytics', credits: 3, category: 'major_elective', status: s6, termTaken: 'Fall 2026', currentGrade: 'A-', professor: 'Dr. Jonah Berger' },
      { id: 'bus-410', code: 'BUS 410', title: 'Global Competitive Strategy & Innovation', credits: 3, category: 'major_elective', status: s7, termTaken: 'Spring 2027', professor: 'Dr. Michael Porter' },
      { id: 'bus-490', code: 'BUS 490', title: 'Senior Executive Business Strategy Capstone', credits: 4, category: 'core', status: s8, termTaken: 'Spring 2027', professor: 'Prof. Clay Christensen' },
      { id: 'econ-1', code: 'ECON 1', title: 'Principles of Economics & Market Systems', credits: 3, category: 'gen_ed', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
      { id: 'bus-210', code: 'BUS 210', title: 'Business Law, Contracts & Ethics', credits: 3, category: 'gen_ed', status: 'completed', termTaken: 'Spring 2025', grade: 'A-' }
    ];
  } else if (majorCategory === 'engineering') {
    generatedCourses = [
      { id: 'eng-101', code: 'ENG 101', title: 'Engineering CAD Design & 3D Modeling Fundamentals', credits: 3, category: 'core', status: s1, termTaken: 'Fall 2024', grade: 'A', professor: 'Dr. James Watt' },
      { id: 'eng-201', code: 'ENG 201', title: 'Statics, Dynamics & Mechanical Vector Analysis', credits: 3, category: 'core', status: s2, termTaken: 'Spring 2025', grade: 'A-', professor: 'Prof. Stephen Timoshenko' },
      { id: 'eng-210', code: 'ENG 210', title: 'Electric Circuits, Signals & System Analysis', credits: 4, category: 'core', status: s3, termTaken: 'Fall 2025', grade: 'B+', professor: 'Dr. Claude Shannon' },
      { id: 'eng-301', code: 'ENG 301', title: 'Fluid Mechanics & Applied Thermodynamics', credits: 3, category: 'core', status: s4, termTaken: 'Spring 2026', grade: 'A', professor: 'Dr. Osborne Reynolds' },
      { id: 'eng-320', code: 'ENG 320', title: 'Control Systems & Embedded Mechatronics', credits: 3, category: 'core', status: s5, termTaken: 'Fall 2026', currentGrade: 'A', professor: 'Prof. Rudolf Kalman' },
      { id: 'eng-410', code: 'ENG 410', title: 'Finite Element Analysis & Stress Modeling', credits: 3, category: 'major_elective', status: s6, termTaken: 'Fall 2026', currentGrade: 'A-', professor: 'Dr. Olgierd Zienkiewicz' },
      { id: 'eng-480', code: 'ENG 480', title: 'Robotics, Sensors & Autonomous Systems Design', credits: 3, category: 'major_elective', status: s7, termTaken: 'Spring 2027', professor: 'Dr. Sebastian Thrun' },
      { id: 'eng-490', code: 'ENG 490', title: 'Senior Engineering Capstone Multi-Disciplinary Project', credits: 4, category: 'core', status: s8, termTaken: 'Spring 2027', professor: 'Prof. Kelly Johnson' },
      { id: 'phys-101', code: 'PHYS 101', title: 'University Physics I: Calculus-based Mechanics', credits: 4, category: 'prereq', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
      { id: 'math-250', code: 'MATH 250', title: 'Differential Equations & Vector Calculus', credits: 4, category: 'prereq', status: 'completed', termTaken: 'Spring 2025', grade: 'A-' }
    ];
  } else if (majorCategory === 'econ') {
    generatedCourses = [
      { id: 'econ-1', code: 'ECON 1', title: 'Principles of Microeconomics', credits: 3, category: 'core', status: s1, termTaken: 'Fall 2024', grade: 'A', professor: 'Dr. N. Gregory Mankiw' },
      { id: 'econ-2', code: 'ECON 2', title: 'Principles of Macroeconomics', credits: 3, category: 'core', status: s2, termTaken: 'Spring 2025', grade: 'A', professor: 'Dr. Paul Krugman' },
      { id: 'econ-100a', code: 'ECON 100A', title: 'Intermediate Microeconomic Theory & Game Strategy', credits: 4, category: 'core', status: s3, termTaken: 'Fall 2025', grade: 'A-', professor: 'Dr. Hal Varian' },
      { id: 'econ-100b', code: 'ECON 100B', title: 'Intermediate Macroeconomic Dynamics & Growth', credits: 4, category: 'core', status: s4, termTaken: 'Spring 2026', grade: 'B+', professor: 'Dr. Olivier Blanchard' },
      { id: 'econ-140', code: 'ECON 140', title: 'Econometrics & Causal Inference Data Science', credits: 4, category: 'core', status: s5, termTaken: 'Fall 2026', currentGrade: 'A', professor: 'Dr. Joshua Angrist' },
      { id: 'econ-136', code: 'ECON 136', title: 'Financial Economics & Empirical Market Microstructure', credits: 4, category: 'major_elective', status: s6, termTaken: 'Fall 2026', currentGrade: 'A-', professor: 'Dr. Robert Shiller' },
      { id: 'econ-180', code: 'ECON 180', title: 'International Trade & Global Macroeconomic Policy', credits: 4, category: 'major_elective', status: s7, termTaken: 'Spring 2027', professor: 'Dr. Maurice Obstfeld' },
      { id: 'econ-190', code: 'ECON 190', title: 'Senior Economics Empirical Thesis & Honors Seminar', credits: 4, category: 'core', status: s8, termTaken: 'Spring 2027', professor: 'Prof. Janet Yellen' },
      { id: 'math-1a', code: 'MATH 1A', title: 'Single Variable Differential & Integral Calculus', credits: 4, category: 'prereq', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
      { id: 'stat-20', code: 'STAT 20', title: 'Probability & Statistical Reasoning for Social Sciences', credits: 4, category: 'prereq', status: 'completed', termTaken: 'Spring 2025', grade: 'A-' }
    ];
  } else if (majorCategory === 'bio') {
    generatedCourses = [
      { id: 'bio-101', code: 'BIO 101', title: 'General Biology I: Cellular Biology & Genetics', credits: 4, category: 'core', status: s1, termTaken: 'Fall 2024', grade: 'A', professor: 'Dr. Jennifer Doudna' },
      { id: 'bio-102', code: 'BIO 102', title: 'General Biology II: Organismal Biology & Evolution', credits: 4, category: 'core', status: s2, termTaken: 'Spring 2025', grade: 'A-', professor: 'Dr. Edward O. Wilson' },
      { id: 'chem-101', code: 'CHEM 101', title: 'General Chemistry I with Quantitative Laboratory', credits: 4, category: 'prereq', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
      { id: 'chem-201', code: 'CHEM 201', title: 'Organic Chemistry I & Reaction Mechanisms', credits: 4, category: 'core', status: s3, termTaken: 'Fall 2025', grade: 'B+', professor: 'Dr. Elias J. Corey' },
      { id: 'chem-202', code: 'CHEM 202', title: 'Organic Chemistry II & Chemical Synthesis', credits: 4, category: 'core', status: s4, termTaken: 'Spring 2026', grade: 'A', professor: 'Dr. Carolyn Bertozzi' },
      { id: 'bio-301', code: 'BIO 301', title: 'Molecular Genetics, CRISPR & Genomics', credits: 4, category: 'core', status: s5, termTaken: 'Fall 2026', currentGrade: 'A', professor: 'Prof. Eric Lander' },
      { id: 'bio-320', code: 'BIO 320', title: 'Human Anatomy & Physiology I with Cadaver Lab', credits: 4, category: 'major_elective', status: s6, termTaken: 'Fall 2026', currentGrade: 'A-', professor: 'Dr. Henry Gray' },
      { id: 'bio-350', code: 'BIO 350', title: 'Biochemistry & Metabolic Regulation', credits: 4, category: 'major_elective', status: s7, termTaken: 'Spring 2027', professor: 'Dr. Albert Lehninger' },
      { id: 'bio-490', code: 'BIO 490', title: 'Senior Biomedical Research Capstone Seminar', credits: 4, category: 'core', status: s8, termTaken: 'Spring 2027', professor: 'Prof. Elizabeth Blackburn' }
    ];
  } else if (majorCategory === 'psych') {
    generatedCourses = [
      { id: 'psy-101', code: 'PSY 101', title: 'General Psychology & Human Behavioral Science', credits: 3, category: 'core', status: s1, termTaken: 'Fall 2024', grade: 'A', professor: 'Dr. Steven Pinker' },
      { id: 'psy-201', code: 'PSY 201', title: 'Developmental Psychology Across the Lifespan', credits: 3, category: 'core', status: s2, termTaken: 'Spring 2025', grade: 'A', professor: 'Dr. Jean Piaget' },
      { id: 'psy-210', code: 'PSY 210', title: 'Research Methods & Experimental Psychology', credits: 4, category: 'core', status: s3, termTaken: 'Fall 2025', grade: 'A-', professor: 'Dr. Elizabeth Loftus' },
      { id: 'psy-301', code: 'PSY 301', title: 'Cognitive Neuroscience & Brain Imaging Methods', credits: 4, category: 'core', status: s4, termTaken: 'Spring 2026', grade: 'B+', professor: 'Dr. Michael Gazzaniga' },
      { id: 'psy-330', code: 'PSY 330', title: 'Abnormal Psychology & Clinical Diagnosis', credits: 3, category: 'core', status: s5, termTaken: 'Fall 2026', currentGrade: 'A', professor: 'Dr. Aaron Beck' },
      { id: 'psy-350', code: 'PSY 350', title: 'Social Psychology & Group Decision Making', credits: 3, category: 'major_elective', status: s6, termTaken: 'Fall 2026', currentGrade: 'A-', professor: 'Dr. Philip Zimbardo' },
      { id: 'cogsci-100', code: 'COGSCI 100', title: 'Mind, Brain, Artificial Intelligence & HCI', credits: 4, category: 'major_elective', status: s7, termTaken: 'Spring 2027', professor: 'Dr. Daniel Kahneman' },
      { id: 'psy-490', code: 'PSY 490', title: 'Senior Psychology Honors Thesis & Lab Seminar', credits: 4, category: 'core', status: s8, termTaken: 'Spring 2027', professor: 'Prof. Carol Dweck' },
      { id: 'stat-20', code: 'STAT 20', title: 'Introductory Applied Statistics for Social Sciences', credits: 3, category: 'prereq', status: 'completed', termTaken: 'Fall 2024', grade: 'A' }
    ];
  } else {
    // General fallback for any other major (e.g. Political Science, History, Communications, Architecture, Music, Art)
    generatedCourses = [
      { id: `${deptPrefix.toLowerCase()}-101`, code: `${deptPrefix} 101`, title: `Foundations of ${rawMajor}`, credits: isQuarter ? 4 : 3, category: 'core', status: s1, termTaken: 'Fall 2024', grade: 'A', professor: `Prof. J. Smith` },
      { id: `${deptPrefix.toLowerCase()}-201`, code: `${deptPrefix} 201`, title: `Analytical Methods & Theory in ${rawMajor}`, credits: isQuarter ? 4 : 3, category: 'core', status: s2, termTaken: 'Spring 2025', grade: 'A-', professor: `Prof. M. Johnson` },
      { id: `${deptPrefix.toLowerCase()}-301`, code: `${deptPrefix} 301`, title: `Intermediate ${rawMajor} Seminar`, credits: isQuarter ? 4 : 3, category: 'core', status: s3, termTaken: 'Fall 2025', grade: 'B+', professor: `Dr. C. Williams` },
      { id: `${deptPrefix.toLowerCase()}-350`, code: `${deptPrefix} 350`, title: `Applied Research & Case Studies in ${rawMajor}`, credits: isQuarter ? 4 : 3, category: 'core', status: s4, termTaken: 'Spring 2026', grade: 'A', professor: `Dr. R. Davis` },
      { id: `${deptPrefix.toLowerCase()}-410`, code: `${deptPrefix} 410`, title: `Advanced Topics & Contemporary Issues in ${rawMajor}`, credits: isQuarter ? 4 : 3, category: 'major_elective', status: s5, termTaken: 'Fall 2026', currentGrade: 'A', professor: `Prof. S. Miller` },
      { id: `${deptPrefix.toLowerCase()}-420`, code: `${deptPrefix} 420`, title: `Specialized Elective in ${rawMajor} Practice`, credits: isQuarter ? 4 : 3, category: 'major_elective', status: s6, termTaken: 'Fall 2026', currentGrade: 'A-', professor: `Dr. H. Wilson` },
      { id: `${deptPrefix.toLowerCase()}-480`, code: `${deptPrefix} 480`, title: `Global & Professional Frameworks in ${rawMajor}`, credits: isQuarter ? 4 : 3, category: 'major_elective', status: s7, termTaken: 'Spring 2027', professor: `Prof. E. Taylor` },
      { id: `${deptPrefix.toLowerCase()}-490`, code: `${deptPrefix} 490`, title: `Senior Capstone & Research Thesis in ${rawMajor}`, credits: isQuarter ? 5 : 4, category: 'core', status: s8, termTaken: 'Spring 2027', professor: `Dr. A. Anderson` },
      { id: `writ-101`, code: `WRIT 101`, title: 'Academic Expository Writing & Critical Analysis', credits: 3, category: 'gen_ed', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
      { id: `stat-100`, code: `STAT 100`, title: 'Quantitative Data Reasoning & Inference', credits: 3, category: 'prereq', status: 'completed', termTaken: 'Spring 2025', grade: 'A-' }
    ];
  }

  return {
    majorName: rawMajor,
    degreeType: profile.degreeType || (isQuarter ? 'BS' : 'BS'),
    requiredCredits: totalCredits,
    courses: generatedCourses,
    guidedElectiveGroups: [
      {
        id: 'grp-1',
        groupName: `${rawMajor} Upper-Division Track Electives`,
        requiredCount: 2,
        description: 'Select approved upper-division courses to fulfill degree concentration requirements.',
        options: [
          {
            id: `${deptPrefix.toLowerCase()}-481`,
            code: `${deptPrefix} 481`,
            title: `Advanced Analytics & Strategy in ${rawMajor.split(' ')[0]}`,
            credits: 3,
            category: 'major_elective',
            status: 'planned'
          },
          {
            id: `${deptPrefix.toLowerCase()}-482`,
            code: `${deptPrefix} 482`,
            title: `Ethics, Governance & Policy in ${rawMajor.split(' ')[0]}`,
            credits: 3,
            category: 'major_elective',
            status: 'planned'
          }
        ]
      }
    ]
  };
}
