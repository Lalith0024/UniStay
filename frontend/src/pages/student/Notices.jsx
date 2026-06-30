import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertCircle, Calendar, Clock, Pin, Search, Filter, Mail, CheckCircle2, Inbox } from 'lucide-react';
import config from '../../config';
import PriorityBadge from '../../components/ui/PriorityBadge';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, urgent, pinned
  const [pinnedNotices, setPinnedNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_URL}/api/notices?limit=50&sort=createdAt:desc`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.data) {
        const validNotices = data.data.filter(n => n.audience !== 'Staff');
        setNotices(validNotices);
        
        const pinned = JSON.parse(localStorage.getItem('pinnedNotices') || '[]');
        setPinnedNotices(pinned);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setLoading(false);
    }
  };

  const togglePin = (noticeId, e) => {
    if (e) e.stopPropagation();
    const newPinned = pinnedNotices.includes(noticeId)
      ? pinnedNotices.filter(id => id !== noticeId)
      : [...pinnedNotices, noticeId];

    setPinnedNotices(newPinned);
    localStorage.setItem('pinnedNotices', JSON.stringify(newPinned));
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'urgent') matchesFilter = notice.priority === 'Urgent';
    if (activeFilter === 'pinned') matchesFilter = pinnedNotices.includes(notice._id);

    return matchesSearch && matchesFilter;
  });

  const urgentCount = notices.filter(n => n.priority === 'Urgent').length;
  const pinnedCount = pinnedNotices.length;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 max-w-[1400px] mx-auto">
      
      {/* Left Sidebar - Navigation & Filters */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Notice Board</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Updates & Announcements</p>
        </div>

        <div className="flex flex-col gap-1">
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')} 
            icon={Inbox} 
            label="All Notices" 
            count={notices.length} 
          />
          <FilterButton 
            active={activeFilter === 'urgent'} 
            onClick={() => setActiveFilter('urgent')} 
            icon={AlertCircle} 
            label="Urgent" 
            count={urgentCount}
            colorClass="text-red-500"
          />
          <FilterButton 
            active={activeFilter === 'pinned'} 
            onClick={() => setActiveFilter('pinned')} 
            icon={Pin} 
            label="Pinned" 
            count={pinnedCount}
            colorClass="text-amber-500"
          />
        </div>
      </div>

      {/* Middle Column - List View */}
      <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col bg-slate-50/50 dark:bg-zinc-950/30 border border-slate-200/60 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Notice List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                  <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full text-slate-500 dark:text-zinc-500">
              <CheckCircle2 size={32} className="mb-3 text-emerald-500 opacity-50" />
              <p className="font-medium text-sm text-slate-900 dark:text-white">All caught up!</p>
              <p className="text-xs mt-1">No notices found.</p>
            </div>
          ) : (
            <div className="p-3 flex flex-col gap-2">
              {filteredNotices.map(notice => {
                const isActive = selectedNotice?._id === notice._id;
                return (
                <div 
                  key={notice._id}
                  onClick={() => setSelectedNotice(notice)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden group ${
                    isActive 
                      ? 'bg-blue-50 border-blue-200 shadow-sm dark:bg-blue-500/15 dark:border-blue-500/30' 
                      : 'bg-white border-transparent hover:border-slate-200 dark:bg-zinc-900 dark:hover:border-zinc-700/80 hover:shadow-sm'
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500" />
                  )}
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <h3 className={`text-sm font-bold truncate flex-1 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                      {notice.title}
                    </h3>
                    {notice.priority === 'Urgent' && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                    {notice.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      {new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    {pinnedNotices.includes(notice._id) && <Pin size={12} className="text-amber-500 fill-amber-500" />}
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Detail View */}
      <div className="hidden md:flex flex-1 flex-col bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm relative">
        {selectedNotice ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            key={selectedNotice._id}
            className="flex-1 flex flex-col"
          >
            {/* Detail Header */}
            <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex flex-col gap-6 relative">
              
              <div className="flex items-start justify-between">
                <PriorityBadge priority={selectedNotice.priority} />
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => togglePin(selectedNotice._id, e)}
                    className={`p-2 rounded-xl transition-all ${pinnedNotices.includes(selectedNotice._id) ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-slate-50 text-slate-400 hover:text-slate-900 dark:bg-zinc-800 dark:hover:text-white'}`}
                  >
                    <Pin size={18} className={pinnedNotices.includes(selectedNotice._id) ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                  {selectedNotice.title}
                </h2>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(selectedNotice.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {new Date(selectedNotice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="prose dark:prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold">
                {selectedNotice.description.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-sm md:text-base text-slate-700 dark:text-zinc-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
              <Mail size={32} className="text-slate-300 dark:text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Select a notice to read</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm">
              Click on any notice from the list on the left to view its full details here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

function FilterButton({ active, onClick, icon: Icon, label, count, colorClass = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${
        active 
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-bold' 
          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 font-medium'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={active ? '' : colorClass} />
        <span className="text-sm">{label}</span>
      </div>
      {count > 0 && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
          active 
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' 
            : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}
