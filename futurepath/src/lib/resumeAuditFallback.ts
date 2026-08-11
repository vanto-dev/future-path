import { StudentProfile, ResumeAuditResult } from '../types';

export function generateAdaptiveResumeAuditFallback(resumeText: string, profile: StudentProfile): ResumeAuditResult {
  const major = profile.major || 'General Studies';
  const targetRole = profile.targetJobTitles[0] || 'Target Role';
  const targetIndustry = profile.targetIndustries[0] || 'Target Industry';
  const targetRolesList = profile.targetJobTitles.length ? profile.targetJobTitles.join(', ') : 'targeted positions';

  const contextStr = (major + ' ' + (profile.customMajorCategory || '') + ' ' + profile.targetJobTitles.join(' ') + ' ' + profile.targetIndustries.join(' ') + ' ' + (profile.targetFunctions?.join(' ') || '')).toLowerCase();

  const isFinance = /finance|banking|investment|accounting|economics|fintech|quant|hedge|equity|asset|valuation/i.test(contextStr);
  const isConsulting = /consulting|strategy|management|advisory|business analyst|operations analyst/i.test(contextStr);
  const isHealthcare = /health|medical|bio|nursing|pre-med|clinical|pharmacy|public health|genetics/i.test(contextStr);
  const isMarketing = /marketing|brand|growth|content|sales|media|communications|product marketing|public relations/i.test(contextStr);
  const isEngineering = /mechanical|civil|electrical|aerospace|chemical|industrial engineering|robotics|cad/i.test(contextStr);

  let bestFitRoles: string[] = [];
  let missingKeywords: string[] = [];
  let bulletRewrites: { original: string; improved: string; reason: string }[] = [];
  let strengths: string[] = [];
  let keyImprovements: string[] = [];

  if (isFinance) {
    bestFitRoles = ['Financial Analyst', 'Corporate Finance Associate', 'Investment Banking Analyst', 'Equity Research Assistant'];
    missingKeywords = ['Financial Modeling', 'DCF Valuation', 'EBITDA', 'Excel (Pivot Tables / VLOOKUP)', 'SEC Filings (10-K/10-Q)', 'GAAP', 'Variance Analysis', 'LBO Analysis'];
    bulletRewrites = [
      {
        original: 'Assisted team with analyzing financial reports and updating budget spreadsheets.',
        improved: 'Constructed 3-statement financial models and DCF valuations for 8 portfolio firms, identifying $3.4M in EBITDA optimization opportunities.',
        reason: 'Replaced passive support phrasing with active financial modeling methodologies and explicit dollar impact.'
      },
      {
        original: 'Prepared weekly revenue presentations for department leadership.',
        improved: 'Synthesized quarterly revenue variances across 14 business units into executive decks, accelerating board reporting speed by 25%.',
        reason: 'Added quantitative scale and productivity efficiency metrics for finance leadership.'
      },
      {
        original: 'Monitored account balances and processed transaction records.',
        improved: 'Audited $1.2M in monthly accounts receivable transactions, improving reconciliation accuracy to 99.8% and eliminating audit discrepancies.',
        reason: 'Quantified total transaction volume and compliance precision.'
      }
    ];
    strengths = [
      `Strong alignment between ${major} background and core financial analysis requirements.`,
      'Solid evidence of quantitative problem-solving and structured numerical reasoning.',
      'Demonstrated experience managing data-intensive workflows and reporting schedules.'
    ];
    keyImprovements = [
      `Explicitly highlight financial modeling and valuation methodologies tailored for ${targetRole}.`,
      'Add specific transaction volumes, dollar figures, or portfolio scale metrics to bullet points.',
      'Incorporate SEC filings (10-K/10-Q) and financial software tools like Bloomberg or CapIQ.'
    ];
  } else if (isConsulting) {
    bestFitRoles = ['Management Consulting Analyst', 'Strategy & Operations Associate', 'Business Analyst', 'Market Intelligence Associate'];
    missingKeywords = ['MECE Framework', 'Market Sizing', 'Stakeholder Interviews', 'Process Optimization', 'Client Decks', 'KPI Benchmarking', 'Data Synthesis', 'Root Cause Analysis'];
    bulletRewrites = [
      {
        original: 'Researched market trends and wrote summary reports for the team.',
        improved: 'Executed primary market research across 30+ competitor benchmarks, producing a MECE strategic framework that informed a $500K GTM initiative.',
        reason: 'Added consulting framework terminology and commercial outcome metrics.'
      },
      {
        original: 'Helped improve team workflow and communication.',
        improved: 'Redesigned cross-departmental operational workflows across 5 project teams, accelerating project delivery timelines by 20%.',
        reason: 'Replaced vague support statements with quantified operational optimization results.'
      },
      {
        original: 'Organized client survey data and summarized results.',
        improved: 'Synthesized 1,200+ client survey responses using statistical segmentation, delivering strategic recommendations directly to executive stakeholders.',
        reason: 'Quantified sample sizes and highlighted executive-level deliverable impact.'
      }
    ];
    strengths = [
      `Solid strategic framing reflecting ${major} analytical fundamentals.`,
      'Demonstrated versatility across primary research, synthesis, and team project delivery.',
      'Clear project-based structure emphasizing outcomes.'
    ];
    keyImprovements = [
      `Frame bullet points using hypothesis-driven problem-solving suited for ${targetRole}.`,
      'Include market sizing metrics, team sizes, and client-facing deliverable counts.',
      'Highlight frameworks (MECE, Porter\'s 5 Forces) and advanced data visualization tools.'
    ];
  } else if (isHealthcare) {
    bestFitRoles = ['Clinical Research Coordinator', 'Healthcare Data Analyst', 'Medical Assistant', 'Public Health Program Associate'];
    missingKeywords = ['HIPAA Compliance', 'Clinical Protocols', 'Patient Care & Intake', 'EHR/EMR Systems', 'IRB Documentation', 'Biostatistics (SPSS/R)', 'Lab Safety', 'Assay Protocols'];
    bulletRewrites = [
      {
        original: 'Assisted doctors with patient files and laboratory records.',
        improved: 'Managed EHR documentation and intake protocols for 120+ weekly patients while maintaining 100% HIPAA compliance.',
        reason: 'Quantified patient load and underscored regulatory compliance standards.'
      },
      {
        original: 'Collected survey data for health study.',
        improved: 'Coordinated participant enrollment for a 250-patient clinical trial, achieving a 94% retention rate over a 6-month study window.',
        reason: 'Added sample size and clinical trial retention metrics.'
      },
      {
        original: 'Maintained lab equipment and assisted with experiments.',
        improved: 'Calibrated laboratory instruments and executed standard assay protocols for 50+ specimen trials with zero safety infractions.',
        reason: 'Specified clinical lab protocols and quality control metrics.'
      }
    ];
    strengths = [
      `Strong foundational background in ${major} suited for clinical and research environments.`,
      'Demonstrated detail-oriented documentation and patient-focused communication.',
      'Hands-on experience with healthcare workflows and lab protocols.'
    ];
    keyImprovements = [
      `Integrate specific electronic health record (EHR) platforms and clinical software tools for ${targetRole}.`,
      'Quantify patient volume, clinical trial sample sizes, or lab throughput.',
      'Highlight compliance certifications (HIPAA, CITI Program, CPR/BLS).'
    ];
  } else if (isMarketing) {
    bestFitRoles = ['Growth Marketing Specialist', 'Content Strategist', 'Digital Marketing Analyst', 'Brand Management Associate'];
    missingKeywords = ['Google Analytics 4', 'Conversion Rate Optimization (CRO)', 'Customer Acquisition Cost (CAC)', 'A/B Testing', 'SEO/SEM', 'Copywriting', 'Klaviyo / Mailchimp', 'Funnel Analysis'];
    bulletRewrites = [
      {
        original: 'Managed social media channels and posted content regularly.',
        improved: 'Orchestrated cross-channel social media campaigns generating 65,000+ impressions and increasing organic follower conversion by 38%.',
        reason: 'Quantified reach metrics and conversion impact.'
      },
      {
        original: 'Wrote blog articles and newsletters for company website.',
        improved: 'Authored 12 SEO-optimized articles driving a 42% increase in monthly organic site traffic and capturing 350+ newsletter leads.',
        reason: 'Connected content creation to organic traffic growth and lead generation.'
      },
      {
        original: 'Helped plan campus promotional events.',
        improved: 'Executed targeted promotional campaigns reaching 1,500+ students, driving record event attendance and achieving a $1.80 CAC.',
        reason: 'Incorporated acquisition metrics and cost efficiency.'
      }
    ];
    strengths = [
      `Strong creative and analytical balance aligned with ${major}.`,
      'Clear experience in content creation and audience engagement.',
      'Demonstrated initiative in campaign execution.'
    ];
    keyImprovements = [
      `Add explicit performance marketing metrics (ROI, CTR, CAC, ROAS) tailored for ${targetRole}.`,
      'Highlight proficiency in marketing analytics platforms (GA4, HubSpot, Meta Ads Manager).',
      'Showcase A/B testing methodologies and conversion funnels.'
    ];
  } else if (isEngineering) {
    bestFitRoles = ['Design Engineer', 'Project Engineer', 'Manufacturing Associate', 'Systems Engineering Assistant'];
    missingKeywords = ['SolidWorks / AutoCAD', 'FEA (Finite Element Analysis)', 'GD&T', 'Prototyping & DFM', 'MATLAB', 'Project Management', 'Root Cause Analysis', 'Technical Documentation'];
    bulletRewrites = [
      {
        original: 'Designed mechanical parts for student project.',
        improved: 'Engineered 12 custom CAD components in SolidWorks, conducting FEA stress simulations to reduce material weight by 15% while meeting safety margins.',
        reason: 'Specified CAD tools, FEA simulation methods, and material optimization percentages.'
      },
      {
        original: 'Tested prototype components in the lab.',
        improved: 'Executed rigorous load testing across 25 prototype iterations, documenting failure modes and improving structural durability by 30%.',
        reason: 'Added testing sample size and durability improvement metrics.'
      },
      {
        original: 'Worked with team on assembly line layout.',
        improved: 'Optimized sub-assembly layout for student vehicle project, cutting assembly throughput time by 18 minutes per unit.',
        reason: 'Quantified time savings and manufacturing flow improvements.'
      }
    ];
    strengths = [
      `Strong technical foundation in ${major} theory and design principles.`,
      'Hands-on prototyping and laboratory experimentation experience.',
      'Solid quantitative analytical skills.'
    ];
    keyImprovements = [
      `Include specific CAD/CAM software packages and engineering standards relevant to ${targetRole}.`,
      'Add metrics for tolerance limits, weight reductions, cost savings, or stress thresholds.',
      'Highlight industry standards (ASME, IEEE, ISO) and prototyping methodologies.'
    ];
  } else {
    // Tech / Software / Default
    bestFitRoles = [`${targetRole || 'Software Engineer'}`, `${major} Specialist`, 'Technical Analyst', 'Associate Product Specialist'];
    missingKeywords = ['System Architecture', 'CI/CD Pipelines', 'RESTful APIs', 'Unit & Integration Testing', 'Version Control (Git)', 'Data Structures', 'Cloud Deployment', 'Agile / Scrum'];
    bulletRewrites = [
      {
        original: 'Built a web application for class project using JavaScript.',
        improved: 'Engineered a responsive full-stack web application serving 1,200+ active user sessions with sub-200ms API response latency.',
        reason: 'Added specific performance metrics, scale, and architectural context.'
      },
      {
        original: 'Worked on database queries and bug fixes.',
        improved: 'Optimized PostgreSQL queries and indexing, cutting database response times by 35% across high-traffic endpoints.',
        reason: 'Quantified performance gains and technical depth.'
      },
      {
        original: 'Collaborated with team to build software features.',
        improved: 'Led Agile development sprints delivering 8 core features on schedule with 98% automated test code coverage.',
        reason: 'Added process methodology, delivery speed, and code quality metrics.'
      }
    ];
    strengths = [
      `Strong academic foundation in ${major} combined with practical project experience.`,
      'Clear evidence of problem-solving and domain application.',
      'Structured technical and communication capabilities.'
    ];
    keyImprovements = [
      `Tailor core project descriptions to highlight skills required for ${targetRole}.`,
      'Incorporate quantitative metrics (scale, throughput, efficiency, user adoption).',
      'Incorporate domain-specific industry tools and frameworks.'
    ];
  }

  return {
    overallScore: 82,
    atsCompatibilityScore: 85,
    impactScore: 78,
    targetRoleMatchScore: 81,
    bestFitRoles,
    targetRoleAlignment: `Your resume shows strong foundational alignment for roles like ${bestFitRoles.slice(0, 2).join(' and ')}. To maximize your match for ${targetRolesList} in ${targetIndustry}, emphasize domain metrics, specialized tools (${missingKeywords.slice(0, 3).join(', ')}), and quantified deliverables.`,
    strengths,
    keyImprovements,
    bulletRewrites,
    missingKeywords
  };
}
