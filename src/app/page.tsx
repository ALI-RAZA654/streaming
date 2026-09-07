import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSlider } from '@/components/home/HeroSlider';
import { AnimeRow } from '@/components/anime/AnimeRow';
import { MOCK_ANIME, MOCK_HISTORY } from '@/lib/mockData';
import { Sparkles, Flame, Tv, Film, Clock, PlayCircle, Play, ShieldCheck, Zap, Compass } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function HomePage() {
  const trending = MOCK_ANIME.filter((a) => a.trending);
  const popular = MOCK_ANIME.filter((a) => a.popular);
  const latest = MOCK_ANIME.filter((a) => a.latest);
  const ongoing = MOCK_ANIME.filter((a) => a.status === 'Ongoing');
  const movies = MOCK_ANIME.filter((a) => a.format === 'Movie' || a.format === 'OVA');

  const categories = [
    { label: 'All Catalog', href: '/browse' },
    { label: '🎬 Feature Movies', href: '/movies' },
    { label: '🔥 Trending Top 10', href: '/browse?sort=popularity' },
    { label: '⚡ Cyberpunk & Sci-Fi', href: '/browse?genre=Cyberpunk' },
    { label: '⚔️ Action & Adventure', href: '/browse?genre=Action' },
    { label: '🔮 Fantasy Magic', href: '/browse?genre=Fantasy' },
    { label: '🤖 Mecha Warfare', href: '/browse?genre=Mecha' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Carousel Banner */}
      <HeroSlider animes={MOCK_ANIME} />

      {/* Category Pills Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-30">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-2 px-1 bg-white/80 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-xl">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-extrabold whitespace-nowrap transition-all duration-200 shadow-sm hover:scale-105"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Highlights & Features Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 p-2">
            <div className="p-3 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Stream Quality</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">1080p Ultra HD</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-3 rounded-2xl bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Fast Simulcast</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">1hr After Japan</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-3 rounded-2xl bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Multi-Audio</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Subbed & Dubbed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-3 rounded-2xl bg-rose-600/10 dark:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">VIP Premium</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Zero Advertisements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Watching Row (Streaming Favorite Feature) */}
      {MOCK_HISTORY.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Continue Watching
            </h2>
            <Link
              href="/history"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Watch History →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_HISTORY.slice(0, 3).map((item) => {
              const progressPercent = Math.round(
                (item.progressSeconds / item.durationSeconds) * 100
              );

              return (
                <div
                  key={item.anime.id}
                  className="group relative flex gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 backdrop-blur-md shadow-md dark:shadow-xl transition-all"
                >
                  <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-slate-950 flex-shrink-0">
                    <Image
                      src={item.episode.thumbnail || item.anime.bannerImage}
                      alt={item.anime.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/watch/${item.anime.slug}/${item.episode.number}`}
                        className="p-2 rounded-full bg-indigo-600 text-white shadow-lg"
                      >
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </Link>
                    </div>
                    {/* Progress overlay bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                        {item.anime.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Ep {item.episode.number}: {item.episode.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{progressPercent}% watched</span>
                      <Link
                        href={`/watch/${item.anime.slug}/${item.episode.number}`}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Resume →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Netflix / AniWatch Top 10 Trending Carousel */}
      <div className="max-w-7xl mx-auto">
        <AnimeRow
          title="Top 10 Trending This Week"
          subtitle="The most streamed shows across the network"
          animes={trending.length > 0 ? trending : MOCK_ANIME}
          viewAllHref="/browse?sort=popularity"
          showRankNumbers={true}
        />

        {/* Feature Movies Row */}
        <AnimeRow
          title="Feature Anime Movies"
          subtitle="High-budget cinematic blockbusters, theatrical films, and OVAs"
          animes={movies.length > 0 ? movies : MOCK_ANIME}
          viewAllHref="/movies"
        />

        {/* Latest Releases */}
        <AnimeRow
          title="Latest Episode Releases"
          subtitle="Freshly updated episodes ready to watch in 1080p"
          animes={latest.length > 0 ? latest : MOCK_ANIME}
          viewAllHref="/browse?sort=latest"
        />

        {/* Popular All Time */}
        <AnimeRow
          title="Fan Favorites & All-Time Masterworks"
          subtitle="Top community rated masterpiece series"
          animes={popular.length > 0 ? popular : MOCK_ANIME}
          viewAllHref="/browse?sort=rating"
        />

        {/* Currently Airing */}
        <AnimeRow
          title="Currently Airing Seasonal Series"
          subtitle="Ongoing weekly broadcasts directly from Japan"
          animes={ongoing.length > 0 ? ongoing : MOCK_ANIME}
          viewAllHref="/browse?status=Ongoing"
        />
      </div>
    </div>
  );
}
