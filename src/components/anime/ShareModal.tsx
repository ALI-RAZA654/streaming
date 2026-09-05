'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Twitter, Facebook, Share2, Disc as Discord } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-400" /> Share Anime
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-300">
            Share <span className="font-semibold text-indigo-400">"{title}"</span> with your friends:
          </p>

          {/* Social Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Check out ${title} on SEKKAIICHI!`
              )}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-950 hover:bg-sky-600/20 hover:border-sky-500 border border-slate-800 transition-colors text-slate-300 hover:text-sky-400"
            >
              <Twitter className="w-5 h-5" />
              <span className="text-xs">Twitter</span>
            </a>

            <a
              href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-950 hover:bg-blue-600/20 hover:border-blue-500 border border-slate-800 transition-colors text-slate-300 hover:text-blue-400"
            >
              <Facebook className="w-5 h-5" />
              <span className="text-xs">Facebook</span>
            </a>

            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-950 hover:bg-indigo-600/20 hover:border-indigo-500 border border-slate-800 transition-colors text-slate-300 hover:text-indigo-400"
            >
              <Discord className="w-5 h-5" />
              <span className="text-xs">Discord</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-950 hover:bg-purple-600/20 hover:border-purple-500 border border-slate-800 transition-colors text-slate-300 hover:text-purple-400"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs">More</span>
            </button>
          </div>

          {/* Copy Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 px-3 py-2.5 rounded-xl focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
