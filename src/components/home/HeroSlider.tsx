'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Bookmark, Star, ChevronLeft, ChevronRight, Sparkles, Tv, Volume2, Check } from 'lucide-react';
import { Anime } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

interface HeroSliderProps {
  animes: Anime[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ animes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const { showToast } = useToast();

  const featuredList = animes.filter((a) => a.featured).length > 0
    ? animes.filter((a) => a.featured)
    : animes.slice(0, 4);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featuredList.length, isPaused]);

  const current = featuredList[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  };

  const handleBookmarkToggle = () => {
    setInWatchlist(!inWatchlist);
    showToast(
      !inWatchlist
        ? `Added "${current.title}" to Watchlist`
        : `Removed "${current.title}" from Watchlist`,
      'info'
    );
  };

  if (!current) return null;

  return (
    <div
      className="relative w-full h-[75vh] sm:h-[82vh] min-h-[550px] max-h-[800px] bg-slate-950 overflow-hidden group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Timer Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-slate-800/60 overflow-hidden">
        <motion.div
          key={`timer-${currentIndex}-${isPaused}`}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? '0%' : '100%' }}
          transition={{ duration: 6.5, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Banner Image - Vibrant & Clear */}
          <Image
            src={current.bannerImage}
            alt={current.title}
            fill
            priority
            className="object-cover object-center filter brightness-105 contrast-[1.08] saturate-[1.1] transition-transform duration-1000 group-hover/hero:scale-105"
          />

          {/* Precision Gradients for Content Readability without Darkening Entire Artwork */}
          {/* Bottom fade into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          {/* Left side soft gradient behind text */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-[65%] bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent pointer-events-none" />
          {/* Top subtle nav fade */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />
          {/* Ambient Glow Accent */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content & Poster Layout */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12 sm:pb-16 z-20">
        <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          
          {/* Left Text Info */}
          <div className="max-w-2xl text-white space-y-4">
            {/* Badges & Streaming Indicators */}
            <motion.div
              key={`badges-${current.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <Badge variant="cyan" className="gap-1.5 bg-emerald-500/20 text-emerald-300 border-emerald-500/40 backdrop-blur-md px-3 py-1 font-semibold text-xs shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> SPOTLIGHT #{currentIndex + 1}
              </Badge>

              <Badge variant="secondary" className="gap-1 bg-slate-900/80 backdrop-blur-md text-amber-300 border-slate-700/80 px-3 py-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {current.rating} Score
              </Badge>

              <Badge variant="primary" className="bg-indigo-600/90 text-white font-bold px-2.5 py-0.5 text-xs shadow-md shadow-indigo-600/30">
                {current.format}
              </Badge>

              <span className="text-xs text-cyan-300 font-semibold px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 backdrop-blur-md">
                HD 1080P • SUB / DUB
              </span>

              <span className="text-xs text-slate-300 font-medium px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                {current.studio}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              key={`title-${current.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            >
              {current.title}
            </motion.h1>

            {/* Synopsis */}
            <motion.p
              key={`synopsis-${current.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed max-w-xl font-normal drop-shadow-md"
            >
              {current.synopsis}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              key={`actions-${current.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-3 pt-3 flex-wrap"
            >
              <Link
                href={`/watch/${current.slug}/1`}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 hover:from-emerald-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 border border-white/20 group/btn"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
                <span>STREAM EPISODE 1</span>
              </Link>

              <Link
                href={`/anime/${current.slug}`}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-semibold backdrop-blur-md transition-all duration-200 flex items-center gap-2 hover:border-slate-500"
              >
                <Info className="w-4.5 h-4.5 text-indigo-400" /> Details
              </Link>

              <button
                onClick={handleBookmarkToggle}
                className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all duration-200 flex items-center gap-2 ${
                  inWatchlist
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500'
                }`}
                title="Add to Watchlist"
              >
                {inWatchlist ? <Check className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
              </button>
            </motion.div>
          </div>



        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-30 flex items-center gap-3">
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl bg-slate-900/80 hover:bg-indigo-600 text-white border border-slate-700/80 backdrop-blur-md transition-colors shadow-lg active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
          {featuredList.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-indigo-500 shadow-md shadow-indigo-500/50' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-2xl bg-slate-900/80 hover:bg-indigo-600 text-white border border-slate-700/80 backdrop-blur-md transition-colors shadow-lg active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
