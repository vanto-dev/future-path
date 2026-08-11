export interface CourseRequirement {
  id: string;
  code: string;
  title: string;
  credits: number;
  category: 'core' | 'major_elective' | 'gen_ed' | 'prereq';
  status: 'completed' | 'in_progress' | 'planned';
  termTaken?: string;
  grade?: string; // Final grade for completed courses
  currentGrade?: string; // Current / mid-semester grade for in-progress courses
  professor?: string;
  syllabusUploaded?: boolean;
  syllabusFileName?: string;
  syllabusSummary?: string;
  remainingAssignments?: {
    id: string;
    title: string;
    dueDate: string;
    weightPercent?: number;
    category: 'Exam' | 'Essay' | 'Project' | 'Quiz' | 'Homework' | 'Presentation';
    completed?: boolean;
  }[];
  estimatedWeeksRemaining?: number;
  estimatedHoursRemaining?: number;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  category: 'academic' | 'exam' | 'holiday' | 'deadline' | 'registration';
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  description: string;
}

export interface GuidedElectiveGroup {
  id: string;
  groupName: string;
  requiredCount: number;
  description?: string;
  options: CourseRequirement[];
}

export interface DegreePlan {
  majorName: string;
  degreeType: string; // e.g., 'BS', 'BA', 'MS', 'BBA', 'BSN'
  requiredCredits: number;
  courses: CourseRequirement[];
  guidedElectiveGroups?: GuidedElectiveGroup[];
}

export interface UniversityInfo {
  id: string;
  name: string;
  location: string; // e.g. "Berkeley, CA"
  city?: string;
  state?: string;
  country?: string;
  termType: 'semester' | 'quarter';
  calendarEvents: AcademicCalendarEvent[];
  degreePlans: DegreePlan[];
  offeredMajors?: string[];
  offeredDegreeTypes?: string[];
  offeredMinors?: string[];
  offeredConcentrations?: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  type: 'internship' | 'part_time' | 'full_time' | 'project' | 'research' | 'leadership';
  startDate: string;
  endDate: string;
  description: string;
  skillsUsed: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  techStack: string[];
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  marketabilityScore?: number;
  aiFeedback?: string;
  aiVerdict?: 'High Marketability' | 'Strong Portfolio Asset' | 'Needs Optimization' | 'Basic';
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  dateObtained?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  marketabilityScore?: number;
  aiFeedback?: string;
  aiVerdict?: 'Top Industry Standard' | 'Valuable Credential' | 'Emerging' | 'Entry Level';
}

export interface LanguageItem {
  language: string;
  proficiency: 'Native/Bilingual' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Elementary';
}

export interface AdditionalDegree {
  type: 'Second Major' | 'Minor' | 'Concentration' | 'Certificate';
  name: string;
}

