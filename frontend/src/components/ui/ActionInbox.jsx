import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle, Calendar, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import Badge from './Badge';

const ActionInbox = ({ items = [], onAction, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 animate-pulse h-24"></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 text-center">
        <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">All Caught Up!</h3>
        <p className="text-sm text-slate-500">You have no pending actions at the moment.</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'complaint': return <AlertCircle size={20} className="text-orange-500" />;
      case 'leave': return <Calendar size={20} className="text-blue-500" />;
      case 'payment': return <Clock size={20} className="text-red-500" />;
      default: return <AlertCircle size={20} className="text-slate-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'complaint': return 'bg-orange-50 dark:bg-orange-500/10';
      case 'leave': return 'bg-blue-50 dark:bg-blue-500/10';
      case 'payment': return 'bg-red-50 dark:bg-red-500/10';
      default: return 'bg-slate-50 dark:bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800/30 transition-all flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
          >
            <div className="flex gap-4 items-start sm:items-center">
              <div className={`p-3 rounded-xl flex-shrink-0 ${getBgColor(item.type)}`}>
                {getIcon(item.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                  {item.isUrgent && <Badge variant="danger">Urgent</Badge>}
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-1">{item.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400">
                  <span>{item.meta}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                  <span>{item.timeAgo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0 pl-14 sm:pl-0">
              {item.actions.map((action, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction && onAction(item.id, action.name);
                  }}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                    ${action.primary 
                      ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600 hover:shadow-lg' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-zinc-700'}
                  `}
                >
                  {action.icon && <action.icon size={16} />}
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ActionInbox;
