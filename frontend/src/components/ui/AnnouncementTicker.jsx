import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnouncementTicker = ({ notice, onClose, basePath = '/student/notices' }) => {
  if (!notice) return null;

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'Urgent':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: AlertCircle,
          pulse: true
        };
      case 'Important':
        return {
          bg: 'bg-amber-500',
          text: 'text-white',
          icon: AlertTriangle,
          pulse: false
        };
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          icon: Info,
          pulse: false
        };
    }
  };

  const config = getPriorityConfig(notice.priority);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`w-full overflow-hidden ${config.bg} ${config.text}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 sm:py-2.5">
            <Link 
              to={basePath}
              className="flex flex-1 items-center gap-3 min-w-0 group hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-shrink-0">
                <Icon size={16} className={config.pulse ? 'animate-pulse' : ''} />
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
                  {notice.priority}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/50 hidden sm:inline-block"></span>
              </div>
              <p className="text-sm font-medium truncate">
                {notice.title}
              </p>
              <ChevronRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose && onClose(notice._id);
              }}
              className="p-1 rounded-full hover:bg-white/20 transition-colors ml-4 flex-shrink-0"
              aria-label="Dismiss announcement"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementTicker;
