import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Plus, 
  Filter, 
  ExternalLink, 
  Award, 
  Clock, 
  CheckCircle, 
  CheckCircle2,
  XCircle, 
  Bookmark, 
  Send, 
  Download,
  Building,
  Sparkles,
  MapPin,
  DollarSign,
  AlertTriangle,
  FileText,
  Trophy,
  PartyPopper,
  Radio,
  Search,
  Building2,
  Flame,
  Zap,
  Check,
  Globe,
  SlidersHorizontal,
  Target,
  Bot
} from 'lucide-react';
import { JobOpportunity, CompanyReleaseTrackerItem, TimelineMilestone, StudentProfile } from '../types';

interface CareerTimelineTabProps {
  jobs: JobOpportunity[];
  releaseItems?: CompanyReleaseTrackerItem[];
  milestones: TimelineMilestone[];
  profile: StudentProfile;
  onAddJob: (job: JobOpportunity) => void;
  onTrackReleaseItem?: (item: CompanyReleaseTrackerItem) => void;
  onAddReleaseItem?: (item: CompanyReleaseTrackerItem) => void;
  onUpdateJobStatus: (jobId: string, status: JobOpportunity['status']) => void;
  onDeleteJob: (jobId: string) => void;
  onExportCalendar: () => void;
  onOpenCoachWithContext?: (company: string, role: string, interviewStage?: string, recommendations?: string[], requirements?: string[]) => void;
}

const pipelineStages: { id: JobOpportunity['status']; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'applied', label: 'Applied', icon: Send },
  { id: 'interviewing', label: 'Interview', icon: Clock },
  { id: 'offer', label: 'Offer', icon: Sparkles },
  { id: 'accepted', label: 'Accepted', icon: Trophy }
];

const getStageIndex = (status: JobOpportunity['status']) => {
  switch (status) {
    case 'saved': return 0;
    case 'applied': return 1;
    case 'interviewing': return 2;
    case 'offer': return 3;
    case 'accepted': return 4;
    case 'rejected': return -1;
    default: return 0;
  }
};

