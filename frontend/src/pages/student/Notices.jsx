import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertCircle,
  Calendar,
  Clock,
  TrendingUp,
  Pin,
  Search,
  Filter,
  ChevronDown,
  X,
  Sparkles
} from 'lucide-react';
import config from '../../config';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [pinnedNotices, setPinnedNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/notices?limit=50&sort=createdAt:desc`);
      const data = await response.json();

      if (data.data) {
        setNotices(data.data);
        // Get pinned from localStorage
        const pinned = JSON.parse(localStorage.getItem('pinnedNotices') || '[]');
        setPinnedNotices(pinned);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setLoading(false);
    }
  };

  const togglePin = (noticeId) => {
    const newPinned = pinnedNotices.includes(noticeId)
      ? pinnedNotices.filter(id => id !== noticeId)
      : [...pinnedNotices, noticeId];

    setPinnedNotices(newPinned);
    localStorage.setItem('pinnedNotices', JSON.stringify(newPinned));
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || notice.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const pinned = filteredNotices.filter(n => pinnedNotices.includes(n._id));
  const recent = filteredNotices.filter(n => !pinnedNotices.includes(n._id));
  const urgentCount = notices.filter(n => n.priority === 'Urgent').length;

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 rounded-3xl p-8 mb-8 border border-slate-200 dark:border-neutral-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg border border-slate-200 dark:border-neutral-700">
              <Bell size={28} className="text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Notice Board
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Stay updated with the latest announcements
              </p>
            </div>
          </div>

          {urgentCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl"
            >
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                {urgentCount} urgent {urgentCount === 1 ? 'notice' : 'notices'} require your attention
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 mb-6 border border-slate-200 dark:border-neutral-700 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            />
          </div>

          {/* Priority Filter */}
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 appearance-none transition-all cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent Only</option>
              <option value="Normal">Normal Only</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pinned Notices */}
          {pinned.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pin size={18} className="text-primary-500" />
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Pinned Notices
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pinned.map((notice, index) => (
                  <NoticeCard
                    key={notice._id}
                    notice={notice}
                    index={index}
                    isPinned={true}
                    onPin={() => togglePin(notice._id)}
                    onView={() => {
                      setSelectedNotice(notice);
                      setShowDetailModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Notices */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {pinned.length > 0 ? 'Other Notices' : 'All Notices'}
              </h2>
            </div>

            {recent.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700">
                <div className="w-20 h-20 bg-slate-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No notices found</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {searchTerm || filterPriority !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Check back later for updates'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {recent.map((notice, index) => (
                  <NoticeCard
                    key={notice._id}
                    notice={notice}
                    index={index}
                    isPinned={false}
                    onPin={() => togglePin(notice._id)}
                    onView={() => {
                      setSelectedNotice(notice);
                      setShowDetailModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedNotice && (
          <NoticeDetailModal
            notice={selectedNotice}
            onClose={() => setShowDetailModal(false)}
            isPinned={pinnedNotices.includes(selectedNotice._id)}
            onTogglePin={() => togglePin(selectedNotice._id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Notice Card Component
function NoticeCard({ notice, index, isPinned, onPin, onView }) {
  const isUrgent = notice.priority === 'Urgent';
  const formattedDate = new Date(notice.createdAt || notice.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const timeAgo = getTimeAgo(new Date(notice.createdAt || notice.date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-white dark:bg-neutral-800 rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${isUrgent
        ? 'border-red-200 dark:border-red-900/40 hover:border-red-300 dark:hover:border-red-800/50'
        : 'border-slate-200 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800/50'
        }`}
      onClick={onView}
    >
      {/* Decorative Elements */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-opacity opacity-0 group-hover:opacity-100 ${isUrgent
        ? 'bg-gradient-to-br from-red-500/10 to-transparent'
        : 'bg-gradient-to-br from-primary-500/10 to-transparent'
        }`} />

      {/* Pin Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPin();
        }}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-all z-10 ${isPinned
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
          : 'bg-slate-100 dark:bg-neutral-700 text-slate-400 hover:text-primary-500'
          }`}
      >
        <Pin size={16} className={isPinned ? 'fill-current' : ''} />
      </button>

      {/* Priority Badge */}
      {isUrgent && (
        <div className="absolute -top-2 -left-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            <div className="relative px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full border-2 border-white dark:border-neutral-800 flex items-center gap-1">
              <Sparkles size={12} />
              Urgent
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mt-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isUrgent
          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
          }`}>
          <Bell size={24} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 pr-8 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {notice.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {notice.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock size={14} />
            {timeAgo}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Detail Modal Component
function NoticeDetailModal({ notice, onClose, isPinned, onTogglePin }) {
  const isUrgent = notice.priority === 'Urgent';
  const formattedDate = new Date(notice.createdAt || notice.date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-neutral-700"
      >
        {/* Header */}
        <div className={`relative p-8 border-b border-slate-100 dark:border-neutral-700 ${isUrgent
          ? 'bg-gradient-to-br from-red-50/50 to-white dark:from-red-900/10 dark:to-neutral-800'
          : 'bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-neutral-800'
          }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-4 rounded-2xl shadow-lg ${isUrgent
                ? 'bg-red-500 text-white'
                : 'bg-gradient-to-br from-primary-500 to-teal-400 text-white'
                }`}>
                <Bell size={28} />
              </div>
              <div className="flex-1">
                {isUrgent && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                    <Sparkles size={12} />
                    Urgent
                  </span>
                )}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {notice.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar size={16} />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin();
                }}
                className={`p-2 rounded-xl transition-all ${isPinned
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-neutral-700 text-slate-500 hover:text-primary-500'
                  }`}
              >
                <Pin size={20} className={isPinned ? 'fill-current' : ''} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-neutral-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="p-6 bg-slate-50 dark:bg-neutral-900/50 rounded-2xl border border-slate-200 dark:border-neutral-700">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {notice.description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-all shadow-lg"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper function
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${key}${interval !== 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}
