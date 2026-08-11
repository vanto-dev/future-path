import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Check, Plus, X, Globe, Sparkles } from 'lucide-react';
import { WORLDWIDE_PREFERRED_LOCATIONS } from '../data/locationDatabase';

interface SearchablePreferredLocationProps {
  preferredLocations: string[];
  onChange: (locations: string[]) => void;
  placeholder?: string;
}

export const SearchablePreferredLocation: React.FC<SearchablePreferredLocationProps> = ({
  preferredLocations,
  onChange,
  placeholder = 'Search worldwide cities, regions, or countries (e.g. San Francisco, London, Tokyo, Remote)...'
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

  const suggestions = WORLDWIDE_PREFERRED_LOCATIONS.filter(loc => {
    if (!trimmedQuery) return true;
    return loc.toLowerCase().includes(trimmedQuery);
  });

  const toggleLocation = (loc: string) => {
    if (preferredLocations.includes(loc)) {
      onChange(preferredLocations.filter(l => l !== loc));
    } else {
      onChange([...preferredLocations, loc]);
    }
    setQuery('');
  };

  const addCustomLocation = (loc: string) => {
    const trimmed = loc.trim();
    if (!trimmed) return;
    if (!preferredLocations.includes(trimmed)) {
      onChange([...preferredLocations, trimmed]);
    }
    setQuery('');
    setIsOpen(false);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div ref={containerRef} className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Globe className="h-3.5 w-3.5 text-amber-400" />
          <span>Preferred Target Locations (Worldwide)</span>
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-zinc-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
            {preferredLocations.length} Selected
          </span>
          {preferredLocations.length > 0 && (
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

      {/* Input Field */}
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
                addCustomLocation(query);
              }
            }
          }}
          placeholder={placeholder}
          className="w-full bg-[#0c0c0e] border border-zinc-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
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

      {/* Selected Location Chips */}
      {preferredLocations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {preferredLocations.map((loc) => (
            <span
              key={loc}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-600/20 border border-amber-500/40 text-amber-200 rounded-lg text-xs font-medium shadow-sm animate-in fade-in duration-100"
            >
              <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
              <span>{loc}</span>
              <button
                type="button"
                onClick={() => toggleLocation(loc)}
                className="hover:text-rose-400 cursor-pointer ml-1 p-0.5"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Autocomplete Suggestions Popup */}
      {isOpen && (
        <div className="absolute z-[100] left-0 right-0 mt-1 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md max-h-64 flex flex-col divide-y divide-zinc-800/60 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 bg-zinc-900/90 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Worldwide Locations</span>
            </span>
            <span>{suggestions.length} Locations</span>
          </div>

          <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5">
            {suggestions.slice(0, 30).map((loc) => {
              const isSelected = preferredLocations.includes(loc);
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => toggleLocation(loc)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600/20 text-amber-200 font-semibold border border-amber-500/30'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-2 truncate">
                    <MapPin className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <span className="truncate">{loc}</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isSelected ? 'bg-amber-500/30 text-amber-200 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                    {isSelected ? '✓ Added' : '+ Select'}
                  </span>
                </button>
              );
            })}

            {query.trim() && !preferredLocations.includes(query.trim()) && (
              <button
                type="button"
                onClick={() => addCustomLocation(query)}
                className="w-full text-left px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors mt-1"
              >
                <span className="flex items-center space-x-2 truncate">
                  <Plus className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="truncate">Add Custom Location: <strong className="text-white">"{query.trim()}"</strong></span>
                </span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200 font-mono">Custom</span>
              </button>
            )}

            {suggestions.length === 0 && !query.trim() && (
              <p className="p-3 text-center text-xs text-zinc-500 italic">Type any global city, state, region or country name.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
