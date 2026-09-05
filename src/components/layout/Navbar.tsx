'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Bookmark,
  History,
  User,
  LogOut,
  SlidersHorizontal,
  Compass,
  Film,
  Heart,
  Home,
  Play,
  Star,
  Tv,
  Radio,
} from 'lucide-react';
import { MOCK_USER, MOCK_ANIME } from '@/lib/mockData';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Browse', href: '/browse', icon: Compass },
    { name: 'Movies', href: '/movies', icon: Film },
    { name: 'Watchlist', href: '/watchlist', icon: Bookmark },
    { name: 'History', href: '/history', icon: History },
  ];

  // Instant live search filter results
  const searchResults = searchQuery.trim()
    ? MOCK_ANIME.filter(
        (anime) =>
          anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          anime.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
          anime.studio.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/90 shadow-2xl backdrop-blur-xl border-b border-slate-800/80 py-3'
            : 'bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo with Streaming Live Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/Screenshot 2026-09-03 013825.png"
                alt="SEKKAIICHI STREAMING"
                width={44}
                height={44}
                className="rounded-full group-hover:scale-105 transition-transform duration-300 ring-2 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-wider text-white">
                  SEKKAI<span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">ICHI</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white tracking-widest hidden sm:inline-block">
                  STREAM
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wide hidden sm:block">
                HD Anime & Movie Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with Icons */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href === '/movies' && pathname === '/browse' && typeof window !== 'undefined' && window.location.search.includes('format=Movie'));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions Right */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-all text-xs font-medium backdrop-blur-md shadow-md"
              title="Search Anime & Movies"
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden lg:inline-block text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-transform duration-300 shadow-md"
                title="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
              </button>
            )}

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-indigo-500/40 hover:border-indigo-500 transition-colors shadow-lg"
              >
                <img
                  src={MOCK_USER.avatar}
                  alt={MOCK_USER.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-60 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-slate-200"
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="font-bold text-sm text-white">{MOCK_USER.name}</p>
                      <p className="text-xs text-emerald-400 font-medium">VIP Streamer • Lv. {MOCK_USER.level}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>Profile & Stats</span>
                    </Link>

                    <Link
                      href="/watchlist"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-purple-400" />
                      <span>My Watchlist</span>
                    </Link>

                    <Link
                      href="/favorites"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>Favorites</span>
                    </Link>

                    <Link
                      href="/history"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <History className="w-4 h-4 text-cyan-400" />
                      <span>Watch History</span>
                    </Link>

                    <div className="border-t border-slate-800 my-1 pt-1">
                      <Link
                        href="/login"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl hover:bg-rose-500/10 text-rose-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[70px] left-0 right-0 z-30 bg-slate-950/98 border-b border-slate-800 backdrop-blur-2xl px-4 py-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="border-t border-slate-800 my-3 pt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                >
                  Sign In / Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal Overlay with Live Results */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-4 shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-indigo-400 absolute left-4" />
                <input
                  type="text"
                  placeholder="Search titles, movies, genres (e.g. Cyberpunk, Movies, Action)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-950 text-white pl-12 pr-12 py-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 text-base placeholder-slate-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              {/* Instant Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                    Live Matches ({searchResults.length})
                  </p>
                  {searchResults.map((anime) => (
                    <Link
                      key={anime.id}
                      href={`/anime/${anime.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-950">
                        <Image
                          src={anime.posterImage}
                          alt={anime.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 truncate">
                          {anime.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" /> {anime.rating}
                          </span>
                          <span>•</span>
                          <span className="text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded text-[10px]">
                            {anime.format}
                          </span>
                          <span>•</span>
                          <span>{anime.studio}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Press Enter to view full results</span>
                <Link
                  href="/browse"
                  onClick={() => setSearchOpen(false)}
                  className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Catalog
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
