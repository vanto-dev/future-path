import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Search, Check, Plus, X, Sparkles } from 'lucide-react';
import { COMPREHENSIVE_JOB_TITLES } from '../data/jobTitlesDatabase';

interface SearchableJobTitleTypeaheadProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
  suggestedRoles?: string[];
  placeholder?: string;
}

export const SearchableJobTitleTypeahead: React.FC<SearchableJobTitleTypeaheadProps> = ({
  selectedRoles,
  onChange,
  suggestedRoles = [],
  placeholder = 'Search job titles across all industries (e.g. Software Engineer, Quant, PM)...'
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmedQuery = query.toLowerCase().trim();

  const filteredTitles = COMPREHENSIVE_JOB_TITLES.filter(r => {
    if (!trimmedQuery) return true;
    return r.title.toLowerCase().includes(trimmedQuery) || r.category.toLowerCase().includes(trimmedQuery);
  });

  const toggleRole = (title: string) => {
    if (selectedRoles.includes(title)) {
      onChange(selectedRoles.filter(r => r !== title));
    } else {
      onChange([...selectedRoles, title]);
    }
    setQuery('');
  };

  const addCustomRole = (role: string) => {
    const trimmed = role.trim();
    if (!trimmed) return;
    if (!selectedRoles.includes(trimmed)) {
      onChange([...selectedRoles, trimmed]);
    }
    setQuery('');
    setIsOpen(false);
  };

  const clearAll = () => {
    onChange([]);
  };

  // Helper to highlight match
  const highlightMatch = (text: string) => {
    if (!trimmedQuery) return text;
    const index = text.toLowerCase().indexOf(trimmedQuery);
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span className="bg-emerald-500/30 text-emerald-200 font-bold px-0.5 rounded">
          {text.substring(index, index + trimmedQuery.length)}
        </span>
        {text.substring(index + trimmedQuery.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
          <span>Target Roles & Position Titles</span>
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-zinc-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
            {selectedRoles.length} Roles Selected
          </span>
          {selectedRoles.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[10px] text-zinc-500 hover:text-rose-400 cursor-pointer transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (query.trim()) {
                addCustomRole(query);
              }
            }
          }}
          placeholder={placeholder}
          className="w-full bg-[#0c0c0e] border border-zinc-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Selected Job Title Chips */}
      {selectedRoles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {selectedRoles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 rounded-lg text-xs font-medium shadow-sm animate-in fade-in duration-100"
            >
              <span>{role}</span>
              <button
                type="button"
                onClick={() => toggleRole(role)}
                className="hover:text-rose-400 cursor-pointer ml-1 p-0.5"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggested Job Titles bar if present */}
      {suggestedRoles.length > 0 && (
        <div className="p-2.5 bg-gradient-to-r from-emerald-950/30 to-teal-950/20 border border-emerald-500/20 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300">
            <span className="flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Recommended Target Roles:</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">{suggestedRoles.length} Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedRoles.map((r) => {
              const isSelected = selectedRoles.includes(r);
              if (isSelected) return null;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRole(r)}
                  className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-[11px] font-medium transition-all cursor-pointer shadow-sm flex items-center space-x-1"
                >
                  <span>+ {r}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Typeahead Dropdown Popup */}
      {isOpen && (
        <div className="absolute z-[100] left-0 right-0 mt-1 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md max-h-64 flex flex-col divide-y divide-zinc-800/60 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 bg-zinc-900/90 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span className="flex items-center space-x-1">
              <Briefcase className="h-3 w-3 text-emerald-400" />
              <span>All Industry Job Roles</span>
            </span>
            <span>{filteredTitles.length} Titles Available</span>
          </div>

          <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5">
            {filteredTitles.slice(0, 35).map((item) => {
              const isSelected = selectedRoles.includes(item.title);
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => toggleRole(item.title)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600/20 text-emerald-200 font-semibold border border-emerald-500/30'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate font-medium">{highlightMatch(item.title)}</span>
                    <span className="text-[10px] text-zinc-500">{item.category}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono shrink-0 ${isSelected ? 'bg-emerald-500/30 text-emerald-200 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                    {isSelected ? '✓ Added' : '+ Select'}
                  </span>
                </button>
              );
            })}

            {query.trim() && !selectedRoles.includes(query.trim()) && (
              <button
                type="button"
                onClick={() => addCustomRole(query)}
                className="w-full text-left px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors mt-1"
              >
                <span className="flex items-center space-x-2 truncate">
                  <Plus className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Enter Custom Title: <strong className="text-white">"{query.trim()}"</strong></span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200 font-mono">Custom</span>
              </button>
            )}

            {filteredTitles.length === 0 && !query.trim() && (
              <p className="p-3 text-center text-xs text-zinc-500 italic">Type any position title or function to search.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
