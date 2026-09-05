import React from 'react';
import { Anime } from '@/lib/types';
import { AnimeCard } from './AnimeCard';

interface AnimeGridProps {
  animes: Anime[];
  emptyMessage?: string;
}

export const AnimeGrid: React.FC<AnimeGridProps> = ({
  animes,
  emptyMessage = 'No anime found matching your criteria.',
}) => {
  if (animes.length === 0) {
    return (
      <div className="py-20 text-center rounded-2xl bg-slate-900/30 border border-slate-800">
        <p className="text-slate-400 text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
};
