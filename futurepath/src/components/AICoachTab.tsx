import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  FileText, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  User, 
  Zap, 
  Award, 
  Copy, 
  Check, 
  Lightbulb, 
  MessageSquare, 
  Briefcase, 
  BookOpen,
  Plus,
  Upload,
  FileType,
  FileCheck,
  AlertCircle,
  TrendingUp,
  BarChart2,
  UserPlus,
  Wand2,
  X,
  Sliders,
  GraduationCap,
  Compass
} from 'lucide-react';
import { 
  StudentProfile, 
  CoachPersona, 
  ChatMessage, 
  ActionPlanItem, 
  ResumeAuditResult, 
  SkillGapResult, 
  TimelineMilestone,
  JobOpportunity 
} from '../types';
import { parseResumeFile, ParseResumeResult } from '../lib/parseResumeFile';
import { generateAdaptiveResumeAuditFallback } from '../lib/resumeAuditFallback';
import { AIMockInterview } from './AIMockInterview';

interface AICoachTabProps {
  profile: StudentProfile;
  personas: CoachPersona[];
  activePersona: CoachPersona;
  onSelectPersona: (persona: CoachPersona) => void;
  onAddCustomCoach?: (persona: CoachPersona) => void;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  actionPlan: ActionPlanItem[];
  onAddActionItem: (item: ActionPlanItem) => void;
  milestones: TimelineMilestone[];
  jobs?: JobOpportunity[];
}

