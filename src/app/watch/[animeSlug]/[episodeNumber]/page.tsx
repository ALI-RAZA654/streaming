'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { EpisodeSidebar } from '@/components/watch/EpisodeSidebar';
import { Comments } from '@/components/watch/Comments';
import { MOCK_ANIME } from '@/lib/mockData';
import { ChevronLeft, ChevronRight, Bookmark, Heart, Share2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function WatchPage({
  params,
}: {
  params: { animeSlug: string; episodeNumber: string };
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const epNum = parseInt(params.episodeNumber, 10) || 1;

  const anime = MOCK_ANIME.find((a) => a.slug === params.animeSlug) || MOCK_ANIME[0];
  const currentEpisode =
    anime.episodes.find((e) => e.number === epNum) || anime.episodes[0];

  const handleNextEpisode = () => {
    if (epNum < anime.episodes.length) {
      router.push(`/watch/${anime.slug}/${epNum + 1}`);
      showToast(`Loading Episode ${epNum + 1}`, 'info');
    }
  };

  const handlePrevEpisode = () => {
    if (epNum > 1) {
      router.push(`/watch/${anime.slug}/${epNum - 1}`);
      showToast(`Loading Episode ${epNum - 1}`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <Link
          href={`/anime/${anime.slug}`}
          className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to {anime.title}
        </Link>
        <span className="text-slate-500">
          Stream Server: <strong className="text-emerald-400">Online 1080p</strong>
        </span>
      </div>

      {/* Main Grid: Video Player + Episode Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Player + Meta + Comments */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer
            videoUrl={currentEpisode.videoUrl}
            title={`${anime.title} - ${currentEpisode.title}`}
            episodeNumber={epNum}
            onNextEpisode={handleNextEpisode}
            onPrevEpisode={handlePrevEpisode}
            hasNextEpisode={epNum < anime.episodes.length}
          />

          {/* Episode Info Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Ep {epNum}: {currentEpisode.title}
                </h1>
                <p className="text-xs text-indigo-400 font-medium mt-1">
                  {anime.title} • Released {currentEpisode.airDate}
                </p>
              </div>

              {/* Prev / Next Episode Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevEpisode}
                  disabled={epNum <= 1}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs border border-slate-800 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev Ep
                </button>

                <button
                  onClick={handleNextEpisode}
                  disabled={epNum >= anime.episodes.length}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1 shadow-lg"
                >
                  Next Ep <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentEpisode.description}
            </p>
          </div>

          {/* Episode Comments */}
          <Comments />
        </div>

        {/* Right Col: Episode Sidebar */}
        <div className="space-y-6">
          <EpisodeSidebar
            animeSlug={anime.slug}
            episodes={anime.episodes}
            currentEpisodeNumber={epNum}
          />
        </div>
      </div>
    </div>
  );
}
