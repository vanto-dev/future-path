import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Check, X, Plus, GraduationCap, Building, Sparkles, ChevronDown } from 'lucide-react';
import { UniversityInfo } from '../types';
import { MAJORS_BY_STANDING } from '../data/careerDatabase';
import { stripDegreePrefix } from '../utils/degreeFormatter';

interface SearchableMajorTypeaheadProps {
  value: string;
  onChange: (selectedMajor: string) => void;
  university?: UniversityInfo | null;
  standing?: string;
  degreeType?: string;
  placeholder?: string;
  label?: string;
  id?: string;
  isAdditional?: boolean;
  additionalType?: 'Second Major' | 'Minor' | 'Concentration' | 'Certificate';
  onAddAdditional?: (type: string, name: string) => void;
}

export const SearchableMajorTypeahead: React.FC<SearchableMajorTypeaheadProps> = ({
  value,
  onChange,
  university,
  standing = 'Junior',
  degreeType = '',
  placeholder = 'Type to search program (e.g. Computer Science, Finance)...',
  label,
  id,
  isAdditional = false,
  additionalType = 'Minor',
  onAddAdditional
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal search term when external value changes or dropdown opens
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(value ? stripDegreePrefix(value) : '');
    }
  }, [value, isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine degree level (Graduate vs Undergraduate)
  const isGraduate = (standing && standing.toLowerCase().includes('graduate')) || 
    degreeType.toLowerCase().includes('master') || 
    degreeType.toLowerCase().includes('doctorate') || 
    degreeType.toLowerCase().includes('phd') || 
    degreeType.toLowerCase().includes('m.s.') || 
    degreeType.toLowerCase().includes('m.a.');

  // Extract university specific offered programs & format them
  const universityMajorsRaw: string[] = [];
  if (university) {
    if (university.offeredMajors && university.offeredMajors.length > 0) {
      university.offeredMajors.forEach(m => universityMajorsRaw.push(stripDegreePrefix(m)));
    }
    if (university.degreePlans && university.degreePlans.length > 0) {
      university.degreePlans.forEach(dp => {
        if (dp.majorName) {
          const cleaned = stripDegreePrefix(dp.majorName);
          if (!universityMajorsRaw.includes(cleaned)) {
            universityMajorsRaw.push(cleaned);
          }
        }
      });
    }
    // Also add offered minors / concentrations
    if (university.offeredMinors) {
      university.offeredMinors.forEach(m => {
        const cleaned = isAdditional && additionalType === 'Minor' ? m : stripDegreePrefix(m);
        if (!universityMajorsRaw.includes(cleaned)) universityMajorsRaw.push(cleaned);
      });
    }
    if (university.offeredConcentrations) {
      university.offeredConcentrations.forEach(c => {
        const cleaned = stripDegreePrefix(c);
        if (!universityMajorsRaw.includes(cleaned)) universityMajorsRaw.push(cleaned);
      });
    }
  }

  // Deduplicate university majors
  const universityOfferedMajors = Array.from(new Set(universityMajorsRaw.filter(Boolean)));

  // General accredited majors list based on standing
  const rawStandardMajors = isGraduate ? MAJORS_BY_STANDING.graduate : MAJORS_BY_STANDING.undergraduate;
  const standardMajors = Array.from(new Set(rawStandardMajors.map(m => stripDegreePrefix(m))));

  // Has specific university majors
  const hasUniversityMajors = universityOfferedMajors.length > 0;

  // Calculate filtered results
  const query = searchTerm.toLowerCase().trim();

  const filterMajorList = (list: string[]) => {
    if (!query) return list;
    return list.filter(m => {
      const lower = m.toLowerCase();
      if (lower.includes(query)) return true;
      // Shortcuts
      if (query === 'cs' && (lower.includes('computer science') || lower.includes('eecs'))) return true;
      if (query === 'ds' && lower.includes('data science')) return true;
      if (query === 'ai' && (lower.includes('artificial intelligence') || lower.includes('machine learning'))) return true;
      if (query === 'swe' && lower.includes('software engineering')) return true;
      if (query === 'se' && lower.includes('software engineering')) return true;
      if (query === 'ee' && lower.includes('electrical')) return true;
      if (query === 'me' && lower.includes('mechanical')) return true;
      if (query === 'econ' && lower.includes('economics')) return true;
      if (query === 'fin' && lower.includes('finance')) return true;
      if (query === 'quant' && lower.includes('quantitative')) return true;
      if (query === 'bio' && (lower.includes('biology') || lower.includes('bioengineering') || lower.includes('biomedical'))) return true;
      if (query === 'stat' && lower.includes('statistics')) return true;
      if (query === 'math' && lower.includes('mathematics')) return true;
      return false;
    });
  };

  const filteredUnivMajors = filterMajorList(universityOfferedMajors);
  const filteredStandardMajors = filterMajorList(standardMajors.filter(m => !universityOfferedMajors.includes(m)));

  const displayedUnivList = hasUniversityMajors ? filteredUnivMajors : [];
  const displayedStandardList = hasUniversityMajors && query ? filteredStandardMajors : (!hasUniversityMajors ? filteredStandardMajors : []);

  const allFilteredCombined = [...displayedUnivList, ...displayedStandardList];

  const hasExactMatch = allFilteredCombined.some(m => m.toLowerCase() === query);
  const showCustomOption = query.length > 0 && !hasExactMatch;

  const totalNavigableOptions = allFilteredCombined.length + (showCustomOption ? 1 : 0);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % Math.max(1, totalNavigableOptions));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + totalNavigableOptions) % Math.max(1, totalNavigableOptions));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showCustomOption && highlightedIndex === allFilteredCombined.length) {
        selectMajor(searchTerm.trim());
      } else if (allFilteredCombined[highlightedIndex]) {
        selectMajor(allFilteredCombined[highlightedIndex]);
      } else if (searchTerm.trim()) {
        selectMajor(searchTerm.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectMajor = (selected: string) => {
    const formatted = stripDegreePrefix(selected);
    if (isAdditional && onAddAdditional) {
      onAddAdditional(additionalType, formatted);
      setSearchTerm('');
    } else {
      onChange(formatted);
      setSearchTerm(formatted);
    }
    setIsOpen(false);
  };

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);

    return (
      <>
        {before}
        <span className="bg-indigo-500/30 text-indigo-200 font-bold px-0.5 rounded">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-xs font-medium text-zinc-400 mb-1">
          {label}
        </label>
      )}

      {/* Input Field Box */}
      <div className="relative flex items-center" title={value || searchTerm}>
        <div className="absolute left-3 text-zinc-500 pointer-events-none flex items-center">
          <BookOpen className="h-4 w-4 text-indigo-400" />
        </div>

        <input
          id={id}
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : (value || searchTerm)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(0);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          title={value || searchTerm}
          className="w-full bg-[#0c0c0e] border border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-xl py-2.5 pl-9 pr-24 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner font-medium truncate"
        />

        <div className="absolute right-2 flex items-center space-x-1">
          {value && !isOpen && (
            <span className="hidden sm:inline-flex items-center text-[10px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded-md font-semibold">
              {hasUniversityMajors && universityOfferedMajors.includes(value) ? 'Offered' : 'Custom'}
            </span>
          )}

          {searchTerm && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchTerm('');
                if (!isAdditional) onChange('');
                inputRef.current?.focus();
              }}
              className="p-1 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800/80 transition-colors cursor-pointer"
              title="Clear text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded-lg cursor-pointer"
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Predictive Typeahead Popover */}
      {isOpen && (
        <div className="absolute z-[100] left-0 mt-1.5 w-full sm:w-[540px] md:w-[620px] max-w-[95vw] bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md max-h-80 sm:max-h-96 flex flex-col divide-y divide-zinc-800/60 animate-in fade-in slide-in-from-top-1 duration-150">
          
          {/* Top Status Bar */}
          <div className="px-3.5 py-2.5 bg-zinc-900/95 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center space-x-2 min-w-0">
              <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
              <span className="truncate">
                {university ? (
                  <span className="truncate">
                    Programs at <strong className="text-zinc-100 font-semibold">{university.name}</strong>
                  </span>
                ) : (
                  <span>Select a University above to view campus majors</span>
                )}
              </span>
            </div>
            <span className="font-mono text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0 ml-2">
              {hasUniversityMajors ? `${displayedUnivList.length} Offered` : 'All Accredited'}
            </span>
          </div>

          {/* Scrollable Results Area */}
          <div className="overflow-y-auto custom-scrollbar p-2 space-y-2">
            
            {/* 1. University Offered Majors Section */}
            {hasUniversityMajors && (
              <div>
                <div className="px-2.5 py-1 flex items-center justify-between text-[10px] font-bold text-indigo-300 uppercase tracking-wider bg-indigo-500/10 rounded-md mb-1.5">
                  <span className="flex items-center space-x-1.5">
                    <Building className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Campus Offered Programs ({displayedUnivList.length})</span>
                  </span>
                  <span className="text-[9px] text-indigo-400 font-mono">Official Campus List</span>
                </div>

                {displayedUnivList.length > 0 ? (
                  <div className="space-y-1">
                    {displayedUnivList.map((m, idx) => {
                      const isSelected = value === m;
                      const isHighlighted = highlightedIndex === idx;
                      return (
                        <button
                          key={`univ-${m}-${idx}`}
                          type="button"
                          onClick={() => selectMajor(m)}
                          title={m}
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-indigo-600/20 text-indigo-200 font-medium border border-indigo-500/30'
                              : isHighlighted
                              ? 'bg-zinc-800/90 text-white'
                              : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                          }`}
                        >
                          <span className="flex items-start space-x-2.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                            <span className="break-words whitespace-normal leading-snug font-medium text-zinc-100">{highlightMatch(m)}</span>
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                ) : query ? (
                  <p className="px-3 py-2 text-xs text-zinc-400 italic">No program at {university?.name} matches "{query}".</p>
                ) : null}
              </div>
            )}

            {/* 2. Fallback or Additional Accredited Majors Section */}
            {displayedStandardList.length > 0 && (
              <div>
                <div className="px-2.5 py-1 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-800/50 rounded-md mb-1.5">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>{hasUniversityMajors ? 'Other Accredited Programs' : `All Accredited ${isGraduate ? 'Graduate' : 'Undergraduate'} Majors`}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  {displayedStandardList.map((m, idx) => {
                    const actualIdx = hasUniversityMajors ? displayedUnivList.length + idx : idx;
                    const isSelected = value === m;
                    const isHighlighted = highlightedIndex === actualIdx;
                    return (
                      <button
                        key={`std-${m}-${idx}`}
                        type="button"
                        onClick={() => selectMajor(m)}
                        title={m}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-600/20 text-indigo-200 font-medium border border-indigo-500/30'
                            : isHighlighted
                            ? 'bg-zinc-800/90 text-white'
                            : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                        }`}
                      >
                        <span className="flex items-start space-x-2.5 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                          <span className="break-words whitespace-normal leading-snug font-medium text-zinc-100">{highlightMatch(m)}</span>
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Major Option when query does not match an offered major */}
            {showCustomOption && (
              <button
                type="button"
                onClick={() => selectMajor(searchTerm.trim())}
                title={`Use custom major "${searchTerm.trim()}"`}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm flex items-start justify-between gap-3 transition-colors cursor-pointer border border-dashed border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 ${
                  highlightedIndex === allFilteredCombined.length ? 'bg-indigo-500/25 ring-1 ring-indigo-400' : ''
                }`}
              >
                <span className="flex items-start space-x-2.5 font-medium min-w-0">
                  <Plus className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="break-words whitespace-normal leading-snug">Enter Custom Program: <strong className="text-white font-mono">"{searchTerm.trim()}"</strong></span>
                </span>
                <span className="text-[10px] font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200 shrink-0 ml-1">Custom</span>
              </button>
            )}

            {/* No Results at all */}
            {allFilteredCombined.length === 0 && !showCustomOption && (
              <div className="p-4 text-center text-xs text-zinc-400">
                <Search className="h-5 w-5 text-zinc-500 mx-auto mb-1.5" />
                <p>Type to search offered majors or enter custom program name.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
