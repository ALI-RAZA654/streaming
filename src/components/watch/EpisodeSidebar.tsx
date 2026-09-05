'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Search, CheckCircle2 } from 'lucide-react';
import { Episode } from '@/lib/types';

interface EpisodeSidebarProps {
  animeSlug: string;
  episodes: Episode[];
  currentEpisodeNumber: number;
}

export const EpisodeSidebar: React.FC<EpisodeSidebarProps> = ({
  animeSlug,
  episodes,
  currentEpisodeNumber,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = episodes.filter(
    (ep) =>
      ep.number.toString().includes(filterQuery) ||
      ep.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-base text-white">Episodes ({episodes.length})</h3>
        <div className="relative w-36">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Find ep..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg pl-8 pr-2 py-1.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Episode List */}
      <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1 no-scrollbar">
        {filtered.map((ep) => {
          const isActive = ep.number === currentEpisodeNumber;
          return (
            <Link
              key={ep.id}
              href={`/watch/${animeSlug}/${ep.number}`}
              className={`group flex items-center gap-3 p-2 rounded-xl border transition-all ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500/80 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300 hover:text-white'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-24 rounded-lg overflow-hidden shrink-0 bg-black">
                <Image
                  src={ep.thumbnail}
                  alt={ep.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    isActive ? 'bg-indigo-950/60' : 'bg-black/40 group-hover:bg-black/20'
                  }`}
                >
                  {isActive ? (
                    <Play className="w-4 h-4 fill-white text-white" />
                  ) : (
                    <span className="text-xs font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                      Ep {ep.number}
                    </span>
                  )}
                </div>
              </div>

              {/* Episode Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-400' : 'text-white'}`}>
                    Ep {ep.number}: {ep.title}
                  </h4>
                  {ep.isFiller && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      Filler
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{ep.duration}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
