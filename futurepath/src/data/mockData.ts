import { UniversityInfo, StudentProfile, JobOpportunity, CompanyReleaseTrackerItem, TimelineMilestone, CoachPersona, ActionPlanItem, AcademicCalendarEvent } from '../types';

export const UNIVERSITIES: UniversityInfo[] = [
  {
    id: 'ucb',
    name: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    termType: 'semester',
    offeredDegreeTypes: [
      "Bachelor's Degree (B.S., B.A., B.A.S., B.B.A., B.Eng.)",
      "Master's Degree (M.S., M.A., M.B.A., M.Eng., M.P.P.)",
      "Doctorate / PhD (Ph.D., Sc.D., Ed.D.)"
    ],
    offeredMajors: [
      'Computer Science',
      'Computer Science & Data Science',
      'Electrical Engineering & Computer Sciences (EECS)',
      'Data Science',
      'Industrial Engineering & Operations Research (IEOR)',
      'Bioengineering',
      'Mechanical Engineering',
      'Civil & Environmental Engineering',
      'Chemical Engineering',
      'Economics',
      'Business Administration (Haas)',
      'Statistics',
      'Applied Mathematics',
      'Physics',
      'Cognitive Science',
      'Political Science',
      'Molecular & Cell Biology',
      'Psychology'
    ],
    offeredMinors: [
      'Data Science Minor',
      'Computer Science Minor',
      'Economics Minor',
      'Statistics Minor',
      'Public Policy Minor',
      'Electrical Engineering Minor',
      'Business Administration Minor',
      'Cognitive Science Minor'
    ],
    calendarEvents: [
      { id: 'ucb-1', title: 'Fall Semester Begins', category: 'academic', startDate: '2026-08-24', endDate: '2026-08-24', description: 'Instruction begins for Fall semester.' },
      { id: 'ucb-2', title: 'Fall Career Fair Week', category: 'registration', startDate: '2026-09-14', endDate: '2026-09-18', description: 'Annual EECS & Business Engineering Career Fair.' },
      { id: 'ucb-3', title: 'Course Drop Deadline (without fee)', category: 'deadline', startDate: '2026-09-25', endDate: '2026-09-25', description: 'Final day to drop classes on CalCentral without penalty.' },
      { id: 'ucb-4', title: 'Midterm Exam Period', category: 'exam', startDate: '2026-10-12', endDate: '2026-10-23', description: 'Midterm examinations across major departments.' },
      { id: 'ucb-5', title: 'Spring Registration Opens', category: 'registration', startDate: '2026-10-26', endDate: '2026-11-06', description: 'Phase 1 registration window for upcoming term.' },
      { id: 'ucb-6', title: 'Fall Final Examinations', category: 'exam', startDate: '2026-12-14', endDate: '2026-12-18', description: 'Final exam week.' },
      { id: 'ucb-7', title: 'Spring Semester Starts', category: 'academic', startDate: '2027-01-19', endDate: '2027-01-19', description: 'Spring instruction begins.' },
      { id: 'ucb-8', title: 'Spring Career & Tech Expo', category: 'registration', startDate: '2027-02-10', endDate: '2027-02-12', description: 'Spring campus hiring event.' },
      { id: 'ucb-9', title: 'Graduation Application Filing Deadline', category: 'deadline', startDate: '2027-03-15', endDate: '2027-03-15', description: 'Filing degree completion intent for May commencement.' }
    ],
    degreePlans: [
      {
        majorName: 'Computer Science & Data Science',
        degreeType: 'BS',
        requiredCredits: 120,
        courses: [
          { id: 'cs-61a', code: 'CS 61A', title: 'Structure and Interpretation of Computer Programs', credits: 4, category: 'core', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
          { id: 'cs-61b', code: 'CS 61B', title: 'Data Structures & Algorithms', credits: 4, category: 'core', status: 'completed', termTaken: 'Spring 2025', grade: 'A-' },
          { id: 'cs-61c', code: 'CS 61C', title: 'Machine Structures', credits: 4, category: 'core', status: 'completed', termTaken: 'Fall 2025', grade: 'B+' },
          { id: 'cs-170', code: 'CS 170', title: 'Efficient Algorithms and Intractable Problems', credits: 4, category: 'core', status: 'in_progress', termTaken: 'Fall 2026', currentGrade: 'A' },
          { id: 'cs-188', code: 'CS 188', title: 'Introduction to Artificial Intelligence', credits: 4, category: 'major_elective', status: 'in_progress', termTaken: 'Fall 2026', currentGrade: 'A-' },
          { id: 'cs-162', code: 'CS 162', title: 'Operating Systems and System Programming', credits: 4, category: 'core', status: 'planned', termTaken: 'Spring 2027' },
          { id: 'ds-100', code: 'DATA 100', title: 'Principles & Techniques of Data Science', credits: 4, category: 'core', status: 'completed', termTaken: 'Spring 2025', grade: 'A' },
          { id: 'cs-189', code: 'CS 189', title: 'Introduction to Machine Learning', credits: 4, category: 'major_elective', status: 'planned', termTaken: 'Spring 2027' },
          { id: 'math-54', code: 'MATH 54', title: 'Linear Algebra and Differential Equations', credits: 4, category: 'prereq', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
          { id: 'ee-126', code: 'EE 126', title: 'Probability and Random Processes', credits: 4, category: 'major_elective', status: 'planned', termTaken: 'Fall 2027' },
          { id: 'engl-1a', code: 'COLWRIT R1A', title: 'College Writing & Critical Reading', credits: 4, category: 'gen_ed', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
          { id: 'econ-1', code: 'ECON 1', title: 'Introduction to Economics', credits: 4, category: 'gen_ed', status: 'completed', termTaken: 'Spring 2025', grade: 'A' }
        ]
      }
    ]
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    location: 'Stanford, CA',
    termType: 'quarter',
    offeredDegreeTypes: [
      "Bachelor's Degree (B.S., B.A., B.A.S., B.B.A., B.Eng.)",
      "Master's Degree (M.S., M.A., M.B.A., M.Eng., M.P.P.)",
      "Doctorate / PhD (Ph.D., Sc.D., Ed.D.)"
    ],
    offeredMajors: [
      'Computer Science',
      'Artificial Intelligence & Machine Learning',
      'Symbolic Systems',
      'Mathematical & Computational Science',
      'Electrical Engineering',
      'Data Science & Social Systems',
      'Mechanical Engineering',
      'Management Science & Engineering (MS&E)',
      'Economics',
      'Bioengineering',
      'Product Design',
      'Human Biology',
      'Psychology'
    ],
    offeredMinors: [
      'Computer Science Minor',
      'Economics Minor',
      'Statistics Minor',
      'Management Science & Engineering Minor'
    ],
    calendarEvents: [
      { id: 'stan-1', title: 'Autumn Quarter Instruction Starts', category: 'academic', startDate: '2026-09-21', endDate: '2026-09-21', description: 'Autumn Quarter classes begin.' },
      { id: 'stan-2', title: 'Computer Science Career Fair', category: 'registration', startDate: '2026-10-06', endDate: '2026-10-06', description: 'Top tech recruiter campus showcase.' },
      { id: 'stan-3', title: 'Autumn Midterm Period', category: 'exam', startDate: '2026-10-26', endDate: '2026-11-06', description: 'Midterms across departments.' },
      { id: 'stan-4', title: 'Winter Quarter Registration', category: 'registration', startDate: '2026-11-16', endDate: '2026-11-20', description: 'Axess registration opens.' },
      { id: 'stan-5', title: 'Autumn Quarter End Examinations', category: 'exam', startDate: '2026-12-07', endDate: '2026-12-11', description: 'Final exams for Autumn Quarter.' }
    ],
    degreePlans: [
      {
        majorName: 'Computer Science (AI Track)',
        degreeType: 'BS',
        requiredCredits: 180,
        courses: [
          { id: 'cs-106b', code: 'CS 106B', title: 'Programming Abstractions', credits: 5, category: 'core', status: 'completed', termTaken: 'Autumn 2024', grade: 'A' },
          { id: 'cs-107', code: 'CS 107', title: 'Computer Organization & Systems', credits: 5, category: 'core', status: 'completed', termTaken: 'Winter 2025', grade: 'A-' },
          { id: 'cs-110', code: 'CS 110', title: 'Principles of Computer Systems', credits: 5, category: 'core', status: 'in_progress', termTaken: 'Autumn 2026', currentGrade: 'A' },
          { id: 'cs-221', code: 'CS 221', title: 'Artificial Intelligence: Principles and Techniques', credits: 4, category: 'major_elective', status: 'planned', termTaken: 'Winter 2027' },
          { id: 'cs-229', code: 'CS 229', title: 'Machine Learning', credits: 4, category: 'major_elective', status: 'planned', termTaken: 'Spring 2027' }
        ]
      }
    ]
  },
  {
    id: 'nyu',
    name: 'New York University (Stern / CAS)',
    location: 'New York, NY',
    termType: 'semester',
    offeredDegreeTypes: [
      "Bachelor's Degree (B.S., B.A., B.A.S., B.B.A., B.Eng.)",
      "Master's Degree (M.S., M.A., M.B.A., M.Eng., M.P.P.)"
    ],
    offeredMajors: [
      'Finance & Statistics',
      'Computer Science',
      'Economics',
      'Data Science',
      'Business Administration',
      'Marketing & Digital Media',
      'Accounting',
      'International Relations',
      'Applied Psychology',
      'Neural Science',
      'Mathematics'
    ],
    offeredMinors: [
      'Computer Science Minor',
      'Finance Minor',
      'Economics Minor',
      'Data Science Minor'
    ],
    calendarEvents: [
      { id: 'nyu-1', title: 'Fall Classes Begin', category: 'academic', startDate: '2026-09-02', endDate: '2026-09-02', description: 'Fall semester instruction.' },
      { id: 'nyu-2', title: 'Wall Street & Finance Recruiting Summit', category: 'registration', startDate: '2026-09-18', endDate: '2026-09-18', description: 'On-campus interviews for banking & consulting.' },
      { id: 'nyu-3', title: 'Midterm Assessment Window', category: 'exam', startDate: '2026-10-15', endDate: '2026-10-30', description: 'Midterm week.' }
    ],
    degreePlans: [
      {
        majorName: 'Finance & Statistics',
        degreeType: 'BS',
        requiredCredits: 128,
        courses: [
          { id: 'fin-1', code: 'FINC-UB 2', title: 'Foundations of Finance', credits: 4, category: 'core', status: 'completed', termTaken: 'Fall 2024', grade: 'A' },
          { id: 'fin-2', code: 'FINC-UB 7', title: 'Corporate Finance', credits: 4, category: 'core', status: 'completed', termTaken: 'Spring 2025', grade: 'A' },
          { id: 'stat-1', code: 'STAT-UB 103', title: 'Applied Statistics', credits: 4, category: 'core', status: 'in_progress', termTaken: 'Fall 2026', currentGrade: 'A' }
        ]
      }
    ]
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology (MIT)',
    location: 'Cambridge, MA',
    termType: 'semester',
    offeredDegreeTypes: [
      "Bachelor's Degree (B.S., B.A., B.A.S., B.B.A., B.Eng.)",
      "Master's Degree (M.S., M.A., M.B.A., M.Eng., M.P.P.)",
      "Doctorate / PhD (Ph.D., Sc.D., Ed.D.)"
    ],
    offeredMajors: [
      'Computer Science & Engineering (6-3)',
      'Artificial Intelligence & Decision Making (6-4)',
      'Electrical Science & Engineering (6-1)',
      'Mathematics with Computer Science (18-C)',
      'Mechanical Engineering (2)',
      'Physics (8)',
      'Biological Engineering (20)',
      'Aerospace Engineering (16)',
      'Management / Finance (15)',
      'Materials Science & Engineering (3)',
      'Chemical Engineering (10)'
    ],
    offeredMinors: [
      'Computer Science Minor',
      'Management Minor',
      'Economics Minor',
      'Energy Studies Minor'
    ],
    calendarEvents: [
      { id: 'mit-1', title: 'Fall Term Begins', category: 'academic', startDate: '2026-09-09', endDate: '2026-09-09', description: 'Classes commence.' },
      { id: 'mit-2', title: 'MIT Fall Career Fair', category: 'registration', startDate: '2026-09-25', endDate: '2026-09-25', description: 'All-institution career fair.' }
    ],
    degreePlans: []
  },
  {
    id: 'utaustin',
    name: 'University of Texas at Austin',
    location: 'Austin, TX',
    termType: 'semester',
    offeredDegreeTypes: [
      "Bachelor's Degree (B.S., B.A., B.A.S., B.B.A., B.Eng.)",
      "Master's Degree (M.S., M.A., M.B.A., M.Eng., M.P.P.)"
    ],
    offeredMajors: [
      'Computer Science',
      'Electrical & Computer Engineering',
      'Data Science',
      'Business Honors / Finance',
      'Mechanical Engineering',
      'Biomedical Engineering',
      'Chemical Engineering',
      'Economics',
      'Mathematics',
      'Management Information Systems (MIS)',
      'Accounting'
    ],
    offeredMinors: [
      'Computer Science Minor',
      'Business Administration Minor',
      'Economics Minor',
      'Elements of Computing Minor'
    ],
    calendarEvents: [
      { id: 'ut-1', title: 'Fall Semester Begins', category: 'academic', startDate: '2026-08-26', endDate: '2026-08-26', description: 'First class day.' },
      { id: 'ut-2', title: 'Engineering & Business Expo', category: 'registration', startDate: '2026-09-15', endDate: '2026-09-17', description: 'Fall recruiting kickoff.' }
    ],
    degreePlans: []
  }
];

export function getResetUniversities(): UniversityInfo[] {
  return UNIVERSITIES.map(u => ({
    ...u,
    degreePlans: u.degreePlans.map(dp => ({
      ...dp,
      courses: dp.courses.map(c => ({
        ...c,
        status: 'planned' as const,
        grade: undefined,
        currentGrade: undefined,
        termTaken: undefined
      }))
    }))
  }));
}

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  id: 'student-101',
  firstName: 'Alex',
  lastName: 'Chen',
  fullName: 'Alex Chen',
  email: 'alex.chen@example.edu',
  universityId: '',
  customUniversityName: '',
  major: '',
  degreeType: '',
  expectedGraduationDate: '',
  graduationYear: undefined,
  graduationMonth: '',
  currentStanding: '',
  gpa: '',
  relevantCoursework: [],
  targetCompanies: ['Google', 'Meta', 'Stripe', 'Anthropic', 'Citadel', 'Nvidia', 'Databricks', 'Apple', 'Microsoft'],
  targetJobTitles: ['Software Engineer', 'AI / ML Engineer', 'Data Scientist', 'Quantitative Researcher'],
  targetIndustries: ['Technology & AI', 'Fintech', 'Quantitative Finance'],
  preferredLocations: ['San Francisco Bay Area, CA', 'New York City, NY', 'Seattle, WA', 'Remote (US Only)'],
  preferredWorkModes: ['Hybrid', 'Remote', 'On-site'],
  targetTerms: ['Summer 2027 Internship', 'Fall 2026 Co-Op', '2027 Full-Time New Grad'],
  compensationGoalType: 'salary',
  salaryGoals: '$120,000 - $160,000 / yr (Full-time)',
  hourlyMinRate: '50',
  hourlyMaxRate: '75',
  workAuthorization: 'US Citizen / Permanent Resident',
  resumeText: `ALEX CHEN
San Francisco, CA | alex.chen@example.edu | linkedin.com/in/alexchen-dev | github.com/alexchen-dev

TECHNICAL SKILLS
• Languages: Python, TypeScript/JavaScript, C++, Java, SQL, HTML/CSS
• Frameworks & Tools: React, Node.js, Express, PyTorch, Tailwind CSS, Docker, Git, PostgreSQL, REST APIs

EXPERIENCE
Software Engineering Intern — TechNova Labs (San Francisco, CA) | Jun 2025 – Aug 2025
• Built a real-time data streaming dashboard using React, TypeScript, and WebSockets serving 10,000+ daily active users.
• Optimized PostgreSQL query execution plans, reducing API endpoint response latency by 35%.
• Collaborated with senior engineers in an Agile team to ship 14 frontend features and 6 backend endpoints.

Undergraduate AI Research Assistant — Campus AI Lab | Jan 2025 – Present
• Developed automated Python data preprocessing pipelines for multimodal Transformer models training datasets.
• Benchmark-tested LLM inference latency across GPU configurations, writing evaluation scripts in PyTorch.

PROJECTS
AlignAI / Pathways — AI Student Career Agent (Python, React, Gemini API, Express) | Sep 2025
• Designed a full-stack student career command center with automated resume keyword extraction and degree tracking.
• Integrated LLM function calling to auto-generate personalized 90-day recruiting roadmaps.

Smart Portfolio Quant Backtester (Python, Pandas, FastAPI) | Jan 2025
• Developed a vectorised backtesting framework simulating algorithmic momentum trading strategies on S&P 500 stocks.`,
  resumeFilename: 'Alex_Chen_Resume_2026.pdf',
  skills: [
    { name: 'Python', category: 'technical', level: 'Advanced' },
    { name: 'TypeScript / React', category: 'technical', level: 'Advanced' },
    { name: 'Data Structures & Algorithms', category: 'technical', level: 'Advanced' },
    { name: 'PyTorch / ML Basics', category: 'technical', level: 'Intermediate' },
    { name: 'SQL & PostgreSQL', category: 'technical', level: 'Intermediate' },
    { name: 'System Design Basics', category: 'technical', level: 'Beginner' },
    { name: 'Agile & Git', category: 'tool', level: 'Advanced' },
    { name: 'Technical Communication', category: 'soft', level: 'Advanced' }
  ],
  experiences: [
    {
      id: 'exp-1',
      title: 'Software Engineering Intern',
      organization: 'TechNova Labs',
      type: 'internship',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      description: 'Built real-time data streaming dashboard in React/TypeScript, optimized SQL queries by 35%.',
      skillsUsed: ['React', 'TypeScript', 'WebSockets', 'PostgreSQL']
    },
    {
      id: 'exp-2',
      title: 'Undergraduate Research Assistant',
      organization: 'Berkeley AI Research (BAIR)',
      type: 'research',
      startDate: '2025-01-15',
      endDate: 'Present',
      description: 'Developing data preprocessing pipelines and LLM inference benchmarking scripts in PyTorch.',
      skillsUsed: ['Python', 'PyTorch', 'Data Pipelines', 'LLMs']
    }
  ],
  extracurriculars: [
    'Member, Association for Computing Machinery (ACM @ Berkeley)',
    'Project Lead, CS Undergraduate Mentorship Program',
    'Competitor, Cal Hacks 2025 (Top 10 Finalist)'
  ]
};

export const INITIAL_JOB_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
    role: 'Software Engineering Intern (Summer 2027)',
    type: 'Internship',
    jobType: 'Internship',
    source: 'Levels.fyi',
    category: 'Software Engineering & Cloud',
    location: 'San Francisco, CA / Seattle, WA',
    salaryRange: '$62 - $70 / hr + Housing Stipend',
    deadline: '2026-09-30',
    status: 'interviewing',
    fitScore: 94,
    priorityScore: 98,
    requirements: ['Data Structures', 'TypeScript/Python', 'API Design', 'Distributed Systems Basics'],
    notes: 'Passed initial coding assessment! Technical Phone Interview scheduled for Sept 18th.',
    url: 'https://stripe.com/jobs'
  },
  {
    id: 'job-1b',
    company: 'Google',
    logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&q=80',
    role: 'Software Engineer, University Graduate (Full-Time 2027)',
    type: 'Full-time',
    jobType: 'Full-Time New Grad',
    source: 'Handshake',
    category: 'Software Engineering & Cloud',
    location: 'Mountain View, CA / Seattle, WA / New York, NY',
    salaryRange: '$135,000 - $160,000 / yr + Equity & Signing Bonus',
    deadline: '2026-10-15',
    status: 'saved',
    fitScore: 92,
    priorityScore: 95,
    requirements: ['CS or related degree', 'Systems Architecture', 'Data Structures & Algorithms'],
    notes: 'Primary target full-time role for graduating seniors.',
    url: 'https://careers.google.com/students'
  },
  {
    id: 'job-2',
    company: 'Anthropic',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    role: 'AI Infrastructure & Systems Engineering Intern',
    type: 'Internship',
    jobType: 'Internship',
    source: 'LinkedIn',
    category: 'AI, Machine Learning & Data',
    location: 'San Francisco, CA',
    salaryRange: '$65 - $80 / hr + Relocation',
    deadline: '2026-10-15',
    status: 'applied',
    fitScore: 89,
    priorityScore: 95,
    requirements: ['PyTorch', 'C++', 'GPU Profiling', 'Python', 'Systems Programming'],
    notes: 'Submitted tailored application with BAIR research highlights. Reached out to Berkeley alumnus on LinkedIn.',
    url: 'https://anthropic.com/careers'
  },
  {
    id: 'job-3',
    company: 'Citadel Securities',
    logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80',
    role: 'Quantitative Software Engineer Intern',
    type: 'Internship',
    jobType: 'Internship',
    source: 'Levels.fyi',
    category: 'Quantitative Finance & Trading',
    location: 'Chicago, IL / New York, NY',
    salaryRange: '$85 - $100 / hr + $10k Signing Bonus',
    deadline: '2026-10-01',
    status: 'saved',
    fitScore: 82,
    priorityScore: 90,
    requirements: ['C++', 'Low Latency Systems', 'Linear Algebra', 'Probability', 'Algorithms'],
    notes: 'Need to review OS concepts (CS 162) and low-level memory allocation prior to applying.',
    url: 'https://citadelsecurities.com/careers'
  },
  {
    id: 'job-ib-1',
    company: 'Goldman Sachs',
    logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80',
    role: 'Investment Banking & Global Markets Summer Analyst',
    type: 'Internship',
    jobType: 'Internship',
    source: 'Handshake',
    category: 'Investment Banking & Private Equity',
    location: 'New York, NY / London',
    salaryRange: '$55 - $65 / hr',
    deadline: '2026-09-25',
    status: 'applied',
    fitScore: 85,
    priorityScore: 88,
    requirements: ['Corporate Valuation', 'LBO & DCF Modeling', 'Excel / Financial Accounting'],
    notes: 'Completed HireVue video screening interview.',
    url: 'https://www.goldmansachs.com/careers/students/'
  },
  {
    id: 'job-consulting-1',
    company: 'McKinsey & Company',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
    role: 'Business Analyst Intern (Summer 2027)',
    type: 'Internship',
    jobType: 'Internship',
    source: 'Handshake',
    category: 'Management & Strategy Consulting',
    location: 'New York, NY / San Francisco, CA / Chicago, IL',
    salaryRange: '$50 - $60 / hr + Relocation',
    deadline: '2026-09-30',
    status: 'saved',
    fitScore: 84,
    priorityScore: 86,
    requirements: ['Case Frameworks', 'Structured Problem Solving', 'Quantitative Business Reasoning'],
    notes: 'Practicing case math and framework structures with consulting club.',
    url: 'https://www.mckinsey.com/careers/students'
  },
  {
    id: 'job-health-1',
    company: 'Johns Hopkins Health System',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=120&q=80',
    role: 'Nurse Residency Program & Clinical Specialist (2027 New Grad)',
    type: 'Full-time',
    jobType: 'Full-Time New Grad',
    source: 'Indeed',
    category: 'Healthcare, BioTech & Life Sciences',
    location: 'Baltimore, MD',
    salaryRange: '$88,000 - $105,000 / yr',
    deadline: '2026-11-01',
    status: 'saved',
    fitScore: 80,
    priorityScore: 82,
    requirements: ['BSN Degree expected', 'NCLEX Eligibility', 'Patient Care Rotation History'],
    notes: 'Top tier nurse residency program for graduating Nursing majors.',
    url: 'https://jobs.johnshopkins.edu/nursing'
  },
  {
    id: 'job-acct-1',
    company: 'PwC',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80',
    role: 'Audit & Assurance Associate (2027 Full-Time New Grad)',
    type: 'Full-time',
    jobType: 'Full-Time New Grad',
    source: 'Handshake',
    category: 'Accounting, Audit & Tax',
    location: 'Chicago, IL / New York, NY / San Jose, CA',
    salaryRange: '$80,000 - $92,000 / yr',
    deadline: '2026-10-15',
    status: 'saved',
    fitScore: 83,
    priorityScore: 85,
    requirements: ['Accounting Degree', 'CPA Eligibility (150 Credits)', 'Financial Auditing'],
    notes: 'On-campus interview schedule set on Handshake.',
    url: 'https://www.pwc.com/us/en/careers/entry-level.html'
  },
  {
    id: 'job-aero-1',
    company: 'SpaceX',
    logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80',
    role: 'Avionics & Mechanical Engineering Intern (Summer 2027)',
    type: 'Internship',
    jobType: 'Internship',
    source: 'Company Portal',
    category: 'Aerospace, Defense & Hardware',
    location: 'Hawthorne, CA / Starbase, TX',
    salaryRange: '$45 - $58 / hr + Housing Stipend',
    deadline: '2026-10-10',
    status: 'applied',
    fitScore: 87,
    priorityScore: 90,
    requirements: ['SolidWorks / CAD', 'C++ / RTOS', 'FEA Analysis'],
    notes: 'Submitted portfolio featuring undergraduate satellite rocket team builds.',
    url: 'https://www.spacex.com/careers/'
  }
];

