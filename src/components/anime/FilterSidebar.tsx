'use client';

import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { FilterState } from '@/lib/types';
import { MOCK_GENRES, MOCK_STUDIOS } from '@/lib/mockData';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-slate-900/60 dark:bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-6 shrink-0 backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          Filter & Sort
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Title, character, studio..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Sort Results
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
        >
          <option value="popularity">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="latest">Latest Release</option>
          <option value="title">Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Format */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Format / Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['', 'TV', 'Movie', 'OVA'].map((fmt) => (
            <button
              key={fmt || 'All'}
              onClick={() => onFilterChange({ format: fmt })}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center justify-between ${
                filters.format === fmt
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{fmt || 'All Formats'}</span>
              {filters.format === fmt && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Airing Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="Ongoing">Currently Airing</option>
          <option value="Completed">Finished Airing</option>
        </select>
      </div>

      {/* Genres Pill List */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Genre
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
          <button
            onClick={() => onFilterChange({ genre: '' })}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              !filters.genre
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          {MOCK_GENRES.map((g) => (
            <button
              key={g}
              onClick={() => onFilterChange({ genre: filters.genre === g ? '' : g })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filters.genre === g
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
