export type EuCountryCode =
  | 'NL'
  | 'DE'
  | 'CH'
  | 'BE'
  | 'FR'
  | 'AT'
  | 'LU'
  | 'IT'
  | 'ES'
  | 'IE'
  | 'SE'
  | 'DK'
  | 'NO'
  | 'FI'
  | 'PT'
  | 'PL'
  | 'CZ'
  | 'EU';

export type CommunityCategory =
  | 'cultural'
  | 'religious'
  | 'professional'
  | 'student'
  | 'civic'
  | 'commerce'
  | 'umbrella';

export interface IndianCommunity {
  id: string;
  name: string;
  description: string;
  website: string;
  countries: EuCountryCode[];
  cities?: string[];
  category: CommunityCategory;
  tags: string[];
}

export const EU_COUNTRIES: { code: EuCountryCode; name: string; flag: string }[] = [
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'EU', name: 'Pan-Europe', flag: '🇪🇺' },
];

export const COMMUNITY_CATEGORIES: { value: CommunityCategory; label: string }[] = [
  { value: 'umbrella', label: 'Umbrella & Federation' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'religious', label: 'Religious & Temple' },
  { value: 'civic', label: 'Civic & Diaspora' },
  { value: 'professional', label: 'Professional' },
  { value: 'student', label: 'Student & Youth' },
  { value: 'commerce', label: 'Food & Commerce' },
];

