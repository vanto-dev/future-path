// Comprehensive list of countries and states/provinces worldwide

export interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  hasStates: boolean;
  states?: string[];
}

export const COMPREHENSIVE_COUNTRIES: CountryInfo[] = [
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    hasStates: true,
    states: [
      'Alabama (AL)', 'Alaska (AK)', 'Arizona (AZ)', 'Arkansas (AR)', 'California (CA)',
      'Colorado (CO)', 'Connecticut (CT)', 'Delaware (DE)', 'District of Columbia (DC)',
      'Florida (FL)', 'Georgia (GA)', 'Hawaii (HI)', 'Idaho (ID)', 'Illinois (IL)',
      'Indiana (IN)', 'Iowa (IA)', 'Kansas (KS)', 'Kentucky (KY)', 'Louisiana (LA)',
      'Maine (ME)', 'Maryland (MD)', 'Massachusetts (MA)', 'Michigan (MI)', 'Minnesota (MN)',
      'Mississippi (MS)', 'Missouri (MO)', 'Montana (MT)', 'Nebraska (NE)', 'Nevada (NV)',
      'New Hampshire (NH)', 'New Jersey (NJ)', 'New Mexico (NM)', 'New York (NY)',
      'North Carolina (NC)', 'North Dakota (ND)', 'Ohio (OH)', 'Oklahoma (OK)', 'Oregon (OR)',
      'Pennsylvania (PA)', 'Puerto Rico (PR)', 'Rhode Island (RI)', 'South Carolina (SC)',
      'South Dakota (SD)', 'Tennessee (TN)', 'Texas (TX)', 'Utah (UT)', 'Vermont (VT)',
      'Virginia (VA)', 'Washington (WA)', 'West Virginia (WV)', 'Wisconsin (WI)', 'Wyoming (WY)'
    ]
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    hasStates: true,
    states: [
      'Alberta (AB)', 'British Columbia (BC)', 'Manitoba (MB)', 'New Brunswick (NB)',
      'Newfoundland and Labrador (NL)', 'Northwest Territories (NT)', 'Nova Scotia (NS)',
      'Nunavut (NU)', 'Ontario (ON)', 'Prince Edward Island (PE)', 'Quebec (QC)',
      'Saskatchewan (SK)', 'Yukon (YT)'
    ]
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    hasStates: true,
    states: [
      'England', 'Scotland', 'Wales', 'Northern Ireland', 'Greater London',
      'West Midlands', 'Greater Manchester', 'Yorkshire', 'East Midlands'
    ]
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    hasStates: true,
    states: [
      'New South Wales (NSW)', 'Victoria (VIC)', 'Queensland (QLD)',
      'Western Australia (WA)', 'South Australia (SA)', 'Tasmania (TAS)',
      'Australian Capital Territory (ACT)', 'Northern Territory (NT)'
    ]
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    hasStates: true,
    states: [
      'Andhra Pradesh', 'Delhi (NCT)', 'Gujarat', 'Karnataka', 'Kerala',
      'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
      'Telangana', 'Uttar Pradesh', 'West Bengal'
    ]
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    hasStates: true,
    states: [
      'Bavaria (Bayern)', 'Baden-Württemberg', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hesse (Hessen)', 'Lower Saxony (Niedersachsen)', 'North Rhine-Westphalia (NRW)',
      'Rhineland-Palatinate', 'Saxony (Sachsen)', 'Schleswig-Holstein'
    ]
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    hasStates: true,
    states: [
      'Île-de-France (Paris Region)', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur',
      'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France', 'Grand Est'
    ]
  },
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    hasStates: true,
    states: [
      'Tokyo Metropolis', 'Osaka Prefecture', 'Kanagawa Prefecture', 'Aichi Prefecture',
      'Kyoto Prefecture', 'Hokkaido', 'Fukuoka Prefecture', 'Saitama Prefecture'
    ]
  },
  {
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    hasStates: false,
    states: ['Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region']
  },
  {
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    hasStates: true,
    states: [
      'Beijing', 'Shanghai', 'Guangdong', 'Zhejiang', 'Jiangsu', 'Sichuan',
      'Hubei', 'Shandong', 'Hong Kong SAR', 'Macau SAR'
    ]
  },
  {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    hasStates: true,
    states: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná', 'Rio Grande do Sul', 'Bahia']
  },
  {
    name: 'Mexico',
    code: 'MX',
    flag: '🇲🇽',
    hasStates: true,
    states: ['Mexico City (CDMX)', 'Jalisco', 'Nuevo León', 'State of Mexico', 'Puebla', 'Guanajuato']
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    hasStates: true,
    states: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
  },
  {
    name: 'Switzerland',
    code: 'CH',
    flag: '🇨🇭',
    hasStates: true,
    states: ['Zurich', 'Geneva', 'Vaud (Lausanne)', 'Basel-Stadt', 'Bern', 'Zug']
  },
  {
    name: 'Netherlands',
    code: 'NL',
    flag: '🇳🇱',
    hasStates: true,
    states: ['North Holland (Amsterdam)', 'South Holland (Rotterdam / The Hague)', 'Utrecht', 'North Brabant']
  },
  {
    name: 'South Korea',
    code: 'KR',
    flag: '🇰🇷',
    hasStates: true,
    states: ['Seoul Capital Area', 'Gyeonggi Province', 'Busan Metropolitan City', 'Incheon', 'Daegu']
  },
  {
    name: 'Ireland',
    code: 'IE',
    flag: '🇮🇪',
    hasStates: true,
    states: ['County Dublin', 'County Cork', 'County Galway', 'County Limerick']
  },
  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    hasStates: true,
    states: ['Community of Madrid', 'Catalonia (Barcelona)', 'Andalusia', 'Valencian Community', 'Basque Country']
  },
  {
    name: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    hasStates: true,
    states: ['Lombardy (Milan)', 'Lazio (Rome)', 'Piedmont (Turin)', 'Veneto', 'Emilia-Romagna']
  },
  {
    name: 'Sweden',
    code: 'SE',
    flag: '🇸🇪',
    hasStates: true,
    states: ['Stockholm County', 'Västra Götaland (Gothenburg)', 'Skåne (Malmö)']
  },
  {
    name: 'Israel',
    code: 'IL',
    flag: '🇮🇱',
    hasStates: true,
    states: ['Tel Aviv District', 'Central District', 'Jerusalem District', 'Haifa District']
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    hasStates: true,
    states: ['Auckland Region', 'Wellington Region', 'Canterbury (Christchurch)', 'Waikato']
  },
  {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    hasStates: true,
    states: ['Gauteng (Johannesburg / Pretoria)', 'Western Cape (Cape Town)', 'KwaZulu-Natal (Durban)']
  },
  {
    name: 'Argentina',
    code: 'AR',
    flag: '🇦🇷',
    hasStates: true,
    states: ['Buenos Aires City (CABA)', 'Buenos Aires Province', 'Córdoba', 'Santa Fe (Rosario)']
  },
  {
    name: 'Colombia',
    code: 'CO',
    flag: '🇨🇴',
    hasStates: true,
    states: ['Bogotá D.C.', 'Antioquia (Medellín)', 'Valle del Cauca (Cali)', 'Atlántico (Barranquilla)']
  },
  {
    name: 'Chile',
    code: 'CL',
    flag: '🇨🇱',
    hasStates: true,
    states: ['Santiago Metropolitan Region', 'Valparaíso Region', 'Bío Bío Region']
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    hasStates: true,
    states: ['Riyadh Province', 'Makkah Province (Jeddah)', 'Eastern Province (Dammam)']
  },
  {
    name: 'Nigeria',
    code: 'NG',
    flag: '🇳🇬',
    hasStates: true,
    states: ['Lagos State', 'Abuja (FCT)', 'Rivers State (Port Harcourt)', 'Oyo State (Ibadan)']
  },
  {
    name: 'Kenya',
    code: 'KE',
    flag: '🇰🇪',
    hasStates: true,
    states: ['Nairobi County', 'Mombasa County', 'Kiambu County']
  },
  {
    name: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    hasStates: true,
    states: ['Cairo Governorate', 'Alexandria Governorate', 'Giza Governorate']
  },
  {
    name: 'Taiwan',
    code: 'TW',
    flag: '🇹🇼',
    hasStates: true,
    states: ['Taipei City', 'New Taipei City', 'Hsinchu City (Hsinchu Science Park)', 'Taichung City', 'Kaohsiung City']
  },
  {
    name: 'Philippines',
    code: 'PH',
    flag: '🇵🇭',
    hasStates: true,
    states: ['Metro Manila', 'Cebu', 'Davao Region', 'CALABARZON']
  },
  {
    name: 'Vietnam',
    code: 'VN',
    flag: '🇻🇳',
    hasStates: true,
    states: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Binh Duong']
  },
  {
    name: 'Indonesia',
    code: 'ID',
    flag: '🇮🇩',
    hasStates: true,
    states: ['Special Capital Region of Jakarta', 'West Java (Bandung)', 'East Java (Surabaya)', 'Bali']
  },
  {
    name: 'Malaysia',
    code: 'MY',
    flag: '🇲🇾',
    hasStates: true,
    states: ['Kuala Lumpur (Federal Territory)', 'Selangor', 'Penang', 'Johor']
  },
  {
    name: 'Thailand',
    code: 'TH',
    flag: '🇹🇭',
    hasStates: true,
    states: ['Bangkok Metropolitan Region', 'Chiang Mai Province', 'Chonburi (Pattaya)']
  },
  {
    name: 'Poland',
    code: 'PL',
    flag: '🇵🇱',
    hasStates: true,
    states: ['Masovian (Warsaw)', 'Lesser Poland (Kraków)', 'Lower Silesian (Wrocław)']
  },
  {
    name: 'Portugal',
    code: 'PT',
    flag: '🇵🇹',
    hasStates: true,
    states: ['Lisbon District', 'Porto District', 'Braga District', 'Faro (Algarve)']
  },
  {
    name: 'Greece',
    code: 'GR',
    flag: '🇬🇷',
    hasStates: true,
    states: ['Attica (Athens)', 'Central Macedonia (Thessaloniki)']
  },
  {
    name: 'Austria',
    code: 'AT',
    flag: '🇦🇹',
    hasStates: true,
    states: ['Vienna', 'Lower Austria', 'Upper Austria', 'Styria', 'Tyrol']
  },
  {
    name: 'Belgium',
    code: 'BE',
    flag: '🇧🇪',
    hasStates: true,
    states: ['Brussels-Capital Region', 'Flanders (Antwerp / Ghent)', 'Wallonia']
  },
  {
    name: 'Denmark',
    code: 'DK',
    flag: '🇩🇰',
    hasStates: true,
    states: ['Capital Region of Denmark (Copenhagen)', 'Central Denmark Region (Aarhus)']
  },
  {
    name: 'Finland',
    code: 'FI',
    flag: '🇫🇮',
    hasStates: true,
    states: ['Uusimaa (Helsinki Metropolitan Area)', 'Pirkanmaa (Tampere)']
  },
  {
    name: 'Norway',
    code: 'NO',
    flag: '🇳🇴',
    hasStates: true,
    states: ['Oslo', 'Viken', 'Vestland (Bergen)', 'Trøndelag (Trondheim)']
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
    flag: '🇨🇿',
    hasStates: true,
    states: ['Prague', 'South Moravia (Brno)']
  },
  {
    name: 'Hungary',
    code: 'HU',
    flag: '🇭🇺',
    hasStates: true,
    states: ['Budapest', 'Pest County']
  },
  {
    name: 'Romania',
    code: 'RO',
    flag: '🇷🇴',
    hasStates: true,
    states: ['Bucharest', 'Cluj County', 'Timiș County']
  },
  {
    name: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    hasStates: true,
    states: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya']
  },
  {
    name: 'Pakistan',
    code: 'PK',
    flag: '🇵🇰',
    hasStates: true,
    states: ['Punjab (Lahore)', 'Sindh (Karachi)', 'Islamabad Capital Territory', 'Khyber Pakhtunkhwa']
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    flag: '🇧🇩',
    hasStates: true,
    states: ['Dhaka Division', 'Chittagong Division', 'Rajshahi Division']
  }
];