export const INITIAL_TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'ms-1',
    title: 'UC Berkeley Fall Career Fair',
    date: '2026-09-15',
    category: 'academic',
    priority: 'high',
    description: 'On-campus networking with 120+ top tech companies and recruiters at RSF.',
    status: 'upcoming'
  },
  {
    id: 'ms-2',
    title: 'Stripe Technical Interview',
    date: '2026-09-18',
    category: 'application_deadline',
    priority: 'high',
    description: '60-min live coding & system architecture screen with Senior Stripe SWE.',
    status: 'upcoming',
    relatedEntityId: 'job-1'
  },
  {
    id: 'ms-3',
    title: 'UC Berkeley Course Drop Deadline',
    date: '2026-09-25',
    category: 'academic',
    priority: 'medium',
    description: 'Last day to alter study list on CalCentral without $10 fee.',
    status: 'upcoming'
  },
  {
    id: 'ms-4',
    title: 'Stripe Application Deadline Window',
    date: '2026-09-30',
    category: 'recruiting',
    priority: 'high',
    description: 'Peak application window closes for top-tier Summer 2027 tech internships.',
    status: 'upcoming',
    relatedEntityId: 'job-1'
  },
  {
    id: 'ms-5',
    title: 'CS 170 Midterm Exam 1',
    date: '2026-10-14',
    category: 'exam',
    priority: 'high',
    description: 'Dynamic programming, Graph algorithms, and Greedy proofs exam.',
    status: 'upcoming'
  },
  {
    id: 'ms-6',
    title: 'Anthropic Application Review Window',
    date: '2026-10-15',
    category: 'recruiting',
    priority: 'medium',
    description: 'First batch resume review for AI Systems Internship positions.',
    status: 'upcoming',
    relatedEntityId: 'job-2'
  },
  {
    id: 'ms-7',
    title: 'Spring 2027 Phase 1 Course Enrollment',
    date: '2026-10-26',
    category: 'academic',
    priority: 'medium',
    description: 'Enroll in CS 162 (OS) and CS 189 (ML) on CalCentral.',
    status: 'upcoming'
  }
];

