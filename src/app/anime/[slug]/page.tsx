'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Play,
  Star,
  Bookmark,
  Heart,
  Share2,
  Tv,
  Calendar,
  Layers,
  Award,
  Sparkles,
} from 'lucide-react';
import { MOCK_ANIME } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';
import { AnimeRow } from '@/components/anime/AnimeRow';
import { ShareModal } from '@/components/anime/ShareModal';
import { useToast } from '@/components/ui/Toast';

export default function AnimeDetailsPage({ params }: { params: { slug: string } }) {
  const { showToast } = useToast();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'episodes' | 'details'>('episodes');

  const anime = MOCK_ANIME.find((a) => a.slug === params.slug) || MOCK_ANIME[0];

  const handleToggleWatchlist = () => {
    setInWatchlist(!inWatchlist);
    showToast(
      !inWatchlist
        ? `Added "${anime.title}" to your Watchlist`
        : `Removed "${anime.title}" from your Watchlist`,
      'info'
    );
  };

  const handleToggleFavorites = () => {
    setInFavorites(!inFavorites);
    showToast(
      !inFavorites
        ? `Added "${anime.title}" to Favorites`
        : `Removed "${anime.title}" from Favorites`,
      'success'
    );
  };

  const relatedAnime = MOCK_ANIME.filter(
    (a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g))
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Banner Backdrop Header */}
      <div className="relative w-full h-[450px] md:h-[520px] bg-slate-950 overflow-hidden">
        <Image
          src={anime.bannerImage}
          alt={anime.title}
          fill
          priority
          className="object-cover filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10 space-y-10">
        {/* Top Info Layout: Poster + Details */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Card */}
          <div className="w-48 sm:w-64 shrink-0 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl space-y-3 mx-auto md:mx-0">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden">
              <Image src={anime.posterImage} alt={anime.title} fill className="object-cover" />
            </div>

            <Link
              href={`/watch/${anime.slug}/1`}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" /> Start Episode 1
            </Link>
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-5 text-white">
            {/* Title & Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="cyan">{anime.format}</Badge>
                <Badge variant="secondary">{anime.status}</Badge>
                <Badge variant="accent">{anime.studio}</Badge>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {anime.title}
              </h1>
              {anime.japaneseTitle && (
                <p className="text-sm text-indigo-400 font-medium">{anime.japaneseTitle}</p>
              )}
            </div>

            {/* Score & Rank Banner */}
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md max-w-xl">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <div>
                  <span className="text-xl font-extrabold text-white">{anime.rating}</span>
                  <span className="text-xs text-slate-400 block">{anime.scoreCount.toLocaleString()} votes</span>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-800" />

              <div>
                <span className="text-xs text-slate-400 block font-medium">Ranked</span>
                <span className="text-base font-bold text-indigo-400">#{anime.rank}</span>
              </div>

              <div className="h-8 w-px bg-slate-800" />

              <div>
                <span className="text-xs text-slate-400 block font-medium">Popularity</span>
                <span className="text-base font-bold text-cyan-400">#{anime.popularity.toLocaleString()}</span>
              </div>
            </div>

            {/* Genres Tag Cloud */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">
                Genres:
              </span>
              {anime.genres.map((genre) => (
                <Link
                  key={genre}
                  href={`/browse?genre=${genre}`}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {anime.synopsis}
            </p>

            {/* Action Toolbar */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                onClick={handleToggleWatchlist}
                className={`px-5 py-3 rounded-xl border font-semibold text-sm flex items-center gap-2 transition-all ${
                  inWatchlist
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                onClick={handleToggleFavorites}
                className={`px-5 py-3 rounded-xl border font-semibold text-sm flex items-center gap-2 transition-all ${
                  inFavorites
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Heart className="w-4 h-4" />
                {inFavorites ? 'Favorited' : 'Favorite'}
              </button>

              <button
                onClick={() => setShareOpen(true)}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Episode Grid Section */}
        <div className="space-y-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Episode List ({anime.episodes.length})
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Audio:</span>
              <Badge variant="cyan">Subbed</Badge>
              <Badge variant="secondary">Dubbed</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {anime.episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${anime.slug}/${ep.number}`}
                className="group p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 transition-all text-center flex flex-col items-center gap-1.5 hover:scale-105"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 group-hover:bg-indigo-600 flex items-center justify-center text-xs font-bold text-white transition-colors">
                  {ep.number}
                </div>
                <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate max-w-full">
                  Ep {ep.number}
                </span>
                <span className="text-[10px] text-slate-500">{ep.duration}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Anime Row */}
        <AnimeRow
          title="More Like This"
          subtitle="Recommended titles based on genres and themes"
          animes={relatedAnime}
        />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={anime.title}
      />
    </div>
  );
}
