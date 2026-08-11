import React from 'react';
import appIcon from '../assets/images/app_icon_1786243005541.jpg';
import { 
  GraduationCap, 
  Calendar, 
  Briefcase, 
  Bot, 
  UserCheck, 
  Download, 
  Compass, 
  Sparkles,
  Building2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { StudentProfile, UniversityInfo } from '../types';

interface HeaderProps {
  activeTab: 'dashboard' | 'academic' | 'career' | 'coach' | 'profile';
  setActiveTab: (tab: 'dashboard' | 'academic' | 'career' | 'coach' | 'profile') => void;
  profile: StudentProfile;
  currentUniversity?: UniversityInfo;
  onExportCalendar: () => void;
  onResetAllData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  currentUniversity,
  onExportCalendar,
  onResetAllData
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-zinc-800 text-zinc-300 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img 
              src={appIcon} 
              alt="Pathways Icon" 
              className="h-9 w-9 rounded-lg object-cover aspect-square shrink-0" 
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg tracking-tight text-white">
                  Pathways
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                  AlignAI
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                Student Future Planning & Agentic Career Command Center
              </p>
            </div>
          </div>

          {/* Student Status & University Badge */}
          <div className="hidden lg:flex items-center space-x-3 text-xs bg-zinc-900/90 px-3.5 py-1.5 rounded-lg border border-zinc-800">
            <div className="flex items-center space-x-1.5 text-zinc-300">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span className={`font-medium ${!profile.customUniversityName && !profile.universityId ? 'text-amber-400 font-semibold' : ''}`}>
                {profile.customUniversityName || (profile.universityId ? currentUniversity?.name : '') || 'Select University'}
              </span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center space-x-1 text-zinc-300">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
              <span className={`${!profile.major ? 'text-amber-400 font-semibold' : ''}`}>
                {profile.major || 'Select Major'}
              </span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center space-x-1 text-zinc-400 font-mono text-[11px]">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span className={`${!profile.expectedGraduationDate ? 'text-amber-400 font-semibold' : ''}`}>
                Grad: {profile.expectedGraduationDate || 'Not Set'}
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onResetAllData && (
              <button
                onClick={onResetAllData}
                title="Clear all stored profile & application data to test onboarding"
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 hover:border-rose-700 rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5 text-rose-400" />
                <span className="hidden md:inline">Reset Profile</span>
              </button>
            )}

            <button
              onClick={onExportCalendar}
              title="Download iCal (.ics) Calendar file"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export Calendar (.ics)</span>
            </button>

            <button
              onClick={() => setActiveTab('coach')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-100" />
              <span>AI Coach</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-zinc-800/80">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Command Center</span>
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'academic'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Academic Degree Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'career'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Career Timeline & Applications</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'coach'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Bot className="h-4 w-4 text-indigo-400" />
            <span>Agentic AI Coach</span>
            <span className="ml-1 px-1.5 py-0.2 text-[9px] bg-indigo-500/20 text-indigo-300 rounded font-bold uppercase">Active</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Profile & Resume</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
