'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Disc as Discord, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/Screenshot 2026-09-03 013825.png"
                alt="SEKKAIICHI"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-extrabold text-lg tracking-tight text-white">
                SEKKAI<span className="text-green-400">ICHI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The next-generation anime streaming experience with high definition playback, zero ads, and vibrant community features.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Discord className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-indigo-400 transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-indigo-400 transition-colors">
                  Anime Movies
                </Link>
              </li>
              <li>
                <Link href="/browse?status=Ongoing" className="hover:text-indigo-400 transition-colors">
                  Ongoing Series
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-indigo-400 transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wider uppercase">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  DMCA Notice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wider uppercase">
              Stay Updated
            </h4>
            <p className="text-sm mb-4 text-slate-400">
              Subscribe to receive updates on upcoming seasonal releases and exclusive events.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SEKKAIICHI. All rights reserved.</p>
          <p className="text-center md:text-right">
            Designed for original demonstration. No copyrighted assets embedded.
          </p>
        </div>
      </div>
    </footer>
  );
};
