import { StudentProfile } from '../types';

export interface SuggestedSoftSkill {
  name: string;
  reason: string;
  category: 'soft';
}

const COMMON_HIGH_VALUE_SOFT_SKILLS: { name: string; defaultReason: string }[] = [
  { name: 'Communication', defaultReason: 'Essential core competency for all graduate and industry roles.' },
  { name: 'Leadership', defaultReason: 'Highly sought after for rapid career advancement and project lead positions.' },
  { name: 'Teamwork & Collaboration', defaultReason: 'Demonstrates ability to work effectively across multi-disciplinary teams.' },
  { name: 'Problem Solving', defaultReason: 'Key analytical skill for solving complex operational and technical challenges.' },
  { name: 'Adaptability & Agility', defaultReason: 'Crucial for navigating fast-paced, evolving industry environments.' },
  { name: 'Time Management', defaultReason: 'Proves reliability in balancing tight deadlines and multiple priorities.' },
  { name: 'Critical Thinking', defaultReason: 'Fundamental for high-impact decision making and risk assessment.' },
  { name: 'Stakeholder Management', defaultReason: 'Valued for effectively communicating with managers, clients, and partners.' },
  { name: 'Presentation & Public Speaking', defaultReason: 'Demonstrates confidence in delivering executive briefings and team updates.' },
  { name: 'Conflict Resolution', defaultReason: 'Essential for maintaining positive team dynamics and cross-functional alignment.' },
  { name: 'Strategic Thinking', defaultReason: 'Key attribute for long-term project planning and business strategy.' },
  { name: 'Project Ownership & Execution', defaultReason: 'Shows accountability in driving initiatives from concept to delivery.' },
  { name: 'Data-Driven Decision Making', defaultReason: 'Combines quantitative reasoning with strategic problem solving.' },
  { name: 'Empathy & Active Listening', defaultReason: 'Critical for inclusive leadership and customer-centric design.' },
  { name: 'Negotiation & Influence', defaultReason: 'Valuable for alignment across teams, vendors, and strategic stakeholders.' }
];

export function getSuggestedSoftSkills(profile: StudentProfile): SuggestedSoftSkill[] {
  const existingSkillNames = new Set(
    (profile.skills || []).map(s => s.name.toLowerCase().trim())
  );

  const contextStr = (
    (profile.major || '') + ' ' +
    (profile.targetJobTitles || []).join(' ') + ' ' +
    (profile.targetIndustries || []).join(' ') + ' ' +
    (profile.targetFunctions || []).join(' ') + ' ' +
    (profile.resumeText || '') + ' ' +
    (profile.experiences || []).map(e => e.title + ' ' + e.description).join(' ')
  ).toLowerCase();

  const suggestions: SuggestedSoftSkill[] = [];

  // Domain-specific tailored suggestions
  if (/finance|banking|investment|accounting|equity/i.test(contextStr)) {
    suggestions.push(
      { name: 'Executive Financial Reporting', reason: 'Tailored for target Finance & Banking positions.', category: 'soft' },
      { name: 'Attention to Detail & Accuracy', reason: 'Critical for financial modeling and compliance.', category: 'soft' }
    );
  }

  if (/consulting|strategy|advisory|operations/i.test(contextStr)) {
    suggestions.push(
      { name: 'Client Relationship Management', reason: 'High-value skill for Consulting & Strategy roles.', category: 'soft' },
      { name: 'Structured Data Synthesis', reason: 'Essential for MECE frameworks and client presentations.', category: 'soft' }
    );
  }

  if (/computer|software|tech|data|engineering/i.test(contextStr)) {
    suggestions.push(
      { name: 'Agile & Sprint Collaboration', reason: 'In-demand for tech product development teams.', category: 'soft' },
      { name: 'Technical Documentation', reason: 'Crucial for scalable codebases and engineering design.', category: 'soft' }
    );
  }

  if (/health|medical|clinical|bio|nursing/i.test(contextStr)) {
    suggestions.push(
      { name: 'Patient Advocacy & Compassion', reason: 'Vital soft skill for healthcare and clinical research environments.', category: 'soft' },
      { name: 'Regulatory Compliance Precision', reason: 'Required for HIPAA and clinical trial protocols.', category: 'soft' }
    );
  }

  if (/marketing|brand|growth|sales|media/i.test(contextStr)) {
    suggestions.push(
      { name: 'Data Storytelling', reason: 'Key competency for campaign analysis and brand positioning.', category: 'soft' },
      { name: 'Audience Engagement', reason: 'Crucial for growth marketing and customer acquisition.', category: 'soft' }
    );
  }

  // Add general high-value soft skills
  COMMON_HIGH_VALUE_SOFT_SKILLS.forEach(item => {
    suggestions.push({
      name: item.name,
      reason: item.defaultReason,
      category: 'soft'
    });
  });

  // Filter out skills the user already possesses (case-insensitive check)
  const filtered = suggestions.filter(s => !existingSkillNames.has(s.name.toLowerCase().trim()));

  // Deduplicate suggested skills by name
  const uniqueMap = new Map<string, SuggestedSoftSkill>();
  filtered.forEach(s => {
    const key = s.name.toLowerCase().trim();
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, s);
    }
  });

  return Array.from(uniqueMap.values()).slice(0, 10);
}
