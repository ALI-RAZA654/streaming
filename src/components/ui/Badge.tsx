import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'cyan' | 'rose';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const base = 'inline-flex items-center font-semibold rounded-md border tracking-wide transition-colors';

  const variants = {
    primary: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30',
    secondary: 'bg-slate-800/80 text-slate-300 border-slate-700/50',
    accent: 'bg-purple-600/20 text-purple-300 border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    outline: 'border-slate-700 text-slate-300 hover:border-slate-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