// Worldwide target locations curated dataset
export const WORLDWIDE_PREFERRED_LOCATIONS = [
  // US Major Tech / Business Hubs
  'San Francisco, CA',
  'Silicon Valley / San Jose, CA',
  'New York, NY',
  'Boston, MA',
  'Seattle, WA',
  'Austin, TX',
  'Chicago, IL',
  'Los Angeles, CA',
  'San Diego, CA',
  'Washington, D.C. Metro Area',
  'Dallas-Fort Worth, TX',
  'Houston, TX',
  'Atlanta, GA',
  'Denver / Boulder, CO',
  'Miami / Fort Lauderdale, FL',
  'Raleigh-Durham (Research Triangle), NC',
  'Salt Lake City / Provo, UT',
  'Philadelphia, PA',
  'Minneapolis-St. Paul, MN',
  'Phoenix, AZ',
  'Portland, OR',
  'Pittsburgh, PA',
  'Charlotte, NC',
  'Nashville, TN',

  // Canada & Americas
  'Toronto, ON, Canada',
  'Vancouver, BC, Canada',
  'Montreal, QC, Canada',
  'Ottawa, ON, Canada',
  'Mexico City, Mexico',
  'São Paulo, Brazil',
  'Buenos Aires, Argentina',
  'Santiago, Chile',
  'Bogotá, Colombia',

  // Europe & UK
  'London, United Kingdom',
  'Cambridge, United Kingdom',
  'Oxford, United Kingdom',
  'Dublin, Ireland',
  'Zurich, Switzerland',
  'Munich, Germany',
  'Berlin, Germany',
  'Frankfurt, Germany',
  'Paris, France',
  'Amsterdam, Netherlands',
  'Stockholm, Sweden',
  'Copenhagen, Denmark',
  'Oslo, Norway',
  'Helsinki, Finland',
  'Barcelona, Spain',
  'Madrid, Spain',
  'Milan, Italy',
  'Vienna, Austria',
  'Brussels, Belgium',
  'Warsaw, Poland',
  'Prague, Czech Republic',

  // Asia-Pacific & Middle East
  'Tokyo, Japan',
  'Singapore',
  'Hong Kong SAR',
  'Seoul, South Korea',
  'Sydney, Australia',
  'Melbourne, Australia',
  'Dubai, United Arab Emirates',
  'Abu Dhabi, United Arab Emirates',
  'Tel Aviv, Israel',
  'Bengaluru (Bangalore), India',
  'Hyderabad, India',
  'Mumbai, India',
  'Delhi NCR, India',
  'Taipei, Taiwan',
  'Beijing, China',
  'Shanghai, China',
  'Shenzhen, China',
  'Kuala Lumpur, Malaysia',
  'Jakarta, Indonesia',
  'Bangkok, Thailand',
  'Auckland, New Zealand',

  // Remote Options
  'Fully Remote (United States)',
  'Fully Remote (Worldwide / Global)',
  'Hybrid (Flexible Location)'
];
