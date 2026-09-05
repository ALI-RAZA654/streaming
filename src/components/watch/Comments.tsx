'use client';

import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, AlertCircle, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  isSpoiler?: boolean;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: 'KuroNeko_99',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    date: '2 hours ago',
    content: 'That animation sequence at 14:20 was absolutely insane! Studio delivered peak quality once again.',
    likes: 42,
  },
  {
    id: 'c2',
    user: 'CyberSamurai',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    date: '5 hours ago',
    content: 'The plot twist regarding the core matrix matrix blew my mind. Can’t wait for episode 2!',
    likes: 28,
  },
  {
    id: 'c3',
    user: 'ShadowWeaver',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    date: '1 day ago',
    content: 'Warning: Major plot detail revealed! Uncover at your own risk.',
    likes: 15,
    isSpoiler: true,
  },
];

export const Comments: React.FC = () => {
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const created: Comment = {
      id: Math.random().toString(),
      user: 'Alex Vance (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      date: 'Just now',
      content: newComment.trim(),
      likes: 0,
    };

    setComments([created, ...comments]);
    setNewComment('');
    showToast('Comment posted successfully!', 'success');
  };

  const handleLike = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const toggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" /> Community Discussion ({comments.length})
        </h3>
        <span className="text-xs text-slate-400">Keep comments respectful</span>
      </div>

      {/* Post comment form */}
      <form onSubmit={handleAddComment} className="flex gap-3">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
        />
        <div className="flex-1 space-y-2">
          <textarea
            rows={2}
            placeholder="Share your thoughts about this episode..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex gap-3 text-slate-300"
          >
            <img
              src={comment.avatar}
              alt={comment.user}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white">{comment.user}</span>
                <span className="text-[11px] text-slate-500">{comment.date}</span>
              </div>

              {comment.isSpoiler && !revealedSpoilers[comment.id] ? (
                <div
                  onClick={() => toggleSpoiler(comment.id)}
                  className="cursor-pointer p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-center gap-2 hover:bg-amber-950/60 transition-colors"
                >
                  <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>This comment contains spoilers. Click to reveal.</span>
                </div>
              ) : (
                <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
              )}

              <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {comment.likes}
                </button>
                <button className="hover:text-white transition-colors">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
