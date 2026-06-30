import React from 'react';
import { twMerge } from 'tailwind-merge';

const PriorityBadge = ({ priority, className }) => {
  const getStyles = () => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30';
      case 'important':
      case 'medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'general':
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-zinc-400 border-slate-200 dark:border-slate-500/30';
    }
  };

  return (
    <span className={twMerge(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider`, getStyles(), className)}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