export const AICoachTab: React.FC<AICoachTabProps> = ({
  profile,
  personas,
  activePersona,
  onSelectPersona,
  onAddCustomCoach,
  chatHistory,
  onSendMessage,
  actionPlan,
  onAddActionItem,
  milestones,
  jobs = []
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'interview' | 'resume' | 'skillgap' | 'outreach' | 'actionplan'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Custom Coach Creator State
  const [showCreateCoachModal, setShowCreateCoachModal] = useState(false);
  const [customCoachConcept, setCustomCoachConcept] = useState('');
  const [customCoachStyle, setCustomCoachStyle] = useState('Direct, highly technical, tactical, and encouraging');
  const [customCoachName, setCustomCoachName] = useState('');
  const [customCoachTitle, setCustomCoachTitle] = useState('');
  const [customCoachIndustry, setCustomCoachIndustry] = useState('');
  const [customCoachSystemPrompt, setCustomCoachSystemPrompt] = useState('');
  const [customCoachGreeting, setCustomCoachGreeting] = useState('');
  const [customCoachAvatar, setCustomCoachAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
  const [isGeneratingCustomCoach, setIsGeneratingCustomCoach] = useState(false);

  const PRESET_AVATARS = [
    { label: 'AI Architect', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
    { label: 'Quant Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
    { label: 'Product Director', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
    { label: 'Tech Recruiter', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80' },
    { label: 'Engineering Manager', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
  ];

  const handleAutoFillFromProfile = () => {
    const primaryRole = profile.targetJobTitles[0] || 'Software Engineer';
    const primaryIndustry = profile.targetIndustries[0] || 'Technology';
    const uniName = profile.customUniversityName || 'University';
    const majorStr = profile.major || 'Computer Science';

    setCustomCoachConcept(`${primaryRole} Career Advisor & Resume Auditor`);
    setCustomCoachName(`Coach ${profile.fullName.split(' ')[0] || 'Alex'}'s Mentor`);
    setCustomCoachTitle(`Principal ${primaryRole} Specialist & ${majorStr} Career Lead`);
    setCustomCoachIndustry(primaryIndustry);
    setCustomCoachGreeting(`Welcome! I'm your custom AI coach tailored to your background in ${majorStr} at ${uniName}. Target roles: ${profile.targetJobTitles.join(', ') || primaryRole}. Let's review your resume and build a winning strategy!`);
    setCustomCoachSystemPrompt(`You are a custom AI career mentor for a student studying ${majorStr} targeting ${primaryRole} roles in ${primaryIndustry}. Give highly tactical, personalized advice based on their resume and profile.`);
  };

  const handleGenerateCustomCoachAI = async () => {
    setIsGeneratingCustomCoach(true);
    try {
      const res = await fetch('/api/ai/generate-custom-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userConcept: customCoachConcept || `Senior ${profile.targetJobTitles[0] || 'Tech'} Coach`,
          coachingStyle: customCoachStyle,
          profile
        })
      });
      const data = await res.json();
      if (data.name) setCustomCoachName(data.name);
      if (data.title) setCustomCoachTitle(data.title);
      if (data.industry) setCustomCoachIndustry(data.industry);
      if (data.avatar) setCustomCoachAvatar(data.avatar);
      if (data.systemPromptModifier) setCustomCoachSystemPrompt(data.systemPromptModifier);
      if (data.greeting) setCustomCoachGreeting(data.greeting);
    } catch (err) {
      console.error('Failed to generate custom coach:', err);
    } finally {
      setIsGeneratingCustomCoach(false);
    }
  };

  const handleCreateCoachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCoachName.trim()) return;

    const newCoach: CoachPersona = {
      id: `custom-coach-${Date.now()}`,
      name: customCoachName.trim(),
      title: customCoachTitle.trim() || 'AI Career Advisor',
      industry: customCoachIndustry.trim() || 'Tech',
      avatar: customCoachAvatar,
      systemPromptModifier: customCoachSystemPrompt.trim() || 'You are an expert AI mentor.',
      greeting: customCoachGreeting.trim() || `Hello! I am ${customCoachName.trim()}. How can I help you succeed today?`
    };

    if (onAddCustomCoach) {
      onAddCustomCoach(newCoach);
    } else {
      onSelectPersona(newCoach);
    }

    setShowCreateCoachModal(false);
  };

  // Resume Audit State
  const [resumeInputText, setResumeInputText] = useState(profile.resumeText || '');
  const [isAuditing, setIsAuditing] = useState(false);
  const [resumeAudit, setResumeAudit] = useState<ResumeAuditResult | null>(null);
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [docParseStatus, setDocParseStatus] = useState<ParseResumeResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Auto file processor & auditor
  const processUploadedFile = async (file: File) => {
    setIsParsingDoc(true);
    setDocParseStatus(null);

    const result = await parseResumeFile(file);
    setIsParsingDoc(false);
    setDocParseStatus(result);

    if (result.success && result.text) {
      setResumeInputText(result.text);
      // Auto run audit on freshly uploaded resume
      runAuditOnText(result.text);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Skill Gap State
  const [isAnalyzingSkillGap, setIsAnalyzingSkillGap] = useState(false);
  const [skillGap, setSkillGap] = useState<SkillGapResult | null>(null);

  // Outreach Draft State
  const [materialType, setMaterialType] = useState<'cold_outreach' | 'cover_letter' | 'linkedin_headline' | 'thank_you'>('cold_outreach');
  const [targetCompany, setTargetCompany] = useState('Stripe');
  const [targetRole, setTargetRole] = useState(profile.targetJobTitles[0] || 'Software Engineering Intern');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Action Plan Auto-gen State
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Reset internal states when profile is cleared / reset
  useEffect(() => {
    setResumeInputText(profile.resumeText || '');
    if (!profile.resumeText) {
      setResumeAudit(null);
      setDocParseStatus(null);
      setSkillGap(null);
      setDraftResult('');
    }
  }, [profile.id, profile.resumeText]);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const msg = inputMessage;
    setInputMessage('');
    setIsSending(true);

    try {
      await onSendMessage(msg);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const runAuditOnText = async (textToAudit: string) => {
    if (!textToAudit.trim() || isAuditing) return;
    setIsAuditing(true);

    try {
      const res = await fetch('/api/ai/resume-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: textToAudit,
          targetRoles: profile.targetJobTitles,
          targetIndustries: profile.targetIndustries,
          profile: {
            fullName: profile.fullName,
            major: profile.major,
            degreeType: profile.degreeType,
            targetJobTitles: profile.targetJobTitles,
            targetIndustries: profile.targetIndustries,
            targetFunctions: profile.targetFunctions,
            relevantCoursework: profile.relevantCoursework,
            currentStanding: profile.currentStanding,
            skills: profile.skills,
            experiences: profile.experiences
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data && typeof data.overallScore === 'number') {
        const fallback = generateAdaptiveResumeAuditFallback(textToAudit, profile);
        setResumeAudit({
          ...fallback,
          ...data,
          bestFitRoles: (data.bestFitRoles && data.bestFitRoles.length > 0) ? data.bestFitRoles : fallback.bestFitRoles,
          targetRoleMatchScore: data.targetRoleMatchScore ?? fallback.targetRoleMatchScore,
          targetRoleAlignment: data.targetRoleAlignment || fallback.targetRoleAlignment
        });
      } else {
        setResumeAudit(generateAdaptiveResumeAuditFallback(textToAudit, profile));
      }
    } catch (err) {
      console.error('Resume audit API failed, using adaptive fallback:', err);
      setResumeAudit(generateAdaptiveResumeAuditFallback(textToAudit, profile));
    } finally {
      setIsAuditing(false);
    }
  };

  const handleRunResumeAudit = async () => {
    runAuditOnText(resumeInputText);
  };

  const handleRunSkillGap = async () => {
    if (isAnalyzingSkillGap) return;
    setIsAnalyzingSkillGap(true);

    try {
      const res = await fetch('/api/ai/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      const data = await res.json();
      setSkillGap(data);
    } catch (err) {
      console.error('Skill gap failed:', err);
    } finally {
      setIsAnalyzingSkillGap(false);
    }
  };

  const handleGenerateMaterial = async () => {
    if (isDrafting) return;
    setIsDrafting(true);

    try {
      const res = await fetch('/api/ai/draft-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialType,
          targetCompany,
          targetRole,
          profile
        })
      });
      const data = await res.json();
      setDraftResult(data.draft || '');
    } catch (err) {
      console.error('Draft generation failed:', err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleGenerateActionPlan = async () => {
    if (isGeneratingPlan) return;
    setIsGeneratingPlan(true);

    try {
      const res = await fetch('/api/ai/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, milestones })
      });
      const newItems: ActionPlanItem[] = await res.json();
      
      if (Array.isArray(newItems)) {
        newItems.forEach(item => onAddActionItem(item));
      }
    } catch (err) {
      console.error('Action plan generation failed:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Persona Selector */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Agentic AI Career Coach
              </span>
              <span className="text-xs text-zinc-500 font-mono">Long-term Memory Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-white">
              Domain-Expert Coaching Workspace
            </h1>
            <p className="text-xs text-zinc-400">
              Select an industry domain expert to review your resume, discover critical skill gaps, draft high-converting outreach, and build a timeline-aware action plan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-[#0c0c0e] p-2 rounded-xl border border-zinc-800">
            <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full">
              {personas.map(p => {
                const isCustom = p.id.startsWith('custom-') || p.isCustom;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPersona(p)}
                    className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap text-xs ${
                      activePersona.id === p.id 
                        ? 'bg-zinc-800 text-white font-semibold ring-1 ring-zinc-700 shadow-sm' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                    title={`${p.name} - ${p.title}`}
                  >
                    <img src={p.avatar} alt={p.name} className="h-5 w-5 rounded-full object-cover shrink-0" />
                    <span className="font-medium">{p.name}</span>
                    {isCustom && (
                      <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded uppercase font-mono">
                        Custom
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-zinc-800 hidden sm:block mx-0.5" />

            <button
              onClick={() => {
                handleAutoFillFromProfile();
                setShowCreateCoachModal(true);
              }}
              className="px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all cursor-pointer text-xs whitespace-nowrap shrink-0 shadow-md shadow-indigo-500/20 ml-auto"
              title="Create custom AI coach based on your profile & resume"
            >
              <UserPlus className="h-3.5 w-3.5 text-indigo-100" />
              <span>+ Create AI Coach</span>
            </button>
          </div>
        </div>

        {/* Current Active Persona Details */}
        <div className="flex items-center space-x-3 p-3 bg-[#0c0c0e] rounded-xl border border-zinc-800">
          <img src={activePersona.avatar} alt={activePersona.name} className="h-10 w-10 rounded-full object-cover border border-indigo-500/50 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm text-white">{activePersona.name}</span>
              <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.2 rounded font-mono">{activePersona.industry}</span>
            </div>
            <p className="text-xs text-zinc-400 truncate">{activePersona.title}</p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex space-x-1 overflow-x-auto bg-[#0c0c0e] border border-zinc-800 p-2 rounded-2xl text-xs scrollbar-none shadow-inner">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'chat'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Interactive Coach Chat</span>
        </button>

        <button
          onClick={() => setActiveSubTab('interview')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'interview'
              ? 'bg-purple-600 text-white font-semibold shadow-lg shadow-purple-500/20'
              : 'text-purple-400 hover:text-purple-300'
          }`}
        >
          <Bot className="h-4 w-4" />
          <span>AI Mock Interview Simulator</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('resume'); if(!resumeAudit) handleRunResumeAudit(); }}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'resume'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Resume Auditor & Rewriter</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('skillgap'); if(!skillGap) handleRunSkillGap(); }}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'skillgap'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Skill Gap Radar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('outreach')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'outreach'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Application Material Studio</span>
        </button>

        <button
          onClick={() => setActiveSubTab('actionplan')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'actionplan'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Timeline Action Plan ({actionPlan.length})</span>
        </button>
      </div>

      {/* Tab Content 1: Interactive Chat Workspace */}
      {activeSubTab === 'chat' && (
        <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-5 space-y-4 flex flex-col h-[520px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <img src={activePersona.avatar} alt={activePersona.name} className="h-8 w-8 rounded-full object-cover border border-indigo-500/50 shrink-0 mt-0.5" />
                  )}

                  <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-500/20' 
                      : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`block text-[10px] mt-2 font-mono ${isUser ? 'text-indigo-200 text-right' : 'text-zinc-500'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold shrink-0 mt-0.5">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}
                </div>
              );
            })}
            {isSending && (
              <div className="flex items-center space-x-2 text-xs text-indigo-300 bg-zinc-900 p-3 rounded-xl border border-zinc-800 w-max animate-pulse">
                <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" />
                <span>{activePersona.name} is reasoning through your career query...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Trigger Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto text-[11px] pt-2 border-t border-zinc-800">
            <span className="text-zinc-500 shrink-0 font-medium">Quick Prompts:</span>
            {[
              "What should I focus on this week?",
              "How can I prepare for technical interviews?",
              "Review my resume bullet points",
              "Draft a LinkedIn message to a recruiter"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => { setInputMessage(prompt); }}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white whitespace-nowrap transition-colors cursor-pointer border border-zinc-800/80"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask ${activePersona.name} about interview prep, resume fixes, or target role strategies...`}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab Content: AI Mock Interview Simulator */}
      {activeSubTab === 'interview' && (
        <AIMockInterview profile={profile} jobs={jobs} onAddActionItem={onAddActionItem} />
      )}

      {/* Tab Content 2: Resume Auditor & Rewriter */}
      {activeSubTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Resume Column */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                  <FileType className="h-4 w-4 text-indigo-400" />
                  <span>Resume Document Input & ATS Grader</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Target Roles: {profile.targetJobTitles.join(', ')}</p>
              </div>

              <div className="flex items-center space-x-2">
                <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center space-x-1.5 shrink-0">
                  {isParsingDoc ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 text-indigo-400" />}
                  <span>{isParsingDoc ? 'Parsing...' : 'Upload Resume File'}</span>
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.doc,.txt,.md,.rtf,.html,.csv,.json" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>

                <button
                  onClick={handleRunResumeAudit}
                  disabled={isAuditing || !resumeInputText.trim()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer shrink-0"
                >
                  {isAuditing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  <span>{isAuditing ? 'Auditing...' : 'Run Audit'}</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop File Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                isDragOver ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : 'border-zinc-800 bg-[#0c0c0e] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center space-x-2 text-xs font-medium text-zinc-300">
                <Upload className="h-4 w-4 text-indigo-400" />
                <span>Drag & drop Word (.docx/.doc), PDF (.pdf), or text resume here</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1 font-mono text-[9px] text-zinc-500">
                <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">.PDF</span>
                <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">.DOCX</span>
                <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">.DOC</span>
                <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">.TXT</span>
                <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">.MD</span>
                <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">.RTF</span>
              </div>
            </div>

            {/* Document Parse Status Notice */}
            {docParseStatus && (
              <div className={`p-3 rounded-xl border text-xs font-mono flex items-start space-x-2.5 ${
                docParseStatus.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {docParseStatus.success ? <FileCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />}
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>{docParseStatus.filename}</span>
                    <span className="text-[10px] opacity-80">{docParseStatus.fileSizeKB} KB • {docParseStatus.wordCount} words</span>
                  </div>
                  {docParseStatus.success ? (
                    <p className="text-[10px] opacity-90">Extracted document text & automatically triggered AI Recruiter Audit below.</p>
                  ) : (
                    <p className="text-[10px] text-rose-300">{docParseStatus.error}</p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Resume Raw Text Input:</span>
                <span>{resumeInputText.trim() ? resumeInputText.trim().split(/\s+/).length : 0} Words</span>
              </div>
              <textarea
                value={resumeInputText}
                onChange={(e) => setResumeInputText(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500 h-[280px] leading-relaxed"
                placeholder="Paste plain text resume here or drop a .docx / .pdf file above..."
              />
            </div>
          </div>

          {/* Audit Results Column */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-5 backdrop-blur-sm">
            {!resumeAudit ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-3">
                <Sparkles className="h-8 w-8 text-indigo-400 animate-bounce" />
                <p className="text-xs">Click "Run Audit" above to extract ATS scores, best-fit roles, bullet rewrites, and missing keywords tailored to your profile.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Adaptive Profile Context Banner */}
                <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                    <span className="flex items-center space-x-1.5">
                      <GraduationCap className="h-4 w-4 text-indigo-400" />
                      <span>Adaptive Resume Grader</span>
                    </span>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
                      {profile.major || 'General Studies'}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
                    <span>Target Roles: <strong className="text-zinc-200">{profile.targetJobTitles.join(', ') || 'Not specified'}</strong></span>
                    <span>Industries: <strong className="text-zinc-200">{profile.targetIndustries.join(', ') || 'Not specified'}</strong></span>
                  </div>
                </div>

                {/* Score Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-[#0c0c0e] p-2.5 rounded-xl border border-zinc-800 text-center font-mono">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 block">Overall</span>
                    <p className="text-lg font-light text-indigo-400 mt-0.5">{resumeAudit.overallScore}/100</p>
                  </div>
                  <div className="bg-[#0c0c0e] p-2.5 rounded-xl border border-zinc-800 text-center font-mono">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 block">ATS Match</span>
                    <p className="text-lg font-light text-emerald-400 mt-0.5">{resumeAudit.atsCompatibilityScore}%</p>
                  </div>
                  <div className="bg-[#0c0c0e] p-2.5 rounded-xl border border-zinc-800 text-center font-mono">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 block">Impact Score</span>
                    <p className="text-lg font-light text-amber-400 mt-0.5">{resumeAudit.impactScore}/100</p>
                  </div>
                  <div className="bg-[#0c0c0e] p-2.5 rounded-xl border border-zinc-800 text-center font-mono">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 block">Target Role Fit</span>
                    <p className="text-lg font-light text-purple-400 mt-0.5">{resumeAudit.targetRoleMatchScore ?? 80}%</p>
                  </div>
                </div>

                {/* Best Fit Roles Suggestions */}
                {resumeAudit.bestFitRoles && resumeAudit.bestFitRoles.length > 0 && (
                  <div className="p-3.5 bg-[#0c0c0e] rounded-xl border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                        <Briefcase className="h-4 w-4 text-emerald-400" />
                        <span>Best Fit Roles (From Current Resume)</span>
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-mono">3-4 Matched Roles</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {resumeAudit.bestFitRoles.map((role, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-medium rounded-lg flex items-center space-x-1"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                          <span>{role}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Role Alignment Section */}
                <div className="p-3.5 bg-[#0c0c0e] rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                      <Target className="h-4 w-4 text-purple-400" />
                      <span>Target Position Alignment</span>
                    </h4>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {resumeAudit.targetRoleMatchScore ?? 80}% Alignment
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {resumeAudit.targetRoleAlignment || `Evaluated fit against ${profile.targetJobTitles.join(', ') || 'your targeted positions'}. Resume shows good foundational alignment with clear areas for domain keyword optimization.`}
                  </p>
                </div>

                {/* Strengths & Key Fixes */}
                {(resumeAudit.strengths?.length > 0 || resumeAudit.keyImprovements?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {resumeAudit.strengths?.length > 0 && (
                      <div className="p-3 bg-[#0c0c0e] rounded-xl border border-zinc-800 space-y-1.5">
                        <h5 className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center space-x-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Key Strengths</span>
                        </h5>
                        <ul className="space-y-1 text-zinc-300 text-[11px] list-disc list-inside">
                          {resumeAudit.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {resumeAudit.keyImprovements?.length > 0 && (
                      <div className="p-3 bg-[#0c0c0e] rounded-xl border border-zinc-800 space-y-1.5">
                        <h5 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider flex items-center space-x-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Actionable Fixes</span>
                        </h5>
                        <ul className="space-y-1 text-zinc-300 text-[11px] list-disc list-inside">
                          {resumeAudit.keyImprovements.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantified Bullet Rewrites */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span>Quantified Bullet Rewrites ({profile.major || 'Domain'} Specific)</span>
                    </span>
                  </h4>
                  {resumeAudit.bulletRewrites.map((b, i) => (
                    <div key={i} className="p-3 bg-[#0c0c0e] rounded-xl border border-zinc-800 space-y-2 text-xs">
                      <div className="text-rose-400/80 line-through text-[11px] font-mono">• {b.original}</div>
                      <div className="text-emerald-300 font-medium font-mono flex items-start justify-between gap-2">
                        <span>• {b.improved}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(b.improved);
                          }}
                          className="shrink-0 p-1 text-zinc-400 hover:text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-all cursor-pointer"
                          title="Copy rewrite to clipboard"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-500 italic">Rationale: {b.reason}</p>
                    </div>
                  ))}
                </div>

                {/* Missing Keywords */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center justify-between">
                    <span>Missing ATS Keywords ({profile.targetJobTitles[0] || 'Target Domain'})</span>
                    <span className="text-[10px] text-rose-400 font-mono">{resumeAudit.missingKeywords.length} Recommended</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeAudit.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-mono rounded-lg flex items-center space-x-1">
                        <span>+ {kw}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: Skill Gap Radar */}
      {activeSubTab === 'skillgap' && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <Target className="h-4 w-4 text-indigo-400" />
                <span>Industry Skill Gap Matrix</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Benchmarking profile skills against industry standards for {profile.targetJobTitles.join(', ')}
              </p>
            </div>

            <button
              onClick={handleRunSkillGap}
              disabled={isAnalyzingSkillGap}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              {isAnalyzingSkillGap ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>{isAnalyzingSkillGap ? 'Analyzing...' : 'Re-analyze Skill Gap'}</span>
            </button>
          </div>

          {!skillGap ? (
            <div className="p-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              Loading skill gap matrix analysis...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Missing Skills Matrix */}
              <div className="space-y-4">
                <div className="p-4 bg-[#0c0c0e] rounded-xl border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-500">Target Role Match</span>
                    <h3 className="text-base font-medium text-white">{skillGap.targetRole}</h3>
                  </div>
                  <div className="text-2xl font-light text-indigo-400 font-mono">{skillGap.matchPercentage}% Match</div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Identified Skill Gaps & Priority</h3>
                  <div className="space-y-2">
                    {skillGap.missingSkills.map((sk, i) => (
                      <div key={i} className="p-3 bg-[#0c0c0e] rounded-xl border border-zinc-800 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">{sk.name}</span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded font-mono ${
                              sk.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {sk.priority}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1">{sk.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Recommended Projects & Certifications */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recommended Portfolio Projects</h3>
                <div className="space-y-3">
                  {skillGap.recommendedProjects.map((proj, i) => (
                    <div key={i} className="p-4 bg-[#0c0c0e] rounded-xl border border-zinc-800 space-y-2 text-xs">
                      <h4 className="font-medium text-indigo-300 text-sm">{proj.title}</h4>
                      <p className="text-zinc-400 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1 font-mono">
                        {proj.techStack.map((tech, j) => (
                          <span key={j} className="px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded text-[10px] border border-zinc-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">High-Value Certifications</h3>
                  <div className="flex flex-wrap gap-2 font-mono">
                    {skillGap.recommendedCertifications.map((cert, i) => (
                      <span key={i} className="px-3 py-1.5 bg-zinc-900 text-indigo-300 border border-zinc-800 rounded-xl text-xs">
                        🏆 {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Application Material Studio */}
      {activeSubTab === 'outreach' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Draft Application & Outreach Materials</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-400 mb-1">Material Type</label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="cold_outreach">LinkedIn / Email Alumni Cold Outreach</option>
                  <option value="cover_letter">Tailored Cover Letter</option>
                  <option value="linkedin_headline">LinkedIn Headline & About Bio</option>
                  <option value="thank_you">Post-Interview Thank You Email</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-400 mb-1">Target Company</label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-400 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateMaterial}
                disabled={isDrafting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                {isDrafting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>{isDrafting ? 'Drafting...' : 'Generate Material'}</span>
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Generated Draft Output</h3>
              {draftResult && (
                <button
                  onClick={() => copyToClipboard(draftResult)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center space-x-1 cursor-pointer border border-zinc-700/60"
                >
                  {copiedDraft ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedDraft ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="p-4 bg-[#0c0c0e] rounded-xl border border-zinc-800 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed h-[320px] overflow-y-auto">
              {draftResult || 'Select material options on the left and click "Generate Material" to view draft output.'}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Prioritized Strategic Action Plan */}
      {activeSubTab === 'actionplan' && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span>Timeline-Aware Action Roadmap</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Prioritized milestones aligned with your exam dates and graduation window ({profile.expectedGraduationDate})
              </p>
            </div>

            <button
              onClick={handleGenerateActionPlan}
              disabled={isGeneratingPlan}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isGeneratingPlan ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{isGeneratingPlan ? 'Generating Roadmap...' : 'Auto-Generate Strategic Plan'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {actionPlan.map((action) => (
              <div 
                key={action.id}
                className="p-5 rounded-2xl bg-[#0c0c0e] border border-zinc-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                      action.impact === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {action.impact} Impact
                    </span>
                    <h3 className="text-sm font-medium text-white">{action.title}</h3>
                  </div>

                  <span className="text-xs font-mono text-amber-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                    Deadline: {action.deadline}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{action.reasoning}</p>

                {action.steps && action.steps.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Action Steps:</span>
                    {action.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-zinc-300 font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom AI Coach Creator Modal */}
      {showCreateCoachModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white">Create Custom AI Career Coach</h2>
                  <p className="text-xs text-zinc-400">
                    Build a personalized AI coach tailored to your resume, degree, target roles, and custom system prompt.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateCoachModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-400 font-medium">Smart Generators:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAutoFillFromProfile}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Auto-fill from Profile & Resume</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateCustomCoachAI}
                  disabled={isGeneratingCustomCoach}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>{isGeneratingCustomCoach ? 'Generating Persona...' : 'Auto-Generate with AI'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateCoachSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Coach Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Marcus Vance or Coach Sarah"
                    value={customCoachName}
                    onChange={e => setCustomCoachName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Title & Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior AI Staff Engineer & Quant Mentor"
                    value={customCoachTitle}
                    onChange={e => setCustomCoachTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Industry / Specialty *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Generative AI, Quantitative Trading, BioTech"
                    value={customCoachIndustry}
                    onChange={e => setCustomCoachIndustry(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Coaching Style / Tone</label>
                  <input
                    type="text"
                    placeholder="e.g. Direct, highly technical, tactical, and encouraging"
                    value={customCoachStyle}
                    onChange={e => setCustomCoachStyle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">Coach Avatar</label>
                <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomCoachAvatar(av.url)}
                      className={`p-1 rounded-xl border flex flex-col items-center space-y-1 transition-all cursor-pointer shrink-0 ${
                        customCoachAvatar === av.url ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="h-10 w-10 rounded-full object-cover" />
                      <span className="text-[10px] text-zinc-400 max-w-[70px] truncate">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Persona System Prompt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">System Prompt Instructions (AI Persona Rules)</label>
                  <span className="text-[10px] text-zinc-500 font-mono">Controls how the coach thinks & responds</span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Describe your coach's role, background, instructions, and review criteria..."
                  value={customCoachSystemPrompt}
                  onChange={e => setCustomCoachSystemPrompt(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-mono text-[11px]"
                />
              </div>

              {/* Custom Initial Greeting */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">Initial Opening Greeting</label>
                <textarea
                  rows={2}
                  placeholder="Enter the initial chat greeting message from this coach..."
                  value={customCoachGreeting}
                  onChange={e => setCustomCoachGreeting(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 leading-relaxed text-xs"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCoachModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-indigo-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Create Coach & Launch Chat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
