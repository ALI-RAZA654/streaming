'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MOCK_USER, MOCK_ANIME } from '@/lib/mockData';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { User, Clock, Tv, Star, Shield, Award, Settings, Heart, Bookmark, History } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Hero Banner Header */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="h-48 sm:h-64 relative w-full bg-indigo-950">
          <Image src={MOCK_USER.banner} alt="Banner" fill className="object-cover filter brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={MOCK_USER.avatar}
              alt={MOCK_USER.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-950 shadow-2xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{MOCK_USER.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
                  Lvl {MOCK_USER.level} Otaku
                </span>
              </div>
              <p className="text-sm text-indigo-400 font-medium">@{MOCK_USER.username}</p>
              <p className="text-xs text-slate-400">Member since {MOCK_USER.joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-8">
          {/* User Watch Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Tv className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Episodes Watched</p>
              <p className="text-2xl font-black text-white">{MOCK_USER.episodesWatched}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Hours Streamed</p>
              <p className="text-2xl font-black text-white">{MOCK_USER.hoursWatched} hrs</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                <Star className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Favorite Genre</p>
              <p className="text-base font-bold text-white truncate">{MOCK_USER.favoriteGenre}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">XP Progress</p>
              <p className="text-2xl font-black text-white">{MOCK_USER.xp} XP</p>
            </div>
          </div>

          {/* User Favorite Anime Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" /> Favorites Spotlight
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MOCK_ANIME.slice(0, 4).map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Settings Tab */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-2xl">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Account Preferences
          </h2>
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                defaultValue={MOCK_USER.name}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={MOCK_USER.email}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => showToast('Profile settings saved!', 'success')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
