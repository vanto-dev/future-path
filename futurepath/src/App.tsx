import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { AcademicTab } from './components/AcademicTab';
import { CareerTimelineTab } from './components/CareerTimelineTab';
import { AICoachTab } from './components/AICoachTab';
import { ProfileTab } from './components/ProfileTab';

import { 
  UNIVERSITIES, 
  DEFAULT_STUDENT_PROFILE, 
  INITIAL_JOB_OPPORTUNITIES, 
  INITIAL_RELEASE_TRACKER_ITEMS,
  INITIAL_TIMELINE_MILESTONES, 
  COACH_PERSONAS, 
  INITIAL_ACTION_PLAN,
  buildCustomCoachPersona,
  getUniversityAcademicCalendar,
  getResetUniversities
} from './data/mockData';
import { getDegreePlanForProfile } from './utils/degreePlanSelector';

import { 
  StudentProfile, 
  UniversityInfo, 
  JobOpportunity, 
  CompanyReleaseTrackerItem,
  TimelineMilestone, 
  ActionPlanItem, 
  CoachPersona, 
  ChatMessage,
  CourseRequirement,
  AcademicCalendarEvent
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'academic' | 'career' | 'coach' | 'profile'>('dashboard');

  // Local Storage State Persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('pathways_profile') || localStorage.getItem('futurepath_profile');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
  });

  const [universities, setUniversities] = useState<UniversityInfo[]>(() => {
    const saved = localStorage.getItem('pathways_universities') || localStorage.getItem('futurepath_universities');
    return saved ? JSON.parse(saved) : UNIVERSITIES;
  });

  const [jobs, setJobs] = useState<JobOpportunity[]>(() => {
    const saved = localStorage.getItem('pathways_jobs') || localStorage.getItem('futurepath_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOB_OPPORTUNITIES;
  });

  const [releaseItems, setReleaseItems] = useState<CompanyReleaseTrackerItem[]>(() => {
    const saved = localStorage.getItem('pathways_release_items') || localStorage.getItem('futurepath_release_items');
    return saved ? JSON.parse(saved) : INITIAL_RELEASE_TRACKER_ITEMS;
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => {
    const saved = localStorage.getItem('pathways_milestones') || localStorage.getItem('futurepath_milestones');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE_MILESTONES;
  });

  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>(() => {
    const saved = localStorage.getItem('pathways_actionplan') || localStorage.getItem('futurepath_actionplan');
    return saved ? JSON.parse(saved) : INITIAL_ACTION_PLAN;
  });

  const [personas, setPersonas] = useState<CoachPersona[]>(() => {
    const saved = localStorage.getItem('pathways_custom_personas') || localStorage.getItem('futurepath_custom_personas');
    let customList = COACH_PERSONAS;
    if (saved) {
      try {
        const custom = JSON.parse(saved);
        const existingIds = new Set(COACH_PERSONAS.map(p => p.id));
        const customFiltered = custom.filter((c: CoachPersona) => !existingIds.has(c.id));
        customList = [...COACH_PERSONAS, ...customFiltered];
      } catch (e) {
        console.error('Failed to parse custom personas', e);
      }
    }
    return customList;
  });

  // Dynamically update Custom Coach persona whenever student profile updates
  useEffect(() => {
    setPersonas(prev => {
      const customIndex = prev.findIndex(p => p.id === 'persona-custom');
      const existingCustom = customIndex >= 0 ? prev[customIndex] : undefined;
      const updatedCustom = buildCustomCoachPersona(profile, existingCustom);

      if (customIndex >= 0) {
        const next = [...prev];
        next[customIndex] = updatedCustom;
        return next;
      } else {
        return [updatedCustom, ...prev];
      }
    });
  }, [profile]);

  const [activeCoach, setActiveCoach] = useState<CoachPersona>(COACH_PERSONAS[0]);

  // Separate Chat Histories per Coach Persona
  const [coachChatHistories, setCoachChatHistories] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('pathways_coach_chats') || localStorage.getItem('futurepath_coach_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse coach chats', e);
      }
    }
    const initial: Record<string, ChatMessage[]> = {};
    COACH_PERSONAS.forEach(p => {
      initial[p.id] = [
        {
          id: `init-${p.id}`,
          sender: 'agent',
          text: p.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
    return initial;
  });

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('pathways_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('pathways_universities', JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('pathways_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('pathways_release_items', JSON.stringify(releaseItems));
  }, [releaseItems]);

  useEffect(() => {
    localStorage.setItem('pathways_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('pathways_actionplan', JSON.stringify(actionPlan));
  }, [actionPlan]);

  useEffect(() => {
    localStorage.setItem('pathways_coach_chats', JSON.stringify(coachChatHistories));
  }, [coachChatHistories]);

  // Ensure custom universities are registered in state array so they persist to LocalStorage
  useEffect(() => {
    const customName = profile.customUniversityName?.trim();
    if (customName && !profile.universityId) {
      const customId = `custom-${customName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const existing = universities.find(u => u.id === customId || u.name.toLowerCase() === customName.toLowerCase());
      if (!existing) {
        const dynamicPlan = getDegreePlanForProfile({ id: customId, name: customName, location: 'United States', termType: 'semester', calendarEvents: [], degreePlans: [] }, profile);
        const newUni: UniversityInfo = {
          id: customId,
          name: customName,
          location: profile.city ? `${profile.city}, ${profile.state || profile.country || ''}` : 'United States',
          termType: 'semester',
          calendarEvents: getUniversityAcademicCalendar(customId, customName, 'semester'),
          degreePlans: dynamicPlan ? [dynamicPlan] : []
        };
        setUniversities(prev => [...prev, newUni]);
      }
    }
  }, [profile.customUniversityName, profile.universityId, profile.major, profile.degreeType, profile.currentStanding]);

  const currentUniversity = useMemo(() => {
    if (profile.universityId) {
      const found = universities.find(u => u.id === profile.universityId);
      if (found) return found;
    }
    const customName = profile.customUniversityName?.trim();
    if (customName) {
      const matched = universities.find(u => u.name.toLowerCase() === customName.toLowerCase());
      if (matched) return matched;

      const customId = `custom-${customName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const existingCustom = universities.find(u => u.id === customId);
      if (existingCustom) return existingCustom;

      const dynamicPlan = getDegreePlanForProfile({ id: customId, name: customName, location: 'United States', termType: 'semester', calendarEvents: [], degreePlans: [] }, profile);

      return {
        id: customId,
        name: customName,
        location: profile.city ? `${profile.city}, ${profile.state || profile.country || ''}` : 'United States',
        termType: 'semester' as const,
        calendarEvents: getUniversityAcademicCalendar(customId, customName, 'semester'),
        degreePlans: dynamicPlan ? [dynamicPlan] : []
      };
    }
    return universities[0];
  }, [profile.universityId, profile.customUniversityName, profile.major, profile.city, profile.state, profile.country, profile.currentStanding, universities]);

  // Current Active Chat History for selected Coach
  const activeChatHistory = coachChatHistories[activeCoach.id] || [
    {
      id: `init-${activeCoach.id}`,
      sender: 'agent',
      text: activeCoach.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  // -----------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------
  const handleSelectUniversity = (uniId: string) => {
    setProfile(prev => ({ ...prev, universityId: uniId }));
    
    // Auto-pull/generate official academic calendar for selected university
    const uni = universities.find(u => u.id === uniId);
    const calendarEvents = getUniversityAcademicCalendar(uniId, uni?.name || profile.customUniversityName, uni?.termType || 'semester');
    
    if (uni && (!uni.calendarEvents || uni.calendarEvents.length < 3)) {
      setUniversities(prev => prev.map(u => u.id === uniId ? { ...u, calendarEvents } : u));
    }
  };

  const handleUpdateCourseStatus = (
    courseId: string, 
    status: 'completed' | 'in_progress' | 'planned', 
    grade?: string, 
    currentGrade?: string,
    termTaken?: string
  ) => {
    if (!currentUniversity) return;
    setUniversities(prev => {
      const exists = prev.some(u => u.id === currentUniversity.id);
      if (!exists) {
        const activePlan = getDegreePlanForProfile(currentUniversity, profile);
        const baseCourses = activePlan?.courses || [];
        const updatedCourses = baseCourses.map(c => c.id === courseId ? {
          ...c,
          status,
          grade: grade !== undefined ? grade : c.grade,
          currentGrade: currentGrade !== undefined ? currentGrade : c.currentGrade,
          termTaken: termTaken || c.termTaken
        } : c);
        const newUni: UniversityInfo = {
          ...currentUniversity,
          degreePlans: [{
            majorName: profile.major || 'Degree Requirements',
            degreeType: profile.degreeType || 'BS',
            requiredCredits: currentUniversity.termType === 'quarter' ? 180 : 120,
            courses: updatedCourses
          }]
        };
        return [...prev, newUni];
      }

      return prev.map(uni => {
        if (uni.id !== currentUniversity.id) return uni;
        if (!uni.degreePlans || uni.degreePlans.length === 0) {
          const activePlan = getDegreePlanForProfile(uni, profile);
          const baseCourses = activePlan?.courses || [];
          const updatedCourses = baseCourses.map(c => c.id === courseId ? {
            ...c,
            status,
            grade: grade !== undefined ? grade : c.grade,
            currentGrade: currentGrade !== undefined ? currentGrade : c.currentGrade,
            termTaken: termTaken || c.termTaken
          } : c);
          return {
            ...uni,
            degreePlans: [{
              majorName: profile.major || 'Degree Requirements',
              degreeType: profile.degreeType || 'BS',
              requiredCredits: uni.termType === 'quarter' ? 180 : 120,
              courses: updatedCourses
            }]
          };
        }
        return {
          ...uni,
          degreePlans: uni.degreePlans.map(dp => ({
            ...dp,
            courses: dp.courses.map(c => c.id === courseId ? { 
              ...c, 
              status, 
              grade: grade !== undefined ? grade : c.grade, 
              currentGrade: currentGrade !== undefined ? currentGrade : c.currentGrade,
              termTaken: termTaken || c.termTaken 
            } : c)
          }))
        };
      });
    });
  };

  const handleAddCustomCourse = (newCourse: CourseRequirement) => {
    if (!currentUniversity) return;
    setUniversities(prev => {
      const exists = prev.some(u => u.id === currentUniversity.id);
      if (!exists) {
        const activePlan = getDegreePlanForProfile(currentUniversity, profile);
        const existingCourses = activePlan?.courses || [];
        const newUni: UniversityInfo = {
          ...currentUniversity,
          degreePlans: [{
            majorName: profile.major || 'Degree Requirements',
            degreeType: profile.degreeType || 'BS',
            requiredCredits: currentUniversity.termType === 'quarter' ? 180 : 120,
            courses: [...existingCourses, newCourse]
          }]
        };
        return [...prev, newUni];
      }

      return prev.map(uni => {
        if (uni.id !== currentUniversity.id) return uni;
        const hasPlans = uni.degreePlans && uni.degreePlans.length > 0;
        if (!hasPlans) {
          const activePlan = getDegreePlanForProfile(uni, profile);
          const existingCourses = activePlan?.courses || [];
          return {
            ...uni,
            degreePlans: [{
              majorName: profile.major || 'Degree Requirements',
              degreeType: profile.degreeType || 'BS',
              requiredCredits: uni.termType === 'quarter' ? 180 : 120,
              courses: [...existingCourses, newCourse]
            }]
          };
        }
        return {
          ...uni,
          degreePlans: uni.degreePlans.map(dp => ({
            ...dp,
            courses: [...dp.courses, newCourse]
          }))
        };
      });
    });
  };

  const handleAddCalendarEvent = (newEvent: AcademicCalendarEvent) => {
    if (!currentUniversity) return;
    setUniversities(prev => {
      const exists = prev.some(u => u.id === currentUniversity.id);
      if (!exists) {
        const newUni: UniversityInfo = {
          ...currentUniversity,
          calendarEvents: [...(currentUniversity.calendarEvents || []), newEvent]
        };
        return [...prev, newUni];
      }
      return prev.map(uni => {
        if (uni.id !== currentUniversity.id) return uni;
        return {
          ...uni,
          calendarEvents: [...(uni.calendarEvents || []), newEvent]
        };
      });
    });
  };

  const handleAddJob = (newJob: JobOpportunity) => {
    setJobs(prev => [newJob, ...prev]);

    // Also automatically create a milestone for job deadline
    const newMilestone: TimelineMilestone = {
      id: `ms-job-${newJob.id}`,
      title: `${newJob.company} Application Deadline`,
      date: newJob.deadline,
      category: 'application_deadline',
      priority: 'high',
      description: `Target application window for ${newJob.role} at ${newJob.company}.`,
      status: 'upcoming',
      relatedEntityId: newJob.id
    };
    setMilestones(prev => [newMilestone, ...prev]);
  };

  const handleTrackReleaseItem = (item: CompanyReleaseTrackerItem) => {
    const exists = jobs.some(j => j.company.toLowerCase() === item.company.toLowerCase() && j.role.toLowerCase() === item.role.toLowerCase());
    if (exists) return;

    const newJob: JobOpportunity = {
      id: `job-rel-${Date.now()}`,
      company: item.company,
      logoUrl: item.logoUrl,
      role: item.role,
      type: item.term.includes('Intern') ? 'Internship' : item.term.includes('Co-Op') ? 'Co-op' : 'Full-time',
      location: item.location,
      salaryRange: item.salaryEst || '$50 - $75 / hr',
      deadline: item.releaseDate || new Date().toISOString().split('T')[0],
      status: 'saved',
      fitScore: 92,
      priorityScore: 95,
      requirements: item.requirements,
      notes: item.notes || `Tracked from Application Release Radar. Release Status: ${item.releaseStatus}.`,
      url: item.applyUrl
    };

    handleAddJob(newJob);
  };

  const handleAddReleaseItem = (newItem: CompanyReleaseTrackerItem) => {
    setReleaseItems(prev => [newItem, ...prev]);
  };

  const handleUpdateJobStatus = (jobId: string, status: JobOpportunity['status']) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const handleToggleActionStatus = (actionId: string) => {
    setActionPlan(prev => prev.map(a => a.id === actionId ? {
      ...a,
      status: a.status === 'completed' ? 'pending' : 'completed'
    } : a));
  };

  const handleAddMilestones = (newMilestones: TimelineMilestone[]) => {
    setMilestones(prev => [...newMilestones, ...prev]);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    setMilestones(prev => prev.filter(m => m.id !== milestoneId));
  };

  const handleAddActionItem = (newItem: ActionPlanItem) => {
    setActionPlan(prev => [newItem, ...prev]);
  };

  const handleSelectPersona = (persona: CoachPersona) => {
    setActiveCoach(persona);
    setCoachChatHistories(prev => {
      if (!prev[persona.id] || prev[persona.id].length === 0) {
        return {
          ...prev,
          [persona.id]: [
            {
              id: `init-${persona.id}-${Date.now()}`,
              sender: 'agent',
              text: persona.greeting,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return prev;
    });
  };

  const handleAddCustomCoach = (newCoach: CoachPersona) => {
    setPersonas(prev => {
      const updated = [...prev, newCoach];
      const customOnly = updated.filter(p => !COACH_PERSONAS.some(bp => bp.id === p.id));
      localStorage.setItem('pathways_custom_personas', JSON.stringify(customOnly));
      return updated;
    });
    setActiveCoach(newCoach);
    setCoachChatHistories(prev => ({
      ...prev,
      [newCoach.id]: [
        {
          id: `init-${newCoach.id}-${Date.now()}`,
          sender: 'agent',
          text: newCoach.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentHistory = coachChatHistories[activeCoach.id] || [];
    const updatedHistory = [...currentHistory, userMsg];

    setCoachChatHistories(prev => ({
      ...prev,
      [activeCoach.id]: updatedHistory
    }));

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedHistory,
          profile,
          persona: activeCoach,
          activeTab
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I've processed your query. Let's continue sharpening your degree and career plan.";

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setCoachChatHistories(prev => ({
        ...prev,
        [activeCoach.id]: [...(prev[activeCoach.id] || []), agentMsg]
      }));
    } catch (err) {
      console.error('Error calling AI Coach:', err);
      setCoachChatHistories(prev => ({
        ...prev,
        [activeCoach.id]: [
          ...(prev[activeCoach.id] || []),
          {
            id: `err-${Date.now()}`,
            sender: 'agent',
            text: "I experienced a temporary network issue connecting to the Gemini server. Please retry in a moment.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
    }
  };

  const handleExportCalendar = async () => {
    try {
      // Gather both university calendar events and career milestones
      const allEvents = [
        ...currentUniversity.calendarEvents.map(e => ({ id: e.id, title: e.title, date: e.startDate, description: e.description })),
        ...milestones.map(m => ({ id: m.id, title: m.title, date: m.date, description: m.description }))
      ];

      const res = await fetch('/api/calendar/export-ics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: allEvents })
      });

      if (!res.ok) throw new Error('Calendar export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(profile.fullName || 'Student').replace(/\s+/g, '_')}_Pathways_Calendar.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Calendar download failed:', err);
      alert('Could not generate calendar download file. Please check console.');
    }
  };

  const handleOpenCoachWithContext = (company: string, role: string, interviewStage?: string, recommendations?: string[], requirements?: string[]) => {
    setActiveTab('coach');
    const stageStr = interviewStage ? interviewStage.toUpperCase() : 'INTERVIEW';
    const recsList = recommendations && recommendations.length > 0 ? recommendations.map(r => `• ${r}`).join('\n') : '';
    const reqsList = requirements && requirements.length > 0 ? requirements.join(', ') : 'Software Engineering & System Fundamentals';

    const promptText = `I am preparing for a ${role} position at ${company} (Current Stage: ${stageStr}).
Target Role Requirements: ${reqsList}.
Recommendations provided:
${recsList}

Can you act as my senior technical interviewer and career coach for ${company}? Please provide:
1. Specific technical interview questions tailored to ${company}'s hiring bar.
2. A step-by-step strategy to ace my upcoming interview round.
3. Key projects or STAR stories from my profile I should highlight.`;

    handleSendMessage(promptText);
  };

  const handleResetAllData = () => {
    try {
      localStorage.removeItem('pathways_profile');
      localStorage.removeItem('pathways_universities');
      localStorage.removeItem('pathways_jobs');
      localStorage.removeItem('pathways_release_items');
      localStorage.removeItem('pathways_milestones');
      localStorage.removeItem('pathways_actionplan');
      localStorage.removeItem('pathways_custom_personas');
      localStorage.removeItem('pathways_coach_chats');
      localStorage.removeItem('futurepath_profile');
      localStorage.removeItem('futurepath_universities');
      localStorage.removeItem('futurepath_jobs');
      localStorage.removeItem('futurepath_release_items');
      localStorage.removeItem('futurepath_milestones');
      localStorage.removeItem('futurepath_actionplan');
      localStorage.removeItem('futurepath_custom_personas');
      localStorage.removeItem('futurepath_coach_chats');
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear local storage', e);
    }

    const freshProfile: StudentProfile = {
      id: `student-fresh-${Date.now()}`,
      fullName: '',
      firstName: '',
      lastName: '',
      email: '',
      universityId: '',
      customUniversityName: '',
      major: '',
      degreeType: '',
      additionalDegrees: [],
      expectedGraduationDate: '',
      graduationYear: undefined,
      graduationMonth: '',
      currentStanding: '',
      gpa: '',
      calculatedGpa: '',
      relevantCoursework: [],
      city: '',
      state: '',
      country: '',
      targetCompanies: [],
      targetJobTitles: [],
      targetIndustries: [],
      targetIndustriesRanked: [],
      targetFunctions: [],
      targetFunctionsRanked: [],
      preferredLocations: [],
      preferredWorkModes: [],
      targetTerms: [],
      compensationGoalType: 'salary',
      salaryGoals: '',
      hourlyMinRate: '',
      hourlyMaxRate: '',
      workAuthorization: '',
      resumeText: '',
      resumeFilename: undefined,
      skills: [],
      languages: [],
      projects: [],
      certifications: [],
      experiences: [],
      extracurriculars: []
    };

    setProfile(freshProfile);
    setUniversities(getResetUniversities());
    setJobs([]);
    setReleaseItems(INITIAL_RELEASE_TRACKER_ITEMS);
    setMilestones([]);
    setActionPlan([]);
    setPersonas(COACH_PERSONAS);
    setActiveCoach(COACH_PERSONAS[0]);

    const resetChats: Record<string, ChatMessage[]> = {};
    COACH_PERSONAS.forEach(p => {
      resetChats[p.id] = [
        {
          id: `init-${p.id}-${Date.now()}`,
          sender: 'agent',
          text: p.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
    setCoachChatHistories(resetChats);

    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-indigo-600 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Immersive UI Ambient Background Glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[500px] bg-indigo-900 opacity-[0.035] blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[400px] bg-purple-900 opacity-[0.025] blur-[120px] pointer-events-none z-0"></div>
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        currentUniversity={currentUniversity}
        onExportCalendar={handleExportCalendar}
        onResetAllData={handleResetAllData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 relative">
        {activeTab === 'dashboard' && (
          <DashboardTab
            profile={profile}
            university={currentUniversity}
            jobs={jobs}
            milestones={milestones}
            actionPlan={actionPlan}
            activeCoach={activeCoach}
            onNavigate={setActiveTab}
            onToggleActionStatus={handleToggleActionStatus}
            onAddMilestones={handleAddMilestones}
            onDeleteMilestone={handleDeleteMilestone}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicTab
            university={currentUniversity}
            universities={universities}
            profile={profile}
            onUpdateCourseStatus={handleUpdateCourseStatus}
            onAddCustomCourse={handleAddCustomCourse}
            onAddCalendarEvent={handleAddCalendarEvent}
            onSelectUniversity={handleSelectUniversity}
            onUpdateProfile={setProfile}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'career' && (
          <CareerTimelineTab
            jobs={jobs}
            releaseItems={releaseItems}
            milestones={milestones}
            profile={profile}
            onAddJob={handleAddJob}
            onTrackReleaseItem={handleTrackReleaseItem}
            onAddReleaseItem={handleAddReleaseItem}
            onUpdateJobStatus={handleUpdateJobStatus}
            onDeleteJob={handleDeleteJob}
            onExportCalendar={handleExportCalendar}
            onOpenCoachWithContext={handleOpenCoachWithContext}
          />
        )}

        {activeTab === 'coach' && (
          <AICoachTab
            profile={profile}
            personas={personas}
            activePersona={activeCoach}
            onSelectPersona={handleSelectPersona}
            onAddCustomCoach={handleAddCustomCoach}
            chatHistory={activeChatHistory}
            onSendMessage={handleSendMessage}
            actionPlan={actionPlan}
            onAddActionItem={handleAddActionItem}
            milestones={milestones}
            jobs={jobs}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            profile={profile}
            universities={universities}
            onSaveProfile={setProfile}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-[#0c0c0e]/90 py-4 text-center text-xs text-zinc-500 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Pathways AlignAI — Student Future Planning & Career Command Center</span>
          <span className="text-zinc-600 font-mono text-[11px]">Powered by Gemini 3.6 Server-Side API</span>
        </div>
      </footer>

    </div>
  );
}
