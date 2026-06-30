import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, badgeText, color = 'primary', className }) => {
  const colorStyles = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400',
      badge: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
    },
    success: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      text: 'text-success-600 dark:text-success-400',
      badge: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      text: 'text-warning-600 dark:text-warning-400',
      badge: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
    },
    danger: {
      bg: 'bg-danger-50 dark:bg-danger-900/20',
      text: 'text-danger-600 dark:text-danger-400',
      badge: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300'
    },
    info: {
      bg: 'bg-info-50 dark:bg-info-900/20',
      text: 'text-info-600 dark:text-info-400',
      badge: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300'
    }
  };

  const currentStyles = colorStyles[color] || colorStyles.primary;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={twMerge(
        "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={twMerge(`p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`, currentStyles.bg, currentStyles.text)}>
          {Icon && <Icon size={22} strokeWidth={2.5} />}
        </div>
        {trend && !badgeText && (
          <span className={twMerge(`text-xs font-bold px-2.5 py-1 rounded-full`, currentStyles.badge)}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
        {badgeText && (
          <span className={twMerge(`text-xs font-bold px-2.5 py-1 rounded-full`, currentStyles.badge)}>
            {badgeText}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 font-semibold">{title}</p>
    </motion.div>
  );
};

export default StatCard;
