'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Film, Play, Star, Sparkles, Filter, Info, Bookmark, Clock, Calendar } from 'lucide-react';
import { MOCK_ANIME } from '@/lib/mockData';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function MoviesPage() {
  const { showToast } = useToast();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'latest' | 'popularity'>('rating');

  // Filter movies & OVAs
  const allMovies = MOCK_ANIME.filter(
    (a) => a.format === 'Movie' || a.format === 'OVA' || a.genres.includes('Movie')
  );

  // Genre options
  const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Fantasy', 'Slice of Life'];

  const filteredMovies = allMovies
    .filter((movie) => {
      if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latest') return b.releasedYear - a.releasedYear;
      return b.popularity - a.popularity;
    });

  const featuredMovie = allMovies[0] || MOCK_ANIME[4];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Featured Movie Hero Spotlight */}
      {featuredMovie && (
        <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl min-h-[380px] flex items-end p-6 sm:p-10 group">
          {/* Background image */}
          <Image
            src={featuredMovie.bannerImage}
            alt={featuredMovie.title}
            fill
            priority
            className="object-cover object-center filter brightness-105 contrast-[1.08] group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent max-w-2xl" />

          {/* Content */}
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="cyan" className="bg-purple-600/30 text-purple-300 border-purple-500/40 gap-1.5 font-bold">
                <Film className="w-3.5 h-3.5 text-purple-400" /> THEATRICAL FEATURE
              </Badge>
              <Badge variant="secondary" className="gap-1 bg-slate-900/80 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {featuredMovie.rating} Score
              </Badge>
              <span className="text-xs text-slate-300 font-medium px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">
                {featuredMovie.releasedYear}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {featuredMovie.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 line-clamp-2 leading-relaxed">
              {featuredMovie.synopsis}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/watch/${featuredMovie.slug}/1`}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" /> Watch Feature Film
              </Link>
              <Link
                href={`/anime/${featuredMovie.slug}`}
                className="px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold backdrop-blur-md transition-colors flex items-center gap-2"
              >
                <Info className="w-4 h-4 text-purple-400" /> Movie Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Film className="w-6 h-6 text-purple-400" /> Theatrical & Feature Films Catalog
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Stream full-length anime feature films in 1080p Ultra HD with multi-language audio.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 pl-2 font-medium">Sort:</span>
          {(['rating', 'latest', 'popularity'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                sortBy === s
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all duration-200 border ${
              selectedGenre === g
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30 scale-105'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span>
            Showing <strong className="text-white font-bold">{filteredMovies.length}</strong> Movies
          </span>
          {selectedGenre !== 'All' && (
            <span className="text-purple-400 font-semibold">Filtered by: {selectedGenre}</span>
          )}
        </div>

        <AnimeGrid animes={filteredMovies} />
      </div>
    </div>
  );
}
