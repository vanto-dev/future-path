import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  School, 
  Briefcase, 
  FileText, 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Building,
  GraduationCap,
  ShieldCheck,
  Award,
  Upload,
  FileCheck,
  AlertCircle,
  RefreshCw,
  FileType,
  Target,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Search,
  BookOpen,
  Globe,
  FolderGit2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  Sparkle,
  RotateCcw,
  X,
  AlertTriangle
} from 'lucide-react';
import { StudentProfile, UniversityInfo, ProjectItem, CertificationItem, LanguageItem, AdditionalDegree } from '../types';
import { getSuggestedSoftSkills } from '../utils/softSkillsAdvisor';
import { getDegreePlanForProfile } from '../utils/degreePlanSelector';
import { SearchableMajorTypeahead } from './SearchableMajorTypeahead';
import { SearchableLocationSelect } from './SearchableLocationSelect';
import { SearchablePreferredLocation } from './SearchablePreferredLocation';
import { SearchableJobTitleTypeahead } from './SearchableJobTitleTypeahead';
import { calculateAcademicStanding } from '../utils/academicStanding';
import { parseResumeFile, ParseResumeResult } from '../lib/parseResumeFile';
import { 
  COMPANY_DATABASE, 
  ROLE_DATABASE, 
  ALL_TARGET_ROLES_FLAT, 
  LOCATION_DATABASE, 
  INDUSTRY_LIST, 
  TARGET_INDUSTRIES,
  TARGET_FUNCTIONS,
  MAJORS_BY_STANDING,
  DEGREE_LEVEL_OPTIONS,
  GRADUATION_MONTHS,
  GRADUATION_YEARS,
  SALARY_GOAL_OPTIONS,
  HOURLY_RATE_OPTIONS,
  ALL_US_INSTITUTIONS,
  getSuggestedCompanies,
  getSuggestedRoles
} from '../data/careerDatabase';

const WORK_AUTH_OPTIONS = [
  'US Citizen / Permanent Resident',
  'F-1 Visa (OPT / CPT Eligible)',
  'H-1B Visa (Sponsorship Required)',
  'Need Sponsorship / Other Visa',
  'Canadian Citizen / TN Visa',
  'Green Card Holder',
  'EU / UK Work Authorization',
  'Other / Custom'
];

const GRADUATION_OPTIONS = [
  'May 2026', 'December 2026',
  'May 2027', 'December 2027',
  'May 2028', 'December 2028',
  'May 2029', 'December 2029'
];

const SALARY_GOAL_PRESETS = [
  '$80,000 - $100,000 / yr (Entry Full-Time)',
  '$100,000 - $130,000 / yr (Mid Full-Time)',
  '$130,000 - $160,000 / yr (Tier-1 Tech New Grad)',
  '$160,000 - $200,000+ / yr (High SWE / Quant New Grad)',
  '$35 - $50 / hr (Standard Internship)',
  '$50 - $70 / hr (Tier-1 Tech Internship)',
  '$75 - $110+ / hr (High Quant Internship)'
];

const PRESET_WORK_MODES = ['Remote', 'Hybrid', 'On-site'] as const;
const PRESET_TERMS = [
  'Summer 2027 Internship', 'Fall 2026 Co-Op', 'Spring 2027 Internship', '2027 Full-Time New Grad'
];

