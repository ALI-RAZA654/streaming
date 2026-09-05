'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Anime } from '@/lib/types';
import { AnimeCard } from './AnimeCard';

interface AnimeRowProps {
  title: string;
  subtitle?: string;
  animes: Anime[];
  viewAllHref?: string;
  showRankNumbers?: boolean;
}

export const AnimeRow: React.FC<AnimeRowProps> = ({
  title,
  subtitle,
  animes,
  viewAllHref,
  showRankNumbers = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="my-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-400 inline-block shadow-md shadow-indigo-500/50" />
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors mr-2 group"
            >
              See All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 transition-all shadow-md active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 transition-all shadow-md active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Cards List */}
      <div
        ref={scrollRef}
        className="flex gap-4.5 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 pb-4"
      >
        {animes.map((anime, index) => (
          <div key={anime.id} className="w-[165px] sm:w-[205px] md:w-[225px] shrink-0">
            <AnimeCard anime={anime} rankNumber={showRankNumbers ? index + 1 : undefined} />
          </div>
        ))}
      </div>
    </section>
  );
};
