import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  GraduationCap, 
  School, 
  AlertCircle, 
  Award,
  ChevronRight,
  Sparkles,
  Tag,
  Upload,
  FileText,
  File,
  Building,
  Check,
  FileSpreadsheet,
  X,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Download,
  Layers
} from 'lucide-react';
import { UniversityInfo, CourseRequirement, AcademicCalendarEvent, StudentProfile } from '../types';
import { calculateAcademicStanding } from '../utils/academicStanding';
import { getDegreePlanForProfile } from '../utils/degreePlanSelector';
import { getUniversityAcademicCalendar } from '../data/mockData';
import { parseDegreePlanFile } from '../lib/parseDegreePlanFile';

interface AcademicTabProps {
  university?: UniversityInfo;
  universities: UniversityInfo[];
  profile: StudentProfile;
  onUpdateCourseStatus: (courseId: string, status: 'completed' | 'in_progress' | 'planned', grade?: string, currentGrade?: string, termTaken?: string) => void;
  onAddCustomCourse: (course: CourseRequirement) => void;
  onAddCalendarEvent: (event: AcademicCalendarEvent) => void;
  onSelectUniversity: (uniId: string) => void;
  onUpdateProfile?: (updatedProfile: StudentProfile) => void;
  onNavigateToProfile?: () => void;
  onReorderCourses?: (courses: CourseRequirement[]) => void;
}

