import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  disabled,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-lg shadow-primary-500/25",
    secondary: "bg-white dark:bg-brandDark-800 text-slate-900 dark:text-white border border-slate-200 dark:border-brandDark-700 hover:bg-slate-50 dark:hover:bg-brandDark-700 focus:ring-slate-200 dark:focus:ring-dark-700",
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brandDark-800 hover:text-slate-900 dark:hover:text-white",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20",
    gradient: "bg-gradient-to-r from-primary-500 to-teal-400 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    icon: "p-2"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={isLoading || disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
};

export default Button;
