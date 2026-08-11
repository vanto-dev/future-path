import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  Building2, 
  Briefcase, 
  Mic, 
  Clock, 
  TrendingUp, 
  Target,
  RefreshCw,
  BookmarkPlus,
  Check
} from 'lucide-react';
import { StudentProfile, MockQuestion, MockInterviewSession, JobOpportunity, ActionPlanItem } from '../types';

interface AIMockInterviewProps {
  profile: StudentProfile;
  jobs?: JobOpportunity[];
  onAddActionItem?: (item: ActionPlanItem) => void;
}

export const AIMockInterview: React.FC<AIMockInterviewProps> = ({ profile, jobs = [], onAddActionItem }) => {
  const [savedQuestionIds, setSavedQuestionIds] = useState<Set<string>>(new Set());
  // Extract applied companies from Application Command
  const appliedCompanies = Array.from(new Set(jobs.map(j => j.company).filter(Boolean)));

  // Generate suggested companies based on profile target industries / functions / target companies
  const targetIndustryStr = (profile.targetIndustries || []).join(' ').toLowerCase();
  const targetFunctionStr = (profile.targetFunctions || []).join(' ').toLowerCase();
  const suggestedBase: string[] = [...(profile.targetCompanies || [])];

  if (targetIndustryStr.includes('tech') || targetFunctionStr.includes('software') || targetFunctionStr.includes('ai')) {
    suggestedBase.push('Google', 'Meta', 'Apple', 'Microsoft', 'Amazon', 'Stripe', 'Anthropic', 'OpenAI', 'Databricks', 'Netflix');
  }
  if (targetIndustryStr.includes('quant') || targetIndustryStr.includes('trading') || targetFunctionStr.includes('quant')) {
    suggestedBase.push('Citadel Securities', 'Jane Street', 'Two Sigma', 'Hudson River Trading', 'Jump Trading');
  }
  if (targetIndustryStr.includes('finance') || targetIndustryStr.includes('banking')) {
    suggestedBase.push('Goldman Sachs', 'Morgan Stanley', 'J.P. Morgan', 'Bank of America');
  }
  if (targetIndustryStr.includes('consulting')) {
    suggestedBase.push('McKinsey & Company', 'Boston Consulting Group (BCG)', 'Bain & Company', 'Deloitte');
  }

  const suggestedCompanies = Array.from(new Set(suggestedBase.filter(c => !appliedCompanies.includes(c))));

  // Standard default recruiting companies
  const defaultCommonCompanies = [
    'Google', 'Meta', 'Apple', 'Microsoft', 'Amazon', 'Stripe', 
    'Citadel Securities', 'Goldman Sachs', 'McKinsey & Company', 
    'Anthropic', 'OpenAI', 'Netflix', 'Tesla', 'NVIDIA', 'Palantir', 'Uber'
  ].filter(c => !appliedCompanies.includes(c) && !suggestedCompanies.includes(c));

  const [selectedCompany, setSelectedCompany] = useState<string>(
    appliedCompanies[0] || profile.targetCompanies[0] || 'Google'
  );
  const [isCustomCompany, setIsCustomCompany] = useState(false);
  const [customCompanyInput, setCustomCompanyInput] = useState('');

  const [selectedRole, setSelectedRole] = useState<string>(profile.targetJobTitles[0] || 'Software Engineer');
  const [selectedCategory, setSelectedCategory] = useState<'Behavioral' | 'Technical' | 'System Design' | 'Quant'>('Behavioral');

  const [session, setSession] = useState<MockInterviewSession | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Reset active session state when profile changes/resets
  useEffect(() => {
    setSession(null);
    setUserAnswer('');
    setCustomCompanyInput('');
    setIsCustomCompany(false);
    setSelectedCompany(profile.targetCompanies[0] || 'Google');
    setSelectedRole(profile.targetJobTitles[0] || 'Software Engineer');
  }, [profile.id]);

  const startNewSession = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/mock-interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: selectedCompany,
          role: selectedRole,
          interviewType: selectedCategory,
          studentProfile: profile
        })
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setSession({
          id: 'mock-' + Date.now(),
          company: selectedCompany,
          role: selectedRole,
          interviewType: selectedCategory,
          questions: data.questions,
          status: 'in_progress',
          createdAt: new Date().toISOString()
        });
        setCurrentQIndex(0);
        setUserAnswer('');
      }
    } catch (err) {
      console.error('Failed to start mock interview:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!session || !userAnswer.trim()) return;
    const currentQ = session.questions[currentQIndex];
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/ai/mock-interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: session.company,
          role: session.role,
          questionText: currentQ.questionText,
          userAnswer: userAnswer.trim(),
          category: session.interviewType
        })
      });
      const evalData = await res.json();

      const updatedQuestions = session.questions.map((q, idx) => {
        if (idx === currentQIndex) {
          return {
            ...q,
            userAnswer: userAnswer.trim(),
            aiScore: evalData.aiScore || 85,
            strengths: evalData.strengths || [],
            improvements: evalData.improvements || [],
            starBreakdown: evalData.starBreakdown
          };
        }
        return q;
      });

      const allAnswered = updatedQuestions.every(q => q.userAnswer);
      let avgScore = undefined;
      if (allAnswered) {
        const sum = updatedQuestions.reduce((acc, q) => acc + (q.aiScore || 0), 0);
        avgScore = Math.round(sum / updatedQuestions.length);
      }

      setSession({
        ...session,
        questions: updatedQuestions,
        overallScore: avgScore,
        status: allAnswered ? 'completed' : 'in_progress'
      });
      setUserAnswer('');
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveToActionPlan = (q: MockQuestion) => {
    if (!session) return;
    const isSaved = savedQuestionIds.has(q.id);
    if (isSaved) return;

    const newItem: ActionPlanItem = {
      id: 'action-mock-' + q.id + '-' + Date.now(),
      title: `Practice Interview Topic: ${q.category} (${session.company} - ${session.role})`,
      area: 'skills',
      deadline: 'Next 3 Days',
      impact: (q.aiScore && q.aiScore < 75) ? 'high' : 'medium',
      reasoning: `Interview Question: "${q.questionText}". Focus on STAR format alignment. Expectations: ${q.idealAnswerOutline || 'Prepare concise situation, action, and metric outcome examples.'}`,
      status: 'pending',
      steps: [
        `Review question: "${q.questionText}"`,
        q.improvements && q.improvements.length > 0
          ? `Improvement focus: ${q.improvements[0]}`
          : 'Formulate 2-minute STAR response focusing on quantifiable impact',
        'Re-test verbal response in AI Mock Simulator'
      ]
    };

    if (onAddActionItem) {
      onAddActionItem(newItem);
    } else {
      try {
        const existingRaw = localStorage.getItem('pathways_actionplan') || localStorage.getItem('futurepath_actionplan') || '[]';
        const parsed = JSON.parse(existingRaw);
        parsed.unshift(newItem);
        localStorage.setItem('pathways_actionplan', JSON.stringify(parsed));
        localStorage.setItem('futurepath_actionplan', JSON.stringify(parsed));
      } catch (e) {
        console.error('Failed saving action item to localStorage:', e);
      }
    }

    setSavedQuestionIds(prev => new Set(prev).add(q.id));
  };

  const currentQ = session?.questions[currentQIndex];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] text-purple-400 font-bold uppercase tracking-widest">
            <Bot className="h-4 w-4" />
            <span>AI Mock Interview Simulator</span>
          </div>
          <h2 className="text-xl font-light text-white">
            Tailored Practice & Instant STAR Evaluation
          </h2>
          <p className="text-xs text-zinc-400">
            Simulate real interview questions tailored to your target company, role, and academic background. Receive instant 0-100 scoring and recruiter feedback.
          </p>
        </div>

        {session && (
          <button
            onClick={() => setSession(null)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Configure New Session</span>
          </button>
        )}
      </div>

      {/* SETUP PHASE */}
      {!session ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-zinc-800">
            <Target className="h-4 w-4 text-purple-400" />
            <span>Configure Mock Interview Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Target Company */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-semibold text-zinc-300">Target Company:</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCompany(!isCustomCompany);
                    if (!isCustomCompany && customCompanyInput) {
                      setSelectedCompany(customCompanyInput);
                    }
                  }}
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-mono underline cursor-pointer"
                >
                  {isCustomCompany ? '← Choose from List' : '+ Enter Custom'}
                </button>
              </div>

              {isCustomCompany ? (
                <input
                  type="text"
                  value={customCompanyInput}
                  onChange={(e) => {
                    setCustomCompanyInput(e.target.value);
                    setSelectedCompany(e.target.value || 'Target Company');
                  }}
                  placeholder="Type company name (e.g. Palantir, OpenAI)..."
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              ) : (
                <select
                  value={selectedCompany}
                  onChange={(e) => {
                    if (e.target.value === '__CUSTOM__') {
                      setIsCustomCompany(true);
                    } else {
                      setSelectedCompany(e.target.value);
                    }
                  }}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  {/* 1. Applied Companies */}
                  <optgroup label="📋 Applied Companies (Application Command)">
                    {appliedCompanies.length > 0 ? (
                      appliedCompanies.map(c => (
                        <option key={`app-${c}`} value={c}>{c}</option>
                      ))
                    ) : (
                      <option disabled>(No applications tracked yet in Application Command)</option>
                    )}
                  </optgroup>

                  {/* 2. Suggested Practice Companies */}
                  {suggestedCompanies.length > 0 && (
                    <optgroup label="🎯 Suggested Practice Companies (Based on Your Goals)">
                      {suggestedCompanies.map(c => (
                        <option key={`sug-${c}`} value={c}>{c}</option>
                      ))}
                    </optgroup>
                  )}

                  {/* 3. Common Top Recruiting Companies */}
                  <optgroup label="🏢 Standard Top Recruiting Companies">
                    {defaultCommonCompanies.map(c => (
                      <option key={`def-${c}`} value={c}>{c}</option>
                    ))}
                  </optgroup>

                  <option value="__CUSTOM__">+ Enter Custom Company...</option>
                </select>
              )}
            </div>

            {/* Target Role */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Target Job Title:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                {profile.targetJobTitles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
                <option value="Software Engineer">Software Engineer</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
                <option value="Quantitative Software Engineer">Quantitative Software Engineer</option>
                <option value="Technical Product Manager">Technical Product Manager</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Interview Focus Area:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="Behavioral">Behavioral (STAR Method & Leadership)</option>
                <option value="Technical">Technical Coding & System Concepts</option>
                <option value="System Design">System Architecture & Scalability</option>
                <option value="Quant">Quantitative Math & Brainteasers</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={startNewSession}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl shadow-purple-500/20 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-purple-200" />
                  <span>Generating Interview Questions for {selectedCompany}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-purple-200" />
                  <span>🚀 Start AI Mock Interview Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* INTERVIEW IN PROGRESS PHASE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Question List Sidebar */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm lg:col-span-1">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Session Questions ({session.questions.length})
              </span>
              <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded font-mono font-semibold">
                {session.company} • {session.interviewType}
              </span>
            </div>

            <div className="space-y-2">
              {session.questions.map((q, idx) => {
                const isCurrent = idx === currentQIndex;
                const isAnswered = !!q.userAnswer;
                return (
                  <div
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-purple-600/20 border-purple-500 text-white font-semibold'
                        : isAnswered
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-[#0c0c0e] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                      <span>Question {idx + 1}</span>
                      {isAnswered && (
                        <span className="text-emerald-400 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{q.aiScore}/100</span>
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-[11px] leading-snug">{q.questionText}</p>
                  </div>
                );
              })}
            </div>

            {session.overallScore !== undefined && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-center">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Overall Session Score</div>
                <div className="text-2xl font-light text-emerald-300 font-mono">{session.overallScore} / 100</div>
              </div>
            )}
          </div>

          {/* Active Question & Response Area */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-5 backdrop-blur-sm lg:col-span-2">
            {currentQ && (
              <div className="space-y-5">
                
                {/* Question Box */}
                <div className="p-5 bg-[#0c0c0e] border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 font-bold">
                    <span>Question {currentQIndex + 1} of {session.questions.length} • Focus: {currentQ.category}</span>
                    <button
                      type="button"
                      onClick={() => handleSaveToActionPlan(currentQ)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition-all border ${
                        savedQuestionIds.has(currentQ.id)
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30'
                      }`}
                      title="Save this interview question topic to your Action Plan roadmap"
                    >
                      {savedQuestionIds.has(currentQ.id) ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Saved to Action Plan</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="h-3 w-3 text-indigo-400" />
                          <span>Save to Action Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                  <h3 className="text-base font-medium text-white leading-relaxed">
                    "{currentQ.questionText}"
                  </h3>
                  {currentQ.idealAnswerOutline && (
                    <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                      <span className="font-semibold text-zinc-300">Recruiter Expectations Outline: </span>
                      {currentQ.idealAnswerOutline}
                    </div>
                  )}
                </div>

                {/* User Response Textarea */}
                {!currentQ.userAnswer ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-zinc-300">Your Answer (Type or outline your response):</label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Outline your situation, task, action taken, and quantifiable result..."
                      className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-4 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 h-40 leading-relaxed font-mono"
                    />

                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        userAnswer.trim()
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {isEvaluating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-purple-200" />
                          <span>Evaluating Answer with AI Recruiter...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Answer for AI Evaluation</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* EVALUATION RESULT DISPLAY */
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
                          <Sparkles className="h-4 w-4 text-purple-400" />
                          <span>AI Recruiter Evaluation</span>
                        </span>
                        <span className="text-lg font-mono font-bold text-emerald-400">
                          {currentQ.aiScore} / 100
                        </span>
                      </div>

                      <div className="text-xs text-zinc-300 font-mono bg-[#0c0c0e] p-3 rounded-lg border border-zinc-800">
                        <span className="text-zinc-500">Your Submitted Response: </span>
                        "{currentQ.userAnswer}"
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {currentQ.strengths && currentQ.strengths.length > 0 && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                          <span className="font-bold text-emerald-300 flex items-center space-x-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>Key Strengths:</span>
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-emerald-200/90 text-[11px]">
                            {currentQ.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentQ.improvements && currentQ.improvements.length > 0 && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                          <span className="font-bold text-amber-300 flex items-center space-x-1.5">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                            <span>Areas for Elevation:</span>
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-amber-200/90 text-[11px]">
                            {currentQ.improvements.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      {currentQIndex < session.questions.length - 1 ? (
                        <button
                          onClick={() => {
                            setCurrentQIndex(prev => prev + 1);
                            setUserAnswer('');
                          }}
                          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-purple-500/20"
                        >
                          <span>Proceed to Question {currentQIndex + 2}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Session Completed! Review overall score in sidebar.</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
