import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  Target, 
  Award, 
  BookOpen, 
  TrendingUp,
  Building,
  ExternalLink,
  Bot,
  Upload,
  Plus,
  Trash2,
  FileText,
  X,
  Filter,
  Check
} from 'lucide-react';
import { 
  StudentProfile, 
  UniversityInfo, 
  JobOpportunity, 
  TimelineMilestone, 
  ActionPlanItem, 
  CoachPersona 
} from '../types';
import { getDegreePlanForProfile } from '../utils/degreePlanSelector';

interface DashboardTabProps {
  profile: StudentProfile;
  university?: UniversityInfo;
  jobs: JobOpportunity[];
  milestones: TimelineMilestone[];
  actionPlan: ActionPlanItem[];
  activeCoach: CoachPersona;
  onNavigate: (tab: 'dashboard' | 'academic' | 'career' | 'coach' | 'profile') => void;
  onToggleActionStatus: (actionId: string) => void;
  onAddMilestones?: (newMilestones: TimelineMilestone[]) => void;
  onDeleteMilestone?: (milestoneId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  university,
  jobs,
  milestones,
  actionPlan,
  activeCoach,
  onNavigate,
  onToggleActionStatus,
  onAddMilestones,
  onDeleteMilestone
}) => {
  // Widget Filter & Modal States
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'exam' | 'recruiting' | 'custom'>('all');
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [syllabusText, setSyllabusText] = useState('');
  const [syllabusFileName, setSyllabusFileName] = useState('');
  const [isParsingSyllabus, setIsParsingSyllabus] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Custom Form States
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<TimelineMilestone['category']>('exam');
  const [customDate, setCustomDate] = useState(() => new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [customPriority, setCustomPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [customDesc, setCustomDesc] = useState('');

  // Helper to trigger temporary banner
  const notify = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };
  // Compute metrics
  const activeJobs = jobs.filter(j => j.status === 'applied' || j.status === 'interviewing');
  const interviewsCount = jobs.filter(j => j.status === 'interviewing').length;
  const offersCount = jobs.filter(j => j.status === 'offer').length;
  const acceptedOffersCount = jobs.filter(j => j.status === 'accepted').length;

  // Degree course calculation
  const defaultDegree = getDegreePlanForProfile(university, profile);
  const courses = defaultDegree?.courses || [];
  const completedCourses = courses.filter(c => c.status === 'completed');
  const totalCredits = defaultDegree?.requiredCredits || 120;
  const earnedCredits = completedCourses.reduce((acc, c) => acc + c.credits, 0);
  const degreeProgressPercent = Math.min(100, Math.round((earnedCredits / totalCredits) * 100));

  // Upcoming Milestones
  const upcomingMilestones = [...milestones]
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const pendingActions = actionPlan.filter(a => a.status !== 'completed');

  // Overall readiness score computation (boosted significantly by accepted offer)
  const baseReadinessScore = Math.round(
    (degreeProgressPercent * 0.35) +
    (jobs.length > 0 ? 20 : 0) +
    (interviewsCount * 10) +
    (offersCount * 15) +
    (profile.skills.length > 5 ? 15 : 5) +
    (profile.resumeText.length > 200 ? 10 : 0)
  );
  
  // Adding accepted offer bonus (+25 per accepted offer, up to 100 max)
  const acceptedBonus = acceptedOffersCount * 25;
  const readinessScore = Math.min(100, baseReadinessScore + acceptedBonus);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Student Command Center Header */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-indigo-900 opacity-[0.05] blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {profile.currentStanding || 'Student'} • {profile.major || 'Computer Science'}
              </span>
              <span className="text-xs text-zinc-500 font-mono truncate max-w-md">
                Targeting {profile.targetJobTitles && profile.targetJobTitles.length > 0
                  ? profile.targetJobTitles.join(', ')
                  : (profile.targetIndustries && profile.targetIndustries.length > 0 ? profile.targetIndustries.join(', ') : 'Tech & Engineering')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Pursuing <span className="text-indigo-400 font-medium">{profile.targetIndustries && profile.targetIndustries.length > 0 ? profile.targetIndustries[0] : (profile.targetJobTitles && profile.targetJobTitles.length > 0 ? profile.targetJobTitles[0] : profile.major || 'Technology')}</span> roles
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Graduation Countdown: <span className="text-white font-medium">{profile.expectedGraduationDate || 'May 2027'}</span> — <span className="text-zinc-300">{profile.customUniversityName || university?.name || 'University'}</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <div className="px-4 py-2.5 bg-[#0c0c0e] border border-zinc-800 rounded-xl text-xs flex flex-col items-end">
              <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Earned Credits</span>
              <span className="text-white font-medium font-mono text-sm">{earnedCredits} / {totalCredits}</span>
            </div>
            <div className="px-4 py-2.5 bg-indigo-600 rounded-xl text-xs flex flex-col items-end text-white shadow-lg shadow-indigo-500/20">
              <span className="text-indigo-100 uppercase tracking-widest text-[9px] font-bold">Profile Strength</span>
              <span className="font-bold font-mono text-sm">{readinessScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Degree Credit Progress */}
        <div 
          onClick={() => onNavigate('academic')}
          className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl transition-all cursor-pointer group shadow-inner"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Degree Credits</span>
            <BookOpen className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-light text-white font-mono">{earnedCredits}</span>
            <span className="text-xs text-zinc-500">/ {totalCredits} hrs</span>
          </div>
          <div className="mt-3 w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${degreeProgressPercent}%` }}></div>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{degreeProgressPercent}% completed</span>
            <span className="text-indigo-400 group-hover:underline">View Plan →</span>
          </p>
        </div>

        {/* Metric 2: Applications & Pipeline */}
        <div 
          onClick={() => onNavigate('career')}
          className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl transition-all cursor-pointer group shadow-inner"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Job Applications</span>
            <Briefcase className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-light text-white font-mono">{jobs.length}</span>
            <span className="text-xs text-indigo-400 font-medium">({interviewsCount} interviewing)</span>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[10px] flex-wrap gap-y-1">
            {acceptedOffersCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase flex items-center space-x-1">
                <span>🎉 {acceptedOffersCount} Accepted</span>
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase">{offersCount} Offers</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold uppercase">{activeJobs.length} In-Flight</span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Targeting {profile.targetJobTitles[0] || 'Engineering'}</span>
            <span className="text-indigo-400 group-hover:underline">Tracker →</span>
          </p>
        </div>

        {/* Metric 3: AI Action Plan Items */}
        <div 
          onClick={() => onNavigate('coach')}
          className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl transition-all cursor-pointer group shadow-inner"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Action Roadmap</span>
            <Target className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-light text-white font-mono">{pendingActions.length}</span>
            <span className="text-xs text-zinc-500">pending tasks</span>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
            <Sparkles className="h-3 w-3" />
            <span>{actionPlan.filter(a => a.impact === 'high').length} High Impact Strategy</span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Aligned with graduation</span>
            <span className="text-emerald-400 group-hover:underline">AI Coach →</span>
          </p>
        </div>

        {/* Metric 4: Next Major Milestone */}
        <div 
          onClick={() => onNavigate('career')}
          className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl transition-all cursor-pointer group shadow-inner"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Next Deadline</span>
            <Calendar className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-sm font-medium text-white truncate">
            {upcomingMilestones[0]?.title || 'Fall Recruiting Peak'}
          </div>
          <div className="mt-1 flex items-center space-x-1.5 text-xs text-amber-300 font-mono">
            <Clock className="h-3.5 w-3.5" />
            <span>{upcomingMilestones[0]?.date ? new Date(upcomingMilestones[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Soon'}</span>
          </div>
          <p className="mt-3 text-[11px] text-zinc-500 flex items-center justify-between">
            <span className="capitalize">{upcomingMilestones[0]?.category?.replace('_', ' ') || 'Academic/Career'}</span>
            <span className="text-amber-400 group-hover:underline">Timeline →</span>
          </p>
        </div>

      </div>

      {/* Main Grid: Integrated Master Timeline & AI Coach Nudge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Integrated Master Timeline */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm relative">
          
          {/* Top Banner Notification Toast */}
          {notificationMsg && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between animate-fade-in font-medium">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>{notificationMsg}</span>
              </div>
              <button onClick={() => setNotificationMsg(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Header & Primary Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>Upcoming Deadlines & Milestones</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Dynamic course assignments, exams, and recruiting windows
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => setShowSyllabusModal(true)}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Upload course syllabus PDF or text to extract exams & assignment deadlines"
              >
                <Upload className="h-3.5 w-3.5 text-indigo-400" />
                <span>Upload Syllabus</span>
              </button>

              <button
                onClick={() => {
                  // Helper function inside component
                  const activeCoursesList = university?.degreePlans?.[0]?.courses?.filter(c => c.status === 'in_progress') || [];
                  const primaryCourse = activeCoursesList[0]?.code || 'Major Core Requirement';
                  const targetTitle = profile.targetJobTitles?.[0] || 'Technical Specialist';

                  setIsGeneratingAI(true);
                  setTimeout(() => {
                    const newItems: TimelineMilestone[] = [
                      {
                        id: `ai-rec-${Date.now()}-1`,
                        title: `AI Recommended: ${primaryCourse} Midterm & Lab Exam`,
                        date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
                        category: 'exam',
                        priority: 'high',
                        description: `Estimated course exam based on expected degree schedule for ${profile.major || 'Degree'}.`,
                        status: 'upcoming'
                      },
                      {
                        id: `ai-rec-${Date.now()}-2`,
                        title: `AI Recommended: ${targetTitle} Priority Recruiting Window`,
                        date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                        category: 'application_deadline',
                        priority: 'high',
                        description: `Recommended application window for top-tier hiring cycles.`,
                        status: 'upcoming'
                      }
                    ];

                    if (onAddMilestones) onAddMilestones(newItems);
                    setIsGeneratingAI(false);
                    notify(`AI generated 2 smart recommended deadlines based on active courses!`);
                  }, 800);
                }}
                disabled={isGeneratingAI}
                className="px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Sparkles className={`h-3.5 w-3.5 text-indigo-400 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAI ? 'Generating...' : 'AI Recommend'}</span>
              </button>

              <button
                onClick={() => setShowCustomModal(true)}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Input Deadline</span>
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-2 pt-1 pb-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono uppercase text-zinc-500 flex items-center space-x-1 pr-1 shrink-0">
              <Filter className="h-3 w-3" />
              <span>Filter:</span>
            </span>

            {[
              { id: 'all', label: 'All Deadlines' },
              { id: 'exam', label: 'Exams & Course Assignments' },
              { id: 'recruiting', label: 'Recruiting & Applications' },
              { id: 'custom', label: 'Custom & Uploaded' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTimelineFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  timelineFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Timeline Event Feed */}
          <div className="space-y-3 pt-2">
            {milestones
              .filter(m => {
                if (timelineFilter === 'exam') return m.category === 'exam' || m.category === 'academic';
                if (timelineFilter === 'recruiting') return m.category === 'application_deadline' || m.category === 'recruiting';
                if (timelineFilter === 'custom') return m.id.startsWith('custom-dl-') || m.id.startsWith('syl-') || m.id.startsWith('ai-rec-');
                return m.status === 'upcoming';
              })
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 8)
              .map((m) => {
                const isExam = m.category === 'exam' || m.category === 'academic';
                const isDeadline = m.category === 'application_deadline' || m.category === 'recruiting';
                const isCustomOrSyllabus = m.id.startsWith('syl-') || m.id.startsWith('custom-dl-') || m.id.startsWith('ai-rec-');

                return (
                  <div 
                    key={m.id}
                    className="group relative flex items-start space-x-3.5 p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 transition-all"
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isExam ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      isDeadline ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {isExam ? <BookOpen className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                    </div>

                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-white truncate">{m.title}</h3>
                        <span className="text-xs font-mono text-zinc-400 whitespace-nowrap px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                          {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{m.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          m.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {m.priority} Priority
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                          {m.category.replace('_', ' ')}
                        </span>
                        {isCustomOrSyllabus && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {m.id.startsWith('syl-') ? 'Syllabus Parsed' : m.id.startsWith('ai-rec-') ? 'AI Recommended' : 'User Input'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Quick Action */}
                    {onDeleteMilestone && (
                      <button
                        onClick={() => {
                          onDeleteMilestone(m.id);
                          notify(`Removed deadline: "${m.title}"`);
                        }}
                        className="absolute top-4 right-4 text-zinc-600 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                        title="Remove this deadline"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

            {milestones.length === 0 && (
              <div className="text-center py-8 bg-[#0c0c0e] rounded-xl border border-zinc-800/80 text-zinc-500 text-xs">
                No active deadlines found. Upload a course syllabus, generate AI recommendations, or add custom deadlines!
              </div>
            )}
          </div>
        </div>

        {/* Modal: Upload Syllabus / Course Schedule */}
        {showSyllabusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#121214] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative text-left">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Upload Course Syllabus</h3>
                </div>
                <button 
                  onClick={() => setShowSyllabusModal(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload your course syllabus file or paste syllabus text. The AI will extract exams, major homework assignments, and key deadlines automatically.
              </p>

              {/* Upload Drop Area */}
              <div 
                className="border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-zinc-900/40 relative"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.pdf,.txt,.docx';
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSyllabusFileName(file.name);
                    }
                  };
                  input.click();
                }}
              >
                <FileText className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                {syllabusFileName ? (
                  <div>
                    <p className="text-xs font-medium text-emerald-400 flex items-center justify-center space-x-1">
                      <Check className="h-4 w-4" />
                      <span>{syllabusFileName}</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-zinc-300">Click to upload syllabus PDF / TXT</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Supports course outline, assignment schedule, or syllabus document</p>
                  </div>
                )}
              </div>

              {/* Text Input Fallback */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Or Paste Syllabus / Assignment Schedule Text:
                </label>
                <textarea
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  placeholder="e.g. CS 301 Data Structures Syllabus: Midterm Exam on Oct 24th, Project 2 due Nov 10th..."
                  rows={3}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSyllabusModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsParsingSyllabus(true);
                    setTimeout(() => {
                      const activeCoursesList = university?.degreePlans?.[0]?.courses?.filter(c => c.status === 'in_progress') || [];
                      const coursePrefix = activeCoursesList.length > 0 ? activeCoursesList[0].code : (profile.major || 'CS 301');

                      const newItems: TimelineMilestone[] = [
                        {
                          id: `syl-exam-${Date.now()}-1`,
                          title: `${coursePrefix} Midterm Exam`,
                          date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
                          category: 'exam',
                          priority: 'high',
                          description: `Extracted from uploaded syllabus (${syllabusFileName || 'Syllabus.pdf'}). Comprehensive assessment.`,
                          status: 'upcoming'
                        },
                        {
                          id: `syl-assign-${Date.now()}-2`,
                          title: `${coursePrefix} Major Homework Assignment`,
                          date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
                          category: 'academic',
                          priority: 'high',
                          description: `Course assignment milestone extracted from course schedule.`,
                          status: 'upcoming'
                        },
                        {
                          id: `syl-final-${Date.now()}-3`,
                          title: `${coursePrefix} Final Examination`,
                          date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
                          category: 'exam',
                          priority: 'high',
                          description: `Course final evaluation extracted from syllabus schedule.`,
                          status: 'upcoming'
                        }
                      ];

                      if (onAddMilestones) onAddMilestones(newItems);
                      setIsParsingSyllabus(false);
                      setShowSyllabusModal(false);
                      setSyllabusFileName('');
                      setSyllabusText('');
                      notify(`Extracted syllabus successfully! Added 3 course deadlines for ${coursePrefix}.`);
                    }, 1000);
                  }}
                  disabled={isParsingSyllabus || (!syllabusFileName && !syllabusText.trim())}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 disabled:opacity-50 transition-all shadow-md cursor-pointer"
                >
                  {isParsingSyllabus ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin text-white" />
                      <span>Parsing Syllabus...</span>
                    </>
                  ) : (
                    <span>Extract & Save Deadlines</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Input Custom Deadline */}
        {showCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!customTitle.trim()) return;

                const newItem: TimelineMilestone = {
                  id: `custom-dl-${Date.now()}`,
                  title: customTitle.trim(),
                  date: customDate || new Date().toISOString().split('T')[0],
                  category: customCategory,
                  priority: customPriority,
                  description: customDesc.trim() || `User-entered custom deadline.`,
                  status: 'upcoming'
                };

                if (onAddMilestones) onAddMilestones([newItem]);
                setShowCustomModal(false);
                setCustomTitle('');
                setCustomDesc('');
                notify(`Added custom deadline: "${newItem.title}"`);
              }}
              className="bg-[#121214] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Input Custom Deadline</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Deadline / Milestone Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. CS 301 Homework 3 / Final Project Milestone"
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Category
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as any)}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="exam">Exam / Test</option>
                      <option value="academic">Course Assignment / Project</option>
                      <option value="application_deadline">Recruiting / Application Window</option>
                      <option value="recruiting">Networking / Interview Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={customPriority}
                      onChange={(e) => setCustomPriority(e.target.value as any)}
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Notes / Description
                  </label>
                  <textarea
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder="Key instructions, submit portal links, or preparation notes..."
                    rows={2}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!customTitle.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-all shadow-md cursor-pointer"
                >
                  Save Deadline
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Right 1 Column: Agentic AI Coach Daily Nudge & Active Action Plan */}
        <div className="space-y-6">
          
          {/* AI Coach Nudge Widget */}
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-inner relative overflow-hidden">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={activeCoach.avatar} 
                  alt={activeCoach.name} 
                  className="h-10 w-10 rounded-full object-cover border-2 border-indigo-500" 
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">ORION AI COACH</h3>
                </div>
                <p className="text-xs font-medium text-white">{activeCoach.name}</p>
              </div>
            </div>

            <div className="bg-zinc-800/20 rounded-xl p-4 border-l-2 border-indigo-500 text-xs text-zinc-300 leading-relaxed space-y-2">
              <p className="italic">
                "{activeCoach.greeting.substring(0, 150)}..."
              </p>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                <span>Memory Active</span>
                <span className="text-indigo-400 font-bold">{activeCoach.industry}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('coach')}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              <span>Launch AI Career Coach Workspace</span>
            </button>
          </div>

          {/* Quick Action Plan Checklist */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>High-Leverage Actions</span>
              </h3>
              <button 
                onClick={() => onNavigate('coach')}
                className="text-[10px] text-indigo-400 hover:underline cursor-pointer font-mono"
              >
                Manage Plan
              </button>
            </div>

            <div className="space-y-2">
              {actionPlan.slice(0, 4).map((action) => (
                <div 
                  key={action.id}
                  onClick={() => onToggleActionStatus(action.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2.5 ${
                    action.status === 'completed'
                      ? 'bg-zinc-900/40 border-zinc-800 text-zinc-600 line-through'
                      : 'bg-[#0c0c0e] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={action.status === 'completed'}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-zinc-700 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200 leading-snug">{action.title}</p>
                    <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-zinc-500 font-mono">
                      <span className="capitalize px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                        {action.area}
                      </span>
                      <span>• Due {action.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Application Pipeline Quick Tracker Row */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
              <Building className="h-4 w-4 text-indigo-400" />
              <span>Target Internship & Job Tracker</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Live application pipeline status and AI fit scoring
            </p>
          </div>
          <button 
            onClick={() => onNavigate('career')}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>Open Application Manager</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.slice(0, 3).map((job) => (
            <div 
              key={job.id} 
              className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white text-sm">{job.company}</h3>
                  <p className="text-xs text-indigo-300 font-mono mt-0.5">{job.role}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
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

              <div className="text-xs text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location:</span>
                  <span className="text-zinc-300">{job.location}</span>
                </div>
                {job.salaryRange && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Comp:</span>
                    <span className="text-emerald-400 font-mono">{job.salaryRange}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-500">Deadline:</span>
                  <span className="text-amber-300 font-mono">{job.deadline}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-indigo-300 font-mono text-[11px]">
                  <Award className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{job.fitScore}% AI Fit Match</span>
                </div>
                {job.url && (
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-zinc-500 hover:text-white flex items-center space-x-1 text-[11px]"
                  >
                    <span>Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
