import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

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
  const baseStyles = "relative inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

  const variants = {
    primary: "bg-primary-500 text-brandDark hover:bg-white border-none shadow-[0_10px_30px_-10px_rgba(0,191,255,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(0,191,255,0.6)]",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
    ghost: "bg-transparent text-slate-400 hover:text-white",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-brandDark",
    gradient: "bg-gradient-to-r from-primary-500 to-primary-600 text-brandDark shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
  };

  const sizes = {
    sm: "px-6 py-3 text-[10px] rounded-xl",
    md: "px-8 py-4 text-xs rounded-2xl",
    lg: "px-12 py-6 text-sm rounded-[1.5rem]",
    icon: "p-3 rounded-xl"
  };

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
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

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
};

export default Button;