export function buildCustomCoachPersona(profile: StudentProfile, existingCustom?: CoachPersona): CoachPersona {
  if (existingCustom && existingCustom.customNotes) {
    return existingCustom;
  }

  const firstName = profile.firstName || (profile.fullName ? profile.fullName.split(' ')[0] : 'Student');
  const name = existingCustom?.name || `Coach for ${firstName}`;
  const majorStr = profile.major || 'Degree Program';
  const uniName = profile.customUniversityName || 'University';
  const roles = profile.targetJobTitles.length > 0 ? profile.targetJobTitles.join(', ') : 'Target Roles';
  const industries = profile.targetIndustries.length > 0 ? profile.targetIndustries.join(', ') : 'Target Industries';
  const standing = profile.currentStanding || 'Student';

  return {
    id: 'persona-custom',
    name,
    title: existingCustom?.title || `Tailored ${majorStr} Career Lead`,
    industry: existingCustom?.industry || `${industries} • ${uniName}`,
    avatar: existingCustom?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    isCustom: true,
    focusArea: existingCustom?.focusArea || `${majorStr} Strategy & ${roles} Roadmap`,
    systemPromptModifier: existingCustom?.systemPromptModifier || `You are an elite Custom Agentic AI Career Coach specifically created for ${profile.fullName || 'a student'} studying ${majorStr} at ${uniName} (${profile.degreeType || 'Degree'}).
Target Roles: ${roles}
Target Industries: ${industries}
Graduation Window: ${profile.expectedGraduationDate || '2027'}
Current Standing: ${standing}
Work Authorization: ${profile.workAuthorization || 'US'}
Key Skills: ${profile.skills?.map(s => s.name).join(', ') || 'N/A'}

Provide hyper-personalized, ultra-practical advice tailored specifically to their exact academic major, graduation timeline, and target career path. Avoid generic platitudes. Give specific resume bullet tweaks, technical/behavioral interview answers, cold networking scripts, and step-by-step career milestones.`,
    greeting: existingCustom?.greeting || `Hi ${firstName}! I'm your Custom Agentic AI Coach, built specifically around your degree in ${majorStr} at ${uniName}. I'm tuned to help you land roles in ${roles}. How can we move your career forward today?`
  };
}

