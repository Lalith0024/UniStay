import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';

const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-xl p-1 shadow-inner border border-slate-200/50 dark:border-zinc-800/50">
      <button
        onClick={() => onViewChange('grid')}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors z-10 ${
          view === 'grid' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        {view === 'grid' && (
          <motion.div
            layoutId="view-toggle"
            className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm -z-10 border border-slate-200/50 dark:border-zinc-700/50"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <LayoutGrid size={16} />
        <span className="hidden sm:inline-block">Grid</span>
      </button>

      <button
        onClick={() => onViewChange('table')}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors z-10 ${
          view === 'table' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        {view === 'table' && (
          <motion.div
            layoutId="view-toggle"
            className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm -z-10 border border-slate-200/50 dark:border-zinc-700/50"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <List size={16} />
        <span className="hidden sm:inline-block">Table</span>
      </button>
    </div>
  );
};

export default ViewToggle;
