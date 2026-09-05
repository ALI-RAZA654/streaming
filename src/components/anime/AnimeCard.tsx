'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Play, Bookmark, Heart, Tv, Film } from 'lucide-react';
import { Anime } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

interface AnimeCardProps {
  anime: Anime;
  priority?: boolean;
  rankNumber?: number; // Optional Netflix/AniWatch Top 10 rank overlay
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, priority = false, rankNumber }) => {
  const { showToast } = useToast();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInWatchlist(!inWatchlist);
    showToast(
      !inWatchlist
        ? `Added "${anime.title}" to Watchlist`
        : `Removed "${anime.title}" from Watchlist`,
      'info'
    );
  };

  const toggleFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInFavorites(!inFavorites);
    showToast(
      !inFavorites
        ? `Saved "${anime.title}" to Favorites`
        : `Removed "${anime.title}" from Favorites`,
      'success'
    );
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden shadow-xl hover:shadow-[0_8px_30px_rgba(99,102,241,0.25)] hover:border-indigo-500/50 transition-all duration-300"
    >
      {/* Poster Image Container */}
      <Link href={`/anime/${anime.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <Image
          src={anime.posterImage}
          alt={anime.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Numeric Rank Badge (Top 10 Overlay) */}
        {rankNumber !== undefined && (
          <div className="absolute bottom-2 left-2 z-20 font-black text-6xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] stroke-black tracking-tighter select-none pointer-events-none opacity-90 group-hover:text-indigo-400 transition-colors">
            #{rankNumber}
          </div>
        )}

        {/* Top Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <Badge variant="secondary" className="bg-slate-950/85 backdrop-blur-md border-slate-700/80 text-amber-300 gap-1 text-xs shadow-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {anime.rating}
          </Badge>

          <Badge
            variant={anime.format === 'Movie' ? 'cyan' : 'primary'}
            className={`backdrop-blur-md text-xs font-bold shadow-md ${
              anime.format === 'Movie'
                ? 'bg-purple-900/90 text-purple-200 border-purple-500/40'
                : 'bg-indigo-900/90 text-indigo-200 border-indigo-500/40'
            }`}
          >
            {anime.format}
          </Badge>
        </div>

        {/* Quality Tag */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md tracking-wider">
            HD 1080P
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center z-20">
          <Link
            href={`/watch/${anime.slug}/1`}
            className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 hover:scale-110 active:scale-95 transition-transform mb-3 border border-white/20"
          >
            <Play className="w-6 h-6 fill-white translate-x-0.5" />
          </Link>

          <span className="text-xs font-bold text-white mb-3">Watch Ep 1</span>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleWatchlist}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                inWatchlist
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/40'
                  : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
              title="Add to Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFavorites}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                inFavorites
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/40'
                  : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
              title="Add to Favorites"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>

      {/* Footer Info */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between bg-slate-900/60">
        <div>
          <Link href={`/anime/${anime.slug}`}>
            <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {anime.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{anime.releasedYear}</span>
            <span>•</span>
            <span>{anime.episodesCount > 1 ? `${anime.episodesCount} Eps` : 'Movie'}</span>
            <span>•</span>
            <span className="text-slate-300 font-medium truncate">{anime.studio}</span>
          </div>
        </div>

        {/* Genres tag pill list */}
        <div className="flex items-center gap-1.5 overflow-hidden pt-1">
          {anime.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