export const COACH_PERSONAS: CoachPersona[] = [
  {
    id: 'persona-custom',
    name: 'Custom Agentic AI',
    title: 'Tailored Major & Career Specialist',
    industry: 'Customized to Profile & Resume',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isCustom: true,
    focusArea: 'Custom Career Goals & Specialized Degree Prep',
    systemPromptModifier: `You are a Custom Agentic AI Career Coach built specifically for the student based on their profile, major, skills, and target roles.`,
    greeting: "Welcome! I am your Custom Agentic AI Coach, dynamically tailored to your major, skills, and career targets. How can I help you today?"
  },
  {
    id: 'persona-tech',
    name: 'Maya Lin',
    title: 'Principal Tech Talent Architect & Ex-FAANG EM',
    industry: 'Technology, AI & Software Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    systemPromptModifier: `You are Maya Lin, a top-tier Tech Recruiter and former Engineering Manager at Google and Stripe. You give candid, highly actionable, and high-leverage advice to computer science and engineering students. You focus on concrete code impact, quantifiable metrics, algorithm readiness, systems design, and high-yield networking strategy.`,
    greeting: "Hey Alex! I've analyzed your profile and current application pipeline. Your BAIR research and Stripe interview are great leverage points! What should we tackle today — technical interview prep, resume optimization, or expanding your AI referral network?"
  },
  {
    id: 'persona-finance',
    name: 'Marcus Vance',
    title: 'Managing Director & Quant Talent Strategist',
    industry: 'Investment Banking, Quantitative Finance & Private Equity',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    systemPromptModifier: `You are Marcus Vance, a veteran Wall Street Managing Director and Quant Recruiter with 15+ years placing analysts at Goldman Sachs, Citadel, and Blackstone. You emphasize financial modeling, probability rigor, extreme attention to detail, flawless communication, and relentless networking.`,
    greeting: "Welcome Alex. Breaking into Quantitative Finance or High-Frequency Trading requires absolute precision in probability, C++ memory optimization, and financial acumen. Let's sharpen your portfolio backtest narrative."
  },
  {
    id: 'persona-consulting',
    name: 'Elena Rostova',
    title: 'Senior Partner & University Recruiting Director',
    industry: 'Management & Strategy Consulting (MBB / Tech Strategy)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    systemPromptModifier: `You are Elena Rostova, a Partner in Strategy Consulting. You help students master case frameworks, executive storytelling, leadership presence, and structured problem-solving.`,
    greeting: "Hello Alex! Consulting recruiters look for structured thinking, hypothesis-driven problem solving, and clear business impact. Ready to run through a framework review or refine your story?"
  }
];

