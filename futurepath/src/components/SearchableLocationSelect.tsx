import React, { useState, useRef, useEffect } from 'react';
import { Globe, MapPin, Search, Check, X, ChevronDown, Building2, Sparkles } from 'lucide-react';
import { COMPREHENSIVE_COUNTRIES, CountryInfo } from '../data/locationDatabase';

export const formatCityName = (str: string): string => {
  if (!str) return '';
  const trimmed = str.trim();
  if (!trimmed) return '';

  const minorWords = new Set(['of', 'and', 'de', 'del', 'da', 'la', 'der', 'des', 'upon']);

  return trimmed
    .split(/\s+/)
    .map((word, index) => {
      if (!word) return '';
      const lower = word.toLowerCase();
      if (lower === 'st' || lower === 'st.') return 'St.';

      const hyphenParts = word.split('-');
      const formattedParts = hyphenParts.map((part) => {
        if (!part) return '';
        const lowerPart = part.toLowerCase();
        if (index > 0 && minorWords.has(lowerPart)) {
          return lowerPart;
        }
        return lowerPart.charAt(0).toUpperCase() + lowerPart.slice(1);
      });
      return formattedParts.join('-');
    })
    .join(' ');
};

const POPULAR_CITIES: Record<string, string[]> = {
  'United States': [
    'San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Seattle', 'Austin',
    'San Jose', 'Boston', 'San Diego', 'Washington', 'Atlanta', 'Denver',
    'Dallas', 'Houston', 'Miami', 'Phoenix', 'Philadelphia', 'Minneapolis',
    'Portland', 'Pittsburgh', 'Raleigh', 'Charlotte', 'Nashville', 'Detroit',
    'Salt Lake City', 'Las Vegas', 'Sacramento', 'Irvine', 'San Antonio',
    'Columbus', 'Indianapolis', 'St. Louis', 'Tampa', 'Orlando', 'Baltimore'
  ],
  'Canada': [
    'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton',
    'Quebec City', 'Waterloo', 'Victoria', 'Winnipeg', 'Halifax'
  ],
  'United Kingdom': [
    'London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Bristol',
    'Cambridge', 'Oxford', 'Leeds', 'Liverpool', 'Belfast', 'Sheffield'
  ],
  'Australia': [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Gold Coast'
  ],
  'India': [
    'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon',
    'Noida', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh'
  ],
  'Germany': [
    'Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart', 'Düsseldorf'
  ],
  'France': [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Strasbourg'
  ],
  'Japan': [
    'Tokyo', 'Osaka', 'Yokohama', 'Kyoto', 'Nagoya', 'Fukuoka', 'Sapporo'
  ],
  'Singapore': ['Singapore'],
  'China': [
    'Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou', 'Hangzhou', 'Chengdu', 'Wuhan'
  ],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Belo Horizonte', 'Curitiba'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
  'Switzerland': ['Zurich', 'Geneva', 'Lausanne', 'Basel', 'Bern', 'Zug'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  'Global': [
    'San Francisco', 'New York', 'London', 'Toronto', 'Tokyo', 'Singapore',
    'Paris', 'Berlin', 'Sydney', 'Zurich', 'Dubai', 'Seoul', 'Dublin',
    'Amsterdam', 'Stockholm', 'Barcelona', 'Madrid', 'Hong Kong', 'Taipei',
    'Bengaluru', 'São Paulo', 'Mexico City', 'Auckland', 'Tel Aviv'
  ]
};

interface SearchableLocationSelectProps {
  country: string;
  state: string;
  city: string;
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
}

export const SearchableLocationSelect: React.FC<SearchableLocationSelectProps> = ({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange
}) => {
  // Country dropdown state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const countryRef = useRef<HTMLDivElement>(null);

  // State/Province dropdown state
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState('');
  const stateRef = useRef<HTMLDivElement>(null);

  // City typeahead & dropdown state
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const cityRef = useRef<HTMLDivElement>(null);

  // Selected Country Info Object
  const selectedCountryObj = COMPREHENSIVE_COUNTRIES.find(
    c => c.name.toLowerCase() === (country || 'united states').toLowerCase()
  ) || COMPREHENSIVE_COUNTRIES[0];

  // Dynamic States list based on selected country
  const availableStates = selectedCountryObj?.states || [
    'California (CA)', 'New York (NY)', 'Texas (TX)', 'Washington (WA)',
    'Massachusetts (MA)', 'Illinois (IL)', 'Florida (FL)', 'Ontario (ON)', 'London'
  ];

  // Outside click listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setIsCountryOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setIsStateOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
        if (city) {
          const formatted = formatCityName(city);
          if (formatted !== city) {
            onCityChange(formatted);
          }
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [city, onCityChange]);

  // Country filtering
  const filteredCountries = COMPREHENSIVE_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countryQuery.toLowerCase().trim()) ||
    c.code.toLowerCase().includes(countryQuery.toLowerCase().trim())
  );

  // State filtering
  const filteredStates = availableStates.filter(s =>
    s.toLowerCase().includes(stateQuery.toLowerCase().trim())
  );

  // City filtering
  const currentCountryCities = POPULAR_CITIES[country] || POPULAR_CITIES['Global'];
  const searchTerm = (cityQuery || city || '').toLowerCase().trim();
  const filteredCities = currentCountryCities.filter(c =>
    c.toLowerCase().includes(searchTerm)
  );

  const handleSelectCountry = (c: CountryInfo) => {
    onCountryChange(c.name);
    setIsCountryOpen(false);
    setCountryQuery('');
    if (state && !c.states?.includes(state)) {
      onStateChange('');
    }
  };

  const handleSelectState = (s: string) => {
    onStateChange(s);
    setIsStateOpen(false);
    setStateQuery('');
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0c0c0e]/80 p-3.5 rounded-2xl border border-zinc-800/90 shadow-inner">
        
        {/* 1. Searchable Country Dropdown */}
        <div ref={countryRef} className="relative">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Globe className="h-3 w-3 text-indigo-400" />
              <span>Country</span>
            </span>
            {country && (
              <button
                type="button"
                onClick={() => {
                  onCountryChange('');
                  onStateChange('');
                }}
                className="text-[10px] text-zinc-500 hover:text-rose-400 flex items-center space-x-0.5 cursor-pointer font-normal normal-case"
                title="Clear Country"
              >
                <span>Clear</span>
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </label>

          <div
            onClick={() => {
              setIsCountryOpen(!isCountryOpen);
              setIsStateOpen(false);
              setIsCityOpen(false);
            }}
            className="w-full bg-[#121215] border border-zinc-800 hover:border-zinc-700 rounded-xl p-2.5 text-xs text-white flex items-center justify-between cursor-pointer transition-all shadow-sm group"
          >
            <div className="flex items-center space-x-2 truncate pr-1">
              <span className="text-base leading-none">{selectedCountryObj ? selectedCountryObj.flag : '🌐'}</span>
              <span className={`truncate ${country ? 'text-white font-medium' : 'text-zinc-500'}`}>
                {country || 'Select Country...'}
              </span>
            </div>
            <div className="flex items-center space-x-1 shrink-0 text-zinc-500 group-hover:text-zinc-300">
              {country && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCountryChange('');
                  }}
                  className="p-0.5 hover:text-rose-400"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Searchable Dropdown Popup */}
          {isCountryOpen && (
            <div className="absolute z-[100] left-0 right-0 mt-1.5 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in duration-150">
              <div className="p-2 border-b border-zinc-800 bg-zinc-900/90 flex items-center space-x-2">
                <Search className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  value={countryQuery}
                  onChange={(e) => setCountryQuery(e.target.value)}
                  placeholder="Type to search country..."
                  autoFocus
                  className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-zinc-500"
                />
                {countryQuery && (
                  <button type="button" onClick={() => setCountryQuery('')}>
                    <X className="h-3 w-3 text-zinc-500 hover:text-white" />
                  </button>
                )}
              </div>

              <div className="max-h-56 overflow-y-auto p-1 space-y-0.5 divide-y divide-zinc-800/40">
                {filteredCountries.map((c) => {
                  const isSelected = country === c.name;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelectCountry(c)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/30'
                          : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center space-x-2 truncate">
                        <span className="text-sm leading-none">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}

                {filteredCountries.length === 0 && countryQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      onCountryChange(countryQuery.trim());
                      setIsCountryOpen(false);
                      setCountryQuery('');
                    }}
                    className="w-full text-left p-2.5 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>Use Custom Country: <strong>"{countryQuery}"</strong></span>
                    <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200">Custom</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Searchable State / Province Dropdown */}
        <div ref={stateRef} className="relative">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-indigo-400" />
              <span>State / Province</span>
            </span>
            {state && (
              <button
                type="button"
                onClick={() => onStateChange('')}
                className="text-[10px] text-zinc-500 hover:text-rose-400 flex items-center space-x-0.5 cursor-pointer font-normal normal-case"
                title="Clear State"
              >
                <span>Clear</span>
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </label>

          <div
            onClick={() => {
              setIsStateOpen(!isStateOpen);
              setIsCountryOpen(false);
              setIsCityOpen(false);
            }}
            className="w-full bg-[#121215] border border-zinc-800 hover:border-zinc-700 rounded-xl p-2.5 text-xs text-white flex items-center justify-between cursor-pointer transition-all shadow-sm group"
          >
            <span className={`truncate pr-1 ${state ? 'text-white font-medium' : 'text-zinc-500'}`}>
              {state || (selectedCountryObj ? `Select ${selectedCountryObj.name} Region...` : 'Select State / Region...')}
            </span>
            <div className="flex items-center space-x-1 shrink-0 text-zinc-500 group-hover:text-zinc-300">
              {state && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStateChange('');
                  }}
                  className="p-0.5 hover:text-rose-400"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* State Searchable Popup */}
          {isStateOpen && (
            <div className="absolute z-[100] left-0 right-0 mt-1.5 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in duration-150">
              <div className="p-2 border-b border-zinc-800 bg-zinc-900/90 flex items-center space-x-2">
                <Search className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  value={stateQuery}
                  onChange={(e) => setStateQuery(e.target.value)}
                  placeholder={`Search states for ${country || 'US'}...`}
                  autoFocus
                  className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-zinc-500"
                />
                {stateQuery && (
                  <button type="button" onClick={() => setStateQuery('')}>
                    <X className="h-3 w-3 text-zinc-500 hover:text-white" />
                  </button>
                )}
              </div>

              <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
                {filteredStates.map((s, idx) => {
                  const isSelected = state === s;
                  return (
                    <button
                      key={`${s}-${idx}`}
                      type="button"
                      onClick={() => handleSelectState(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/30'
                          : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{s}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}

                {stateQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      onStateChange(stateQuery.trim());
                      setIsStateOpen(false);
                      setStateQuery('');
                    }}
                    className="w-full text-left p-2.5 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-lg flex items-center justify-between cursor-pointer border-t border-zinc-800/60 mt-1"
                  >
                    <span>Use Custom Region: <strong>"{stateQuery}"</strong></span>
                    <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200">Custom</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. City Field (with Typeahead, Custom Input & Auto-formatting) */}
        <div ref={cityRef} className="relative">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Building2 className="h-3 w-3 text-indigo-400" />
              <span>City</span>
            </span>
            {city && (
              <button
                type="button"
                onClick={() => {
                  onCityChange('');
                  setCityQuery('');
                  setIsCityOpen(false);
                }}
                className="text-[10px] text-zinc-500 hover:text-rose-400 flex items-center space-x-0.5 cursor-pointer font-normal normal-case"
                title="Clear City"
              >
                <span>Clear</span>
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={cityQuery !== '' ? cityQuery : city}
              onChange={(e) => {
                const val = e.target.value;
                setCityQuery(val);
                onCityChange(val);
                setIsCityOpen(true);
              }}
              onFocus={() => {
                setIsCityOpen(true);
                setIsCountryOpen(false);
                setIsStateOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const formatted = formatCityName(cityQuery || city);
                  if (formatted) {
                    onCityChange(formatted);
                    setCityQuery('');
                  }
                  setIsCityOpen(false);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  const currentVal = cityQuery || city;
                  if (currentVal) {
                    const formatted = formatCityName(currentVal);
                    if (formatted) {
                      onCityChange(formatted);
                      setCityQuery('');
                    }
                  }
                }, 200);
              }}
              placeholder="e.g. San Francisco, London"
              className="w-full bg-[#121215] border border-zinc-800 hover:border-zinc-700 rounded-xl p-2.5 pr-8 text-xs text-white focus:outline-none focus:border-indigo-500 shadow-sm transition-all font-medium placeholder-zinc-500"
            />
            {(city || cityQuery) && (
              <button
                type="button"
                onClick={() => {
                  onCityChange('');
                  setCityQuery('');
                  setIsCityOpen(false);
                }}
                className="absolute right-2.5 text-zinc-500 hover:text-rose-400 p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* City Searchable Suggestions & Custom Input Popup */}
          {isCityOpen && (
            <div className="absolute z-[100] left-0 right-0 mt-1.5 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in duration-150">
              <div className="px-3 py-1.5 bg-zinc-900/90 flex items-center justify-between text-[10px] text-zinc-400 font-mono border-b border-zinc-800">
                <span className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-indigo-400" />
                  <span>Popular Cities & Custom Input</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCityOpen(false)}
                  className="text-zinc-500 hover:text-white text-[10px]"
                >
                  Close ✕
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
                {filteredCities.map((c, idx) => {
                  const isSelected = city.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={`${c}-${idx}`}
                      type="button"
                      onClick={() => {
                        const formatted = formatCityName(c);
                        onCityChange(formatted);
                        setCityQuery('');
                        setIsCityOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/30'
                          : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{c}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}

                {/* Option to use custom typed city */}
                {(cityQuery || city) && (
                  <button
                    type="button"
                    onClick={() => {
                      const formatted = formatCityName(cityQuery || city);
                      if (formatted) {
                        onCityChange(formatted);
                        setCityQuery('');
                      }
                      setIsCityOpen(false);
                    }}
                    className="w-full text-left p-2.5 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-lg flex items-center justify-between cursor-pointer border-t border-zinc-800/60 mt-1"
                  >
                    <span className="truncate pr-2">
                      Use Custom City: <strong>"{formatCityName(cityQuery || city)}"</strong>
                    </span>
                    <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200 shrink-0">Custom City</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

