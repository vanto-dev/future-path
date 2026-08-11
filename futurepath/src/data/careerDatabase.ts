export interface CompanyInfo {
  name: string;
  category: string;
  domain: string;
  logoUrl: string;
  hiringStatus: 'Active Hiring' | 'Opening Soon' | 'Selective' | 'Rolling';
}

export const DEGREE_LEVEL_OPTIONS = [
  "Bachelor's Degree (B.S., B.A., B.A.S., B.B.A., B.S.N., B.Eng.)",
  "Master's Degree (M.S., M.A., M.B.A., M.P.A., M.S.N., M.Eng.)",
  "Associate's Degree (A.A., A.S., A.A.S.)",
  "Doctorate / PhD (Ph.D., Sc.D., Ed.D.)",
  "Professional Degree (J.D., M.D., Pharm.D., Certificate)"
];

export const GRADUATION_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const GRADUATION_YEARS = [
  2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
];

export const SALARY_GOAL_OPTIONS = [
  '$60,000 - $80,000',
  '$80,000 - $110,000',
  '$110,000 - $140,000',
  '$140,000 - $175,000',
  '$175,000 - $220,000+',
  'Custom Annual Range'
];

export const HOURLY_RATE_OPTIONS = [
  '$20 - $30 / hr',
  '$30 - $45 / hr',
  '$45 - $65 / hr',
  '$65 - $85 / hr',
  '$85 - $110+ / hr',
  'Custom Hourly Range'
];

export const TARGET_INDUSTRIES = [
  'Technology, Software & AI',
  'Banking, Investment Banking & Capital Markets',
  'Quantitative Finance & Trading',
  'Asset Management, Wealth & Private Equity',
  'Accounting, Audit & Tax Services',
  'Management Consulting & Business Strategy',
  'Healthcare, Clinical Medicine & Nursing',
  'Biotech, Pharmaceuticals & Life Sciences',
  'Aerospace, Defense & National Security',
  'Automotive, EV & Autonomous Systems',
  'Semiconductor & Hardware Engineering',
  'Consumer Goods, Retail & E-Commerce',
  'Energy, CleanTech & Sustainability',
  'Media, Entertainment, Gaming & Telecom',
  'Real Estate, Construction & Infrastructure',
  'Government, Public Policy, Defense & Law',
  'Education, Higher Ed & Non-Profit',
  'Supply Chain, Logistics & Transportation',
  'Hospitality, Travel & Food Services',
  'Insurance, Risk & Actuarial Sciences'
];

export const TARGET_FUNCTIONS = [
  'Software Engineering & Infrastructure',
  'Artificial Intelligence, ML & Data Science',
  'Quantitative Research & Algorithmic Trading',
  'Investment Banking & Equity Research',
  'Financial Analysis & Corporate Finance (FP&A)',
  'Accounting, Audit & Tax Services',
  'Management & Strategy Consulting',
  'Clinical Healthcare, Nursing & Medicine',
  'BioTech, Pharma & Lab Research',
  'Product Management & Product Design (UI/UX)',
  'Sales, Business Development & Account Management',
  'Marketing, Brand Strategy & Public Relations',
  'Operations, Supply Chain & Logistics',
  'Human Resources, Recruiting & People Ops',
  'Legal, Compliance, Ethics & Public Policy',
  'Hardware, Embedded Systems & Robotics',
  'Mechanical & Aerospace Engineering',
  'Civil, Environmental & Structural Engineering'
];

export const INDUSTRY_LIST = TARGET_INDUSTRIES;