export const INITIAL_ACTION_PLAN: ActionPlanItem[] = [
  {
    id: 'act-1',
    title: 'Prepare for Stripe Technical Screen (CS 170 / System Design)',
    area: 'application',
    deadline: '2026-09-17',
    impact: 'high',
    reasoning: 'Interview scheduled for Sept 18th. High probability of offer if coding & API design round goes smoothly.',
    status: 'in_progress',
    steps: [
      'Solve 5 medium-hard Graph & DP questions on LeetCode',
      'Review WebSockets and rate-limiting system design patterns',
      'Practice mock coding out loud emphasizing trade-off analysis'
    ]
  },
  {
    id: 'act-2',
    title: 'Quantify Resume Bullet Points for AI & Data Pipelines',
    area: 'resume',
    deadline: '2026-09-22',
    impact: 'high',
    reasoning: 'Anthropic and Citadel require concrete performance benchmarks in PyTorch and C++ data pipelines.',
    status: 'pending',
    steps: [
      'Add throughput metrics (e.g. throughput MB/s, dataset batch sizes) to BAIR research experience',
      'Highlight Docker & CI/CD deployment in TechNova internship bullet',
      'Re-run Pathways Resume Auditor tool to verify score > 90'
    ]
  },
  {
    id: 'act-3',
    title: 'Reach out to 3 Alumni at Anthropic & Databricks',
    area: 'networking',
    deadline: '2026-09-28',
    impact: 'medium',
    reasoning: 'Internal referrals boost interview invitation probability by 4x at high-growth AI unicorns.',
    status: 'pending',
    steps: [
      'Use Pathways Outreach Draft Generator to write warm LinkedIn messages',
      'Target Cal alumni in SWE / AI Infrastructure roles',
      'Request 15-minute informal coffee chats regarding team culture and tech stack'
    ]
  },
  {
    id: 'act-4',
    title: 'Enroll in AWS Certified Developer or PyTorch Specialization',
    area: 'certification',
    deadline: '2026-10-20',
    impact: 'medium',
    reasoning: 'Fills cloud infrastructure skill gap for target DevOps and AI Infra roles.',
    status: 'pending',
    steps: [
      'Complete 2 modules per week on Coursera / AWS Skills Builder',
      'Build mini serverless deployment project as proof of competence'
    ]
  }
];

