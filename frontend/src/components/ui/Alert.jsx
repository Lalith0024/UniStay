import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const variants = {
  success: {
    container: 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-500/50',
    iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400',
    iconBorder: 'border-teal-200 dark:border-teal-800',
    title: 'text-teal-900 dark:text-teal-100',
    text: 'text-teal-700 dark:text-teal-300',
    icon: CheckCircle2
  },
  error: {
    container: 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500/50',
    iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
    iconBorder: 'border-red-200 dark:border-red-800',
    title: 'text-red-900 dark:text-red-100',
    text: 'text-red-700 dark:text-red-300',
    icon: XCircle
  },
  warning: {
    container: 'bg-amber-50 border-amber-500 dark:bg-amber-900/20 dark:border-amber-500/50',
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    iconBorder: 'border-amber-200 dark:border-amber-800',
    title: 'text-amber-900 dark:text-amber-100',
    text: 'text-amber-700 dark:text-amber-300',
    icon: AlertTriangle
  },
  info: {
    container: 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500/50',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    iconBorder: 'border-blue-200 dark:border-blue-800',
    title: 'text-blue-900 dark:text-blue-100',
    text: 'text-blue-700 dark:text-blue-300',
    icon: Info
  }
};

const Alert = ({ type = 'info', title, message, className = '' }) => {
  const style = variants[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative w-full rounded-xl border-l-4 p-4 shadow-sm backdrop-blur-sm ${style.container} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <span className={`inline-flex justify-center items-center w-10 h-10 rounded-full border-4 ${style.iconBorder} ${style.iconBg} transition-transform hover:scale-110`}>
            <Icon size={18} strokeWidth={2.5} />
          </span>
        </div>
        <div className="flex-1 pt-0.5">
          {title && (
            <h3 className={`text-sm font-bold mb-1 ${style.title}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm font-medium leading-relaxed ${style.text}`}>
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Alert;