export const ALL_US_INSTITUTIONS = [
  // Texas Institutions
  'University of Texas at Dallas (UT Dallas)',
  'University of Texas at Austin',
  'University of Texas at Arlington',
  'University of Texas at San Antonio',
  'University of Texas at El Paso',
  'University of Texas Rio Grande Valley',
  'University of Texas Permian Basin',
  'University of Texas at Tyler',
  'Texas A&M University, College Station',
  'Texas A&M University–Commerce',
  'Texas A&M University–Corpus Christi',
  'Texas A&M University–Kingsville',
  'Texas A&M International University',
  'Texas A&M University–San Antonio',
  'Texas A&M University–Texarkana',
  'Tarleton State University',
  'Prairie View A&M University',
  'West Texas A&M University',
  'Rice University',
  'University of Houston',
  'University of Houston–Clear Lake',
  'University of Houston–Downtown',
  'University of Houston–Sugar Land',
  'Southern Methodist University (SMU)',
  'Texas Christian University (TCU)',
  'Baylor University',
  'Texas Tech University',
  'University of North Texas (UNT)',
  'Texas State University',
  'Sam Houston State University',
  'Stephen F. Austin State University',
  'Lamar University',
  'Texas Woman\'s University',
  'Trinity University',
  'St. Mary\'s University',
  'Southwestern University',
  'Abilene Christian University',
  'Dallas Baptist University',
  'University of Dallas',

  // California Institutions
  'University of California, Berkeley',
  'University of California, Los Angeles (UCLA)',
  'University of California, San Diego (UCSD)',
  'University of California, Davis',
  'University of California, Irvine',
  'University of California, Santa Barbara (UCSB)',
  'University of California, Santa Cruz',
  'University of California, Riverside',
  'University of California, Merced',
  'Stanford University',
  'California Institute of Technology (Caltech)',
  'University of Southern California (USC)',
  'San Jose State University',
  'San Diego State University',
  'California Polytechnic State University, San Luis Obispo (Cal Poly SLO)',
  'California State Polytechnic University, Pomona (Cal Poly Pomona)',
  'California State University, Long Beach',
  'California State University, Fullerton',
  'California State University, Northridge',
  'Santa Clara University',
  'Pepperdine University',
  'Loyola Marymount University',
  'University of San Francisco',
  'University of San Diego',

  // East Coast & Ivy League / Top Private
  'Harvard University',
  'Massachusetts Institute of Technology (MIT)',
  'Princeton University',
  'Yale University',
  'Columbia University',
  'University of Pennsylvania (Penn / Wharton)',
  'Cornell University',
  'Brown University',
  'Dartmouth College',
  'New York University (NYU)',
  'Carnegie Mellon University (CMU)',
  'Johns Hopkins University',
  'Georgetown University',
  'Duke University',
  'Emory University',
  'Vanderbilt University',
  'Boston College',
  'Boston University',
  'Northeastern University',
  'Tufts University',
  'George Washington University',
  'Fordham University',
  'Rensselaer Polytechnic Institute (RPI)',
  'Stevens Institute of Technology',

  // Midwest & Central Top Universities
  'University of Chicago',
  'Northwestern University',
  'University of Michigan, Ann Arbor',
  'University of Illinois Urbana-Champaign (UIUC)',
  'Purdue University, West Lafayette',
  'University of Wisconsin–Madison',
  'University of Minnesota, Twin Cities',
  'Ohio State University',
  'Indiana University Bloomington (Kelley)',
  'Michigan State University',
  'University of Notre Dame',
  'Case Western Reserve University',
  'Washington University in St. Louis (WashU)',

  // South, Southeast & Atlantic
  'University of Virginia (UVA)',
  'University of North Carolina at Chapel Hill (UNC)',
  'Georgia Institute of Technology (Georgia Tech)',
  'University of Georgia',
  'University of Florida',
  'Florida State University',
  'University of Miami',
  'Wake Forest University',
  'Clemson University',
  'University of Maryland, College Park',
  'Virginia Tech',
  'North Carolina State University',

  // West & Northwest
  'University of Washington (UW)',
  'Washington State University',
  'University of Colorado Boulder',
  'Colorado School of Mines',
  'University of Arizona',
  'Arizona State University (ASU)',
  'Brigham Young University (BYU)',
  'University of Utah',
  'Oregon State University',
  'University of Oregon'
];

export const LOCATION_DATABASE = [
  'San Francisco, CA',
  'Silicon Valley / San Jose, CA',
  'Los Angeles, CA',
  'San Diego, CA',
  'New York, NY',
  'Boston, MA',
  'Seattle, WA',
  'Austin, TX',
  'Dallas-Fort Worth, TX',
  'Houston, TX',
  'Chicago, IL',
  'Atlanta, GA',
  'Washington, D.C. Metro',
  'Denver / Boulder, CO',
  'Miami / Fort Lauderdale, FL',
  'Raleigh-Durham (RTP), NC',
  'Salt Lake City / Provo, UT',
  'Philadelphia, PA',
  'Minneapolis-St. Paul, MN',
  'Phoenix, AZ',
  'London, UK',
  'Toronto, Canada',
  'Fully Remote (US / Global)'
];

export const MAJORS_BY_STANDING = {
  undergraduate: [
    // Computer Science & Tech
    'B.S. Computer Science',
    'B.S. Software Engineering',
    'B.S. Computer Engineering',
    'B.S. Data Science / Artificial Intelligence',
    'B.A. Computer Science',
    'B.S. Cybersecurity / Information Security',
    'B.S. Information Technology / Management Information Systems (MIS)',

    // Business, Finance & Economics
    'B.B.A. Finance',
    'B.S. Quantitative Finance / Financial Engineering',
    'B.B.A. Accounting',
    'B.A. Economics',
    'B.S. Economics & Data Science',
    'B.B.A. Business Administration / Management',
    'B.B.A. Marketing / Digital Growth',
    'B.B.A. Supply Chain Management & Logistics',
    'B.B.A. Real Estate & Urban Land Economics',
    'B.S. International Business',

    // Healthcare, Nursing & Life Sciences
    'B.S. Nursing (BSN)',
    'B.S. Biology / Biological Sciences',
    'B.S. Chemistry / Biochemistry',
    'B.S. Biomedical Sciences / Pre-Med',
    'B.S. Neuroscience',
    'B.S. Public Health / Health Sciences',
    'B.S. Kinesiology / Physical Therapy Track',

    // Engineering & Hardware
    'B.S. Mechanical Engineering',
    'B.S. Electrical Engineering',
    'B.S. Aerospace Engineering',
    'B.S. Biomedical Engineering',
    'B.S. Chemical Engineering',
    'B.S. Civil & Environmental Engineering',
    'B.S. Industrial & Systems Engineering',
    'B.S. Materials Science & Engineering',

    // Mathematics & Physical Sciences
    'B.S. Mathematics / Applied Mathematics',
    'B.S. Statistics / Applied Probability',
    'B.S. Physics / Engineering Physics',

    // Social Sciences, Humanities & Design
    'B.A. Political Science / Government',
    'B.A. International Relations / Global Affairs',
    'B.A. Psychology / Behavioral Science',
    'B.A. Media, Journalism & Digital Communications',
    'B.S. / B.A. Graphic Design / UI/UX Product Design',
    'B.A. English / Professional Writing',
    'B.A. History / Philosophy / Law Track'
  ],
  graduate: [
    'M.S. Computer Science (MSCS)',
    'M.S. Artificial Intelligence & Machine Learning',
    'M.S. Data Science / Analytics',
    'M.S. Electrical Engineering & Computer Sciences (EECS)',
    'Master of Business Administration (MBA)',
    'M.S. Finance / M.S. Quantitative Finance (MSQF)',
    'M.S. Accounting & Taxation',
    'Master of Health Administration (MHA) / MSN Nursing',
    'M.S. Biotechnology & Biomedical Engineering',
    'M.S. Cybersecurity',
    'M.S. Robotics & Autonomous Systems',
    'M.S. Mechanical & Aerospace Engineering',
    'Master of Public Policy (MPP) / Master of Public Administration (MPA)',
    'Juris Doctor (J.D. Law)',
    'Doctor of Medicine (M.D.) / Doctor of Pharmacy (Pharm.D.)',
    'Ph.D. Computer Science (AI / Systems / Security)',
    'Ph.D. Biomedical Sciences / Bioengineering',
    'Ph.D. Economics / Quantitative Finance'
  ]
};