export const INDIAN_COMMUNITIES: IndianCommunity[] = [
  {
    id: 'ofbjp-nl',
    name: 'OFBJP Netherlands',
    description:
      'Overseas Friends of BJP — volunteer-led foundation connecting the Indian-Dutch community through seva, culture, and civic engagement since 2015.',
    website: 'https://ofbjpnetherlands.org/',
    countries: ['NL'],
    cities: ['Amsterdam', 'The Hague', 'Rotterdam'],
    category: 'civic',
    tags: ['diaspora', 'community service', 'events', 'helpdesk'],
  },
  {
    id: 'idc-nl',
    name: 'Indian Diaspora Council',
    description:
      'Advocacy for the Indian and Hindustani Surinamese diaspora in the Netherlands, part of the Foundation for Indian Diaspora in Europe (FIDE).',
    website: 'https://indiandiasporacouncil.nl/',
    countries: ['NL', 'EU'],
    cities: ['Amsterdam'],
    category: 'civic',
    tags: ['advocacy', 'policy', 'FIDE', 'conference'],
  },
  {
    id: 'durga-mandir-rotterdam',
    name: 'Shri Durga Mandir — Indian Cultural Center Rotterdam',
    description:
      'Hindu temple and cultural centre hosting Deepavali, Navratri, Holi, and community programmes open to the wider public.',
    website: 'https://shridurgamandir.com/',
    countries: ['NL'],
    cities: ['Rotterdam'],
    category: 'religious',
    tags: ['temple', 'festivals', 'culture'],
  },
  {
    id: 'shiva-temple-amsterdam',
    name: 'Lord Shiva Hindu Temple Amsterdam',
    description:
      'Daily aarti, priest services, and major Hindu festivals including Mahashivratri, Navratri, and Janmashtami; langar and family functions.',
    website: 'https://www.shivatemple.nl/',
    countries: ['NL'],
    cities: ['Amsterdam'],
    category: 'religious',
    tags: ['temple', 'aarti', 'langar'],
  },
  {
    id: 'sewa-dhaam',
    name: 'Sewa Dhaam — Hindu Centre The Hague',
    description:
      'Promotes Hindu dharma and culture through pujas, yagyas, religious discourses, and participation in national cultural activities.',
    website: 'https://www.sewadhaam.eu/',
    countries: ['NL'],
    cities: ['The Hague'],
    category: 'religious',
    tags: ['temple', 'Sanatan Dharma', 'community centre'],
  },
  {
    id: 'balaji-nl',
    name: 'Balaji Foods',
    description:
      'Authentic Indian groceries — rice, dals, spices, and masalas — distributed across 8+ European countries for diaspora families.',
    website: 'https://balaji.nl/',
    countries: ['NL', 'DE', 'BE', 'FR', 'LU', 'EU'],
    category: 'commerce',
    tags: ['food', 'groceries', 'diaspora', 'distribution'],
  },
  {
    id: 'ecosphere',
    name: 'Ecosphere Trade BV',
    description:
      'Imports and distributes traditional Indian groceries across the European Union, connecting Indian farmers with diaspora households.',
    website: 'https://ecosphere.cc/',
    countries: ['NL', 'EU'],
    category: 'commerce',
    tags: ['trade', 'import', 'groceries'],
  },
  {
    id: 'ifg-de',
    name: 'India Federation of Germany (IFG)',
    description:
      'National umbrella representing 300,000+ people of Indian origin across 100+ associations in all 16 federal states.',
    website: 'https://indiafederationgermany.de/',
    countries: ['DE'],
    category: 'umbrella',
    tags: ['federation', 'networking', 'policy', 'talent bridge'],
  },
  {
    id: 'bharatvasi-de',
    name: 'Bharatvasi Germany',
    description:
      'Non-profit promoting Indian culture through events, sports, women’s forums, student counselling, and community helplines.',
    website: 'https://bharatvasi.de/',
    countries: ['DE'],
    category: 'cultural',
    tags: ['culture', 'women', 'students', 'sports'],
  },
  {
    id: 'kamadchi-ampal-hamm',
    name: 'Hindu Shankarar Sri Kamadchi Ampal Temple Hamm',
    description:
      'Largest Dravida Hindu temple in mainland Europe; annual festival draws tens of thousands of visitors from across Germany.',
    website: 'https://www.hinduistische-gemeinde-deutschland.de/ueber-uns-english/',
    countries: ['DE'],
    cities: ['Hamm'],
    category: 'religious',
    tags: ['Tamil', 'temple', 'Dravida'],
  },
  {
    id: 'svt-stuttgart',
    name: 'Sri Venkateshwara Temple Stuttgart',
    description:
      'Spiritual sanctuary and cultural bridge between India and Germany, built following ancient Agama Shastra traditions.',
    website: 'https://www.svtstuttgart.de/',
    countries: ['DE'],
    cities: ['Stuttgart'],
    category: 'religious',
    tags: ['temple', 'Telugu', 'Andhra'],
  },
  {
    id: 'sba-ch',
    name: 'Swiss Bharathiya Association',
    description:
      'Basel-based non-profit celebrating Indian heritage through Diwali, Janmashtami, workshops, sports, and seminars.',
    website: 'https://sbabasel.ch/',
    countries: ['CH'],
    cities: ['Basel'],
    category: 'cultural',
    tags: ['culture', 'events', 'membership'],
  },
  {
    id: 'indians-belgium',
    name: 'Indians in Belgium',
    description:
      'Connects the Indian community in Belgium through cultural events, Ganesh Festival celebrations, and diaspora support.',
    website: 'https://indianassociation.be/',
    countries: ['BE'],
    cities: ['Brussels', 'Antwerp'],
    category: 'cultural',
    tags: ['association', 'festivals', 'community'],
  },
  {
    id: 'gopio-france',
    name: 'GOPIO France Metropole',
    description:
      'Non-partisan organisation promoting PIO interests in France — cultural heritage, professional networking, and diaspora–India links.',
    website: 'https://www.gopiofrance.org/',
    countries: ['FR'],
    cities: ['Paris'],
    category: 'umbrella',
    tags: ['GOPIO', 'diaspora', 'networking'],
  },
  {
    id: 'idffc-france',
    name: 'Indian Diaspora of France & Francophone Countries (IDFFC)',
    description:
      'UN-accredited NGO serving ~300,000 people of Indian origin in France and francophone regions since 1989.',
    website: 'https://idffc.org/',
    countries: ['FR', 'BE', 'LU', 'EU'],
    category: 'civic',
    tags: ['GOPIO', 'advocacy', 'francophone'],
  },
  {
    id: 'ial-lu',
    name: 'Indian Association Luxembourg',
    description:
      'Non-profit since 1991 — Indian heritage festivals, music concerts, social events, and charitable community initiatives.',
    website: 'https://ial.lu/',
    countries: ['LU'],
    cities: ['Luxembourg City'],
    category: 'cultural',
    tags: ['festivals', 'charity', 'heritage'],
  },
  {
    id: 'iya-it',
    name: 'Indian Youth Association Italy',
    description:
      'Rome-based non-profit supporting social integration, education, entrepreneurship, and career development for Indians in Italy.',
    website: 'https://indianyouthassociation.com/',
    countries: ['IT'],
    cities: ['Rome'],
    category: 'student',
    tags: ['youth', 'integration', 'education', 'volunteers'],
  },
  {
    id: 'divya-bharat-at',
    name: 'Divya Bharat Association',
    description:
      'Vienna-based bridge between Europe and India — cultural festivals, spiritual programmes, and community economic initiatives.',
    website: 'https://divyabharat.at/',
    countries: ['AT'],
    cities: ['Vienna'],
    category: 'cultural',
    tags: ['culture', 'spiritual', 'Vienna'],
  },
  {
    id: 'oig-at',
    name: 'Austro-Indian Association',
    description:
      'Fosters cultural, economic, scientific, and technological ties between Austria and India through lectures, concerts, and exhibitions.',
    website: 'https://www.austriaindia.org/',
    countries: ['AT'],
    cities: ['Vienna'],
    category: 'professional',
    tags: ['bilateral', 'business', 'culture'],
  },
  {
    id: 'gopio-intl',
    name: 'GOPIO International',
    description:
      'Global organisation of People of Indian Origin — coordinates chapters across five continents including multiple European countries.',
    website: 'https://www.gopio.net/',
    countries: ['EU', 'NL', 'DE', 'FR', 'BE', 'CH'],
    category: 'umbrella',
    tags: ['global', 'PIO', 'chapters', 'network'],
  },
  {
    id: 'sanatana-dharma-way',
    name: 'Sanātana Dharma Way',
    description:
      'European initiative connecting diaspora families with authentic dharmic living, learning, and community resources.',
    website: 'https://sanatanadharmaway.eu/',
    countries: ['NL', 'CH', 'DE', 'EU'],
    category: 'religious',
    tags: ['dharma', 'education', 'Europe'],
  },
  {
    id: 'alps-vedas',
    name: 'Where the Alps Meet the Vedas',
    description:
      'Cultural bridge programme linking Indian spiritual heritage with European alpine communities.',
    website: 'https://brink-trick-47383861.figma.site/',
    countries: ['CH', 'AT', 'DE'],
    category: 'cultural',
    tags: ['Vedas', 'Switzerland', 'culture'],
  },
  {
    id: 'hindu-council-uk-eu',
    name: 'Hindu Council UK (reference for EU Hindus)',
    description:
      'Leading representative body for British Hindus; many EU temples and associations coordinate with similar models and resources.',
    website: 'https://www.hinducounciluk.org/',
    countries: ['EU', 'IE'],
    category: 'religious',
    tags: ['Hindu', 'representation', 'reference'],
  },
  {
    id: 'india-ireland',
    name: 'Embassy of India — Ireland',
    description:
      'Official diplomatic mission; consular services, cultural programmes, and pointers to registered Indian associations in Ireland.',
    website: 'https://www.indianembassy.ie/',
    countries: ['IE'],
    cities: ['Dublin'],
    category: 'civic',
    tags: ['embassy', 'consular', 'official'],
  },
  {
    id: 'india-spain',
    name: 'Embassy of India — Spain',
    description:
      'Consular and cultural outreach for Indians in Spain; maintains lists of community contacts and national-day celebrations.',
    website: 'https://www.indembassy.es/',
    countries: ['ES'],
    cities: ['Madrid'],
    category: 'civic',
    tags: ['embassy', 'consular', 'official'],
  },
  {
    id: 'india-sweden',
    name: 'Embassy of India — Sweden',
    description:
      'Supports the Indian diaspora in Sweden and the Nordic region with consular services and bilateral cultural events.',
    website: 'https://www.indianembassy.se/',
    countries: ['SE', 'NO', 'FI', 'DK'],
    category: 'civic',
    tags: ['embassy', 'Nordic', 'consular'],
  },
  {
    id: 'india-poland',
    name: 'Embassy of India — Poland',
    description:
      'Diplomatic mission covering Poland and community outreach for the growing Indian professional diaspora in Central Europe.',
    website: 'https://www.indianembassy.pl/',
    countries: ['PL', 'CZ'],
    category: 'civic',
    tags: ['embassy', 'Central Europe', 'consular'],
  },
  {
    id: 'india-portugal',
    name: 'Embassy of India — Portugal',
    description:
      'Consular services and cultural diplomacy for Indians in Portugal and Lusophone connections.',
    website: 'https://www.indembassy.pt/',
    countries: ['PT'],
    cities: ['Lisbon'],
    category: 'civic',
    tags: ['embassy', 'consular', 'official'],
  },
];

