// Comprehensive Dataset of Job Titles across All Industries & Functions

export interface CategorizedJobRole {
  title: string;
  category: string;
  level?: string;
}

export const COMPREHENSIVE_JOB_TITLES: CategorizedJobRole[] = [
  // 1. Software Engineering & Infrastructure
  { title: 'Software Engineer', category: 'Software Engineering' },
  { title: 'Software Development Engineer (SDE)', category: 'Software Engineering' },
  { title: 'Junior Software Engineer', category: 'Software Engineering' },
  { title: 'Senior Software Engineer', category: 'Software Engineering' },
  { title: 'Staff Software Engineer', category: 'Software Engineering' },
  { title: 'Principal Software Engineer', category: 'Software Engineer' },
  { title: 'Frontend Engineer', category: 'Software Engineering' },
  { title: 'Backend Engineer', category: 'Software Engineering' },
  { title: 'Full Stack Engineer', category: 'Software Engineering' },
  { title: 'Mobile Engineer (iOS / Swift)', category: 'Software Engineering' },
  { title: 'Mobile Engineer (Android / Kotlin)', category: 'Software Engineering' },
  { title: 'DevOps Engineer', category: 'Infrastructure & Cloud' },
  { title: 'Site Reliability Engineer (SRE)', category: 'Infrastructure & Cloud' },
  { title: 'Cloud Infrastructure Engineer', category: 'Infrastructure & Cloud' },
  { title: 'Cloud Architect', category: 'Infrastructure & Cloud' },
  { title: 'Systems Engineer', category: 'Infrastructure & Cloud' },
  { title: 'Cybersecurity Analyst', category: 'Security' },
  { title: 'Security Engineer', category: 'Security' },
  { title: 'Application Security Engineer', category: 'Security' },
  { title: 'Penetration Tester / Ethical Hacker', category: 'Security' },
  { title: 'Embedded Systems Engineer', category: 'Hardware & Systems' },
  { title: 'Firmware Engineer', category: 'Hardware & Systems' },

  // 2. AI, Machine Learning & Data
  { title: 'Artificial Intelligence Engineer (AI Engineer)', category: 'AI & Data Science' },
  { title: 'Machine Learning Engineer (MLE)', category: 'AI & Data Science' },
  { title: 'Machine Learning Research Scientist', category: 'AI & Data Science' },
  { title: 'Deep Learning Scientist', category: 'AI & Data Science' },
  { title: 'Computer Vision Engineer', category: 'AI & Data Science' },
  { title: 'Natural Language Processing (NLP) Specialist', category: 'AI & Data Science' },
  { title: 'Generative AI Applications Engineer', category: 'AI & Data Science' },
  { title: 'Data Scientist', category: 'AI & Data Science' },
  { title: 'Senior Data Scientist', category: 'AI & Data Science' },
  { title: 'Data Engineer', category: 'AI & Data Science' },
  { title: 'Big Data Architect', category: 'AI & Data Science' },
  { title: 'Analytics Engineer', category: 'AI & Data Science' },
  { title: 'Business Intelligence Analyst (BI Analyst)', category: 'AI & Data Science' },
  { title: 'Quantitative Data Analyst', category: 'AI & Data Science' },

  // 3. Quantitative Finance & Trading
  { title: 'Quantitative Researcher (Quant Researcher)', category: 'Quantitative Finance' },
  { title: 'Quantitative Trader (Quant Trader)', category: 'Quantitative Finance' },
  { title: 'Quantitative Developer (Quant Dev)', category: 'Quantitative Finance' },
  { title: 'Algorithmic Trader', category: 'Quantitative Finance' },
  { title: 'Risk Analyst / Risk Engineer', category: 'Quantitative Finance' },
  { title: 'Financial Engineer', category: 'Quantitative Finance' },
  { title: 'Quantitative Strategist', category: 'Quantitative Finance' },

  // 4. Investment Banking, Corporate Finance & Accounting
  { title: 'Investment Banking Analyst (IB Analyst)', category: 'Investment Banking' },
  { title: 'Investment Banking Associate', category: 'Investment Banking' },
  { title: 'Equity Research Analyst', category: 'Capital Markets' },
  { title: 'Capital Markets Analyst', category: 'Capital Markets' },
  { title: 'Mergers & Acquisitions (M&A) Analyst', category: 'Investment Banking' },
  { title: 'Private Equity Analyst / Associate', category: 'Private Equity' },
  { title: 'Venture Capital Analyst / Associate', category: 'Venture Capital' },
  { title: 'Corporate Finance Analyst (FP&A)', category: 'Corporate Finance' },
  { title: 'Financial Analyst', category: 'Corporate Finance' },
  { title: 'Commercial Banking Analyst', category: 'Banking' },
  { title: 'Staff Accountant', category: 'Accounting & Audit' },
  { title: 'Audit Associate (Public Accounting)', category: 'Accounting & Audit' },
  { title: 'Tax Associate (Public Accounting)', category: 'Accounting & Audit' },
  { title: 'Senior Auditor / Senior Tax Associate', category: 'Accounting & Audit' },
  { title: 'Actuarial Analyst / Actuary', category: 'Insurance' },

  // 5. Consulting & Business Strategy
  { title: 'Management Consultant / Business Analyst', category: 'Management Consulting' },
  { title: 'Strategy Consultant', category: 'Management Consulting' },
  { title: 'Technology Consultant', category: 'Technology Consulting' },
  { title: 'Healthcare Consultant', category: 'Healthcare Consulting' },
  { title: 'Operations Consultant', category: 'Management Consulting' },
  { title: 'Corporate Strategy Analyst', category: 'Corporate Strategy' },
  { title: 'Chief of Staff / Strategy Associate', category: 'Corporate Strategy' },

  // 6. Product, Design & Growth
  { title: 'Product Manager (PM)', category: 'Product & Design' },
  { title: 'Associate Product Manager (APM)', category: 'Product & Design' },
  { title: 'Technical Product Manager (TPM)', category: 'Product & Design' },
  { title: 'Senior Product Manager', category: 'Product & Design' },
  { title: 'Product Designer (UI/UX)', category: 'Product & Design' },
  { title: 'UI/UX Designer', category: 'Product & Design' },
  { title: 'UX Researcher', category: 'Product & Design' },
  { title: 'User Researcher', category: 'Product & Design' },
  { title: 'Graphic Designer', category: 'Creative & Design' },
  { title: 'Brand Specialist / Art Director', category: 'Creative & Design' },

  // 7. Sales, Marketing & Business Development
  { title: 'Sales Development Representative (SDR)', category: 'Sales & BD' },
  { title: 'Business Development Representative (BDR)', category: 'Sales & BD' },
  { title: 'Account Executive (AE)', category: 'Sales & BD' },
  { title: 'Enterprise Account Manager', category: 'Sales & BD' },
  { title: 'Solutions Architect / Presales Engineer', category: 'Sales Engineering' },
  { title: 'Digital Marketing Specialist', category: 'Marketing' },
  { title: 'Growth Marketing Manager', category: 'Marketing' },
  { title: 'Content Strategist / Copywriter', category: 'Marketing' },
  { title: 'Public Relations (PR) Specialist', category: 'Marketing' },
  { title: 'Product Marketing Manager (PMM)', category: 'Marketing' },

  // 8. Healthcare, Clinical Medicine & BioTech
  { title: 'Registered Nurse (RN)', category: 'Clinical Healthcare' },
  { title: 'Clinical Research Coordinator', category: 'BioTech & Pharma' },
  { title: 'Bioinformatics Scientist', category: 'BioTech & Pharma' },
  { title: 'Biomedical Engineer', category: 'BioTech & Pharma' },
  { title: 'Pharmaceutical Research Scientist', category: 'BioTech & Pharma' },
  { title: 'Medical Doctor / Resident Physician (MD)', category: 'Clinical Healthcare' },
  { title: 'Physician Assistant (PA)', category: 'Clinical Healthcare' },
  { title: 'Nurse Practitioner (NP)', category: 'Clinical Healthcare' },
  { title: 'Medical Laboratory Scientist', category: 'Clinical Healthcare' },
  { title: 'Health Services Administrator', category: 'Healthcare Admin' },

  // 9. Engineering (Mechanical, Hardware, Aerospace, Civil)
  { title: 'Mechanical Engineer', category: 'Hardware & Engineering' },
  { title: 'Hardware Design Engineer', category: 'Hardware & Engineering' },
  { title: 'ASIC / FPGA Design Engineer', category: 'Semiconductor' },
  { title: 'Verification Engineer', category: 'Semiconductor' },
  { title: 'Electrical Engineer', category: 'Hardware & Engineering' },
  { title: 'Aerospace Engineer', category: 'Aerospace & Defense' },
  { title: 'Robotics Engineer', category: 'Robotics' },
  { title: 'Avionics Engineer', category: 'Aerospace & Defense' },
  { title: 'Civil Engineer', category: 'Civil & Infrastructure' },
  { title: 'Structural Engineer', category: 'Civil & Infrastructure' },
  { title: 'Environmental Engineer', category: 'Civil & Infrastructure' },
  { title: 'Chemical Engineer', category: 'Chemical & Energy' },
  { title: 'Materials Engineer', category: 'Materials Science' },

  // 10. Operations, Supply Chain, Legal & HR
  { title: 'Operations Manager', category: 'Operations' },
  { title: 'Supply Chain Analyst', category: 'Supply Chain' },
  { title: 'Logistics Coordinator', category: 'Supply Chain' },
  { title: 'Procurement Specialist', category: 'Supply Chain' },
  { title: 'Human Resources Generalist (HR Generalist)', category: 'Human Resources' },
  { title: 'Talent Acquisition Specialist / Technical Recruiter', category: 'Human Resources' },
  { title: 'People Operations Manager', category: 'Human Resources' },
  { title: 'Paralegal / Legal Assistant', category: 'Legal & Policy' },
  { title: 'Associate Attorney / Legal Counsel', category: 'Legal & Policy' },
  { title: 'Compliance Officer / Analyst', category: 'Legal & Policy' },
  { title: 'Public Policy Analyst', category: 'Government & Policy' }
];

export const ALL_JOB_TITLES = COMPREHENSIVE_JOB_TITLES.map(r => r.title);
