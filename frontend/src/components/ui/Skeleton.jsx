import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

const Skeleton = ({ className, variant = 'text' }) => {
  const baseClasses = "animate-pulse bg-slate-200 dark:bg-zinc-800";
  
  const variants = {
    text: "h-4 rounded-md w-full",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div className={twMerge(clsx(baseClasses, variants[variant], className))} />
  );
};

export default Skeleton;