export const COMPANY_DATABASE: CompanyInfo[] = [
  // Tech, Software, Cloud & AI
  { name: 'Google', category: 'Technology, Software & AI', domain: 'google.com', logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Meta', category: 'Technology, Software & AI', domain: 'meta.com', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Apple', category: 'Technology, Software & AI', domain: 'apple.com', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Opening Soon' },
  { name: 'Microsoft', category: 'Technology, Software & AI', domain: 'microsoft.com', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Amazon', category: 'Technology, Software & AI', domain: 'amazon.com', logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Nvidia', category: 'Technology, Software & AI', domain: 'nvidia.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Opening Soon' },
  { name: 'Anthropic', category: 'Technology, Software & AI', domain: 'anthropic.com', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'OpenAI', category: 'Technology, Software & AI', domain: 'openai.com', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Selective' },
  { name: 'Stripe', category: 'Banking, Investment Banking & Capital Markets', domain: 'stripe.com', logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Databricks', category: 'Technology, Software & AI', domain: 'databricks.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Opening Soon' },
  { name: 'Palantir Technologies', category: 'Government, Public Policy, Defense & Law', domain: 'palantir.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Snowflake', category: 'Technology, Software & AI', domain: 'snowflake.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Uber', category: 'Technology, Software & AI', domain: 'uber.com', logoUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Airbnb', category: 'Technology, Software & AI', domain: 'airbnb.com', logoUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Rolling' },
  { name: 'Netflix', category: 'Media, Entertainment, Gaming & Telecom', domain: 'netflix.com', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Selective' },
  { name: 'Salesforce', category: 'Technology, Software & AI', domain: 'salesforce.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'AMD', category: 'Semiconductor & Hardware Engineering', domain: 'amd.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Intel', category: 'Semiconductor & Hardware Engineering', domain: 'intel.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Rolling' },
  { name: 'Qualcomm', category: 'Semiconductor & Hardware Engineering', domain: 'qualcomm.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Texas Instruments', category: 'Semiconductor & Hardware Engineering', domain: 'ti.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Adobe', category: 'Technology, Software & AI', domain: 'adobe.com', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Figma', category: 'Technology, Software & AI', domain: 'figma.com', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Notion', category: 'Technology, Software & AI', domain: 'notion.so', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Scale AI', category: 'Technology, Software & AI', domain: 'scale.com', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Atlassian', category: 'Technology, Software & AI', domain: 'atlassian.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Cisco Systems', category: 'Technology, Software & AI', domain: 'cisco.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Oracle', category: 'Technology, Software & AI', domain: 'oracle.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'IBM', category: 'Technology, Software & AI', domain: 'ibm.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'ServiceNow', category: 'Technology, Software & AI', domain: 'servicenow.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Workday', category: 'Technology, Software & AI', domain: 'workday.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Cloudflare', category: 'Technology, Software & AI', domain: 'cloudflare.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Datadog', category: 'Technology, Software & AI', domain: 'datadoghq.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'HubSpot', category: 'Technology, Software & AI', domain: 'hubspot.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Perplexity AI', category: 'Technology, Software & AI', domain: 'perplexity.ai', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Selective' },
  { name: 'Rippling', category: 'Technology, Software & AI', domain: 'rippling.com', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Ramp', category: 'Banking, Investment Banking & Capital Markets', domain: 'ramp.com', logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Plaid', category: 'Banking, Investment Banking & Capital Markets', domain: 'plaid.com', logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Brex', category: 'Banking, Investment Banking & Capital Markets', domain: 'brex.com', logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Coinbase', category: 'Banking, Investment Banking & Capital Markets', domain: 'coinbase.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Robinhood', category: 'Banking, Investment Banking & Capital Markets', domain: 'robinhood.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Quantitative Finance & Trading
  { name: 'Citadel & Citadel Securities', category: 'Quantitative Finance & Trading', domain: 'citadelsecurities.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Jane Street', category: 'Quantitative Finance & Trading', domain: 'janestreet.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Two Sigma', category: 'Quantitative Finance & Trading', domain: 'twosigma.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Opening Soon' },
  { name: 'Hudson River Trading (HRT)', category: 'Quantitative Finance & Trading', domain: 'hudson-trading.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'DE Shaw & Co', category: 'Quantitative Finance & Trading', domain: 'deshaw.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Jump Trading', category: 'Quantitative Finance & Trading', domain: 'jumptrading.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Selective' },
  { name: 'Optiver', category: 'Quantitative Finance & Trading', domain: 'optiver.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'SIG (Susquehanna)', category: 'Quantitative Finance & Trading', domain: 'sig.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'IMC Trading', category: 'Quantitative Finance & Trading', domain: 'imc.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Point72', category: 'Quantitative Finance & Trading', domain: 'point72.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Millennium Management', category: 'Quantitative Finance & Trading', domain: 'mlp.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Balyasny Asset Management', category: 'Quantitative Finance & Trading', domain: 'bamfunds.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Akuna Capital', category: 'Quantitative Finance & Trading', domain: 'akunacapital.com', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Investment Banking, Capital Markets & Private Equity
  { name: 'Goldman Sachs', category: 'Banking, Investment Banking & Capital Markets', domain: 'goldmansachs.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Morgan Stanley', category: 'Banking, Investment Banking & Capital Markets', domain: 'morganstanley.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'JPMorgan Chase & Co', category: 'Banking, Investment Banking & Capital Markets', domain: 'jpmorganchase.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Fidelity Investments', category: 'Asset Management, Wealth & Private Equity', domain: 'fidelity.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Deutsche Bank', category: 'Banking, Investment Banking & Capital Markets', domain: 'db.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Bank of America', category: 'Banking, Investment Banking & Capital Markets', domain: 'bankofamerica.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Citigroup', category: 'Banking, Investment Banking & Capital Markets', domain: 'citigroup.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Wells Fargo', category: 'Banking, Investment Banking & Capital Markets', domain: 'wellsfargo.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Barclays', category: 'Banking, Investment Banking & Capital Markets', domain: 'barclays.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'UBS / Credit Suisse', category: 'Banking, Investment Banking & Capital Markets', domain: 'ubs.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'RBC Capital Markets', category: 'Banking, Investment Banking & Capital Markets', domain: 'rbccm.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Jefferies', category: 'Banking, Investment Banking & Capital Markets', domain: 'jefferies.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Evercore', category: 'Banking, Investment Banking & Capital Markets', domain: 'evercore.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Lazard', category: 'Banking, Investment Banking & Capital Markets', domain: 'lazard.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Centerview Partners', category: 'Banking, Investment Banking & Capital Markets', domain: 'centerviewpartners.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Selective' },
  { name: 'Moelis & Company', category: 'Banking, Investment Banking & Capital Markets', domain: 'moelis.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Houlihan Lokey', category: 'Banking, Investment Banking & Capital Markets', domain: 'hl.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Blackstone', category: 'Asset Management, Wealth & Private Equity', domain: 'blackstone.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Selective' },
  { name: 'KKR & Co', category: 'Asset Management, Wealth & Private Equity', domain: 'kkr.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Selective' },
  { name: 'Carlyle Group', category: 'Asset Management, Wealth & Private Equity', domain: 'carlyle.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Apollo Global Management', category: 'Asset Management, Wealth & Private Equity', domain: 'apollo.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'BlackRock', category: 'Asset Management, Wealth & Private Equity', domain: 'blackrock.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Vanguard', category: 'Asset Management, Wealth & Private Equity', domain: 'vanguard.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Charles Schwab', category: 'Asset Management, Wealth & Private Equity', domain: 'schwab.com', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Accounting, Audit & Tax (Big 4 & Top National)
  { name: 'Deloitte', category: 'Accounting, Audit & Tax Services', domain: 'deloitte.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'PwC (PricewaterhouseCoopers)', category: 'Accounting, Audit & Tax Services', domain: 'pwc.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'EY (Ernst & Young)', category: 'Accounting, Audit & Tax Services', domain: 'ey.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'KPMG', category: 'Accounting, Audit & Tax Services', domain: 'kpmg.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Grant Thornton', category: 'Accounting, Audit & Tax Services', domain: 'grantthornton.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'BDO USA', category: 'Accounting, Audit & Tax Services', domain: 'bdo.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'RSM US', category: 'Accounting, Audit & Tax Services', domain: 'rsmus.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Baker Tilly', category: 'Accounting, Audit & Tax Services', domain: 'bakertilly.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Management Consulting & Advisory
  { name: 'McKinsey & Company', category: 'Management Consulting & Business Strategy', domain: 'mckinsey.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Boston Consulting Group (BCG)', category: 'Management Consulting & Business Strategy', domain: 'bcg.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Bain & Company', category: 'Management Consulting & Business Strategy', domain: 'bain.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Oliver Wyman', category: 'Management Consulting & Business Strategy', domain: 'oliverwyman.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Accenture Strategy', category: 'Management Consulting & Business Strategy', domain: 'accenture.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'L.E.K. Consulting', category: 'Management Consulting & Business Strategy', domain: 'lek.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Strategy& (PwC)', category: 'Management Consulting & Business Strategy', domain: 'strategyand.pwc.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'EY-Parthenon', category: 'Management Consulting & Business Strategy', domain: 'ey.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Gartner', category: 'Management Consulting & Business Strategy', domain: 'gartner.com', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Healthcare, BioTech & Life Sciences
  { name: 'Pfizer', category: 'Biotech, Pharmaceuticals & Life Sciences', domain: 'pfizer.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Johnson & Johnson', category: 'Biotech, Pharmaceuticals & Life Sciences', domain: 'jnj.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Eli Lilly and Company', category: 'Biotech, Pharmaceuticals & Life Sciences', domain: 'lilly.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Moderna', category: 'Biotech, Pharmaceuticals & Life Sciences', domain: 'modernatx.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Genentech / Roche', category: 'Biotech, Pharmaceuticals & Life Sciences', domain: 'gene.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Opening Soon' },
  { name: 'Illumina', category: 'Biotech, Pharmaceuticals & Life Sciences', domain: 'illumina.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Rolling' },
  { name: 'Medtronic', category: 'Healthcare, Clinical Medicine & Nursing', domain: 'medtronic.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Stryker', category: 'Healthcare, Clinical Medicine & Nursing', domain: 'stryker.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Thermo Fisher Scientific', category: 'Biotech, Pharmaceuticals & Life Sciences', domain: 'thermofisher.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'UnitedHealth Group / Optum', category: 'Healthcare, Clinical Medicine & Nursing', domain: 'unitedhealthgroup.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Mayo Clinic Health System', category: 'Healthcare, Clinical Medicine & Nursing', domain: 'mayoclinic.org', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Johns Hopkins Health System', category: 'Healthcare, Clinical Medicine & Nursing', domain: 'johnshopkins.edu', logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Kaiser Permanente', category: 'Healthcare, Clinical Medicine & Nursing', domain: 'kaiserpermanente.org', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Cleveland Clinic', category: 'Healthcare, Clinical Medicine & Nursing', domain: 'clevelandclinic.org', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'CVS Health', category: 'Healthcare, Clinical Medicine & Nursing', domain: 'cvshealth.com', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Aerospace, Defense, Automotive & Robotics
  { name: 'SpaceX', category: 'Aerospace, Defense & National Security', domain: 'spacex.com', logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Anduril Industries', category: 'Aerospace, Defense & National Security', domain: 'anduril.com', logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Tesla', category: 'Automotive, EV & Autonomous Systems', domain: 'tesla.com', logoUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Lockheed Martin', category: 'Aerospace, Defense & National Security', domain: 'lockheedmartin.com', logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Northrop Grumman', category: 'Aerospace, Defense & National Security', domain: 'northropgrumman.com', logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'The Boeing Company', category: 'Aerospace, Defense & National Security', domain: 'boeing.com', logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'General Motors (GM)', category: 'Automotive, EV & Autonomous Systems', domain: 'gm.com', logoUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Ford Motor Company', category: 'Automotive, EV & Autonomous Systems', domain: 'ford.com', logoUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Rivian', category: 'Automotive, EV & Autonomous Systems', domain: 'rivian.com', logoUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Honeywell', category: 'Aerospace, Defense & National Security', domain: 'honeywell.com', logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'GE Aerospace', category: 'Aerospace, Defense & National Security', domain: 'geaerospace.com', logoUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Consumer Goods, Retail & E-Commerce
  { name: 'Nike', category: 'Consumer Goods, Retail & E-Commerce', domain: 'nike.com', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Procter & Gamble (P&G)', category: 'Consumer Goods, Retail & E-Commerce', domain: 'pg.com', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'L\'Oréal', category: 'Consumer Goods, Retail & E-Commerce', domain: 'loreal.com', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Walmart', category: 'Consumer Goods, Retail & E-Commerce', domain: 'walmart.com', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Target', category: 'Consumer Goods, Retail & E-Commerce', domain: 'target.com', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'PepsiCo', category: 'Consumer Goods, Retail & E-Commerce', domain: 'pepsico.com', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'The Coca-Cola Company', category: 'Consumer Goods, Retail & E-Commerce', domain: 'coca-colacompany.com', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Unilever', category: 'Consumer Goods, Retail & E-Commerce', domain: 'unilever.com', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Media, Entertainment, Gaming & Telecom
  { name: 'The Walt Disney Company', category: 'Media, Entertainment, Gaming & Telecom', domain: 'disney.com', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Spotify', category: 'Media, Entertainment, Gaming & Telecom', domain: 'spotify.com', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Warner Bros. Discovery', category: 'Media, Entertainment, Gaming & Telecom', domain: 'wbd.com', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Electronic Arts (EA)', category: 'Media, Entertainment, Gaming & Telecom', domain: 'ea.com', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Riot Games', category: 'Media, Entertainment, Gaming & Telecom', domain: 'riotgames.com', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Epic Games', category: 'Media, Entertainment, Gaming & Telecom', domain: 'epicgames.com', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },

  // Energy, CleanTech, Real Estate, Government & Education
  { name: 'CBRE Group', category: 'Real Estate, Construction & Infrastructure', domain: 'cbre.com', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'JLL (Jones Lang LaSalle)', category: 'Real Estate, Construction & Infrastructure', domain: 'jll.com', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'ExxonMobil', category: 'Energy, CleanTech & Sustainability', domain: 'exxonmobil.com', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Chevron', category: 'Energy, CleanTech & Sustainability', domain: 'chevron.com', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'NextEra Energy', category: 'Energy, CleanTech & Sustainability', domain: 'nexteraenergy.com', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'U.S. Federal Government (NASA / NSA / DoD)', category: 'Government, Public Policy, Defense & Law', domain: 'usa.gov', logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'Federal Reserve System', category: 'Government, Public Policy, Defense & Law', domain: 'federalreserve.gov', logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' },
  { name: 'United Nations / World Bank', category: 'Education, Higher Ed & Non-Profit', domain: 'un.org', logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=120&q=80', hiringStatus: 'Active Hiring' }
];

export const ROLE_DATABASE: Record<string, string[]> = {
  'Technology, Software & AI': [
    'Software Engineer',
    'Full-Stack Developer',
    'Backend Systems Engineer',
    'Frontend / UI Engineer',
    'AI / Machine Learning Engineer',
    'LLM Infrastructure Researcher',
    'Computer Vision Scientist',
    'Data Scientist',
    'Data Engineer',
    'Cloud & DevOps Engineer',
    'Technical Product Manager (TPM)',
    'Site Reliability Engineer (SRE)',
    'Mobile Engineer (iOS / Android)',
    'Solutions Architect',
    'Cybersecurity Analyst',
    'Embedded C/C++ Firmware Engineer',
    'Quantum Computing Researcher'
  ],
  'Banking, Investment Banking & Capital Markets': [
    'Investment Banking Analyst',
    'M&A Investment Banking Summer Associate',
    'Equity Research Analyst',
    'Global Markets & Trading Analyst',
    'Corporate Banking Associate',
    'Credit Risk Analyst',
    'Capital Markets Analyst',
    'FinTech Product Manager',
    'Public Finance Associate',
    'Financial Analyst'
  ],
  'Quantitative Finance & Trading': [
    'Quantitative Researcher',
    'Quantitative Trader',
    'Quantitative Software Engineer (QSE)',
    'Algorithmic Trading Developer',
    'Low-Latency C++ Engineer',
    'Quantitative Risk Analyst',
    'Portfolio Analytics Specialist',
    'Stochastic Modeler'
  ],
  'Asset Management, Wealth & Private Equity': [
    'Private Equity Associate',
    'Venture Capital Analyst',
    'Portfolio Management Associate',
    'Wealth Management Advisor',
    'Alternative Investments Analyst',
    'Asset Management Analyst',
    'Real Estate Private Equity Analyst'
  ],
  'Accounting, Audit & Tax Services': [
    'Financial Auditor / Staff Auditor',
    'Tax Associate / CPA Candidate',
    'Corporate Accountant',
    'Forensic Accounting Specialist',
    'Financial Advisory Associate',
    'Risk Assurance Consultant',
    'FP&A Financial Analyst',
    'International Tax Consultant',
    'ESG & Sustainability Auditor'
  ],
  'Management Consulting & Business Strategy': [
    'Management Consultant',
    'Strategy Analyst',
    'Technology Strategy Consultant',
    'Economic Analyst',
    'Operations Consultant',
    'Healthcare Consultant',
    'Business Transformation Analyst',
    'Supply Chain Consultant',
    'Digital Transformation Lead'
  ],
  'Healthcare, Clinical Medicine & Nursing': [
    'Registered Nurse (RN) / Nurse Specialist',
    'Clinical Research Coordinator',
    'Health Systems Administrator',
    'Healthcare Data Analyst',
    'Hospital Operations Manager',
    'Medical Device Specialist',
    'Public Health Analyst',
    'Clinical Informaticist'
  ],
  'Biotech, Pharmaceuticals & Life Sciences': [
    'Bioinformatics Scientist',
    'Biomedical Engineer',
    'Computational Biologist',
    'Pharmaceutical Research Associate',
    'Drug Discovery Scientist',
    'Gene Therapy Specialist',
    'Regulatory Affairs Associate',
    'Clinical Trial Manager'
  ],
  'Aerospace, Defense & National Security': [
    'Aerospace Software Engineer',
    'Avionics Developer',
    'Propulsion Engineer',
    'Guidance, Navigation & Control (GNC) Engineer',
    'Defense Systems Analyst',
    'Cyber Intelligence Analyst',
    'Satellite Hardware Engineer'
  ],
  'Automotive, EV & Autonomous Systems': [
    'Autonomous Driving Systems Engineer',
    'EV Battery Systems Engineer',
    'Robotics & Controls Engineer',
    'Vehicle Integration Engineer',
    'Embedded Firmware Developer'
  ],
  'Semiconductor & Hardware Engineering': [
    'Silicon Design & Verification Engineer',
    'ASIC / FPGA Hardware Engineer',
    'Microarchitecture Engineer',
    'Semiconductor Fabrication Engineer',
    'Hardware Validation Engineer'
  ],
  'Consumer Goods, Retail & E-Commerce': [
    'Brand Marketing Manager',
    'Supply Chain Analyst',
    'E-Commerce Operations Specialist',
    'Category Growth Analyst',
    'Consumer Insights Analyst',
    'Product Developer'
  ],
  'Media, Entertainment, Gaming & Telecom': [
    'Media Strategy Analyst',
    'Digital Content & Growth Specialist',
    'Game Developer / Engine Engineer',
    '3D Graphics & Rendering Developer',
    'UI/UX Product Designer',
    'Network Systems Engineer'
  ],
  'Real Estate, Construction & Infrastructure': [
    'Real Estate Investment Analyst',
    'Commercial Leasing Associate',
    'Construction Project Engineer',
    'Property Manager',
    'Urban Planning Analyst',
    'Structural Civil Engineer'
  ],
  'Energy, CleanTech & Sustainability': [
    'CleanTech Systems Engineer',
    'Renewable Energy Project Developer',
    'Energy Trader / Quantitative Analyst',
    'Sustainability & Carbon Markets Manager',
    'Petroleum & Energy Analyst'
  ],
  'Government, Public Policy, Defense & Law': [
    'Public Policy Analyst',
    'Economic Policy Researcher',
    'Legal Assistant / Paralegal',
    'Compliance & Regulatory Specialist',
    'Legislative Aide',
    'Foreign Affairs Analyst'
  ],
  'Education, Higher Ed & Non-Profit': [
    'Educational Program Coordinator',
    'Non-Profit Operations Manager',
    'Grant Writer & Researcher',
    'Academic Research Associate',
    'Higher Ed Student Advisor'
  ]
};

export const ALL_TARGET_ROLES_FLAT = Array.from(
  new Set(Object.values(ROLE_DATABASE).flat())
);

/**
 * Smart recommendation engine that generates personalized company suggestions
 * based on the user's Major, Target Functions, and Target Industries.
 */
export function getSuggestedCompanies(
  major: string = '',
  targetFunctions: string[] = [],
  targetIndustries: string[] = [],
  existingCompanies: string[] = []
): CompanyInfo[] {
  const existingSet = new Set(existingCompanies);
  const majorLower = major.toLowerCase();
  const functionsLower = targetFunctions.map(f => f.toLowerCase());
  const industriesLower = targetIndustries.map(i => i.toLowerCase());

  // Score each company
  const scored = COMPANY_DATABASE.map(comp => {
    let score = 0;
    const catLower = comp.category.toLowerCase();
    const nameLower = comp.name.toLowerCase();

    // Industry match
    if (industriesLower.some(ind => ind.includes(catLower) || catLower.includes(ind))) {
      score += 10;
    }

    // Function match heuristics
    if (functionsLower.some(f => f.includes('software') || f.includes('tech') || f.includes('data') || f.includes('ai'))) {
      if (catLower.includes('technology') || nameLower.includes('google') || nameLower.includes('meta') || nameLower.includes('microsoft') || nameLower.includes('apple') || nameLower.includes('nvidia') || nameLower.includes('stripe')) {
        score += 8;
      }
    }
    if (functionsLower.some(f => f.includes('finance') || f.includes('investment') || f.includes('quant') || f.includes('banking'))) {
      if (catLower.includes('banking') || catLower.includes('quantitative') || catLower.includes('asset') || nameLower.includes('citadel') || nameLower.includes('jane street') || nameLower.includes('goldman') || nameLower.includes('jpmorgan') || nameLower.includes('fidelity') || nameLower.includes('deutsche')) {
        score += 8;
      }
    }
    if (functionsLower.some(f => f.includes('accounting') || f.includes('audit') || f.includes('tax'))) {
      if (catLower.includes('accounting') || nameLower.includes('deloitte') || nameLower.includes('pwc') || nameLower.includes('ey') || nameLower.includes('kpmg')) {
        score += 10;
      }
    }
    if (functionsLower.some(f => f.includes('consulting') || f.includes('strategy'))) {
      if (catLower.includes('consulting') || nameLower.includes('mckinsey') || nameLower.includes('bcg') || nameLower.includes('bain')) {
        score += 10;
      }
    }
    if (functionsLower.some(f => f.includes('clinical') || f.includes('healthcare') || f.includes('nursing') || f.includes('medicine'))) {
      if (catLower.includes('healthcare') || nameLower.includes('pfizer') || nameLower.includes('jnj') || nameLower.includes('mayo') || nameLower.includes('johns hopkins')) {
        score += 10;
      }
    }

    // Major match heuristics
    if (majorLower.includes('computer') || majorLower.includes('software') || majorLower.includes('data') || majorLower.includes('ai')) {
      if (catLower.includes('technology') || catLower.includes('quantitative')) score += 5;
    } else if (majorLower.includes('finance') || majorLower.includes('economics')) {
      if (catLower.includes('banking') || catLower.includes('quantitative') || catLower.includes('consulting')) score += 5;
    } else if (majorLower.includes('accounting')) {
      if (catLower.includes('accounting') || catLower.includes('banking')) score += 5;
    } else if (majorLower.includes('nursing') || majorLower.includes('health') || majorLower.includes('bio') || majorLower.includes('medical')) {
      if (catLower.includes('healthcare') || catLower.includes('biotech')) score += 8;
    } else if (majorLower.includes('mechanical') || majorLower.includes('aerospace')) {
      if (catLower.includes('aerospace') || catLower.includes('automotive')) score += 8;
    }

    return { comp, score };
  });

  // Filter out already selected, sort by score descending
  return scored
    .filter(item => !existingSet.has(item.comp.name))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(item => item.comp);
}

/**
 * Smart recommendation engine that generates personalized job title suggestions
 * based on Major, Target Functions, and Target Industries.
 */
export function getSuggestedRoles(
  major: string = '',
  targetFunctions: string[] = [],
  targetIndustries: string[] = [],
  existingRoles: string[] = []
): string[] {
  const existingSet = new Set(existingRoles);
  const majorLower = major.toLowerCase();

  const suggestedSet = new Set<string>();

  // 1. Gather roles directly from selected Target Functions in ROLE_DATABASE
  targetFunctions.forEach(fn => {
    Object.keys(ROLE_DATABASE).forEach(catKey => {
      if (catKey.toLowerCase().includes(fn.toLowerCase()) || fn.toLowerCase().includes(catKey.toLowerCase())) {
        ROLE_DATABASE[catKey].forEach(r => suggestedSet.add(r));
      }
    });
  });

  // 2. Gather roles directly from selected Target Industries in ROLE_DATABASE
  targetIndustries.forEach(ind => {
    Object.keys(ROLE_DATABASE).forEach(catKey => {
      if (catKey.toLowerCase().includes(ind.toLowerCase()) || ind.toLowerCase().includes(catKey.toLowerCase())) {
        ROLE_DATABASE[catKey].forEach(r => suggestedSet.add(r));
      }
    });
  });

  // 3. Fallback / Major heuristic suggestions
  if (majorLower.includes('computer') || majorLower.includes('software') || majorLower.includes('eecs')) {
    ['Software Engineer', 'Full-Stack Developer', 'Backend Systems Engineer', 'AI / Machine Learning Engineer', 'Cloud & DevOps Engineer', 'Technical Product Manager (TPM)', 'Quantitative Software Engineer (QSE)'].forEach(r => suggestedSet.add(r));
  } else if (majorLower.includes('data') || majorLower.includes('statistics') || majorLower.includes('math')) {
    ['Data Scientist', 'Data Engineer', 'Quantitative Researcher', 'AI / Machine Learning Engineer', 'Quantitative Trader'].forEach(r => suggestedSet.add(r));
  } else if (majorLower.includes('finance') || majorLower.includes('economics')) {
    ['Investment Banking Analyst', 'Private Equity Associate', 'Quantitative Researcher', 'Equity Research Analyst', 'Financial Analyst', 'Credit Risk Analyst'].forEach(r => suggestedSet.add(r));
  } else if (majorLower.includes('accounting')) {
    ['Financial Auditor / Staff Auditor', 'Tax Associate / CPA Candidate', 'Corporate Accountant', 'Risk Assurance Consultant', 'FP&A Financial Analyst'].forEach(r => suggestedSet.add(r));
  } else if (majorLower.includes('nursing') || majorLower.includes('health') || majorLower.includes('medical')) {
    ['Registered Nurse (RN) / Nurse Specialist', 'Clinical Research Coordinator', 'Health Systems Administrator', 'Healthcare Data Analyst'].forEach(r => suggestedSet.add(r));
  } else if (majorLower.includes('bio') || majorLower.includes('chemistry')) {
    ['Bioinformatics Scientist', 'Computational Biologist', 'Biomedical Engineer', 'Pharmaceutical Research Associate'].forEach(r => suggestedSet.add(r));
  } else if (majorLower.includes('mechanical') || majorLower.includes('aerospace')) {
    ['Aerospace Software Engineer', 'Mechanical Design Engineer', 'Robotics & Controls Engineer', 'Hardware Validation Engineer', 'Avionics Developer'].forEach(r => suggestedSet.add(r));
  } else if (majorLower.includes('business') || majorLower.includes('management') || majorLower.includes('marketing')) {
    ['Management Consultant', 'Strategy Analyst', 'Brand Marketing Manager', 'Supply Chain Analyst', 'Business Transformation Analyst'].forEach(r => suggestedSet.add(r));
  }

  // Default fallback if still small
  if (suggestedSet.size < 6) {
    ALL_TARGET_ROLES_FLAT.slice(0, 10).forEach(r => suggestedSet.add(r));
  }

  return Array.from(suggestedSet)
    .filter(role => !existingSet.has(role))
    .slice(0, 12);
}

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What type of daily problem-solving energizes you the most?',
    options: [
      { label: 'Building tangible software applications, web tools, or mobile apps', traits: ['SWE', 'Fullstack'] },
      { label: 'Developing AI algorithms, training neural networks, or analyzing vast data', traits: ['AI', 'Data'] },
      { label: 'Mathematical modeling, probability puzzles, and high-speed financial algorithms', traits: ['Quant'] },
      { label: 'Defining product roadmaps, user experience, and team strategy', traits: ['PM', 'Consulting'] },
      { label: 'Securing cloud infrastructure, networks, and low-level system code', traits: ['Systems', 'Cyber'] }
    ]
  },
  {
    id: 'q2',
    question: 'How do you like to balance theory/math versus hands-on coding?',
    options: [
      { label: 'Heavy coding & rapid iteration with medium theory', traits: ['SWE', 'Fullstack'] },
      { label: 'Heavy math, linear algebra, statistics & deep learning frameworks', traits: ['AI', 'Data'] },
      { label: 'Rigorous probability, differential equations & low-latency execution', traits: ['Quant'] },
      { label: 'Strategic analysis, user interviews, metrics & high-level architecture', traits: ['PM'] }
    ]
  },
  {
    id: 'q3',
    question: 'What kind of work culture and environment appeals to you?',
    options: [
      { label: 'High-autonomy product engineering team at a scaling tech leader', traits: ['SWE'] },
      { label: 'Cutting-edge AI research lab or AI startup pushing technological frontiers', traits: ['AI'] },
      { label: 'Fast-paced, high-stakes quantitative trading floor or hedge fund', traits: ['Quant'] },
      { label: 'Cross-functional collaborative environment bridging business and tech', traits: ['PM', 'Consulting'] }
    ]
  },
  {
    id: 'q4',
    question: 'What output or impact makes you feel most accomplished?',
    options: [
      { label: 'Shipping a feature that millions of users interact with seamlessly', traits: ['SWE', 'Fullstack'] },
      { label: 'Training a model that beats state-of-the-art accuracy benchmarks', traits: ['AI'] },
      { label: 'Executing profitable automated trading strategies with microsecond latency', traits: ['Quant'] },
      { label: 'Launching a new product line from 0 to 1 that drives company revenue', traits: ['PM'] }
    ]
  },
  {
    id: 'q5',
    question: 'What technical tools or topics are you most eager to master?',
    options: [
      { label: 'React, TypeScript, Node.js, GraphQL, Microservices & Docker', traits: ['SWE', 'Fullstack'] },
      { label: 'PyTorch, Transformers, CUDA, LLM Fine-Tuning & Data Pipelines', traits: ['AI'] },
      { label: 'C++, Stochastic Calculus, Backtesting Engines & Low-Latency Networking', traits: ['Quant'] },
      { label: 'Product Analytics, SQL, Agile Sprints, UI Wireframing & Business Cases', traits: ['PM'] }
    ]
  }
];