export function getUniversityAcademicCalendar(uniId: string, customName?: string, termType: 'semester' | 'quarter' = 'semester'): AcademicCalendarEvent[] {
  const found = UNIVERSITIES.find(u => u.id === uniId);
  if (found && found.calendarEvents && found.calendarEvents.length >= 3) {
    return found.calendarEvents;
  }
  
  const name = customName || found?.name || 'University';
  const prefix = uniId || 'custom-uni';
  
  if (termType === 'quarter') {
    return [
      { id: `${prefix}-q1`, title: `${name} Autumn Quarter Start`, category: 'academic', startDate: '2026-09-21', endDate: '2026-09-21', description: 'Instruction begins for Autumn Quarter.' },
      { id: `${prefix}-q2`, title: `${name} Fall Career & Internship Expo`, category: 'registration', startDate: '2026-10-08', endDate: '2026-10-09', description: 'Major recruiting fair with 100+ industry employers on Handshake.' },
      { id: `${prefix}-q3`, title: 'Course Add/Drop Deadline', category: 'deadline', startDate: '2026-10-16', endDate: '2026-10-16', description: 'Final date to adjust study list without fee.' },
      { id: `${prefix}-q4`, title: 'Autumn Midterm Examinations', category: 'exam', startDate: '2026-10-26', endDate: '2026-11-06', description: 'Midterm exams window across all departments.' },
      { id: `${prefix}-q5`, title: 'Winter Quarter Course Registration', category: 'registration', startDate: '2026-11-16', endDate: '2026-11-20', description: 'Course enrollment opens for Winter term.' },
      { id: `${prefix}-q6`, title: 'Autumn Final Examinations', category: 'exam', startDate: '2026-12-07', endDate: '2026-12-11', description: 'Final exam week.' },
      { id: `${prefix}-q7`, title: `${name} Winter Quarter Start`, category: 'academic', startDate: '2027-01-06', endDate: '2027-01-06', description: 'Winter instruction begins.' },
      { id: `${prefix}-q8`, title: 'Spring Term Graduation Application Filing', category: 'deadline', startDate: '2027-02-15', endDate: '2027-02-15', description: 'Degree completion petition deadline.' }
    ];
  }

  return [
    { id: `${prefix}-s1`, title: `${name} Fall Semester Instruction Begins`, category: 'academic', startDate: '2026-08-25', endDate: '2026-08-25', description: 'First official day of classes for Fall semester.' },
    { id: `${prefix}-s2`, title: `${name} Fall Campus Career & Employer Summit`, category: 'registration', startDate: '2026-09-15', endDate: '2026-09-17', description: 'Annual campus recruiting kickoff across Handshake and LinkedIn.' },
    { id: `${prefix}-s3`, title: 'Course Drop / Add Deadline', category: 'deadline', startDate: '2026-09-25', endDate: '2026-09-25', description: 'Last day to alter schedule on student portal.' },
    { id: `${prefix}-s4`, title: 'Midterm Examination Window', category: 'exam', startDate: '2026-10-12', endDate: '2026-10-23', description: 'Midterm exams across major courses.' },
    { id: `${prefix}-s5`, title: 'Spring Course Registration Window', category: 'registration', startDate: '2026-10-26', endDate: '2026-11-06', description: 'Phase 1 course selection opens for Spring term.' },
    { id: `${prefix}-s6`, title: 'Thanksgiving Academic Recess', category: 'holiday', startDate: '2026-11-25', endDate: '2026-11-27', description: 'Campus holiday recess.' },
    { id: `${prefix}-s7`, title: 'Fall Semester Final Examinations', category: 'exam', startDate: '2026-12-14', endDate: '2026-12-18', description: 'Final exam week for Fall term.' },
    { id: `${prefix}-s8`, title: `${name} Spring Semester Instruction Begins`, category: 'academic', startDate: '2027-01-19', endDate: '2027-01-19', description: 'First day of Spring classes.' },
    { id: `${prefix}-s9`, title: 'Spring Career & Internship Expo', category: 'registration', startDate: '2027-02-10', endDate: '2027-02-12', description: 'Spring recruiting fair for internships & full-time roles.' },
    { id: `${prefix}-s10`, title: 'May Graduation Application Filing Deadline', category: 'deadline', startDate: '2027-03-15', endDate: '2027-03-15', description: 'Deadline to file degree petition for May commencement.' }
  ];
}