export function getCountryName(code: EuCountryCode): string {
  return EU_COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export function getCategoryLabel(category: CommunityCategory): string {
  return COMMUNITY_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function filterCommunities(options: {
  query: string;
  countries: EuCountryCode[];
  categories: CommunityCategory[];
}): IndianCommunity[] {
  const normalizedQuery = options.query.trim().toLowerCase();

  return INDIAN_COMMUNITIES.filter((community) => {
    const matchesCountry =
      options.countries.length === 0 ||
      community.countries.some((c) => options.countries.includes(c));

    const matchesCategory =
      options.categories.length === 0 || options.categories.includes(community.category);

    if (!matchesCountry || !matchesCategory) return false;

    if (!normalizedQuery) return true;

    const haystack = [
      community.name,
      community.description,
      community.website,
      ...(community.cities ?? []),
      ...community.tags,
      ...community.countries.map(getCountryName),
      getCategoryLabel(community.category),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function countByCountry(communities: IndianCommunity[]): Record<EuCountryCode, number> {
  const counts = {} as Record<EuCountryCode, number>;
  for (const { code } of EU_COUNTRIES) {
    counts[code] = 0;
  }
  for (const community of communities) {
    for (const code of community.countries) {
      counts[code] = (counts[code] ?? 0) + 1;
    }
  }
  return counts;
}
