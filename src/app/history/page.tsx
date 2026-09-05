'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_HISTORY } from '@/lib/mockData';
import { History, Play, Trash2, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function HistoryPage() {
  const { showToast } = useToast();
  const [historyItems, setHistoryItems] = useState(MOCK_HISTORY);

  const handleClearHistory = () => {
    setHistoryItems([]);
    showToast('Watch history cleared', 'info');
  };

  const handleRemoveItem = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.anime.id !== id));
    showToast('Removed from history', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <History className="w-8 h-8 text-cyan-400" /> Watch History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pick up right where you left off across all your devices.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All History
          </button>
        )}
      </div>

      {/* History Items List */}
      {historyItems.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400">
          Your watch history is empty. Start streaming anime!
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => {
            const percentage = Math.round(
              (item.progressSeconds / item.durationSeconds) * 100
            );

            return (
              <div
                key={item.anime.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md"
              >
                <div className="flex items-center gap-4">
                  {/* Poster */}
                  <div className="relative aspect-video w-32 sm:w-40 rounded-xl overflow-hidden bg-black shrink-0">
                    <Image
                      src={item.anime.bannerImage}
                      alt={item.anime.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Link
                        href={`/watch/${item.anime.slug}/${item.episode.number}`}
                        className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg"
                      >
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <Link
                      href={`/anime/${item.anime.slug}`}
                      className="font-bold text-base text-white hover:text-indigo-400 transition-colors"
                    >
                      {item.anime.title}
                    </Link>
                    <p className="text-xs text-indigo-400 font-semibold">
                      Episode {item.episode.number}: {item.episode.title}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Watched {item.watchedAt}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-48 sm:w-64 pt-2">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>{formatTime(item.progressSeconds)}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.anime.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors self-end sm:self-center"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