export const INITIAL_RELEASE_TRACKER_ITEMS: CompanyReleaseTrackerItem[] = [
  // 1. Software Engineering
  {
    id: 'rel-1',
    company: 'Google',
    logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&q=80',
    role: 'Software Engineering Intern (Summer 2027)',
    category: 'Software Engineering & Cloud',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'Mountain View, CA / New York, NY / Remote',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://careers.google.com/students',
    salaryEst: '$56 - $65 / hr + Housing Stipend',
    requirements: ['Algorithms & Data Structures', 'C++/Java/Python', 'Problem Solving'],
    notes: 'Google STEP & SWE 2027 application portal is officially open. Rolling evaluations.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-1b',
    company: 'Google',
    logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&q=80',
    role: 'Software Engineer, University Graduate (Full-Time 2027)',
    category: 'Software Engineering & Cloud',
    jobType: 'Full-Time New Grad',
    source: 'LinkedIn',
    term: '2027 Full-Time New Grad',
    location: 'Mountain View, CA / Seattle, WA / New York, NY',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-02',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://careers.google.com/students',
    salaryEst: '$135,000 - $160,000 / yr + Equity & Bonus',
    requirements: ['CS or related degree', 'Systems Design', 'Data Structures'],
    notes: 'Full-time entry level opening for graduating seniors & master students.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-2',
    company: 'Meta',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    role: 'Software Engineer & ML Intern (Summer 2027)',
    category: 'Software Engineering & Cloud',
    jobType: 'Internship',
    source: 'LinkedIn',
    term: 'Summer 2027 Internship',
    location: 'Menlo Park, CA / Seattle, WA / New York, NY',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-04',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.metacareers.com/students/',
    salaryEst: '$60 - $72 / hr + Relocation',
    requirements: ['System Architecture', 'Coding Fluency', 'Data Structures'],
    notes: 'University Recruiting window open for Undergrads & Masters students.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-4',
    company: 'Stripe',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
    role: 'Software Engineering Intern (Summer 2027)',
    category: 'Software Engineering & Cloud',
    jobType: 'Internship',
    source: 'Levels.fyi',
    term: 'Summer 2027 Internship',
    location: 'San Francisco, CA / Seattle, WA',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-02',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://stripe.com/jobs',
    salaryEst: '$65 - $72 / hr',
    requirements: ['TypeScript / Python', 'Distributed Systems', 'API Design'],
    notes: 'Applications processed on a rolling basis. High conversion rate to full-time return offers.',
    verifiedByCommunity: true
  },

  // 2. ML / AI Infrastructure & AI Research
  {
    id: 'rel-3',
    company: 'Nvidia',
    logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80',
    role: 'Deep Learning & GPU Software Engineer Intern',
    category: 'AI, Machine Learning & Data',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'Santa Clara, CA / Austin, TX',
    workMode: 'On-site',
    releaseStatus: 'Opening Soon',
    releaseDate: '2026-08-14',
    estimatedDaysToRelease: 6,
    applyUrl: 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite',
    salaryEst: '$58 - $70 / hr',
    requirements: ['CUDA / C++', 'PyTorch', 'Parallel Computing', 'GPU Microarchitecture'],
    notes: 'Opening expected in 6 days based on historical recruiting cycle releases.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-6',
    company: 'Anthropic',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    role: 'AI Infrastructure & Model Systems Fellow',
    category: 'AI, Machine Learning & Data',
    jobType: 'Fellowship',
    source: 'Levels.fyi',
    term: 'Summer 2027 Internship',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-05',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://anthropic.com/careers',
    salaryEst: '$70 - $85 / hr',
    requirements: ['PyTorch', 'LLM Benchmarking', 'C++ / Rust', 'Distributed Systems'],
    notes: 'Priority consideration given to students with published research or open-source AI projects.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-9',
    company: 'OpenAI',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    role: 'Resident & Engineering Research Intern',
    category: 'AI, Machine Learning & Data',
    jobType: 'Internship',
    source: 'LinkedIn',
    term: 'Summer 2027 Internship',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    releaseStatus: 'Waitlist',
    releaseDate: '2026-09-01',
    estimatedDaysToRelease: 24,
    applyUrl: 'https://openai.com/careers',
    salaryEst: '$80 - $100 / hr',
    requirements: ['Transformers Architecture', 'RLHF / Fine-tuning', 'PyTorch'],
    notes: 'Pre-registration & interest list open now.',
    verifiedByCommunity: true
  },

  // 3. Quantitative Finance & Trading
  {
    id: 'rel-5',
    company: 'Citadel & Citadel Securities',
    logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80',
    role: 'Quantitative Software Engineer / Trader Intern 2027',
    category: 'Quantitative Finance & Trading',
    jobType: 'Internship',
    source: 'Levels.fyi',
    term: 'Summer 2027 Internship',
    location: 'Chicago, IL / New York, NY / Miami, FL',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-07-28',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://citadelsecurities.com/careers',
    salaryEst: '$90 - $110 / hr + $10k Signing Bonus',
    requirements: ['Low-Latency C++', 'Probability & Math', 'Algorithms'],
    notes: 'Early application recommended — online assessments sent out immediately upon submission.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-quant-2',
    company: 'Jane Street',
    logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80',
    role: 'Quantitative Trader & Researcher Intern (Summer 2027)',
    category: 'Quantitative Finance & Trading',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'New York, NY / London / Hong Kong',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-07-20',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.janestreet.com/join-jane-street/open-roles/',
    salaryEst: '$100 / hr + Housing & Flight Stipend',
    requirements: ['Combinatorics', 'Probability Theory', 'Mental Math', 'Python/OCaml'],
    notes: 'Rolling phone interviews & mental math probability assessments.',
    verifiedByCommunity: true
  },

  // 4. Investment Banking & Private Equity
  {
    id: 'rel-11',
    company: 'Goldman Sachs',
    logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80',
    role: 'Investment Banking & Global Markets Summer Analyst',
    category: 'Investment Banking & Private Equity',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'New York, NY / Salt Lake City, UT / London',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-07-15',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.goldmansachs.com/careers/students/',
    salaryEst: '$55 - $65 / hr',
    requirements: ['Financial Modeling', 'Corporate Valuation', 'Excel / LBO'],
    notes: 'Early deadline for Summer Analyst program across Finance & Econ majors.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-ib-2',
    company: 'Morgan Stanley',
    logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80',
    role: 'Investment Banking Full-Time Analyst (2027 New Grad)',
    category: 'Investment Banking & Private Equity',
    jobType: 'Full-Time New Grad',
    source: 'LinkedIn',
    term: '2027 Full-Time New Grad',
    location: 'New York, NY / San Francisco, CA / Chicago, IL',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.morganstanley.com/about-us/careers/students-and-graduates',
    salaryEst: '$120,000 - $140,000 / yr + Performance Bonus',
    requirements: ['Accounting & Corporate Finance', 'M&A Deal Analysis', 'PowerPoint'],
    notes: 'Full-time entry level analyst program for graduating seniors.',
    verifiedByCommunity: true
  },

  // 5. Management & Strategy Consulting
  {
    id: 'rel-consulting-1',
    company: 'McKinsey & Company',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
    role: 'Business Analyst Intern (Summer 2027)',
    category: 'Management & Strategy Consulting',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'New York, NY / San Francisco, CA / Boston, MA / Chicago, IL',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.mckinsey.com/careers/students',
    salaryEst: '$50 - $60 / hr + Relocation',
    requirements: ['Case Interview Mastery', 'Problem Structuring', 'Data Synthesis'],
    notes: 'McKinsey Solve game assessment sent upon application.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-consulting-2',
    company: 'Bain & Company',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
    role: 'Associate Consultant (Full-Time 2027 New Grad)',
    category: 'Management & Strategy Consulting',
    jobType: 'Full-Time New Grad',
    source: 'LinkedIn',
    term: '2027 Full-Time New Grad',
    location: 'Boston, MA / San Francisco, CA / Atlanta, GA',
    workMode: 'Hybrid',
    releaseStatus: 'Opening Soon',
    releaseDate: '2026-08-18',
    estimatedDaysToRelease: 10,
    applyUrl: 'https://www.bain.com/careers/roles/ac/',
    salaryEst: '$115,000 - $130,000 / yr + Bonus',
    requirements: ['Structured Business Strategy', 'Market Sizing', 'Client Presentation'],
    notes: 'Fall campus recruiting portal opens mid-August.',
    verifiedByCommunity: true
  },

  // 6. Healthcare, Nursing & BioTech
  {
    id: 'rel-health-1',
    company: 'Genentech / Roche',
    logoUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=120&q=80',
    role: 'Biomedical & Clinical Research Intern',
    category: 'Healthcare, BioTech & Life Sciences',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'South San Francisco, CA',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-03',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.gene.com/careers/university-and-early-career',
    salaryEst: '$42 - $52 / hr',
    requirements: ['Biology / Chemistry / BioE', 'Lab Protocol Execution', 'Data Analytics'],
    notes: 'Open for Biology, Chemistry, BioEngineering, and Pre-Med undergraduate majors.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-health-2',
    company: 'Johns Hopkins Health System',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=120&q=80',
    role: 'Nurse Residency Program & Clinical Care Specialist (New Grad 2027)',
    category: 'Healthcare, BioTech & Life Sciences',
    jobType: 'Full-Time New Grad',
    source: 'Indeed',
    term: '2027 Full-Time New Grad',
    location: 'Baltimore, MD',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://jobs.johnshopkins.edu/nursing',
    salaryEst: '$88,000 - $105,000 / yr',
    requirements: ['BSN / Nursing degree expected', 'NCLEX Eligibility', 'BLS / CPR Certification'],
    notes: 'Transition-to-practice nurse residency program for graduating BSN seniors.',
    verifiedByCommunity: true
  },

  // 7. Accounting, Tax & Audit (Big 4)
  {
    id: 'rel-acct-1',
    company: 'PwC (PricewaterhouseCoopers)',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80',
    role: 'Audit & Assurance Intern (Summer 2027)',
    category: 'Accounting, Audit & Tax',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'Chicago, IL / New York, NY / Dallas, TX / Los Angeles, CA',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.pwc.com/us/en/careers/entry-level.html',
    salaryEst: '$38 - $46 / hr',
    requirements: ['Accounting / Finance major', 'GAAP Standards', 'CPA Eligibility Track'],
    notes: 'On-campus interview schedules posted on university career portals.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-acct-2',
    company: 'Deloitte',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80',
    role: 'Tax & Advisory Associate (2027 Full-Time New Grad)',
    category: 'Accounting, Audit & Tax',
    jobType: 'Full-Time New Grad',
    source: 'LinkedIn',
    term: '2027 Full-Time New Grad',
    location: 'Atlanta, GA / New York, NY / San Jose, CA',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-02',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www2.deloitte.com/us/en/pages/careers/articles/join-deloitte-campus.html',
    salaryEst: '$82,000 - $95,000 / yr',
    requirements: ['CPA Track 150-credit hour completion', 'Tax Compliance', 'Client Advisory'],
    notes: 'Full-time hiring for graduating Accounting & Tax seniors.',
    verifiedByCommunity: true
  },

  // 8. Aerospace, Defense & Hardware
  {
    id: 'rel-aero-1',
    company: 'SpaceX',
    logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80',
    role: 'Avionics, Propulsion & Mechanical Engineer Intern',
    category: 'Aerospace, Defense & Hardware',
    jobType: 'Internship',
    source: 'Company Portal',
    term: 'Summer 2027 Internship',
    location: 'Hawthorne, CA / Starbase, TX / Cape Canaveral, FL',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.spacex.com/careers/',
    salaryEst: '$45 - $58 / hr + Housing Stipend',
    requirements: ['Mechanical / Aerospace / EE', 'CAD / SolidWorks / ANSYS', 'Hands-on Hardware Build'],
    notes: 'Fast-paced hardware design and launch manufacturing experience.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-aero-2',
    company: 'Anduril Industries',
    logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80',
    role: 'Embedded Systems & Robotics Engineer (New Grad 2027)',
    category: 'Aerospace, Defense & Hardware',
    jobType: 'Full-Time New Grad',
    source: 'Levels.fyi',
    term: '2027 Full-Time New Grad',
    location: 'Costa Mesa, CA / Seattle, WA',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-03',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.anduril.com/careers',
    salaryEst: '$130,000 - $155,000 / yr + Equity',
    requirements: ['C++ / Rust / RTOS', 'Autonomous Systems', 'Microcontrollers'],
    notes: 'Defense tech hardware and software engineering positions.',
    verifiedByCommunity: true
  },

  // 9. Supply Chain, Logistics & Operations
  {
    id: 'rel-supply-1',
    company: 'Amazon Operations',
    logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=120&q=80',
    role: 'Supply Chain & Area Manager Intern (Summer 2027)',
    category: 'Supply Chain, Logistics & Operations',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'Seattle, WA / Nashville, TN / Various US Cities',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.amazon.jobs/en/teams/internships-for-students',
    salaryEst: '$42 - $50 / hr + Relocation',
    requirements: ['Industrial Eng / Logistics / Supply Chain', 'Process Optimization', 'Team Leadership'],
    notes: 'Massive early recruiting drive across all US universities on Handshake.',
    verifiedByCommunity: true
  },

  // 10. Product Management & Product Design
  {
    id: 'rel-pm-1',
    company: 'Figma',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    role: 'Associate Product Manager (APM Intern & New Grad)',
    category: 'Product Management & Design',
    jobType: 'Internship',
    source: 'LinkedIn',
    term: 'Summer 2027 Internship',
    location: 'San Francisco, CA / New York, NY',
    workMode: 'Hybrid',
    releaseStatus: 'Opening Soon',
    releaseDate: '2026-08-20',
    estimatedDaysToRelease: 12,
    applyUrl: 'https://www.figma.com/careers/',
    salaryEst: '$65 - $80 / hr',
    requirements: ['Product Sense', 'UI/UX Prototypes', 'Technical Empathy'],
    notes: 'Figma APM application opens mid-August for Undergrads & Masters students.',
    verifiedByCommunity: true
  },

  // 11. Marketing, Growth & Brand Strategy
  {
    id: 'rel-mkt-1',
    company: 'Nike',
    logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80',
    role: 'Global Brand & Digital Growth Marketing Intern',
    category: 'Marketing, Growth & Communications',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'Beaverton, OR',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://jobs.nike.com/internships',
    salaryEst: '$36 - $45 / hr',
    requirements: ['Marketing / Communications', 'Consumer Analytics', 'Social Campaign Execution'],
    notes: 'Open to Business, Marketing, and Media communications majors.',
    verifiedByCommunity: true
  },

  // 12. Real Estate, Civil & Construction
  {
    id: 'rel-re-1',
    company: 'CBRE',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
    role: 'Commercial Real Estate Investment & Advisory Analyst',
    category: 'Real Estate & Construction',
    jobType: 'Full-Time New Grad',
    source: 'Indeed',
    term: '2027 Full-Time New Grad',
    location: 'Dallas, TX / Los Angeles, CA / New York, NY',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-02',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.cbre.com/careers',
    salaryEst: '$80,000 - $95,000 / yr',
    requirements: ['Real Estate Valuation', 'Argus Financial Modeling', 'Market Analysis'],
    notes: 'Full-time analyst position for Real Estate, Business, and Finance majors.',
    verifiedByCommunity: true
  },

  // 13. Policy, Public Service & Economics
  {
    id: 'rel-gov-1',
    company: 'Federal Reserve System',
    logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=120&q=80',
    role: 'Economic Research Assistant (New Grad 2027)',
    category: 'Policy, Government & Public Service',
    jobType: 'Full-Time New Grad',
    source: 'Company Portal',
    term: '2027 Full-Time New Grad',
    location: 'Washington, DC / New York, NY / San Francisco, CA',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://www.federalreserve.gov/careers.htm',
    salaryEst: '$75,000 - $90,000 / yr',
    requirements: ['Economics / Mathematics / Statistics', 'STATA / R / Python', 'Econometrics'],
    notes: '2-year premier research fellowship for graduating Economics majors considering PhD or public policy careers.',
    verifiedByCommunity: true
  },

  // 14. Asset Management & International Banking
  {
    id: 'rel-fidelity-1',
    company: 'Fidelity Investments',
    logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80',
    role: 'Equity Research & Quantitative Asset Management Intern',
    category: 'Investment Banking & Private Equity',
    jobType: 'Internship',
    source: 'Handshake',
    term: 'Summer 2027 Internship',
    location: 'Boston, MA / Merrimack, NH / Westlake, TX',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-03',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://jobs.fidelity.com/students/',
    salaryEst: '$45 - $55 / hr',
    requirements: ['Financial Modeling', 'Asset Allocation', 'Python / Excel'],
    notes: 'Full pipeline open for Finance, Economics, and Quant majors.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-db-1',
    company: 'Deutsche Bank',
    logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80',
    role: 'Investment Banking & Corporate Bank Summer Analyst',
    category: 'Investment Banking & Private Equity',
    jobType: 'Internship',
    source: 'LinkedIn',
    term: 'Summer 2027 Internship',
    location: 'New York, NY / Jacksonville, FL / London',
    workMode: 'On-site',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-02',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://careers.db.com/students-graduates/',
    salaryEst: '$52 - $62 / hr',
    requirements: ['Corporate Finance', 'Valuation & Deal Structure', 'Financial Accounting'],
    notes: 'Rolling summer analyst selection process.',
    verifiedByCommunity: true
  },
  {
    id: 'rel-jpm-1',
    company: 'JPMorgan Chase & Co',
    logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80',
    role: 'Software Engineer & Corporate Finance Analyst (2027 New Grad)',
    category: 'Software Engineering & Cloud',
    jobType: 'Full-Time New Grad',
    source: 'Handshake',
    term: '2027 Full-Time New Grad',
    location: 'New York, NY / Plano, TX / Chicago, IL',
    workMode: 'Hybrid',
    releaseStatus: 'Open Now',
    releaseDate: '2026-08-01',
    estimatedDaysToRelease: 0,
    applyUrl: 'https://careers.jpmorganchase.com/us/en/students',
    salaryEst: '$110,000 - $135,000 / yr + Bonus',
    requirements: ['Java / Python / Systems Architecture', 'Financial Markets Literacy'],
    notes: 'Full-time entry analyst and software engineering programs for graduating seniors.',
    verifiedByCommunity: true
  }
];