const CompanyLogo: React.FC<{ company: string; logoUrl?: string; className?: string }> = ({ company, logoUrl, className = "h-8 w-8" }) => {
  const [imgError, setImgError] = useState(false);

  const knownLogos: Record<string, string> = {
    google: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
    meta: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    microsoft: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    amazon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    stripe: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    nvidia: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    anthropic: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg',
    citadel: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Citadel_LLC_logo.svg',
    databricks: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Databricks_Logo.svg',
    openai: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    tesla: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    goldmansachs: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg',
    palantir: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Palantir_Technologies_logo.svg',
  };

  const compLower = company.toLowerCase().replace(/[^a-z0-9]/g, '');
  const foundKey = Object.keys(knownLogos).find(k => compLower.includes(k));
  const src = (!imgError && foundKey) ? knownLogos[foundKey] : logoUrl;

  if (imgError || !src) {
    const initial = company.charAt(0).toUpperCase();
    return (
      <div className={`${className} rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs border border-zinc-700 shadow shrink-0`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={company}
      onError={() => setImgError(true)}
      className={`${className} rounded-xl object-contain bg-white/95 p-1 border border-zinc-800 shadow shrink-0`}
    />
  );
};

function getInterviewRecommendations(companyName: string, roleTitle: string): string[] {
  const comp = companyName.toLowerCase();

  if (comp.includes('stripe')) {
    return [
      'Master live code refactoring, exception handling, and API design in TypeScript/Python.',
      'Review CS 170 graph algorithms (Dijkstra, BFS/DFS) and WebSockets rate-limiting design.',
      'Prepare 2 STAR stories demonstrating technical ownership under high-scale production traffic.'
    ];
  }
  if (comp.includes('google')) {
    return [
      'Focus on optimal algorithmic time/space bounds (O(N) time, O(1) space) and 2-pointer DP patterns.',
      'Practice thinking out loud and testing edge cases (empty inputs, integer overflow) before coding.',
      'Review Google STEP/SWE leadership principles and collaborative problem-solving style.'
    ];
  }
  if (comp.includes('anthropic') || comp.includes('openai') || comp.includes('ai')) {
    return [
      'Review PyTorch GPU tensor profiling, memory layouts, and Transformer attention mechanisms.',
      'Prepare detailed talking points on BAIR research or custom multimodal model optimization.',
      'Demonstrate deep understanding of LLM latency benchmarking and distributed training.'
    ];
  }
  if (comp.includes('citadel') || comp.includes('two sigma') || comp.includes('jane street')) {
    return [
      'Brush up on fast mental math, Bayes Theorem, expected value, and Markov chain probability.',
      'Review C++ memory management (smart pointers, cache locality, low-latency execution).',
      'Be ready to walk through quantitative backtest methodologies and risk metrics.'
    ];
  }
  if (comp.includes('meta')) {
    return [
      'Focus on speed: solve 2 medium coding problems within 45 minutes with zero syntax bugs.',
      'Review fundamental data structures (Binary Trees, Graphs, Hash Tables, Sliding Window).',
      'Highlight system scalability and product intuition during behavioral scenarios.'
    ];
  }
  return [
    `Practice core Data Structures & Algorithms relevant to ${companyName}'s technical stack.`,
    `Review system design basics and modular architecture for ${roleTitle}.`,
    'Prepare tailored STAR stories connecting past internship achievements to target team goals.'
  ];
}

export const CareerTimelineTab: React.FC<CareerTimelineTabProps> = ({
  jobs,
  releaseItems = [],
  milestones,
  profile,
  onAddJob,
  onTrackReleaseItem,
  onAddReleaseItem,
  onUpdateJobStatus,
  onDeleteJob,
  onExportCalendar,
  onOpenCoachWithContext
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'radar' | 'timeline'>('pipeline');
  const [statusFilter, setStatusFilter] = useState<'all' | 'saved' | 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected'>('all');
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddReleaseModal, setShowAddReleaseModal] = useState(false);

  // Radar Filters State
  const [radarCategory, setRadarCategory] = useState<string>('all');
  const [radarStatus, setRadarStatus] = useState<string>('all');
  const [radarSearch, setRadarSearch] = useState<string>('');
  const [onlyTargetCompanies, setOnlyTargetCompanies] = useState<boolean>(false);

  // New Release Item Modal Form State
  const [relCompany, setRelCompany] = useState('');
  const [relRole, setRelRole] = useState('');
  const [relCategory, setRelCategory] = useState<CompanyReleaseTrackerItem['category']>('Software Engineering');
  const [relTerm, setRelTerm] = useState('Summer 2027 Internship');
  const [relLocation, setRelLocation] = useState('San Francisco, CA / Remote');
  const [relWorkMode, setRelWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [relReleaseStatus, setRelReleaseStatus] = useState<CompanyReleaseTrackerItem['releaseStatus']>('Open Now');
  const [relReleaseDate, setRelReleaseDate] = useState('2026-08-08');
  const [relApplyUrl, setRelApplyUrl] = useState('');
  const [relSalary, setRelSalary] = useState('$55 - $70 / hr');
  const [relNotes, setRelNotes] = useState('');

  // New Job Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState<'Internship' | 'Full-time' | 'Co-op' | 'Fellowship'>('Internship');
  const [location, setLocation] = useState('San Francisco, CA');
  const [salaryRange, setSalaryRange] = useState('');
  const [deadline, setDeadline] = useState('2026-10-15');
  const [notes, setNotes] = useState('');
  const [url, setUrl] = useState('');

  const filteredJobs = jobs.filter(j => statusFilter === 'all' || j.status === statusFilter);

  // Filtered Release Radar Items
  const userTargetsLower = (profile.targetCompanies || []).map(c => c.toLowerCase());
  const filteredRadarItems = releaseItems.filter(item => {
    if (onlyTargetCompanies && !userTargetsLower.some(tc => item.company.toLowerCase().includes(tc))) {
      return false;
    }
    if (radarCategory !== 'all' && item.category !== radarCategory) {
      return false;
    }
    if (radarStatus !== 'all' && item.releaseStatus !== radarStatus) {
      return false;
    }
    if (radarSearch.trim()) {
      const q = radarSearch.toLowerCase();
      const matchComp = item.company.toLowerCase().includes(q);
      const matchRole = item.role.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchTerm = item.term.toLowerCase().includes(q);
      if (!matchComp && !matchRole && !matchLoc && !matchTerm) return false;
    }
    return true;
  });

  const handleCreateReleaseItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relCompany || !relRole || !relApplyUrl) return;

    const newItem: CompanyReleaseTrackerItem = {
      id: `rel-user-${Date.now()}`,
      company: relCompany,
      logoUrl: `https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&q=80`,
      role: relRole,
      category: relCategory,
      term: relTerm,
      location: relLocation,
      workMode: relWorkMode,
      releaseStatus: relReleaseStatus,
      releaseDate: relReleaseDate,
      estimatedDaysToRelease: relReleaseStatus === 'Opening Soon' ? 5 : 0,
      applyUrl: relApplyUrl,
      salaryEst: relSalary,
      requirements: ['Coding / System Design', 'Problem Solving', 'Data Structures'],
      notes: relNotes || 'Submitted by student release tracker community.',
      verifiedByCommunity: true
    };

    if (onAddReleaseItem) {
      onAddReleaseItem(newItem);
    }

    setRelCompany('');
    setRelRole('');
    setRelApplyUrl('');
    setRelNotes('');
    setShowAddReleaseModal(false);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    // Estimate fit score based on target role keywords
    const isTargetMatch = profile.targetJobTitles.some(t => role.toLowerCase().includes(t.toLowerCase()));
    const rawFit = isTargetMatch ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 20) + 70;
    const fitScore = Number.isFinite(rawFit) ? Math.min(99, Math.max(50, Math.round(rawFit))) : 80;

    // Gracefully format salary input (handles "TBD", "Competitive", "Unpaid", "$140k", etc.)
    let formattedSalary: string | undefined = undefined;
    if (salaryRange && salaryRange.trim()) {
      const trimmed = salaryRange.trim();
      const lower = trimmed.toLowerCase();
      if (lower === 'tbd') formattedSalary = 'TBD (To Be Determined)';
      else if (lower === 'competitive') formattedSalary = 'Competitive Compensation';
      else if (lower === 'unpaid') formattedSalary = 'Unpaid Internship';
      else if (lower === 'doe') formattedSalary = 'DOE (Depends on Experience)';
      else if (lower === 'negotiable') formattedSalary = 'Negotiable';
      else formattedSalary = trimmed;
    }

    const newJobItem: JobOpportunity = {
      id: `job-${Date.now()}`,
      company,
      role,
      type,
      location: location || 'Remote',
      salaryRange: formattedSalary,
      deadline: deadline || '2026-11-01',
      status: 'saved',
      fitScore,
      priorityScore: fitScore > 85 ? 95 : 80,
      requirements: ['Data Structures', 'Problem Solving', 'Communication'],
      notes: notes || 'Added to target application pipeline.',
      url: url || undefined
    };

    onAddJob(newJobItem);
    setCompany('');
    setRole('');
    setSalaryRange('');
    setNotes('');
    setUrl('');
    setShowAddJobModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
            <Briefcase className="h-4 w-4" />
            <span>Career Timeline & Opportunity Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-light text-white">
            Job & Internship Application Command
          </h1>
          <p className="text-xs text-zinc-400">
            Overlaid recruiting seasons, application status pipelines, and smart deadline notifications targeting <span className="text-amber-300 font-mono font-medium">{profile.expectedGraduationDate || 'May 2027'}</span> graduation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onExportCalendar}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-indigo-400" />
            <span>Export iCal (.ics)</span>
          </button>

          <button
            onClick={() => setShowAddJobModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Track Opportunity</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c0c0e] border border-zinc-800 p-4 rounded-2xl shadow-inner">
        <div className="flex flex-wrap items-center gap-1.5 border-b md:border-b-0 pb-2 md:pb-0 border-zinc-800">
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'pipeline'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Active Pipeline ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('radar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'radar'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>Application Release Radar ({releaseItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'timeline'
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Recruiting Roadmap ({milestones.length})</span>
          </button>
        </div>

        {/* Radar Tab Specific Action */}
        {activeSubTab === 'radar' && (
          <button
            onClick={() => setShowAddReleaseModal(true)}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-medium flex items-center space-x-1.5 cursor-pointer transition-all shrink-0"
          >
            <Plus className="h-3.5 w-3.5 text-amber-400" />
            <span>Report Opening / Link</span>
          </button>
        )}

        {/* Status Filter Pills */}
        {activeSubTab === 'pipeline' && (
          <div className="flex items-center space-x-1 overflow-x-auto text-xs">
            <Filter className="h-3.5 w-3.5 text-zinc-500 mr-1 shrink-0" />
            {(['all', 'saved', 'applied', 'interviewing', 'offer', 'accepted', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-all cursor-pointer text-xs ${
                  statusFilter === status
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'bg-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {status} ({status === 'all' ? jobs.length : jobs.filter(j => j.status === status).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main View 1: Application Pipeline Cards */}
      {activeSubTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              No job applications found in this pipeline category. Click "Track Opportunity" above to add one!
            </div>
          ) : (
            filteredJobs.map(job => (
              <div 
                key={job.id}
                className={`bg-[#0c0c0e] border rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl flex flex-col justify-between ${
                  job.status === 'accepted' 
                    ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.12)] bg-gradient-to-b from-emerald-950/20 to-[#0c0c0e]' 
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Celebratory Banner for Accepted Offers */}
                  {job.status === 'accepted' && (
                    <div className="bg-gradient-to-r from-emerald-900/40 via-emerald-800/30 to-amber-900/30 border border-emerald-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-200 shadow-md">
                      <div className="flex items-center space-x-2 font-bold">
                        <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>🎉 OFFER ACCEPTED!</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                        +25 Profile Strength
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <CompanyLogo company={job.company} logoUrl={job.logoUrl} className="h-9 w-9" />
                      <div>
                        <h3 className="text-base font-medium text-white flex items-center space-x-2">
                          <span>{job.company}</span>
                        </h3>
                        <p className="text-xs text-indigo-300 font-mono mt-0.5">{job.role}</p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded shrink-0 ${
                      job.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold' :
                      job.status === 'offer' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      job.status === 'interviewing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      job.status === 'applied' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                      job.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {job.status === 'accepted' ? '🎉 Accepted' : job.status}
                    </span>
                  </div>

                  {/* Metadata Pills */}
                  <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
                    <div className="flex items-center space-x-2 text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{job.location}</span>
                    </div>

                    {job.salaryRange && (
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>{job.salaryRange}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-amber-300">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Fit Score & Priority */}
                  <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-indigo-300">{job.fitScore}% AI Fit Match</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Priority: {job.priorityScore}
                    </span>
                  </div>

                  {/* Notes */}
                  {job.notes && (
                    <div className="p-2.5 bg-zinc-900/40 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 leading-normal">
                      <span className="text-zinc-300 font-medium">Notes:</span> {job.notes}
                    </div>
                  )}

                  {/* Actionable Interview Recommendations & AI Coach Button */}
                  {(job.status === 'applied' || job.status === 'interviewing' || job.status === 'offer') && (
                    <div className="p-3 bg-gradient-to-b from-indigo-950/30 to-[#09090b] border border-indigo-500/25 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-indigo-300 text-[11px]">
                        <span className="flex items-center space-x-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <span>Interview Success Recommendations</span>
                        </span>
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold uppercase">
                          {job.status} STAGE
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-[11px] text-zinc-300">
                        {getInterviewRecommendations(job.company, job.role).map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-2 leading-tight">
                            <span className="text-amber-400 font-bold text-xs mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenCoachWithContext) {
                            onOpenCoachWithContext(
                              job.company,
                              job.role,
                              job.status,
                              getInterviewRecommendations(job.company, job.role),
                              job.requirements
                            );
                          }
                        }}
                        className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                      >
                        <Bot className="h-4 w-4 text-purple-200" />
                        <span>Coach Me with AI Agent →</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Enhanced Move Status Pipeline & External Link */}
                <div className="pt-3 border-t border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Move Status Pipeline</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Stage: <strong className="text-white capitalize">{job.status}</strong>
                    </span>
                  </div>

                  {/* Interactive Pipeline Step Buttons */}
                  <div className="grid grid-cols-5 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    {pipelineStages.map((stage, idx) => {
                      const StageIcon = stage.icon;
                      const isActive = job.status === stage.id;
                      const isPast = getStageIndex(job.status) > idx && job.status !== 'rejected';

                      return (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => onUpdateJobStatus(job.id, stage.id)}
                          title={`Move status to ${stage.label}`}
                          className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                            isActive
                              ? stage.id === 'accepted'
                                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/30 font-bold scale-[1.02]'
                                : stage.id === 'offer'
                                ? 'bg-emerald-600 text-white font-bold'
                                : stage.id === 'interviewing'
                                ? 'bg-amber-600 text-white font-bold'
                                : stage.id === 'applied'
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-zinc-700 text-white font-bold'
                              : isPast
                              ? 'text-emerald-400 hover:bg-zinc-900 hover:text-emerald-300'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                          }`}
                        >
                          <StageIcon className={`h-3.5 w-3.5 mb-0.5 ${isActive ? 'text-white' : isPast ? 'text-emerald-400' : 'text-zinc-500'}`} />
                          <span className="truncate w-full text-center text-[9px]">{stage.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Rejected Toggle & Links */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateJobStatus(job.id, job.status === 'rejected' ? 'applied' : 'rejected')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center space-x-1 border transition-all cursor-pointer ${
                        job.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                          : 'bg-zinc-900/60 text-zinc-500 border-zinc-800 hover:text-rose-400 hover:border-zinc-700'
                      }`}
                    >
                      <XCircle className="h-3 w-3" />
                      <span>{job.status === 'rejected' ? 'Marked Rejected (Restore)' : 'Mark Rejected'}</span>
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onDeleteJob(job.id)}
                        className="text-zinc-600 hover:text-rose-400 transition-colors text-[11px] cursor-pointer"
                      >
                        Remove
                      </button>

                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 text-[11px]"
                        >
                          <span>Apply / Details</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Main View 2: Application Release Radar */}
      {activeSubTab === 'radar' && (
        <div className="space-y-6">
          {/* Radar Control Panel & Filters */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl space-y-4 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={radarSearch}
                  onChange={(e) => setRadarSearch(e.target.value)}
                  placeholder="Search target company, role, location, or season..."
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Target Company Filter Toggle */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setOnlyTargetCompanies(!onlyTargetCompanies)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    onlyTargetCompanies
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-[#0c0c0e] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <Target className="h-3.5 w-3.5" />
                  <span>My Target Wishlist Only ({userTargetsLower.length} Target Companies)</span>
                </button>

                {/* Release Status Dropdown / Filter */}
                <select
                  value={radarStatus}
                  onChange={(e) => setRadarStatus(e.target.value)}
                  className="bg-[#0c0c0e] border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">All Release Statuses</option>
                  <option value="Open Now">Open Now 🟢</option>
                  <option value="Opening Soon">Opening Soon ⏳</option>
                  <option value="Closing Soon">Closing Soon 🔴</option>
                  <option value="Waitlist">Waitlist 📋</option>
                </select>

                {/* Category Dropdown */}
                <select
                  value={radarCategory}
                  onChange={(e) => setRadarCategory(e.target.value)}
                  className="bg-[#0c0c0e] border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">All Functional Roles</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="ML/AI">ML & AI Systems</option>
                  <option value="Quantitative Finance">Quantitative Finance / Quant</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Hardware/Systems">Hardware & Systems</option>
                </select>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/80 text-xs">
              <div className="p-3 bg-[#0c0c0e] border border-zinc-800/80 rounded-xl flex items-center justify-between">
                <span className="text-zinc-400 text-[11px]">Total Monitored Releases</span>
                <span className="font-mono font-bold text-white text-sm">{releaseItems.length}</span>
              </div>
              <div className="p-3 bg-[#0c0c0e] border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <span className="text-emerald-400 text-[11px] flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Currently Open Now</span>
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {releaseItems.filter(i => i.releaseStatus === 'Open Now').length}
                </span>
              </div>
              <div className="p-3 bg-[#0c0c0e] border border-amber-500/20 rounded-xl flex items-center justify-between">
                <span className="text-amber-400 text-[11px]">Opening Soon</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {releaseItems.filter(i => i.releaseStatus === 'Opening Soon').length}
                </span>
              </div>
              <div className="p-3 bg-[#0c0c0e] border border-indigo-500/20 rounded-xl flex items-center justify-between">
                <span className="text-indigo-300 text-[11px]">Target Wishlist Matches</span>
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  {releaseItems.filter(i => userTargetsLower.some(tc => i.company.toLowerCase().includes(tc))).length}
                </span>
              </div>
            </div>
          </div>

          {/* Release Radar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRadarItems.length === 0 ? (
              <div className="col-span-full p-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl space-y-2">
                <p>No application releases matched your active filters or target company wishlist.</p>
                <button
                  onClick={() => { setRadarCategory('all'); setRadarStatus('all'); setRadarSearch(''); setOnlyTargetCompanies(false); }}
                  className="text-amber-400 hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredRadarItems.map(item => {
                const isTargetMatch = userTargetsLower.some(tc => item.company.toLowerCase().includes(tc));
                const isAlreadyTracked = jobs.some(j => j.company.toLowerCase() === item.company.toLowerCase() && j.role.toLowerCase() === item.role.toLowerCase());

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl bg-zinc-900/60 border transition-all flex flex-col justify-between space-y-4 hover:border-amber-500/40 relative overflow-hidden group ${
                      isTargetMatch
                        ? 'border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                        : 'border-zinc-800'
                    }`}
                  >
                    {/* Top Accent Stripe if Target Match */}
                    {isTargetMatch && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"></div>
                    )}

                    <div className="space-y-3">
                      {/* Header Badge Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <CompanyLogo company={item.company} logoUrl={item.logoUrl} className="h-9 w-9" />
                          <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors flex items-center space-x-1.5">
                              <span>{item.company}</span>
                            </h3>
                            <span className="text-[10px] text-zinc-400 font-mono">{item.term}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0 ${
                          item.releaseStatus === 'Open Now'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : item.releaseStatus === 'Opening Soon'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : item.releaseStatus === 'Closing Soon'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                            : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                        }`}>
                          {item.releaseStatus === 'Open Now' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>}
                          <span>{item.releaseStatus}</span>
                        </span>
                      </div>

                      {/* Role & Category */}
                      <div>
                        <p className="text-xs font-semibold text-zinc-100 line-clamp-2">{item.role}</p>
                        <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mt-1">
                          <span className="bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-300">{item.category}</span>
                          {isTargetMatch && (
                            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-semibold flex items-center space-x-1">
                              <Target className="h-3 w-3 text-indigo-400" />
                              <span>Target List Match</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div className="space-y-1.5 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80">
                        <div className="flex items-center justify-between text-zinc-300">
                          <span className="flex items-center space-x-1 text-zinc-400">
                            <MapPin className="h-3 w-3 text-zinc-500" />
                            <span>{item.location}</span>
                          </span>
                          <span className="font-mono text-zinc-300 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">{item.workMode}</span>
                        </div>

                        {item.salaryEst && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[10px]">Est. Compensation:</span>
                            <span className="font-mono text-amber-300 font-medium text-[10px]">{item.salaryEst}</span>
                          </div>
                        )}

                        {item.estimatedDaysToRelease !== undefined && item.estimatedDaysToRelease > 0 && (
                          <div className="flex items-center justify-between text-amber-400 font-mono text-[10px]">
                            <span>Countdown to Opening:</span>
                            <span>{item.estimatedDaysToRelease} Days</span>
                          </div>
                        )}

                        {item.notes && (
                          <p className="text-[10px] text-zinc-400 italic pt-1 line-clamp-2">{item.notes}</p>
                        )}
                      </div>

                      {/* Skills & Experience Match Summary */}
                      {(() => {
                        const studentSkillsLower = (profile.skills || []).map(s => typeof s === 'string' ? s.toLowerCase() : (s && typeof s === 'object' && s.name ? s.name.toLowerCase() : ''));
                        const reqs = item.requirements || [];
                        const matchedSkills = reqs.filter(r => studentSkillsLower.some(s => s.includes(r.toLowerCase()) || r.toLowerCase().includes(s)));
                        const missingSkills = reqs.filter(r => !studentSkillsLower.some(s => s.includes(r.toLowerCase()) || r.toLowerCase().includes(s)));
                        const matchPercent = reqs.length > 0 ? Math.min(98, Math.max(70, Math.round((matchedSkills.length / reqs.length) * 100))) : 88;

                        return (
                          <div className="p-3 bg-[#08080a] border border-zinc-800 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1">
                                <Target className="h-3.5 w-3.5 text-indigo-400" />
                                <span>Skills & Experience Match Summary</span>
                              </span>
                              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                                {matchPercent}% Match
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 text-[10px]">
                              {matchedSkills.map((sk, idx) => (
                                <span key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono flex items-center space-x-1">
                                  <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                                  <span>{sk}</span>
                                </span>
                              ))}
                              {missingSkills.map((sk, idx) => (
                                <span key={idx} className="bg-zinc-800/80 text-zinc-400 border border-zinc-700/80 px-2 py-0.5 rounded font-mono">
                                  + {sk}
                                </span>
                              ))}
                            </div>

                            <div className="text-[10px] text-zinc-400 font-mono flex items-center space-x-1.5 pt-1 border-t border-zinc-800/60">
                              <Award className="h-3 w-3 text-amber-400 shrink-0" />
                              <span>Profile Match: {profile.major} • GPA {profile.gpa}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onTrackReleaseItem && onTrackReleaseItem(item)}
                        disabled={isAlreadyTracked}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                          isAlreadyTracked
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
                        }`}
                      >
                        {isAlreadyTracked ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Tracked in Pipeline</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>Track in Pipeline</span>
                          </>
                        )}
                      </button>

                      <a
                        href={item.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-medium flex items-center space-x-1 cursor-pointer transition-all"
                        title="Open Official Company Career Portal"
                      >
                        <span>Apply</span>
                        <ExternalLink className="h-3 w-3 text-zinc-400" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Main View 3: Recruiting Season Timeline Overlay */}
      {activeSubTab === 'timeline' && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span>Career Milestones & Recruiting Roadmap</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Full chronological overlay of campus career fairs, internship application windows, exams, and certification deadlines
              </p>
            </div>
          </div>

          <div className="relative border-l border-zinc-800 pl-6 space-y-6 ml-2">
            {milestones.map((m, idx) => {
              const isHighPriority = m.priority === 'high';

              return (
                <div key={m.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                    isHighPriority ? 'bg-amber-400 border-zinc-900 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-indigo-500 border-zinc-900'
                  }`}></div>

                  <div className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 transition-all space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          m.category === 'recruiting' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                          m.category === 'exam' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {m.category.replace('_', ' ')}
                        </span>
                        <h3 className="text-sm font-medium text-white">{m.title}</h3>
                      </div>

                      <span className="text-xs font-mono text-amber-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
                        {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Report Company Application Opening */}
      {showAddReleaseModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Radio className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Report Company Application Release</h3>
              </div>
              <button onClick={() => setShowAddReleaseModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-zinc-400">
              Submit a newly opened or upcoming job opening to the Application Release Radar.
            </p>

            <form onSubmit={handleCreateReleaseItem} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Company / Corporation</label>
                  <input
                    type="text"
                    required
                    value={relCompany}
                    onChange={(e) => setRelCompany(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. Anthropic, Stripe"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={relRole}
                    onChange={(e) => setRelRole(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. SWE Intern (Summer 2027)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Category</label>
                  <select
                    value={relCategory}
                    onChange={(e) => setRelCategory(e.target.value as any)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="ML/AI">ML & AI Systems</option>
                    <option value="Quantitative Finance">Quantitative Finance</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Hardware/Systems">Hardware & Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Target Term / Season</label>
                  <input
                    type="text"
                    value={relTerm}
                    onChange={(e) => setRelTerm(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                    placeholder="Summer 2027 Internship"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Release Status</label>
                  <select
                    value={relReleaseStatus}
                    onChange={(e) => setRelReleaseStatus(e.target.value as any)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Open Now">Open Now</option>
                    <option value="Opening Soon">Opening Soon</option>
                    <option value="Closing Soon">Closing Soon</option>
                    <option value="Waitlist">Waitlist</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Work Arrangement</label>
                  <select
                    value={relWorkMode}
                    onChange={(e) => setRelWorkMode(e.target.value as any)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Official Direct Application URL</label>
                <input
                  type="url"
                  required
                  value={relApplyUrl}
                  onChange={(e) => setRelApplyUrl(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  placeholder="https://careers.company.com/jobs/123"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={relLocation}
                    onChange={(e) => setRelLocation(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                    placeholder="San Francisco, CA / Remote"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Est. Compensation</label>
                  <input
                    type="text"
                    value={relSalary}
                    onChange={(e) => setRelSalary(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                    placeholder="$60 - $75 / hr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Community Notes & Tips</label>
                <textarea
                  value={relNotes}
                  onChange={(e) => setRelNotes(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 h-16"
                  placeholder="e.g. Verified open on workday. Online Assessment sent immediately upon applying."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReleaseModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Publish to Radar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Track Job / Internship Opportunity</h3>
              <button onClick={() => setShowAddJobModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Stripe, Google, Citadel"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Software Engineering Intern"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Opportunity Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Co-op">Co-op</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    placeholder="San Francisco, CA / Remote"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Salary / Compensation (Optional)</label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. $60/hr or $140k/yr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Application URL (Optional)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://company.com/careers"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Notes / Referral Contacts</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 h-20"
                  placeholder="e.g. Reached out to Berkeley alumnus on LinkedIn."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
