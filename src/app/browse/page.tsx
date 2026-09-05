'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterSidebar } from '@/components/anime/FilterSidebar';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { MOCK_ANIME } from '@/lib/mockData';
import { FilterState } from '@/lib/types';
import { Compass, Filter, Film } from 'lucide-react';

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('q') || '',
    genre: searchParams.get('genre') || '',
    format: searchParams.get('format') || '',
    status: searchParams.get('status') || '',
    season: searchParams.get('season') || '',
    sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'popularity',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL searchParams change (e.g. clicking Movies in Navbar or back/forward)
  useEffect(() => {
    setFilters({
      search: searchParams.get('q') || '',
      genre: searchParams.get('genre') || '',
      format: searchParams.get('format') || '',
      status: searchParams.get('status') || '',
      season: searchParams.get('season') || '',
      sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'popularity',
    });
  }, [searchParams]);

  // Sync filters with URL
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const params = new URLSearchParams();
    if (updated.search) params.set('q', updated.search);
    if (updated.genre) params.set('genre', updated.genre);
    if (updated.format) params.set('format', updated.format);
    if (updated.status) params.set('status', updated.status);
    if (updated.sortBy && updated.sortBy !== 'popularity') params.set('sort', updated.sortBy);

    router.replace(`/browse?${params.toString()}`);
  };

  const handleReset = () => {
    const resetState: FilterState = {
      search: '',
      genre: '',
      format: '',
      status: '',
      season: '',
      sortBy: 'popularity',
    };
    setFilters(resetState);
    router.replace('/browse');
  };

  // Filter & Sort Logic
  const filteredAnime = MOCK_ANIME.filter((anime) => {
    if (
      filters.search &&
      !anime.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !anime.synopsis.toLowerCase().includes(filters.search.toLowerCase()) &&
      !anime.studio.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.genre && !anime.genres.includes(filters.genre)) {
      return false;
    }
    if (filters.format && anime.format !== filters.format) {
      return false;
    }
    if (filters.status && anime.status !== filters.status) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'latest') return b.releasedYear - a.releasedYear;
    if (filters.sortBy === 'title') return a.title.localeCompare(b.title);
    return b.popularity - a.popularity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            {filters.format === 'Movie' ? (
              <>
                <Film className="w-8 h-8 text-purple-400" /> Anime Movies & Features
              </>
            ) : (
              <>
                <Compass className="w-8 h-8 text-indigo-400" /> Browse Anime Library
              </>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {filters.format === 'Movie'
              ? 'Cinematic feature films, theatrical blockbusters, and high-budget OVAs.'
              : 'Discover thousands of titles filtered by genre, studio, format, and air status.'}
          </p>
        </div>

        {/* Mobile filter trigger */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-lg"
        >
          <Filter className="w-4 h-4" /> Filter Options
        </button>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={updateFilters}
            onReset={handleReset}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden">
            <FilterSidebar
              filters={filters}
              onFilterChange={updateFilters}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Grid Results */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between text-sm text-slate-400 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <span>
              Showing <strong className="text-white font-bold">{filteredAnime.length}</strong> results
            </span>
            <div className="flex items-center gap-2">
              {filters.format && (
                <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                  Format: {filters.format}
                </span>
              )}
              {filters.genre && (
                <span className="px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  Genre: {filters.genre}
                </span>
              )}
            </div>
          </div>

          <AnimeGrid animes={filteredAnime} />
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading catalog...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