export interface StudentProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  universityId: string;
  customUniversityName?: string;
  major: string;
  customMajorCategory?: 'STEM' | 'Business & Finance' | 'Arts & Humanities' | 'Social Sciences' | 'Health & Life Sciences' | 'Law & Public Policy' | 'Education' | 'Other' | string;
  degreeType: string; // e.g. "Bachelor's (B.S.)", "Master's (M.S.)", "Associate's (A.S.)"
  additionalDegrees?: AdditionalDegree[];
  expectedGraduationDate: string; // e.g. "May 2027"
  graduationYear?: number;
  graduationMonth: string;
  currentStanding?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate' | '';
  gpa?: string; // Manually entered overall GPA
  calculatedGpa?: string; // Read-only true GPA calculated from course grades
  relevantCoursework: string[];
  
  city?: string;
  state?: string;
  country?: string;
  
  // Career Preferences
  targetCompanies: string[];
  targetJobTitles: string[];
  targetIndustries: string[];
  targetIndustriesRanked?: { industry: string; rank: number }[];
  targetFunctions?: string[];
  targetFunctionsRanked?: { function: string; rank: number }[];
  preferredLocations: string[];
  preferredWorkModes: ('Remote' | 'Hybrid' | 'On-site')[];
  targetTerms: string[];
  compensationGoalType?: 'salary' | 'hourly';
  salaryGoals?: string;
  hourlyMinRate?: string;
  hourlyMaxRate?: string;
  workAuthorization: string; // e.g. 'US Citizen / Permanent Resident', 'F-1 Visa (OPT/CPT)', 'Need Sponsorship'
  
  // Resume & Inventory
  resumeText: string;
  resumeFilename?: string;
  skills: { name: string; category: 'technical' | 'soft' | 'domain' | 'tool'; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[];
  languages?: LanguageItem[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  experiences: ExperienceItem[];
  extracurriculars: string[];
}

// Mock Interview Types
export interface MockQuestion {
  id: string;
  questionText: string;
  category: 'Behavioral' | 'Technical' | 'System Design' | 'Quant';
  userAnswer?: string;
  aiScore?: number;
  strengths?: string[];
  improvements?: string[];
  idealAnswerOutline?: string;
  starBreakdown?: {
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
  };
}

export interface MockInterviewSession {
  id: string;
  company: string;
  role: string;
  interviewType: 'Behavioral' | 'Technical' | 'System Design' | 'Quant';
  questions: MockQuestion[];
  overallScore?: number;
  overallFeedback?: string;
  status: 'setup' | 'in_progress' | 'completed';
  createdAt: string;
}

// Quiz Types
export interface RecommendedRoleResult {
  title: string;
  category: string;
  matchPercentage: number;
  description: string;
  keySkills: string[];
  salaryEst: string;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'academic' | 'exam' | 'recruiting' | 'certification' | 'networking' | 'application_deadline';
  priority: 'high' | 'medium' | 'low';
  description: string;
  status: 'upcoming' | 'completed' | 'overdue';
  relatedEntityId?: string;
}

export interface JobOpportunity {
  id: string;
  company: string;
  logoUrl?: string;
  role: string;
  type: 'Internship' | 'Full-time' | 'Co-op' | 'Fellowship';
  jobType?: 'Internship' | 'Full-Time New Grad' | 'Co-Op' | 'Fellowship';
  source?: 'Handshake' | 'LinkedIn' | 'Indeed' | 'Levels.fyi' | 'Company Portal' | 'Glassdoor';
  category?: string;
  location: string;
  salaryRange?: string;
  deadline: string; // YYYY-MM-DD
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected';
  fitScore: number; // 0 - 100
  requirements: string[];
  notes: string;
  url?: string;
  priorityScore: number;
}

export interface CompanyReleaseTrackerItem {
  id: string;
  company: string;
  logoUrl?: string;
  role: string;
  category: string; // Broad category e.g. Software Engineering, Investment Banking, Nursing, BioTech, etc.
  jobType?: 'Internship' | 'Full-Time New Grad' | 'Co-Op' | 'Fellowship';
  source?: 'Handshake' | 'LinkedIn' | 'Indeed' | 'Levels.fyi' | 'Company Portal' | 'Glassdoor';
  term: string; // e.g. 'Summer 2027 Internship', 'Fall 2026 Co-Op', '2027 Full-Time New Grad'
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  releaseStatus: 'Open Now' | 'Opening Soon' | 'Closing Soon' | 'Waitlist';
  releaseDate: string; // YYYY-MM-DD or Month YYYY
  estimatedDaysToRelease?: number; // 0 for open, >0 for countdown days
  applyUrl: string;
  salaryEst?: string;
  requirements: string[];
  notes?: string;
  verifiedByCommunity?: boolean;
}

export interface CoachPersona {
  id: string;
  name: string;
  title: string;
  industry: string;
  avatar: string;
  systemPromptModifier: string;
  greeting: string;
  isCustom?: boolean;
  focusArea?: string;
  customNotes?: string;
}

export interface ActionPlanItem {
  id: string;
  title: string;
  area: 'resume' | 'skills' | 'networking' | 'certification' | 'project' | 'application';
  deadline: string;
  impact: 'high' | 'medium' | 'low';
  reasoning: string;
  status: 'pending' | 'in_progress' | 'completed';
  steps: string[];
}

export interface ResumeAuditResult {
  overallScore: number;
  atsCompatibilityScore: number;
  impactScore: number;
  targetRoleMatchScore?: number;
  bestFitRoles?: string[];
  targetRoleAlignment?: string;
  strengths: string[];
  keyImprovements: string[];
  bulletRewrites: { original: string; improved: string; reason: string }[];
  missingKeywords: string[];
}

export interface SkillGapResult {
  targetRole: string;
  matchPercentage: number;
  strongSkills: string[];
  missingSkills: { name: string; priority: 'Critical' | 'Recommended' | 'Optional'; action: string }[];
  recommendedProjects: { title: string; description: string; techStack: string[] }[];
  recommendedCertifications: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionItemAdded?: string;
}