export const AcademicTab: React.FC<AcademicTabProps> = ({
  university,
  universities,
  profile,
  onUpdateCourseStatus,
  onAddCustomCourse,
  onAddCalendarEvent,
  onSelectUniversity,
  onUpdateProfile,
  onNavigateToProfile,
  onReorderCourses
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'core' | 'major_elective' | 'gen_ed' | 'prereq'>('all');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);

  // New Course Form State
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newProfessor, setNewProfessor] = useState('');
  const [newTerm, setNewTerm] = useState('Fall 2026');
  const [newCredits, setNewCredits] = useState(3);
  const [newCategory, setNewCategory] = useState<'core' | 'major_elective' | 'gen_ed' | 'prereq'>('major_elective');
  const [newStatus, setNewStatus] = useState<'completed' | 'in_progress' | 'planned'>('planned');

  // Syllabus Parsing State
  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState<CourseRequirement | null>(null);
  const [syllabusText, setSyllabusText] = useState('');
  const [syllabusMode, setSyllabusMode] = useState<'upload' | 'text'>('upload');
  const [uploadedSyllabusFile, setUploadedSyllabusFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isParsingSyllabus, setIsParsingSyllabus] = useState(false);

  // Degree Plan Document Upload State
  const [isParsingDegreeDoc, setIsParsingDegreeDoc] = useState(false);
  const [degreeDocSuccessMsg, setDegreeDocSuccessMsg] = useState<string | null>(null);
  const [degreeDocTextPasted, setDegreeDocTextPasted] = useState('');

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'academic' | 'exam' | 'holiday' | 'deadline' | 'registration'>('deadline');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  // Dynamically load degree plan matching user's university & profile major selection
  const degreePlan = getDegreePlanForProfile(university, profile);
  const initialCourses = degreePlan?.courses || [];

  const [courseList, setCourseList] = React.useState<CourseRequirement[]>(initialCourses);
  const [groupByTerm, setGroupByTerm] = React.useState(false);

  React.useEffect(() => {
    setCourseList(initialCourses);
  }, [initialCourses.length, profile.major, university?.id]);

  const moveCourse = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= courseList.length) return;
    const updated = [...courseList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCourseList(updated);
    if (onReorderCourses) {
      onReorderCourses(updated);
    }
  };

  const filteredCourses = courseList.filter(c => filterCategory === 'all' || c.category === filterCategory);

  const totalRequiredCredits = degreePlan?.requiredCredits || (university?.termType === 'quarter' ? 180 : 120);
  const completedCredits = courseList.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.credits, 0);
  const inProgressCredits = courseList.filter(c => c.status === 'in_progress').reduce((sum, c) => sum + c.credits, 0);
  const plannedCredits = courseList.filter(c => c.status === 'planned').reduce((sum, c) => sum + c.credits, 0);

  const completedPercent = Math.min(100, Math.round((completedCredits / totalRequiredCredits) * 100));

  const standingAnalysis = calculateAcademicStanding(
    completedCredits,
    inProgressCredits,
    profile.currentStanding,
    totalRequiredCredits,
    profile.degreeType?.includes('Master') || profile.degreeType?.includes('Doctorate') || profile.currentStanding === 'Graduate'
  );

  // Dynamic Academic Calendar Events (Always populated even for custom institutions, sorted chronologically)
  const activeUniName = profile.customUniversityName || university?.name || 'Selected Institution';
  const activeUniTermType = university?.termType || 'semester';
  const activeCalendarEventsRaw = (university?.calendarEvents && university.calendarEvents.length >= 3) 
    ? university.calendarEvents 
    : getUniversityAcademicCalendar(profile.universityId || 'custom', activeUniName, activeUniTermType);

  const activeCalendarEvents = [...activeCalendarEventsRaw].sort((a, b) => {
    const timeA = new Date(a.startDate).getTime() || 0;
    const timeB = new Date(b.startDate).getTime() || 0;
    return timeA - timeB;
  });

  const downloadIcsCalendar = () => {
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Academic Degree Calendar//EN',
      'CALSCALE:GREGORIAN'
    ];

    activeCalendarEvents.forEach(evt => {
      const formattedDate = (evt.startDate || '').replace(/-/g, '');
      icsLines.push(
        'BEGIN:VEVENT',
        `SUMMARY:${evt.title}`,
        `DESCRIPTION:${evt.description || ''} - ${activeUniName}`,
        `DTSTART;VALUE=DATE:${formattedDate}`,
        `DTEND;VALUE=DATE:${formattedDate}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    icsLines.push('END:VCALENDAR');
    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeUniName.replace(/[^a-zA-Z0-9]/g, '_')}_Academic_Calendar.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle) return;

    onAddCustomCourse({
      id: `custom-course-${Date.now()}`,
      code: newCode,
      title: newTitle,
      professor: newProfessor || undefined,
      termTaken: newTerm || (newStatus === 'completed' ? 'Past Term' : newStatus === 'in_progress' ? 'Current Term' : 'Future Term'),
      credits: Number(newCredits) || 3,
      category: newCategory,
      status: newStatus
    });

    setNewCode('');
    setNewTitle('');
    setNewProfessor('');
    setShowAddCourseModal(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventStartDate) return;

    onAddCalendarEvent({
      id: `evt-${Date.now()}`,
      title: eventTitle,
      category: eventCategory,
      startDate: eventStartDate,
      endDate: eventStartDate,
      description: eventDesc || 'Custom academic milestone'
    });

    setEventTitle('');
    setEventStartDate('');
    setEventDesc('');
    setShowAddEventModal(false);
  };

  const handleParseDegreeDoc = async (file: File) => {
    setIsParsingDegreeDoc(true);
    setDegreeDocSuccessMsg(null);

    try {
      const res = await parseDegreePlanFile(file);
      if (res.success && res.coursesExtracted.length > 0) {
        res.coursesExtracted.forEach(course => {
          onAddCustomCourse(course);
        });
        setDegreeDocSuccessMsg(res.message);
      } else {
        setDegreeDocSuccessMsg(res.error || 'No courses could be parsed.');
      }
    } catch (err: any) {
      setDegreeDocSuccessMsg(err.message || 'Error processing degree plan file.');
    } finally {
      setIsParsingDegreeDoc(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Read-Only Matched Campus Display */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
            <School className="h-4 w-4" />
            <span>Academic Intelligence Layer</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-light text-white">
            Degree Requirements & Academic Calendar
          </h1>
          <p className="text-xs text-zinc-400">
            Track degree completion requirements, prerequisites, and key dates for {activeUniName} {profile.major ? `(${profile.major})` : ''}
          </p>
        </div>

        {/* Read-Only Institution Indicator Driven by Profile */}
        <div className="flex items-center space-x-3 bg-[#0c0c0e] px-3.5 py-2.5 rounded-xl border border-zinc-800 shrink-0">
          <Building className="h-4 w-4 text-indigo-400 shrink-0" />
          <div className="text-xs">
            <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-bold">Selected Institution & Program</span>
            <span className="text-white font-medium">
              {activeUniName} {profile.major ? `• ${profile.major}` : ''}
            </span>
          </div>
          {onNavigateToProfile && (
            <button
              type="button"
              onClick={onNavigateToProfile}
              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg border border-zinc-700 transition-all cursor-pointer ml-2"
              title="Change institution or major on Profile & Resume"
            >
              Edit on Profile
            </button>
          )}
        </div>
      </div>

      {/* Empty State Banner when no university or custom university selected */}
      {!university && !profile.customUniversityName && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-amber-300 text-sm">Select Your University on Profile & Resume</h3>
              <p className="leading-relaxed text-zinc-300">
                No university is currently selected. Please select your institution on the <strong>Profile & Resume</strong> tab to automatically load your official campus degree requirements and academic calendar.
              </p>
            </div>
          </div>
          {onNavigateToProfile && (
            <button
              type="button"
              onClick={onNavigateToProfile}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs whitespace-nowrap transition-all shadow-md cursor-pointer shrink-0"
            >
              Go to Profile & Resume →
            </button>
          )}
        </div>
      )}

      {/* Empty State Banner when university is selected but no major is set */}
      {(university || profile.customUniversityName) && (!profile.major || profile.major.trim() === '') && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-indigo-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-indigo-300 text-sm">Select Your Major on Profile & Resume</h3>
              <p className="leading-relaxed text-zinc-300">
                You have selected <strong>{activeUniName}</strong>, but no major is set yet. Select your degree program on <strong>Profile & Resume</strong> to auto-load official program requirements.
              </p>
            </div>
          </div>
          {onNavigateToProfile && (
            <button
              type="button"
              onClick={onNavigateToProfile}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs whitespace-nowrap transition-all shadow-md cursor-pointer shrink-0"
            >
              Set Major on Profile →
            </button>
          )}
        </div>
      )}

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Degree Target</span>
          <div className="text-lg font-bold text-white font-mono">{totalRequiredCredits} Credits</div>
          <p className="text-[10px] text-zinc-400">{profile.degreeType || 'BS'} • {activeUniTermType.toUpperCase()}</p>
        </div>

        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono">Completed</span>
          <div className="text-lg font-bold text-emerald-300 font-mono">{completedCredits} Credits</div>
          <p className="text-[10px] text-zinc-400">{completedPercent}% of degree complete</p>
        </div>

        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider font-mono">In Progress</span>
          <div className="text-lg font-bold text-amber-300 font-mono">{inProgressCredits} Credits</div>
          <p className="text-[10px] text-zinc-400">Current active term</p>
        </div>

        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
          <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-mono">Planned</span>
          <div className="text-lg font-bold text-indigo-300 font-mono">{plannedCredits} Credits</div>
          <p className="text-[10px] text-zinc-400">Remaining to enroll</p>
        </div>
      </div>

      {/* Progress & Standing Mismatch Alignment Banner */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 space-y-3 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-300">Degree Progress Bar</span>
          <span className="font-mono text-indigo-400 font-bold">{completedPercent}% Complete</span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden flex">
          <div style={{ width: `${(completedCredits / totalRequiredCredits) * 100}%` }} className="bg-emerald-500 h-full transition-all" title="Completed Credits" />
          <div style={{ width: `${(inProgressCredits / totalRequiredCredits) * 100}%` }} className="bg-amber-500 h-full transition-all" title="In Progress Credits" />
        </div>

        {standingAnalysis.hasMismatch ? (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Calculated standing based on completed ({completedCredits}) + active ({inProgressCredits}) credits is <strong className="text-white">{standingAnalysis.calculatedStanding}</strong>, but profile lists <strong className="text-white">{profile.currentStanding}</strong>.
              </span>
            </div>
            {onNavigateToProfile && (
              <button
                type="button"
                onClick={onNavigateToProfile}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                Update Profile Standing →
              </button>
            )}
          </div>
        ) : (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Standing Aligned: <strong className="text-white">{profile.currentStanding}</strong> ({standingAnalysis.totalActiveCredits} completed + active hrs)</span>
            </div>
            {onNavigateToProfile && (
              <button
                type="button"
                onClick={onNavigateToProfile}
                className="text-[11px] bg-emerald-950 hover:bg-emerald-900 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/30 font-sans cursor-pointer transition-colors"
              >
                Profile →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Split Layout: Course Requirements Table + Academic Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Degree Requirements Interactive List */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span>Degree Requirement Courses</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {profile.major ? `${profile.major} Major Requirements` : 'Program Course Catalog'}
              </p>
            </div>

            {/* Action Buttons: Manual Add + Upload Degree Document */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowDocUploadModal(true)}
                className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all"
                title="Upload Degree Audit PDF or Transcript to extract courses"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Degree Plan PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddCourseModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-all shadow-md"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills & Grouping Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-zinc-800/60">
            <div className="flex items-center space-x-1 overflow-x-auto text-xs">
              {(['all', 'core', 'major_elective', 'gen_ed', 'prereq'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap transition-all cursor-pointer text-xs ${
                    filterCategory === cat
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setGroupByTerm(!groupByTerm)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 border cursor-pointer transition-colors ${
                groupByTerm
                  ? 'bg-purple-600/20 border-purple-500/40 text-purple-300 font-bold'
                  : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{groupByTerm ? 'Grouped by Term' : 'Group by Term'}</span>
            </button>
          </div>

          {/* Courses List */}
          <div className="space-y-2.5">
            {filteredCourses.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl space-y-3">
                <p>No courses found for category: <strong>{filterCategory}</strong>.</p>
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-xs cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Manually Add a Course Requirement</span>
                </button>
              </div>
            ) : (
              filteredCourses.map((course, idx) => {
                const isCompleted = course.status === 'completed';
                const isInProgress = course.status === 'in_progress';

                const examEvent = activeCalendarEvents.find(e => e.category === 'exam' || e.title.toLowerCase().includes('final'));
                const endDate = examEvent ? new Date(examEvent.startDate) : new Date('2026-12-18');
                const weeksRemaining = Math.max(1, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)));

                const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
                const TERM_OPTIONS = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027', 'Fall 2027', 'Spring 2028', 'Future Term'];

                return (
                  <div
                    key={course.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${
                      isCompleted 
                        ? 'bg-[#0c0c0e] border-zinc-800 text-zinc-400' 
                        : isInProgress 
                        ? 'bg-amber-950/10 border-amber-500/20 text-white' 
                        : 'bg-[#0c0c0e] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-2">
                        {/* Course Re-ordering Controls */}
                        <div className="flex flex-col space-y-0.5 pt-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveCourse(idx, 'up')}
                            className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            title="Move Course Up in Degree Plan"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === filteredCourses.length - 1}
                            onClick={() => moveCourse(idx, 'down')}
                            className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            title="Move Course Down in Degree Plan"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>

                        <div className={`p-2 rounded-lg shrink-0 ${
                          isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          isInProgress ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-indigo-300 font-mono">{course.code}</span>
                            <span className="text-xs text-zinc-500">• {course.credits} Credits</span>
                            <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 font-mono">
                              {course.category.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-white flex items-center justify-between gap-2">
                            <span>{course.title}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedSyllabusCourse(course)}
                              className="px-2 py-0.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-mono cursor-pointer shrink-0"
                            >
                              📄 Syllabus
                            </button>
                          </h4>
                          <div className="text-[11px] text-zinc-500 font-mono flex flex-wrap items-center gap-2">
                            {course.professor && <span>Prof. <strong className="text-zinc-300">{course.professor}</strong></span>}
                            <span>Term:</span>
                            <select
                              value={course.termTaken || 'Fall 2026'}
                              onChange={(e) => onUpdateCourseStatus(course.id, course.status, course.grade, course.currentGrade, e.target.value)}
                              className="bg-[#0c0c0e] text-zinc-300 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-indigo-500 cursor-pointer"
                            >
                              {TERM_OPTIONS.map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Status Toggle Buttons & Grade Input */}
                      <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center w-full sm:w-auto overflow-x-auto pb-0.5 sm:pb-0">
                        {isCompleted && (
                          <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg shrink-0">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Grade:</span>
                            <select
                              value={course.grade || 'A'}
                              onChange={(e) => onUpdateCourseStatus(course.id, 'completed', e.target.value, course.currentGrade, course.termTaken)}
                              className="bg-zinc-900 text-emerald-300 font-mono font-bold text-xs rounded px-1.5 py-0.5 border border-emerald-500/30 focus:outline-none"
                            >
                              {GRADE_OPTIONS.map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {isInProgress && (
                          <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg shrink-0">
                            <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Current:</span>
                            <select
                              value={course.currentGrade || 'A'}
                              onChange={(e) => onUpdateCourseStatus(course.id, 'in_progress', course.grade, e.target.value, course.termTaken)}
                              className="bg-zinc-900 text-amber-300 font-mono font-bold text-xs rounded px-1.5 py-0.5 border border-amber-500/30 focus:outline-none"
                            >
                              {GRADE_OPTIONS.map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="inline-flex items-center p-0.5 bg-zinc-950/80 border border-zinc-800/80 rounded-lg shrink-0">
                          <button
                            onClick={() => onUpdateCourseStatus(course.id, 'completed', course.grade || 'A', course.currentGrade, course.termTaken)}
                            className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium cursor-pointer transition-colors ${
                              course.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                                : 'text-zinc-500 hover:text-white'
                            }`}
                          >
                            Completed
                          </button>

                          <button
                            onClick={() => onUpdateCourseStatus(course.id, 'in_progress', course.grade, course.currentGrade || 'A', course.termTaken)}
                            className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium cursor-pointer transition-colors ${
                              course.status === 'in_progress'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                                : 'text-zinc-500 hover:text-white'
                            }`}
                          >
                            In Progress
                          </button>

                          <button
                            onClick={() => onUpdateCourseStatus(course.id, 'planned', course.grade, course.currentGrade, course.termTaken)}
                            className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium cursor-pointer transition-colors ${
                              course.status === 'planned'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                                : 'text-zinc-500 hover:text-white'
                            }`}
                          >
                            Planned
                          </button>
                        </div>
                      </div>
                    </div>

                    {isInProgress && (
                      <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-amber-300/90 bg-amber-500/5 p-2.5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>Term Schedule: <strong className="text-white">{weeksRemaining} weeks remaining</strong> in current semester</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>Pacing: ~3 homeworks, 1 midterm & 1 final exam remaining</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Guided Elective Groups Section */}
          {degreePlan?.guidedElectiveGroups && degreePlan.guidedElectiveGroups.length > 0 && (
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300 flex items-center space-x-2">
                  <Tag className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Guided Elective Tracks & Concentrations</span>
                </h4>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {degreePlan.guidedElectiveGroups.length} Elective Categories
                </span>
              </div>

              <div className="space-y-3">
                {degreePlan.guidedElectiveGroups.map((group, idx) => (
                  <div key={idx} className="p-3.5 bg-[#0c0c0e] border border-zinc-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-white">{group.groupName}</div>
                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                        Required: {group.requiredCount} Options
                      </span>
                    </div>
                    {group.description && <p className="text-[11px] text-zinc-400">{group.description}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {group.options.map((optCourse, optIdx) => {
                        const isAlreadyInPlan = courses.some(c => c.code === optCourse.code);
                        return (
                          <div key={optIdx} className="p-2 bg-zinc-900/80 border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-indigo-300 font-mono text-[11px]">{optCourse.code}</div>
                              <div className="text-[11px] text-zinc-300 font-medium truncate max-w-[140px]">{optCourse.title}</div>
                              <div className="text-[10px] text-zinc-500">{optCourse.credits} Credits</div>
                            </div>

                            <button
                              type="button"
                              disabled={isAlreadyInPlan}
                              onClick={() => {
                                onAddCustomCourse({
                                  id: `elective-${Date.now()}-${optIdx}`,
                                  code: optCourse.code,
                                  title: optCourse.title,
                                  credits: optCourse.credits,
                                  category: 'major_elective',
                                  status: 'planned',
                                  termTaken: 'Future Term'
                                });
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
                                isAlreadyInPlan
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              }`}
                            >
                              {isAlreadyInPlan ? '✓ In Plan' : '+ Select'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: University Specific Academic Calendar */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span>Academic Calendar</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">{activeUniName}</p>
            </div>

            <button
              onClick={() => setShowAddEventModal(true)}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 text-xs cursor-pointer flex items-center space-x-1"
              title="Add Custom Calendar Event"
            >
              <Plus className="h-4 w-4" />
              <span className="text-[10px]">Add</span>
            </button>
          </div>

          {/* Calendar Export Toolbar */}
          <div className="p-3 bg-[#0c0c0e] border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span className="font-bold text-amber-300">Export Calendar:</span>
              <span>{activeCalendarEvents.length} Events</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={downloadIcsCalendar}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-pointer border border-zinc-700 transition-colors"
                title="Download .ICS calendar file for Apple Calendar, Google, or Outlook"
              >
                <Download className="h-3 w-3 text-amber-400" />
                <span>.ICS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const firstEvt = activeCalendarEvents[0];
                  if (firstEvt) {
                    const dt = (firstEvt.startDate || '').replace(/-/g, '');
                    const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(firstEvt.title)}&dates=${dt}/${dt}&details=${encodeURIComponent(firstEvt.description + ' - ' + activeUniName)}`;
                    window.open(gUrl, '_blank');
                  } else {
                    window.open('https://calendar.google.com', '_blank');
                  }
                }}
                className="py-1.5 px-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-pointer border border-indigo-500/30 transition-colors"
                title="Add event to Google Calendar"
              >
                <ExternalLink className="h-3 w-3 text-indigo-400" />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const firstEvt = activeCalendarEvents[0];
                  if (firstEvt) {
                    const outUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(firstEvt.title)}&startdt=${firstEvt.startDate}T09:00:00Z&enddt=${firstEvt.startDate}T10:00:00Z&body=${encodeURIComponent(firstEvt.description + ' - ' + activeUniName)}`;
                    window.open(outUrl, '_blank');
                  } else {
                    window.open('https://outlook.live.com/calendar', '_blank');
                  }
                }}
                className="py-1.5 px-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-pointer border border-purple-500/30 transition-colors"
                title="Add event to Outlook Web"
              >
                <ExternalLink className="h-3 w-3 text-purple-400" />
                <span>Outlook</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeCalendarEvents.map(event => (
              <div 
                key={event.id}
                className="p-3.5 rounded-xl bg-[#0c0c0e] border border-zinc-800 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    event.category === 'exam' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    event.category === 'deadline' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    event.category === 'registration' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {event.category}
                  </span>
                  <span className="text-xs font-mono text-amber-300">
                    {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h4 className="text-xs font-medium text-white">{event.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal: Upload Degree Plan Document */}
      {showDocUploadModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileSpreadsheet className="h-4.5 w-4.5 text-indigo-400" />
                  <span>Upload Degree Plan / Audit Document</span>
                </h3>
                <p className="text-xs text-zinc-400">Extract course requirements automatically from PDF, Word, or transcript</p>
              </div>
              <button onClick={() => setShowDocUploadModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="relative border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl p-6 text-center bg-[#0c0c0e] transition-all group">
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleParseDegreeDoc(file);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="h-8 w-8 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-white text-xs">Drop Degree Audit PDF or Transcript here</div>
                <div className="text-[10px] text-zinc-400 mt-1">Supports .pdf, .docx, .txt files from student portal</div>
              </div>

              {isParsingDegreeDoc && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center space-x-3 text-indigo-300">
                  <Sparkles className="h-4 w-4 animate-spin text-indigo-400 shrink-0" />
                  <span>Parsing document and extracting course codes...</span>
                </div>
              )}

              {degreeDocSuccessMsg && (
                <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                  degreeDocSuccessMsg.includes('Successfully') 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{degreeDocSuccessMsg}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDocUploadModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Custom Course Requirement</h3>
              <button onClick={() => setShowAddCourseModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Course Code (e.g. CS 189)</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. CS 189 / ECON 101"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Machine Learning"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Professor (Optional)</label>
                  <input
                    type="text"
                    value={newProfessor}
                    onChange={(e) => setNewProfessor(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Dr. Sarah Jenkins"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Term</label>
                  <input
                    type="text"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Fall 2026 / Spring 2027"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="core">Core Requirement</option>
                    <option value="major_elective">Major Elective</option>
                    <option value="gen_ed">General Ed</option>
                    <option value="prereq">Prerequisite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add School Calendar Event */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Academic Calendar Event</h3>
              <button onClick={() => setShowAddEventModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Midterm Week / Degree Filing Deadline"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="exam">Exam</option>
                    <option value="deadline">Drop/Registration Deadline</option>
                    <option value="academic">Academic Term</option>
                    <option value="registration">Career / Hiring Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Description / Notes</label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 h-20"
                  placeholder="e.g. Final day to file graduation intention on CalCentral."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Syllabus Parser & Assignment Schedule */}
      {selectedSyllabusCourse && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  <span>Syllabus Upload & Schedule ({selectedSyllabusCourse.code})</span>
                </h3>
                <p className="text-xs text-zinc-400">{selectedSyllabusCourse.title}</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedSyllabusCourse(null);
                  setUploadedSyllabusFile(null);
                  setSyllabusText('');
                }} 
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Mode Selector */}
              <div className="flex rounded-xl bg-zinc-800 p-1 border border-zinc-700/80">
                <button
                  type="button"
                  onClick={() => setSyllabusMode('upload')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                    syllabusMode === 'upload'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>PDF / Document Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSyllabusMode('text')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                    syllabusMode === 'text'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Paste Raw Text</span>
                </button>
              </div>

              {syllabusMode === 'upload' ? (
                <div className="space-y-2">
                  <label className="block font-medium text-zinc-300">Upload PDF or Text Syllabus File</label>
                  
                  {uploadedSyllabusFile ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <File className="h-5 w-5 text-emerald-400" />
                        <div>
                          <div className="font-semibold text-emerald-300 text-xs">{uploadedSyllabusFile.name}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">{uploadedSyllabusFile.size} • {uploadedSyllabusFile.type}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedSyllabusFile(null);
                          setSyllabusText('');
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer px-2 py-1 bg-rose-500/10 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl p-5 text-center bg-[#0c0c0e] transition-all group">
                      <input
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const sizeKb = (file.size / 1024).toFixed(1) + ' KB';
                            const fileType = file.name.endsWith('.pdf') ? 'PDF Document' : 'Text / Word File';
                            setUploadedSyllabusFile({ name: file.name, size: sizeKb, type: fileType });

                            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  setSyllabusText(evt.target.result as string);
                                }
                              };
                              reader.readAsText(file);
                            } else {
                              setSyllabusText(`[Extracted syllabus content from ${file.name}]`);
                            }
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="h-7 w-7 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-semibold text-white text-xs">Drop PDF or Text file here, or click to browse</div>
                      <div className="text-[10px] text-zinc-400 mt-1">Supports .pdf, .txt, .docx, .doc files up to 25MB</div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Paste Course Syllabus Content</label>
                  <textarea
                    value={syllabusText}
                    onChange={(e) => setSyllabusText(e.target.value)}
                    placeholder="Paste course syllabus guidelines, exam dates, grading scale, or weekly homework breakdown here..."
                    className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 h-28 font-mono text-xs"
                  />
                </div>
              )}

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-200 text-[11px] space-y-1.5">
                <div className="font-bold flex items-center space-x-1">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>
                    {uploadedSyllabusFile ? `Extracted Deadlines from ${uploadedSyllabusFile.name}:` : 'Extracted Course Deadlines & Remaining Assignments:'}
                  </span>
                </div>
                <div className="space-y-1 font-mono text-zinc-300">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-0" />
                    <span>Midterm Exam — Week 7 (Oct 18)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-0" />
                    <span>Case Study / Problem Set 4 — Week 10 (Nov 08)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-0" />
                    <span>Final Project Presentation & Exam — Week 15 (Dec 12)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSyllabusCourse(null);
                    setUploadedSyllabusFile(null);
                    setSyllabusText('');
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsParsingSyllabus(true);
                    setTimeout(() => {
                      setIsParsingSyllabus(false);
                      setSelectedSyllabusCourse(null);
                      setUploadedSyllabusFile(null);
                      setSyllabusText('');
                    }, 500);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl cursor-pointer"
                >
                  {isParsingSyllabus ? 'Parsing File...' : 'Save Syllabus Schedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
