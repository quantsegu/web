import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Globe, MapPin, Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  COMMUNITY_CATEGORIES,
  EU_COUNTRIES,
  type CommunityCategory,
  type EuCountryCode,
  type IndianCommunity,
  countByCountry,
  filterCommunities,
  getCategoryLabel,
  getCountryName,
  INDIAN_COMMUNITIES,
} from '../lib/indianCommunities';

const PRIORITY_COUNTRIES: EuCountryCode[] = ['NL', 'DE', 'CH', 'BE'];

function CommunityCard({ community, index }: { community: IndianCommunity; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      className="bjp-card p-5 flex flex-col h-full hover:border-saffron-500/40 transition-colors"
    >
      <motion.div className="mb-3">
        <span className="text-xs font-medium uppercase tracking-wide text-saffron-400">
          {getCategoryLabel(community.category)}
        </span>
      </motion.div>

      <h3 className="text-lg font-bold text-white mb-2">{community.name}</h3>
      <p className="text-gray-300 text-sm mb-4 flex-grow leading-relaxed">{community.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {community.countries.map((code) => (
          <span key={code} className="badge-location">
            {EU_COUNTRIES.find((c) => c.code === code)?.flag}{' '}
            {getCountryName(code)}
          </span>
        ))}
      </div>

      {community.cities && community.cities.length > 0 && (
        <p className="flex items-start gap-1.5 text-xs text-gray-400 mb-4">
          <MapPin size={14} className="mt-0.5 shrink-0 text-saffron-400" />
          <span>{community.cities.join(' · ')}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {community.tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={community.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center text-sm font-medium text-saffron-300 hover:text-white transition-colors"
      >
        Visit website
        <ExternalLink size={15} className="ml-1.5" />
      </a>
    </motion.article>
  );
}

export default function IndianCommunities() {
  const [query, setQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<EuCountryCode[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CommunityCategory[]>([]);

  const filtered = useMemo(
    () =>
      filterCommunities({
        query,
        countries: selectedCountries,
        categories: selectedCategories,
      }),
    [query, selectedCountries, selectedCategories],
  );

  const countryCounts = useMemo(() => countByCountry(filtered), [filtered]);

  const toggleCountry = (code: EuCountryCode) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const toggleCategory = (value: CommunityCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCountries([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters =
    query.trim() !== '' || selectedCountries.length > 0 || selectedCategories.length > 0;

  const sortedCountries = useMemo(() => {
    const priority = EU_COUNTRIES.filter((c) => PRIORITY_COUNTRIES.includes(c.code));
    const rest = EU_COUNTRIES.filter((c) => !PRIORITY_COUNTRIES.includes(c.code));
    return [...priority, ...rest];
  }, []);

  return (
    <motion.div className="min-h-screen w-full bg-[#050108]">
      <Navbar />

      <section className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="text-saffron-400 text-sm font-semibold tracking-widest uppercase mb-2">
              भारतीय समुदाय · Indian Diaspora
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Indian Communities in Europe
            </h1>
            <p className="text-saffron-100 max-w-3xl mx-auto text-lg">
              Search temples, cultural associations, diaspora councils, and community organisations
              across the Netherlands, Germany, Switzerland, Belgium, and the wider EU.
            </p>
            <div className="section-divider" />
          </motion.div>

          {/* Search */}
          <div className="max-w-3xl mx-auto mb-8">
            <label htmlFor="community-search" className="sr-only">
              Search communities
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron-400"
                size={20}
                aria-hidden
              />
              <input
                id="community-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, city, country, or topic…"
                className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-bjp-navy-light/80 border border-saffron-500/25 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 focus:border-saffron-500/50"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Country filters */}
          <div className="mb-6">
            <p className="text-sm font-medium text-saffron-300 mb-3 flex items-center gap-2">
              <Globe size={16} />
              Filter by country
            </p>
            <div className="flex flex-wrap gap-2">
              {sortedCountries.map(({ code, name, flag }) => {
                const active = selectedCountries.includes(code);
                const count = countryCounts[code];
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => toggleCountry(code)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      active
                        ? 'bg-gradient-to-r from-saffron-500 to-bjp-green text-white border-transparent shadow-md'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-saffron-500/40 hover:text-white'
                    }`}
                    aria-pressed={active}
                  >
                    <span aria-hidden>{flag}</span>
                    <span>{name}</span>
                    <span
                      className={`text-xs tabular-nums ${active ? 'text-white/90' : 'text-gray-500'}`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category filters */}
          <div className="mb-8">
            <p className="text-sm font-medium text-saffron-300 mb-3">Filter by type</p>
            <div className="flex flex-wrap gap-2">
              {COMMUNITY_CATEGORIES.map(({ value, label }) => {
                const active = selectedCategories.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleCategory(value)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-all border ${
                      active
                        ? 'bg-saffron-500/20 text-saffron-200 border-saffron-500/50'
                        : 'bg-transparent text-gray-400 border-white/10 hover:text-saffron-200 hover:border-saffron-500/30'
                    }`}
                    aria-pressed={active}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-saffron-100 text-sm">
              Showing <span className="font-semibold text-white">{filtered.length}</span> of{' '}
              {INDIAN_COMMUNITIES.length} listings
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-saffron-300 hover:text-white transition-colors"
              >
                <X size={14} />
                Clear all filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bjp-card">
              <p className="text-white text-lg font-medium mb-2">No communities match your search</p>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Try a different country, category, or keyword — or clear filters to see all listings.
              </p>
              <button type="button" onClick={clearFilters} className="btn-primary">
                Show all communities
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((community, index) => (
                <CommunityCard key={community.id} community={community} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black/30 border-t border-saffron-800/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-3">Missing a community?</h2>
          <p className="text-saffron-100 text-sm mb-6">
            This directory is curated for the Shreshti diaspora network. If you represent an Indian
            association, temple, or organisation in Europe, we welcome your submission.
          </p>
          <a href="/#contact" className="btn-primary">
            Suggest a listing
          </a>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
