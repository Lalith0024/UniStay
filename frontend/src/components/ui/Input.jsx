import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({
  label,
  id,
  type = 'text',
  error,
  icon: Icon,
  className,
  containerClassName,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };
  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    props.onChange && props.onChange(e);
  };

  return (
    <div className={twMerge("relative group", containerClassName)}>
      <div className={clsx(
        "relative flex items-center transition-all duration-300 rounded-xl border bg-white/50 dark:bg-brandDark-800/50 backdrop-blur-sm",
        error
          ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
          : "border-slate-200 dark:border-brandDark-700 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20",
        isFocused && "shadow-lg shadow-primary-500/5"
      )}>
        {Icon && (
          <div className="pl-4 text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={20} />
          </div>
        )}
        <div className="relative flex-1">
          <input
            id={id}
            type={type}
            className={clsx(
              "w-full bg-transparent border-none outline-none px-4 py-3.5 pt-5 pb-2 text-slate-900 dark:text-white placeholder-transparent transition-all",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={label}
            {...props}
          />
          <label
            htmlFor={id}
            className={clsx(
              "absolute left-4 transition-all duration-200 pointer-events-none text-slate-500 dark:text-slate-400",
              (isFocused || hasValue)
                ? "text-xs top-1.5 text-primary-500 font-medium"
                : "text-base top-3.5"
            )}
          >
            {label}
          </label>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-red-500 mt-1 ml-1 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
