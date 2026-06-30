import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300 ring-1 ring-slate-200/50 dark:ring-zinc-700",
    primary: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 ring-1 ring-blue-200/50 dark:ring-blue-500/25",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 ring-1 ring-emerald-200/50 dark:ring-emerald-500/25",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 ring-1 ring-amber-200/50 dark:ring-amber-500/25",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 ring-1 ring-rose-200/50 dark:ring-rose-500/25",
    info: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400 ring-1 ring-violet-200/50 dark:ring-violet-500/25",
    secondary: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 ring-1 ring-slate-200/50 dark:ring-zinc-700",
  };

  return (
    <span className={twMerge(
      "inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
