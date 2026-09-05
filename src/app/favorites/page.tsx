'use client';

import React from 'react';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { MOCK_ANIME } from '@/lib/mockData';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const favorites = MOCK_ANIME.filter((a) => a.popular || a.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-400" /> Favorite Anime Collection
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Your curated hall of fame. Quick access to your highest-rated shows.
        </p>
      </div>

      <AnimeGrid
        animes={favorites}
        emptyMessage="You haven't saved any anime to your favorites yet."
      />
    </div>
  );
}
