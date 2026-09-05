'use client';

import React, { useState } from 'react';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { MOCK_ANIME } from '@/lib/mockData';
import { WatchStatus } from '@/lib/types';
import { Bookmark, Play, CheckCircle2, Clock, PauseCircle, XCircle } from 'lucide-react';

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<WatchStatus>('Watching');

  // Filter mock anime depending on status tab
  const filteredList = MOCK_ANIME.filter((anime) => {
    if (activeTab === 'Watching') return anime.status === 'Ongoing';
    if (activeTab === 'Completed') return anime.status === 'Completed';
    if (activeTab === 'Plan to Watch') return anime.rating >= 9.0;
    return anime.status === 'Ongoing';
  });

  const tabs: { name: WatchStatus; icon: React.ReactNode; count: number }[] = [
    { name: 'Watching', icon: <Play className="w-3.5 h-3.5" />, count: 4 },
    { name: 'Plan to Watch', icon: <Clock className="w-3.5 h-3.5" />, count: 12 },
    { name: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5" />, count: 28 },
    { name: 'On Hold', icon: <PauseCircle className="w-3.5 h-3.5" />, count: 2 },
    { name: 'Dropped', icon: <XCircle className="w-3.5 h-3.5" />, count: 1 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-purple-400" /> My Personal Watchlist
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Organize and track your current anime shows, completed masterpieces, and planned titles.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs border flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      <AnimeGrid
        animes={filteredList}
        emptyMessage={`No anime titles currently in your "${activeTab}" list.`}
      />
    </div>
  );
}
