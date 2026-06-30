import React from 'react';
import { motion } from 'framer-motion';

const Timeline = ({ items = [] }) => {
  return (
    <div className="relative">
      <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-zinc-800"></div>
      
      <div className="space-y-8">
        {items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex gap-6"
          >
            <div className={`relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center shrink-0
              ${item.isActive 
                ? 'bg-white dark:bg-zinc-900 border-primary-500 text-primary-500 shadow-md' 
                : 'bg-slate-100 dark:bg-zinc-800 border-white dark:border-zinc-800/80 text-slate-400'
              }`}
            >
              {item.icon && <item.icon size={18} />}
            </div>
            
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <span className="text-xs font-medium text-slate-400">{item.time}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                {item.description}
              </p>
              {item.content && (
                <div className="mt-3">
                  {item.content}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