interface ProfileTabProps {
  profile: StudentProfile;
  universities: UniversityInfo[];
  onSaveProfile: (updatedProfile: StudentProfile) => void;
  onResetAllData?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  universities,
  onSaveProfile,
  onResetAllData,
  onNavigateTab
}) => {
  const [formProfile, setFormProfile] = useState<StudentProfile>({
    ...profile,
    languages: profile.languages || [],
    projects: profile.projects || [],
    certifications: profile.certifications || [],
    additionalDegrees: profile.additionalDegrees || []
  });

  // Keep parent profile updated whenever formProfile changes
  useEffect(() => {
    onSaveProfile(formProfile);
  }, [formProfile, onSaveProfile]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'skills' | 'languages' | 'projects' | 'certifications'>('skills');

  // Sync formProfile if parent profile changes (e.g. after a data reset)
  useEffect(() => {
    setFormProfile({
      ...profile,
      languages: profile.languages || [],
      projects: profile.projects || [],
      certifications: profile.certifications || [],
      additionalDegrees: profile.additionalDegrees || []
    });
    setInstitutionSearch(
      profile.customUniversityName || (universities.find(u => u.id === profile.universityId)?.name) || ''
    );
    setFirstNameInput(profile.firstName || (profile.fullName ? profile.fullName.split(' ')[0] : ''));
    setLastNameInput(profile.lastName || (profile.fullName ? profile.fullName.split(' ').slice(1).join(' ') : ''));
    setCustomSalaryMin('');
    setCustomSalaryMax('');
    setCompanySearch('');
    setRoleSearch('');
    setLocationSearch('');
    setParseStatus(null);
  }, [profile.id]);

  // Name Editing Modal State
  const [showNameModal, setShowNameModal] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(formProfile.firstName || (formProfile.fullName ? formProfile.fullName.split(' ')[0] : ''));
  const [lastNameInput, setLastNameInput] = useState(formProfile.lastName || (formProfile.fullName ? formProfile.fullName.split(' ').slice(1).join(' ') : ''));

  // Institution Predictive Search State
  const [institutionSearch, setInstitutionSearch] = useState(
    formProfile.customUniversityName || (universities.find(u => u.id === formProfile.universityId)?.name) || ''
  );
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);
  const [apiUniversities, setApiUniversities] = useState<string[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  // Fetch online global university search results
  useEffect(() => {
    const q = institutionSearch.trim();
    if (q.length < 2) {
      setApiUniversities([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingApi(true);
        const res = await fetch(`/api/universities/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.universities)) {
            const names = data.universities.map((u: any) => typeof u === 'string' ? u : u.name);
            setApiUniversities(names);
          }
        }
      } catch (err) {
        console.warn('University search API error:', err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [institutionSearch]);

  // Custom inputs for ranked target industries & functions
  const [customIndustryInput, setCustomIndustryInput] = useState('');
  const [customFunctionInput, setCustomFunctionInput] = useState('');

  // Compensation Goal Mode
  const [compGoalType, setCompGoalType] = useState<'salary' | 'hourly'>(formProfile.compensationGoalType || 'salary');
  const [customSalaryMin, setCustomSalaryMin] = useState('');
  const [customSalaryMax, setCustomSalaryMax] = useState('');

  useEffect(() => {
    if (formProfile.salaryGoals && !SALARY_GOAL_OPTIONS.includes(formProfile.salaryGoals)) {
      const matches = formProfile.salaryGoals.match(/([0-9,]+)/g);
      if (matches && matches.length >= 2) {
        setCustomSalaryMin(matches[0]);
        setCustomSalaryMax(matches[1]);
      } else if (matches && matches.length === 1) {
        setCustomSalaryMin(matches[0]);
      }
    }
  }, []);

  // File Upload & Parsing state
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState<ParseResumeResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAtsPrompt, setShowAtsPrompt] = useState(false);

  // Search/Filter states for Target Section
  const [companySearch, setCompanySearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  // Skill state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'soft' | 'domain' | 'tool'>('technical');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  // Additional Degree state
  const [degreeType, setDegreeType] = useState<'Second Major' | 'Minor' | 'Concentration' | 'Certificate'>('Minor');
  const [degreeName, setDegreeName] = useState('');

  // Language state
  const [langName, setLangName] = useState('');
  const [langProf, setLangProf] = useState<'Native/Bilingual' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Elementary'>('Fluent');

  // Project state
  const [projTitle, setProjTitle] = useState('');
  const [projRole, setProjRole] = useState('');
  const [projStack, setProjStack] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projGithub, setProjGithub] = useState('');

  // Certification state
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');

  // Rating loading state
  const [ratingItemId, setRatingItemId] = useState<string | null>(null);

  // Current university object
  const currentUniv = formProfile.universityId ? universities.find(u => u.id === formProfile.universityId) : null;

  // True GPA Calculator helper
  const GRADE_POINTS: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const calculateTrueGpa = () => {
    const activePlan = getDegreePlanForProfile(currentUniv, formProfile);
    if (!currentUniv || !activePlan) return { gpaStr: 'N/A', count: 0 };
    const courses = activePlan.courses || [];
    const completed = courses.filter(c => c.status === 'completed' && c.grade && GRADE_POINTS[c.grade] !== undefined);
    if (completed.length === 0) return { gpaStr: 'N/A', count: 0 };

    let pts = 0;
    let credits = 0;
    completed.forEach(c => {
      const gpts = GRADE_POINTS[c.grade!] ?? 4.0;
      const cr = c.credits || 3;
      pts += gpts * cr;
      credits += cr;
    });

    if (credits === 0) return { gpaStr: 'N/A', count: 0 };
    return { gpaStr: (pts / credits).toFixed(2), count: completed.length };
  };

  const trueGpaInfo = calculateTrueGpa();

  // Institution predictive search filtering combining local dataset + global API results
  const combinedInstitutions = Array.from(
    new Set([
      ...apiUniversities,
      ...ALL_US_INSTITUTIONS.filter(inst => {
        const query = institutionSearch.toLowerCase().trim();
        if (!query) return true;
        if (inst.toLowerCase().includes(query)) return true;
        // Match common acronym queries
        if (query === 'utd' && inst.includes('Dallas')) return true;
        if (query === 'uta' && inst.includes('Arlington')) return true;
        if (query === 'ut' && inst.includes('Texas')) return true;
        if (query === 'uc' && inst.includes('California')) return true;
        if (query === 'mit' && inst.includes('Massachusetts Institute')) return true;
        if (query === 'nyu' && inst.includes('New York University')) return true;
        if (query === 'cmu' && inst.includes('Carnegie Mellon')) return true;
        if (query === 'uiuc' && inst.includes('Illinois Urbana')) return true;
        return false;
      })
    ])
  );
  const filteredInstitutions = combinedInstitutions;

  // Dynamic Majors filter based on standing
  const availableMajors = formProfile.currentStanding === 'Graduate'
    ? MAJORS_BY_STANDING.graduate
    : MAJORS_BY_STANDING.undergraduate;

  // Dynamic Smart Suggestions for Target Companies & Target Roles
  const suggestedCompanies = getSuggestedCompanies(
    formProfile.major,
    formProfile.targetFunctionsRanked || formProfile.targetFunctions || [],
    formProfile.targetIndustriesRanked || formProfile.targetIndustries || [],
    formProfile.targetCompanies || []
  );

  const suggestedRoles = getSuggestedRoles(
    formProfile.major,
    formProfile.targetFunctionsRanked || formProfile.targetFunctions || [],
    formProfile.targetIndustriesRanked || formProfile.targetIndustries || [],
    formProfile.targetJobTitles || []
  );

  // Company filtering
  const filteredCompanies = COMPANY_DATABASE.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.category.toLowerCase().includes(companySearch.toLowerCase())
  );

  // Role filtering
  const filteredRoles = ALL_TARGET_ROLES_FLAT.filter(r =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  // Location suggestions
  const locationSuggestions = LOCATION_DATABASE.filter(l =>
    l.toLowerCase().includes(locationSearch.toLowerCase()) &&
    !formProfile.preferredLocations.includes(l)
  );

  const toggleCompany = (companyName: string) => {
    setFormProfile(prev => {
      const currentList = prev.targetCompanies || [];
      const exists = currentList.includes(companyName);
      return {
        ...prev,
        targetCompanies: exists ? currentList.filter(c => c !== companyName) : [...currentList, companyName]
      };
    });
  };

  const addCustomCompany = (name: string) => {
    const val = name.trim();
    if (!val) return;
    if (!(formProfile.targetCompanies || []).includes(val)) {
      setFormProfile(prev => ({
        ...prev,
        targetCompanies: [...(prev.targetCompanies || []), val]
      }));
    }
    setCompanySearch('');
  };

  const toggleRole = (roleTitle: string) => {
    setFormProfile(prev => {
      const exists = prev.targetJobTitles.includes(roleTitle);
      return {
        ...prev,
        targetJobTitles: exists ? prev.targetJobTitles.filter(r => r !== roleTitle) : [...prev.targetJobTitles, roleTitle]
      };
    });
  };

  const addCustomRole = (title: string) => {
    const val = title.trim();
    if (!val) return;
    if (!formProfile.targetJobTitles.includes(val)) {
      setFormProfile(prev => ({
        ...prev,
        targetJobTitles: [...prev.targetJobTitles, val]
      }));
    }
    setRoleSearch('');
  };

  const toggleLocation = (loc: string) => {
    setFormProfile(prev => {
      const exists = prev.preferredLocations.includes(loc);
      return {
        ...prev,
        preferredLocations: exists ? prev.preferredLocations.filter(l => l !== loc) : [...prev.preferredLocations, loc]
      };
    });
  };

  const addCustomLocation = (loc: string) => {
    const val = loc.trim();
    if (!val) return;
    if (!formProfile.preferredLocations.includes(val)) {
      setFormProfile(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, val]
      }));
    }
    setLocationSearch('');
  };

  const toggleRankedIndustry = (ind: string) => {
    setFormProfile(prev => {
      const currentList = prev.targetIndustries || [];
      const currentRanked = prev.targetIndustriesRanked && prev.targetIndustriesRanked.length > 0 ? prev.targetIndustriesRanked : currentList;
      const exists = currentList.includes(ind);

      const newList = exists ? currentList.filter(i => i !== ind) : [...currentList, ind];
      const newRanked = exists ? currentRanked.filter(i => i !== ind) : [...currentRanked, ind];

      return {
        ...prev,
        targetIndustries: newList,
        targetIndustriesRanked: newRanked
      };
    });
  };

  const moveIndustryRank = (ind: string, direction: 'up' | 'down') => {
    setFormProfile(prev => {
      const currentRanked = [...(prev.targetIndustriesRanked && prev.targetIndustriesRanked.length > 0 ? prev.targetIndustriesRanked : (prev.targetIndustries || []))];
      const idx = currentRanked.indexOf(ind);
      if (idx === -1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= currentRanked.length) return prev;

      const temp = currentRanked[idx];
      currentRanked[idx] = currentRanked[targetIdx];
      currentRanked[targetIdx] = temp;

      return {
        ...prev,
        targetIndustriesRanked: currentRanked,
        targetIndustries: currentRanked
      };
    });
  };

  const addCustomIndustry = (indName: string) => {
    const val = indName.trim();
    if (!val) return;
    if (!(formProfile.targetIndustries || []).includes(val)) {
      toggleRankedIndustry(val);
    }
    setCustomIndustryInput('');
  };

  const toggleRankedFunction = (fn: string) => {
    setFormProfile(prev => {
      const currentList = prev.targetFunctions || [];
      const currentRanked = prev.targetFunctionsRanked && prev.targetFunctionsRanked.length > 0 ? prev.targetFunctionsRanked : currentList;
      const exists = currentList.includes(fn);

      const newList = exists ? currentList.filter(f => f !== fn) : [...currentList, fn];
      const newRanked = exists ? currentRanked.filter(f => f !== fn) : [...currentRanked, fn];

      return {
        ...prev,
        targetFunctions: newList,
        targetFunctionsRanked: newRanked
      };
    });
  };

  const moveFunctionRank = (fn: string, direction: 'up' | 'down') => {
    setFormProfile(prev => {
      const currentRanked = [...(prev.targetFunctionsRanked && prev.targetFunctionsRanked.length > 0 ? prev.targetFunctionsRanked : (prev.targetFunctions || []))];
      const idx = currentRanked.indexOf(fn);
      if (idx === -1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= currentRanked.length) return prev;

      const temp = currentRanked[idx];
      currentRanked[idx] = currentRanked[targetIdx];
      currentRanked[targetIdx] = temp;

      return {
        ...prev,
        targetFunctionsRanked: currentRanked,
        targetFunctions: currentRanked
      };
    });
  };

  const addCustomFunction = (fnName: string) => {
    const val = fnName.trim();
    if (!val) return;
    if (!(formProfile.targetFunctions || []).includes(val)) {
      toggleRankedFunction(val);
    }
    setCustomFunctionInput('');
  };

  const toggleWorkMode = (mode: 'Remote' | 'Hybrid' | 'On-site') => {
    setFormProfile(prev => {
      const modes = prev.preferredWorkModes || [];
      const exists = modes.includes(mode);
      return {
        ...prev,
        preferredWorkModes: exists ? modes.filter(m => m !== mode) : [...modes, mode]
      };
    });
  };

  const toggleTerm = (term: string) => {
    setFormProfile(prev => {
      const terms = prev.targetTerms || [];
      const exists = terms.includes(term);
      return {
        ...prev,
        targetTerms: exists ? terms.filter(t => t !== term) : [...terms, term]
      };
    });
  };

  const handleAddAdditionalDegree = () => {
    if (!degreeName.trim()) return;
    setFormProfile(prev => ({
      ...prev,
      additionalDegrees: [...(prev.additionalDegrees || []), { type: degreeType, name: degreeName.trim() }]
    }));
    setDegreeName('');
  };

  const handleRemoveAdditionalDegree = (idx: number) => {
    setFormProfile(prev => ({
      ...prev,
      additionalDegrees: (prev.additionalDegrees || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddLanguage = () => {
    if (!langName.trim()) return;
    setFormProfile(prev => ({
      ...prev,
      languages: [...(prev.languages || []), { language: langName.trim(), proficiency: langProf }]
    }));
    setLangName('');
  };

  const handleRemoveLanguage = (idx: number) => {
    setFormProfile(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddProject = () => {
    if (!projTitle.trim() || !projDesc.trim()) return;
    const newProj: ProjectItem = {
      id: 'proj-' + Date.now(),
      title: projTitle.trim(),
      role: projRole.trim() || 'Contributor',
      techStack: projStack ? projStack.split(',').map(s => s.trim()) : [],
      description: projDesc.trim(),
      githubUrl: projGithub.trim() || undefined
    };
    setFormProfile(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProj]
    }));
    setProjTitle('');
    setProjRole('');
    setProjStack('');
    setProjDesc('');
    setProjGithub('');
  };

  const handleRemoveProject = (id: string) => {
    setFormProfile(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(p => p.id !== id)
    }));
  };

  const handleAddCertification = () => {
    if (!certTitle.trim() || !certIssuer.trim()) return;
    const newCert: CertificationItem = {
      id: 'cert-' + Date.now(),
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      dateObtained: certDate.trim() || undefined
    };
    setFormProfile(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCert]
    }));
    setCertTitle('');
    setCertIssuer('');
    setCertDate('');
  };

  const handleRemoveCertification = (id: string) => {
    setFormProfile(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter(c => c.id !== id)
    }));
  };

  const ratePortfolioItem = async (type: 'project' | 'certification', item: ProjectItem | CertificationItem) => {
    setRatingItemId(item.id);
    try {
      const res = await fetch('/api/ai/rate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title: item.title,
          description: (item as ProjectItem).description || '',
          techStack: (item as ProjectItem).techStack || [],
          issuer: (item as CertificationItem).issuer || '',
          studentMajor: formProfile.major
        })
      });
      const data = await res.json();
      if (data.marketabilityScore !== undefined) {
        if (type === 'project') {
          setFormProfile(prev => ({
            ...prev,
            projects: (prev.projects || []).map(p => p.id === item.id ? {
              ...p,
              marketabilityScore: data.marketabilityScore,
              aiVerdict: data.aiVerdict,
              aiFeedback: data.aiFeedback
            } : p)
          }));
        } else {
          setFormProfile(prev => ({
            ...prev,
            certifications: (prev.certifications || []).map(c => c.id === item.id ? {
              ...c,
              marketabilityScore: data.marketabilityScore,
              aiVerdict: data.aiVerdict,
              aiFeedback: data.aiFeedback
            } : c)
          }));
        }
      }
    } catch (err) {
      console.error('Rating failed:', err);
    } finally {
      setRatingItemId(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setFormProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { name: newSkillName.trim(), category: newSkillCategory, level: newSkillLevel }]
    }));
    setNewSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    setFormProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddSuggestedSoftSkill = (skillName: string) => {
    setFormProfile(prev => {
      const exists = prev.skills.some(s => s.name.toLowerCase().trim() === skillName.toLowerCase().trim());
      if (exists) return prev;
      return {
        ...prev,
        skills: [...prev.skills, { name: skillName, category: 'soft', level: 'Intermediate' }]
      };
    });
  };

  const processFile = async (file: File) => {
    setIsParsing(true);
    setParseStatus(null);
    const result = await parseResumeFile(file);
    setIsParsing(false);
    setParseStatus(result);

    if (result.success && result.text) {
      setFormProfile(prev => ({
        ...prev,
        resumeText: result.text,
        resumeFilename: `${result.filename} (${result.fileType}, ${result.wordCount} words)`
      }));
      setShowAtsPrompt(true);
    }
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const selectedUniv = formProfile.universityId ? universities.find(u => u.id === formProfile.universityId) : null;
  const degreePlan = selectedUniv?.degreePlans?.[0];
  const courses = degreePlan?.courses || [];
  const completedCredits = courses.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.credits, 0);
  const inProgressCredits = courses.filter(c => c.status === 'in_progress').reduce((sum, c) => sum + c.credits, 0);
  const totalRequiredCredits = degreePlan?.requiredCredits || 120;

  const standingAnalysis = calculateAcademicStanding(
    completedCredits,
    inProgressCredits,
    formProfile.currentStanding,
    totalRequiredCredits,
    formProfile.degreeType?.includes('Master') || formProfile.degreeType?.includes('Doctorate') || formProfile.currentStanding === 'Graduate'
  );

  return (
    <div className="space-y-6">
      
      {/* Testing & Reset Controls Banner */}
      <div className="bg-rose-950/30 border border-rose-800/60 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3 text-rose-200">
          <div className="p-2.5 bg-rose-500/20 rounded-xl shrink-0">
            <RotateCcw className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs uppercase tracking-wider text-rose-300">Testing & Reset Toolbar</span>
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">Temporary Tool</span>
            </div>
            <p className="text-xs text-rose-200/80 mt-0.5">
              Wipe all stored profile data, applications, courses, and preferences to test the onboarding flow from scratch.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-rose-600/30 cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All My Data / Reset Profile</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
            <UserCheck className="h-4 w-4" />
            <span>Student Profile & Career Target Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-light text-white">
            Single Source of Truth Profile
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Keep your verified academic status, target corporations, skills inventory, projects, and certifications updated so your AI career coach maintains total memory context.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{savedSuccess ? 'Profile Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Academic Details Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm relative z-30">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center space-x-2">
              <School className="h-4 w-4 text-indigo-400" />
              <span>Academic Standing & Degree Verification</span>
            </h2>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-semibold flex items-center space-x-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Verified Program</span>
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Full Name & Edit Name Modal Trigger */}
            <div className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-0.5">Full Name</label>
                <div className="text-sm font-semibold text-white">{formProfile.fullName}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFirstNameInput(formProfile.firstName || formProfile.fullName.split(' ')[0] || '');
                  setLastNameInput(formProfile.lastName || formProfile.fullName.split(' ').slice(1).join(' ') || '');
                  setShowNameModal(true);
                }}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-indigo-300 border border-zinc-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
              >
                Edit Name
              </button>
            </div>

            {/* University / Institution Predictive Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-zinc-400">University / Institution</label>
                  {institutionSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setInstitutionSearch('');
                        setFormProfile(prev => ({ ...prev, customUniversityName: '' }));
                        setShowInstitutionDropdown(true);
                      }}
                      className="text-[10px] text-zinc-500 hover:text-rose-400 transition-colors font-mono cursor-pointer"
                    >
                      Clear field
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={institutionSearch}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInstitutionSearch(val);
                      setFormProfile(prev => ({ ...prev, customUniversityName: val }));
                      setShowInstitutionDropdown(true);
                    }}
                    onFocus={() => setShowInstitutionDropdown(true)}
                    placeholder="Search accredited U.S. university or institution..."
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 pr-8 text-white focus:outline-none focus:border-indigo-500 font-medium text-xs"
                  />
                  {institutionSearch ? (
                    <button
                      type="button"
                      onClick={() => {
                        setInstitutionSearch('');
                        setFormProfile(prev => ({ ...prev, customUniversityName: '' }));
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer text-xs"
                    >
                      ✕
                    </button>
                  ) : (
                    <Search className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                  )}
                </div>

                {showInstitutionDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 max-h-64 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-xl p-2 space-y-1 z-30 shadow-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2 py-1 flex items-center justify-between border-b border-zinc-800 mb-1">
                      <span className="flex items-center space-x-1.5">
                        <span>Accredited Institutions ({filteredInstitutions.length})</span>
                        {isSearchingApi && <span className="text-indigo-400 font-mono text-[9px]">● Live searching...</span>}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowInstitutionDropdown(false)}
                        className="text-zinc-500 hover:text-zinc-300 text-[10px] cursor-pointer"
                      >
                        Close ✕
                      </button>
                    </div>
                    {filteredInstitutions.slice(0, 20).map(inst => (
                      <div
                        key={inst}
                        onClick={() => {
                          setFormProfile(prev => ({ ...prev, customUniversityName: inst }));
                          setInstitutionSearch(inst);
                          setShowInstitutionDropdown(false);
                        }}
                        className={`p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          institutionSearch === inst 
                            ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/30' 
                            : 'hover:bg-zinc-800 text-zinc-200'
                        }`}
                      >
                        <span>{inst}</span>
                        {institutionSearch === inst && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 ml-1" />}
                      </div>
                    ))}
                    {filteredInstitutions.length === 0 && !isSearchingApi && (
                      <div className="p-2 text-xs text-zinc-400 text-center italic">
                        No pre-matched institution found.
                      </div>
                    )}
                    {institutionSearch && !filteredInstitutions.includes(institutionSearch) && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormProfile(prev => ({ ...prev, customUniversityName: institutionSearch }));
                          setShowInstitutionDropdown(false);
                        }}
                        className="w-full text-left p-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 rounded-lg text-xs cursor-pointer font-medium border border-indigo-500/20 transition-colors"
                      >
                        + Use Custom Institution: "{institutionSearch}"
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium text-zinc-400 mb-1">Degree Level / Target Degree</label>
                <select
                  value={formProfile.degreeType || ''}
                  onChange={(e) => setFormProfile({ ...formProfile, degreeType: e.target.value })}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>-- Select Degree Level --</option>
                  {DEGREE_LEVEL_OPTIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Searchable Location Fields: Country, State/Province, City */}
            <SearchableLocationSelect
              country={formProfile.country || 'United States'}
              state={formProfile.state || ''}
              city={formProfile.city || ''}
              onCountryChange={(val) => setFormProfile({ ...formProfile, country: val })}
              onStateChange={(val) => setFormProfile({ ...formProfile, state: val })}
              onCityChange={(val) => setFormProfile({ ...formProfile, city: val })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-zinc-400 mb-1">Current Academic Standing</label>
                <select
                  value={formProfile.currentStanding || ''}
                  onChange={(e) => setFormProfile({ ...formProfile, currentStanding: e.target.value as any })}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>-- Select Current Standing --</option>
                  <option value="Freshman">Freshman (Undergraduate)</option>
                  <option value="Sophomore">Sophomore (Undergraduate)</option>
                  <option value="Junior">Junior (Undergraduate)</option>
                  <option value="Senior">Senior (Undergraduate)</option>
                  <option value="Graduate">Graduate (Masters / PhD)</option>
                </select>

                {standingAnalysis.hasMismatch && (
                  <div className="mt-2.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs text-amber-200">
                    <div className="flex items-center justify-between font-bold text-amber-300 text-[11px]">
                      <span className="flex items-center space-x-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>Standing Mismatch</span>
                      </span>
                      <span className="font-mono text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 border border-amber-500/30">
                        Calc: {standingAnalysis.calculatedStanding}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-200/90 leading-tight">
                      Your {standingAnalysis.totalActiveCredits} completed + enrolled credits ({Math.round((standingAnalysis.totalActiveCredits / standingAnalysis.requiredCredits) * 100)}% of degree) align with <strong>{standingAnalysis.calculatedStanding}</strong> standing.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormProfile(prev => ({ ...prev, currentStanding: standingAnalysis.calculatedStanding }))}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-[11px] transition-colors cursor-pointer shadow"
                    >
                      Align Standing to {standingAnalysis.calculatedStanding}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-zinc-400">Primary Major</label>
                  <span className="text-[10px] text-indigo-400 font-mono">
                    {availableMajors.includes(formProfile.major) ? '✓ Accredited' : 'Custom'}
                  </span>
                </div>
                <SearchableMajorTypeahead
                  value={formProfile.major}
                  onChange={(selected) => setFormProfile({ ...formProfile, major: selected })}
                  university={currentUniv}
                  standing={formProfile.currentStanding}
                  degreeType={formProfile.degreeType}
                  placeholder="Search primary major or type custom (e.g. Computer Science)..."
                />

                {/* Custom Major Category Mapping Prompt */}
                {formProfile.major && !availableMajors.includes(formProfile.major) && !(currentUniv?.offeredMajors || []).includes(formProfile.major) && (
                  <div className="mt-3 p-3.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs">
                        <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span>Map Custom Major Category: "{formProfile.major}"</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 shrink-0">
                        Broad Domain
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Select the closest broad discipline category for <strong>{formProfile.major}</strong> to optimize your ATS resume auditing, degree plan course recommendations, and job matching:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                      {[
                        'STEM',
                        'Business & Finance',
                        'Arts & Humanities',
                        'Social Sciences',
                        'Health & Life Sciences',
                        'Law & Public Policy',
                        'Education',
                        'Other'
                      ].map(cat => {
                        const isSelected = formProfile.customMajorCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormProfile(prev => ({ ...prev, customMajorCategory: cat }))}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border text-left truncate ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold border-indigo-400 shadow'
                                : 'bg-[#0c0c0e] hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                            }`}
                          >
                            {isSelected ? `✓ ${cat}` : cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Degrees (Double Majors, Minors, Concentrations) */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <label className="block text-[11px] font-semibold text-zinc-300">
                Additional Degrees, Minors & Concentrations:
              </label>

              {(formProfile.additionalDegrees || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 font-mono">
                  {(formProfile.additionalDegrees || []).map((deg, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-[#0c0c0e] border border-zinc-800 px-3 py-1 rounded-lg text-xs">
                      <span className="text-indigo-400 font-bold text-[10px] uppercase">{deg.type}:</span>
                      <span className="text-white">{deg.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalDegree(idx)}
                        className="text-zinc-600 hover:text-rose-400 cursor-pointer ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 items-start">
                <select
                  value={degreeType}
                  onChange={(e) => setDegreeType(e.target.value as any)}
                  className="bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none shrink-0"
                >
                  <option value="Minor">Minor</option>
                  <option value="Second Major">Second Major</option>
                  <option value="Concentration">Concentration</option>
                  <option value="Certificate">Certificate</option>
                </select>
                <div className="flex-1">
                  <SearchableMajorTypeahead
                    value={degreeName}
                    onChange={(selected) => setDegreeName(selected)}
                    university={currentUniv}
                    standing={formProfile.currentStanding}
                    degreeType={formProfile.degreeType}
                    placeholder={`Search ${degreeType.toLowerCase()} (e.g. Statistics)...`}
                    isAdditional
                    additionalType={degreeType}
                    onAddAdditional={(type, name) => {
                      if (!name.trim()) return;
                      setFormProfile(prev => ({
                        ...prev,
                        additionalDegrees: [...(prev.additionalDegrees || []), { type: type as any, name: name.trim() }]
                      }));
                      setDegreeName('');
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAdditionalDegree}
                  className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer shrink-0 shadow transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Graduation Date Dropdown + Work Auth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
              <div>
                <label className="block font-medium text-zinc-400 mb-1">Expected Graduation Date</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={formProfile.expectedGraduationDate?.split(' ')[0] || ''}
                    onChange={(e) => {
                      const year = formProfile.expectedGraduationDate?.split(' ')[1] || '2028';
                      setFormProfile({ ...formProfile, expectedGraduationDate: `${e.target.value} ${year}` });
                    }}
                    className="bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  >
                    <option value="" disabled>Month</option>
                    {GRADUATION_MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={formProfile.expectedGraduationDate?.split(' ')[1] || ''}
                    onChange={(e) => {
                      const month = formProfile.expectedGraduationDate?.split(' ')[0] || 'May';
                      setFormProfile({ ...formProfile, expectedGraduationDate: `${month} ${e.target.value}` });
                    }}
                    className="bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  >
                    <option value="" disabled>Year</option>
                    {GRADUATION_YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-400 mb-1">Work Authorization / Citizenship</label>
                <select
                  value={formProfile.workAuthorization ? (WORK_AUTH_OPTIONS.includes(formProfile.workAuthorization) ? formProfile.workAuthorization : 'custom') : ''}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setFormProfile({ ...formProfile, workAuthorization: e.target.value });
                    }
                  }}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>-- Select Work Authorization --</option>
                  {WORK_AUTH_OPTIONS.map(wa => (
                    <option key={wa} value={wa}>{wa}</option>
                  ))}
                  <option value="custom">Custom Work Auth...</option>
                </select>
              </div>
            </div>

            {/* GPA Section: Editable Overall GPA + Read-Only Calculated "True" GPA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
              <div>
                <label className="block font-medium text-zinc-400 mb-1">Overall GPA (Manually Entered)</label>
                <input
                  type="text"
                  value={formProfile.gpa}
                  onChange={(e) => setFormProfile({ ...formProfile, gpa: e.target.value })}
                  placeholder="e.g. 3.82"
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-400 mb-1 flex items-center space-x-1">
                  <span>Calculated True GPA</span>
                  <span className="text-[10px] text-indigo-400">(Read-Only)</span>
                </label>
                <div className="w-full bg-zinc-950/80 border border-indigo-500/30 rounded-xl p-2.5 font-mono text-white flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">{trueGpaInfo.gpaStr} {trueGpaInfo.gpaStr !== 'N/A' && '/ 4.00'}</span>
                  <span className="text-[10px] text-zinc-500">
                    {trueGpaInfo.count > 0 ? `${trueGpaInfo.count} course grades` : 'No grades yet'}
                  </span>
                </div>
              </div>
            </div>

            {/* Salary / Compensation Goals */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-medium text-zinc-400">Salary / Compensation Target</label>
                
                {/* Goal Mode Toggle */}
                <div className="flex items-center space-x-1 bg-[#0c0c0e] p-1 rounded-lg border border-zinc-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setCompGoalType('salary');
                      setFormProfile(prev => ({
                        ...prev,
                        compensationGoalType: 'salary',
                        salaryGoals: (prev.salaryGoals && prev.salaryGoals.includes('/ hr'))
                          ? SALARY_GOAL_OPTIONS[2]
                          : prev.salaryGoals
                      }));
                    }}
                    className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      compGoalType === 'salary' ? 'bg-indigo-600 text-white' : 'text-zinc-500'
                    }`}
                  >
                    Annual Salary
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCompGoalType('hourly');
                      setFormProfile(prev => ({
                        ...prev,
                        compensationGoalType: 'hourly',
                        salaryGoals: (prev.salaryGoals && !prev.salaryGoals.includes('/ hr'))
                          ? HOURLY_RATE_OPTIONS[1]
                          : prev.salaryGoals
                      }));
                    }}
                    className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      compGoalType === 'hourly' ? 'bg-indigo-600 text-white' : 'text-zinc-500'
                    }`}
                  >
                    Hourly Internship Rate
                  </button>
                </div>
              </div>

              {compGoalType === 'salary' ? (
                <div className="space-y-2">
                  <select
                    value={
                      SALARY_GOAL_OPTIONS.slice(0, -1).includes(formProfile.salaryGoals || '')
                        ? formProfile.salaryGoals
                        : 'Custom Annual Range'
                    }
                    onChange={(e) => {
                      if (e.target.value === 'Custom Annual Range') {
                        const minVal = customSalaryMin || '100,000';
                        const maxVal = customSalaryMax || '130,000';
                        setCustomSalaryMin(minVal);
                        setCustomSalaryMax(maxVal);
                        setFormProfile({ ...formProfile, salaryGoals: `$${minVal} to $${maxVal}` });
                      } else {
                        setFormProfile({ ...formProfile, salaryGoals: e.target.value });
                      }
                    }}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  >
                    {SALARY_GOAL_OPTIONS.map(sg => (
                      <option key={sg} value={sg}>{sg}</option>
                    ))}
                  </select>

                  {!SALARY_GOAL_OPTIONS.slice(0, -1).includes(formProfile.salaryGoals || '') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Min Target Salary
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-zinc-400 font-mono font-bold text-xs pointer-events-none">$</span>
                          <input
                            type="text"
                            value={customSalaryMin}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              const formatted = raw ? Number(raw).toLocaleString('en-US') : '';
                              setCustomSalaryMin(formatted);
                              const maxVal = customSalaryMax;
                              setFormProfile(prev => ({
                                ...prev,
                                salaryGoals: formatted || maxVal ? `$${formatted || '0'} to $${maxVal || '0'}` : ''
                              }));
                            }}
                            placeholder="100,000"
                            className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl py-2.5 pl-8 pr-3 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Max Target Salary
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-zinc-400 font-mono font-bold text-xs pointer-events-none">$</span>
                          <input
                            type="text"
                            value={customSalaryMax}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              const formatted = raw ? Number(raw).toLocaleString('en-US') : '';
                              setCustomSalaryMax(formatted);
                              const minVal = customSalaryMin;
                              setFormProfile(prev => ({
                                ...prev,
                                salaryGoals: minVal || formatted ? `$${minVal || '0'} to $${formatted || '0'}` : ''
                              }));
                            }}
                            placeholder="130,000"
                            className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl py-2.5 pl-8 pr-3 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    value={
                      HOURLY_RATE_OPTIONS.slice(0, -1).includes(formProfile.salaryGoals || '')
                        ? formProfile.salaryGoals
                        : 'Custom Hourly Range'
                    }
                    onChange={(e) => {
                      if (e.target.value === 'Custom Hourly Range') {
                        const minVal = formProfile.hourlyMinRate || 35;
                        const maxVal = formProfile.hourlyMaxRate || 60;
                        setFormProfile({
                          ...formProfile,
                          hourlyMinRate: minVal,
                          hourlyMaxRate: maxVal,
                          salaryGoals: `$${minVal} - $${maxVal} / hr`
                        });
                      } else {
                        setFormProfile({ ...formProfile, salaryGoals: e.target.value });
                      }
                    }}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  >
                    {HOURLY_RATE_OPTIONS.map(hr => (
                      <option key={hr} value={hr}>{hr}</option>
                    ))}
                  </select>

                  {!HOURLY_RATE_OPTIONS.slice(0, -1).includes(formProfile.salaryGoals || '') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Hourly Min ($/hr)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-zinc-400 font-mono font-bold text-xs pointer-events-none">$</span>
                          <input
                            type="number"
                            value={formProfile.hourlyMinRate || ''}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormProfile(prev => ({
                                ...prev,
                                hourlyMinRate: val,
                                salaryGoals: `$${val} - $${prev.hourlyMaxRate || 0} / hr`
                              }));
                            }}
                            placeholder="35"
                            className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl py-2.5 pl-8 pr-3 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Hourly Max ($/hr)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-zinc-400 font-mono font-bold text-xs pointer-events-none">$</span>
                          <input
                            type="number"
                            value={formProfile.hourlyMaxRate || ''}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormProfile(prev => ({
                                ...prev,
                                hourlyMaxRate: val,
                                salaryGoals: `$${prev.hourlyMinRate || 0} - $${val} / hr`
                              }));
                            }}
                            placeholder="60"
                            className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl py-2.5 pl-8 pr-3 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Target Section / Wishlist Matrix */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-5 backdrop-blur-sm lg:col-span-1 relative z-20">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center space-x-2">
              <Target className="h-4 w-4 text-indigo-400" />
              <span>Target Corporations & Roles Matrix</span>
            </h2>
            <span className="text-[10px] text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold">
              {(formProfile.targetCompanies || []).length} Companies
            </span>
          </div>

          {/* Company Search + Lookup */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold text-zinc-300">Search & Select Target Companies:</label>
              <span className="text-[10px] text-zinc-500">Search any company</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="Search companies (e.g. Stripe, OpenAI, Citadel)..."
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Selected Companies Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(formProfile.targetCompanies || []).map(comp => (
                <span key={comp} className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 rounded-lg text-xs font-medium">
                  <span>{comp}</span>
                  <button type="button" onClick={() => toggleCompany(comp)} className="hover:text-rose-400 cursor-pointer">×</button>
                </span>
              ))}
            </div>

            {/* Smart Suggested Companies */}
            <div className="p-3 bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border border-indigo-500/20 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-300 flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Suggested Companies for {formProfile.major || 'Your Profile'}:</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {suggestedCompanies.length} Recommendations
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedCompanies.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleCompany(c.name)}
                    className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 hover:border-indigo-500/50 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center space-x-1 shadow-sm"
                  >
                    <span>+ {c.name}</span>
                    <span className="text-[9px] text-zinc-400 font-normal">({c.category.split(',')[0].split('&')[0].trim()})</span>
                  </button>
                ))}
                {suggestedCompanies.length === 0 && (
                  <span className="text-[11px] text-zinc-500 italic">All suggested target companies added!</span>
                )}
              </div>
            </div>

            {/* Filtered Company Search Results */}
            {companySearch && (
              <div className="max-h-40 overflow-y-auto bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2 space-y-1">
                {filteredCompanies.map(c => {
                  const isSelected = (formProfile.targetCompanies || []).includes(c.name);
                  return (
                    <div
                      key={c.name}
                      onClick={() => toggleCompany(c.name)}
                      className="flex items-center justify-between p-2 hover:bg-zinc-800/60 rounded-lg cursor-pointer text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{c.name}</span>
                        <span className="text-[10px] text-zinc-500">({c.category})</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                        {isSelected ? 'Selected' : '+ Add'}
                      </span>
                    </div>
                  );
                })}

                {/* Custom Add Button */}
                <button
                  type="button"
                  onClick={() => addCustomCompany(companySearch)}
                  className="w-full text-left p-2 bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/20 rounded-lg text-xs font-medium cursor-pointer"
                >
                  + Add "{companySearch}" as target company
                </button>
              </div>
            )}
          </div>

          {/* Searchable Desired Roles / Job Titles */}
          <div className="pt-2 border-t border-zinc-800/80">
            <SearchableJobTitleTypeahead
              selectedRoles={formProfile.targetJobTitles}
              onChange={(roles) => setFormProfile({ ...formProfile, targetJobTitles: roles })}
              suggestedRoles={suggestedRoles}
            />
          </div>

          {/* 1. Target Industry (Company's Industry) - Ranked Multi-Select Chips */}
          <div className="space-y-2.5 pt-3 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                1. Target Industry (Company Industry) — Ranked
              </label>
              <span className="text-[10px] text-zinc-400 font-mono">
                {(formProfile.targetIndustriesRanked || formProfile.targetIndustries || []).length} Ranked
              </span>
            </div>

            {/* Ranked Selection List */}
            <div className="space-y-1.5">
              {(formProfile.targetIndustriesRanked && formProfile.targetIndustriesRanked.length > 0 
                ? formProfile.targetIndustriesRanked 
                : (formProfile.targetIndustries || [])
              ).map((ind, idx) => (
                <div key={ind} className="flex items-center justify-between p-2 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 flex items-center justify-center rounded-md bg-indigo-500/20 text-indigo-300 font-bold font-mono text-[10px] border border-indigo-500/40">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-white">{ind}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveIndustryRank(ind, 'up')}
                      className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded text-[10px] text-zinc-300 cursor-pointer font-bold"
                      title="Move Rank Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === (formProfile.targetIndustriesRanked || formProfile.targetIndustries || []).length - 1}
                      onClick={() => moveIndustryRank(ind, 'down')}
                      className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded text-[10px] text-zinc-300 cursor-pointer font-bold"
                      title="Move Rank Down"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleRankedIndustry(ind)}
                      className="px-1.5 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-[10px] cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Curated Industry Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {TARGET_INDUSTRIES.map(ind => {
                const isSelected = (formProfile.targetIndustries || []).includes(ind);
                return (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => toggleRankedIndustry(ind)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold border border-indigo-400 shadow-sm'
                        : 'bg-[#0c0c0e] text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{ind}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Industry Input */}
            <div className="flex space-x-2 pt-1">
              <input
                type="text"
                value={customIndustryInput}
                onChange={(e) => setCustomIndustryInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomIndustry(customIndustryInput); } }}
                placeholder="Add custom industry..."
                className="flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => addCustomIndustry(customIndustryInput)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shrink-0"
              >
                + Add
              </button>
            </div>
          </div>

          {/* 2. Target Function (Role Function) - Ranked Multi-Select Chips */}
          <div className="space-y-2.5 pt-3 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                2. Target Function (Role Function) — Ranked
              </label>
              <span className="text-[10px] text-zinc-400 font-mono">
                {(formProfile.targetFunctionsRanked || formProfile.targetFunctions || []).length} Ranked
              </span>
            </div>

            {/* Ranked Selection List */}
            <div className="space-y-1.5">
              {(formProfile.targetFunctionsRanked && formProfile.targetFunctionsRanked.length > 0 
                ? formProfile.targetFunctionsRanked 
                : (formProfile.targetFunctions || [])
              ).map((fn, idx) => (
                <div key={fn} className="flex items-center justify-between p-2 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 flex items-center justify-center rounded-md bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[10px] border border-emerald-500/40">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-white">{fn}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFunctionRank(fn, 'up')}
                      className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded text-[10px] text-zinc-300 cursor-pointer font-bold"
                      title="Move Rank Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === (formProfile.targetFunctionsRanked || formProfile.targetFunctions || []).length - 1}
                      onClick={() => moveFunctionRank(fn, 'down')}
                      className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded text-[10px] text-zinc-300 cursor-pointer font-bold"
                      title="Move Rank Down"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleRankedFunction(fn)}
                      className="px-1.5 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-[10px] cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Curated Function Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {TARGET_FUNCTIONS.map(fn => {
                const isSelected = (formProfile.targetFunctions || []).includes(fn);
                return (
                  <button
                    key={fn}
                    type="button"
                    onClick={() => toggleRankedFunction(fn)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold border border-emerald-400 shadow-sm'
                        : 'bg-[#0c0c0e] text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{fn}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Function Input */}
            <div className="flex space-x-2 pt-1">
              <input
                type="text"
                value={customFunctionInput}
                onChange={(e) => setCustomFunctionInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomFunction(customFunctionInput); } }}
                placeholder="Add custom function..."
                className="flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => addCustomFunction(customFunctionInput)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shrink-0"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Searchable Preferred Locations Autocomplete */}
          <div className="pt-2 border-t border-zinc-800/80">
            <SearchablePreferredLocation
              preferredLocations={formProfile.preferredLocations}
              onChange={(locations) => setFormProfile({ ...formProfile, preferredLocations: locations })}
            />
          </div>
        </div>

        {/* Skills, Languages, Projects & Certifications Tabbed Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-5 lg:col-span-2 backdrop-blur-sm relative z-10">
          
          {/* Sub-tab Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                Skills, Languages, Projects & Certifications
              </h2>
            </div>

            <div className="flex items-center space-x-1 bg-[#0c0c0e] p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === 'skills' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Skills ({formProfile.skills.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('languages')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === 'languages' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Languages ({(formProfile.languages || []).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Projects ({(formProfile.projects || []).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('certifications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === 'certifications' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Certifications ({(formProfile.certifications || []).length})
              </button>
            </div>
          </div>

          {/* TAB 1: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-xs">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Add technical or soft skill (e.g. PyTorch, C++, System Design)..."
                  className="flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 w-full"
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 shrink-0"
                >
                  <option value="technical">Technical</option>
                  <option value="tool">Tool / Framework</option>
                  <option value="soft">Soft Skill</option>
                  <option value="domain">Domain Knowledge</option>
                </select>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 shrink-0"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center space-x-1 cursor-pointer shrink-0 shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 font-mono">
                {formProfile.skills.map((skill, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center space-x-2 bg-[#0c0c0e] border border-zinc-800 px-3 py-1.5 rounded-xl text-xs"
                  >
                    <span className="font-medium text-white">{skill.name}</span>
                    <span className="text-[9px] text-indigo-300 font-bold bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                      {skill.level}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Suggested Soft Skills Section with 1-Click Add */}
              {(() => {
                const suggested = getSuggestedSoftSkills(formProfile);
                if (suggested.length === 0) return null;
                return (
                  <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs">
                        <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                        <span className="font-semibold text-zinc-200">Suggested Soft Skills</span>
                        <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                          — Tailored to your major, target roles & experiences
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {suggested.length} Recommendations
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {suggested.map((s, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-3 bg-[#0c0c0e] border border-zinc-800/80 hover:border-indigo-500/40 rounded-xl transition-all text-xs group"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-zinc-200 group-hover:text-white truncate">{s.name}</div>
                            <div className="text-[10px] text-zinc-400 leading-snug line-clamp-1 mt-0.5">{s.reason}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddSuggestedSoftSkill(s.name)}
                            className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold rounded-lg text-[11px] flex items-center space-x-1 shrink-0 transition-all cursor-pointer shadow-sm"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: LANGUAGES */}
          {activeTab === 'languages' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-xs">
                <input
                  type="text"
                  value={langName}
                  onChange={(e) => setLangName(e.target.value)}
                  placeholder="Language (e.g. Spanish, Mandarin, French, German)..."
                  className="flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 w-full"
                />
                <select
                  value={langProf}
                  onChange={(e) => setLangProf(e.target.value as any)}
                  className="bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 shrink-0"
                >
                  <option value="Native/Bilingual">Native/Bilingual</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Elementary">Elementary</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center space-x-1 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Language</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(formProfile.languages || []).map((l, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0c0c0e] border border-zinc-800 rounded-xl text-xs">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-indigo-400" />
                      <div>
                        <div className="font-semibold text-white">{l.language}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{l.proficiency}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(idx)}
                      className="text-zinc-600 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl space-y-3 text-xs">
                <h3 className="font-bold text-white flex items-center space-x-1.5">
                  <FolderGit2 className="h-4 w-4 text-emerald-400" />
                  <span>Add New Technical Project</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="Project Title (e.g. Quant Backtesting Framework)..."
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={projRole}
                    onChange={(e) => setProjRole(e.target.value)}
                    placeholder="Your Role (e.g. Lead Developer, Contributor)..."
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={projStack}
                    onChange={(e) => setProjStack(e.target.value)}
                    placeholder="Tech Stack comma-separated (e.g. Python, PyTorch, React)..."
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="GitHub or Live URL (optional)..."
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none font-mono"
                  />
                </div>

                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Describe key features, architectural highlights, and quantifiable results..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none h-16"
                />

                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Save Project to Profile</span>
                </button>
              </div>

              {/* Project Cards List */}
              <div className="space-y-3">
                {(formProfile.projects || []).map(p => (
                  <div key={p.id} className="p-4 bg-[#0c0c0e] border border-zinc-800 rounded-xl space-y-2 text-xs relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                          <span>{p.title}</span>
                          {p.role && <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">{p.role}</span>}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
                          {p.techStack.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded">{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => ratePortfolioItem('project', p)}
                          disabled={ratingItemId === p.id}
                          className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg text-[11px] font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          {ratingItemId === p.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          <span>AI Recruiter Audit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(p.id)}
                          className="text-zinc-600 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-zinc-300 text-xs leading-relaxed">{p.description}</p>

                    {/* AI Feedback Badge */}
                    {p.marketabilityScore !== undefined && (
                      <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start space-x-2 mt-2">
                        <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div className="text-[11px]">
                          <div className="font-bold text-indigo-300 flex items-center space-x-2">
                            <span>Marketability Score: {p.marketabilityScore}/100</span>
                            {p.aiVerdict && <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-200 rounded font-mono text-[9px]">{p.aiVerdict}</span>}
                          </div>
                          <p className="text-zinc-400 mt-0.5">{p.aiFeedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <div className="bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl space-y-3 text-xs">
                <h3 className="font-bold text-white flex items-center space-x-1.5">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>Add Industry Certification</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="Certification Title (e.g. AWS Certified Developer)..."
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="Issuing Body (e.g. AWS, Coursera, Meta)..."
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    placeholder="Date Obtained (e.g. June 2025)..."
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Save Certification to Profile</span>
                </button>
              </div>

              {/* Certification Cards List */}
              <div className="space-y-3">
                {(formProfile.certifications || []).map(c => (
                  <div key={c.id} className="p-4 bg-[#0c0c0e] border border-zinc-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {c.issuer} {c.dateObtained ? `• ${c.dateObtained}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => ratePortfolioItem('certification', c)}
                          disabled={ratingItemId === c.id}
                          className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          {ratingItemId === c.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          <span>AI Recruiter Audit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(c.id)}
                          className="text-zinc-600 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {c.marketabilityScore !== undefined && (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start space-x-2 mt-2">
                        <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-[11px]">
                          <div className="font-bold text-amber-300 flex items-center space-x-2">
                            <span>Marketability Score: {c.marketabilityScore}/100</span>
                            {c.aiVerdict && <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-200 rounded font-mono text-[9px]">{c.aiVerdict}</span>}
                          </div>
                          <p className="text-zinc-400 mt-0.5">{c.aiFeedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Multi-Format Resume Upload & Parsing Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 lg:col-span-2 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <FileType className="h-4 w-4 text-emerald-400" />
                <span>Multi-Format Resume Upload & ATS Parsing</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Upload Word (.docx/.doc), PDF (.pdf), or plain text (.txt/.md) for AI Recruiter grading & ATS evaluation
              </p>
            </div>

            <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center space-x-2 shadow-lg shadow-indigo-500/20 shrink-0">
              {isParsing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span>{isParsing ? 'Parsing Document...' : 'Upload Document'}</span>
              <input 
                type="file" 
                accept=".pdf,.docx,.doc,.txt,.md,.rtf,.html,.csv,.json" 
                onChange={handleResumeFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
              isDragOver 
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
                : 'border-zinc-800 bg-[#0c0c0e] hover:border-zinc-700'
            }`}
          >
            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800">
              <Upload className={`h-6 w-6 ${isDragOver ? 'text-indigo-400 animate-bounce' : 'text-zinc-400'}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-white">
                Drag & drop your resume file here, or click <span className="text-indigo-400 underline">Upload Document</span> above
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Supports <span className="text-zinc-300 font-mono">.PDF, .DOCX, .DOC, .TXT, .MD, .RTF</span>
              </p>
            </div>
          </div>

          {showAtsPrompt && (
            <div className="p-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-zinc-900 border border-indigo-500/50 rounded-2xl shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl shrink-0">
                    <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <span>Resume Uploaded Successfully!</span>
                      <span className="px-2 py-0.5 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 font-bold uppercase">Ready for ATS Audit</span>
                    </h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      Would you like to run an instant ATS compatibility audit & keyword alignment check on your uploaded resume?
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAtsPrompt(false)}
                  className="text-zinc-400 hover:text-white text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAtsPrompt(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAtsPrompt(false);
                    if (onNavigateTab) {
                      onNavigateTab('ai-coach');
                    }
                  }}
                  className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  <Target className="h-4 w-4 text-purple-200" />
                  <span>Run ATS Resume Audit Now →</span>
                </button>
              </div>
            </div>
          )}

          {parseStatus && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-start space-x-3 font-mono ${
              parseStatus.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {parseStatus.success ? (
                <FileCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{parseStatus.filename}</span>
                  <span className="text-[10px] opacity-80">{parseStatus.fileSizeKB} KB • {parseStatus.wordCount} words</span>
                </div>
                {parseStatus.success ? (
                  <p className="text-[11px] opacity-90">Extracted resume text saved to memory context!</p>
                ) : (
                  <p className="text-[11px] text-rose-300">{parseStatus.error}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Parsed Resume Text Output:</span>
              <span>{formProfile.resumeText.trim() ? formProfile.resumeText.trim().split(/\s+/).length : 0} Words</span>
            </div>
            <textarea
              value={formProfile.resumeText}
              onChange={(e) => setFormProfile({ ...formProfile, resumeText: e.target.value })}
              className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500 h-56 leading-relaxed"
              placeholder="Paste or upload raw resume text here..."
            />
          </div>
        </div>

      </form>

      {/* Name Editing Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-indigo-400" />
                <span>Edit Candidate Name</span>
              </h3>
              <button onClick={() => setShowNameModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstNameInput}
                  onChange={(e) => setFirstNameInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Alex"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastNameInput}
                  onChange={(e) => setLastNameInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Chen"
                />
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
                Full display name preview: <strong className="text-white">{`${firstNameInput} ${lastNameInput}`.trim()}</strong>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const full = `${firstNameInput.trim()} ${lastNameInput.trim()}`.trim();
                    setFormProfile(prev => ({
                      ...prev,
                      firstName: firstNameInput.trim(),
                      lastName: lastNameInput.trim(),
                      fullName: full || prev.fullName
                    }));
                    setShowNameModal(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Save Name
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-3 bg-rose-500/20 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Reset Profile & Clear Data?</h3>
                <p className="text-xs text-rose-300/80 font-mono">Action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              This will <span className="text-rose-400 font-semibold">permanently delete all stored user profile data</span>, degree plans, course statuses, tracked job applications, release radar items, timeline milestones, action items, and AI coach chat history.
            </p>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 text-[11px] text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-300">Items to be wiped:</p>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                <li>Student Profile & Target Settings</li>
                <li>University Degree Plans & Course Grades</li>
                <li>Job Applications & Tracked Release Radar</li>
                <li>Career Milestones & Action Plan Items</li>
                <li>AI Coach Personas & Message Context</li>
              </ul>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  if (onResetAllData) {
                    onResetAllData();
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Yes, Wipe All Data & Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
