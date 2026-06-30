import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Bell, Plus, Send, Trash2, Edit2, Pin, Calendar as CalIcon, Users, CheckSquare } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import ViewToggle from '../../components/ui/ViewToggle';
import PriorityBadge from '../../components/ui/PriorityBadge';
import SlideOver from '../../components/ui/SlideOver';
import DataTable from '../../components/ui/DataTable';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    priority: "Normal",
    audience: "All",
    scheduledFor: ""
  });
  const [editingNotice, setEditingNotice] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      // In a real app we'd handle pagination, but here we fetch a good chunk for the grid
      const res = await axios.get(`${config.API_URL}/api/notices?limit=50`);
      setNotices(res.data.data || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await axios.patch(`${config.API_URL}/api/notices/${editingNotice._id}`, newNotice);
        toast.success("Notice updated successfully");
      } else {
        await axios.post(`${config.API_URL}/api/notices`, newNotice);
        toast.success("Notice posted successfully");
      }
      setSlideOverOpen(false);
      fetchNotices();
    } catch (error) {
      toast.error(editingNotice ? "Failed to update notice" : "Failed to post notice");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await axios.delete(`${config.API_URL}/api/notices/${id}`);
      toast.success("Notice deleted successfully");
      fetchNotices();
    } catch (error) {
      toast.error("Failed to delete notice");
    }
  };

  const openCreate = () => {
    setEditingNotice(null);
    setNewNotice({ title: "", description: "", priority: "Normal", audience: "All", scheduledFor: "" });
    setSlideOverOpen(true);
  };

  const openEdit = (notice) => {
    setEditingNotice(notice);
    setNewNotice({
      title: notice.title,
      description: notice.description,
      priority: notice.priority || "Normal",
      audience: notice.audience || "All",
      scheduledFor: notice.scheduledFor ? new Date(notice.scheduledFor).toISOString().slice(0, 16) : ""
    });
    setSlideOverOpen(true);
  };

  const tableColumns = [
    { header: 'Title', accessor: 'title', cellClassName: 'font-bold' },
    { header: 'Priority', render: (row) => <PriorityBadge priority={row.priority} /> },
    { header: 'Audience', render: (row) => <Badge variant="primary">{row.audience || 'All'}</Badge> },
    { header: 'Status', render: (row) => {
      const isScheduled = row.scheduledFor && new Date(row.scheduledFor) > new Date();
      return isScheduled ? <Badge variant="warning">Scheduled</Badge> : <Badge variant="success">Published</Badge>;
    }},
    { header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2 justify-end">
        <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="text-slate-400 hover:text-primary-500"><Edit2 size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
      </div>
    ), cellClassName: 'text-right' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notices & Announcements" 
        description="Broadcast important information to students and staff."
        actions={
          <div className="flex gap-3">
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 font-medium"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Post Notice</span>
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
      ) : notices.length === 0 ? (
        <EmptyState icon={Bell} title="No Notices Found" description="Click 'Post Notice' to create your first announcement." />
      ) : viewMode === 'table' ? (
        <DataTable columns={tableColumns} data={notices} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {notices.map((notice) => {
              const isScheduled = notice.scheduledFor && new Date(notice.scheduledFor) > new Date();
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={notice._id}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md relative overflow-hidden group flex flex-col h-full"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 ${notice.priority === 'Urgent' ? 'bg-red-500/10' : 'bg-primary-500/10'}`} />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <PriorityBadge priority={notice.priority} />
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(notice)} className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(notice._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 relative z-10 mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 pr-4">{notice.title}</h3>
                    <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed line-clamp-3">{notice.description}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 mt-auto flex items-center justify-between text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-slate-400" />
                      {notice.audience || 'All'}
                    </div>
                    {isScheduled ? (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <CalIcon size={14} /> Scheduled
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <CalIcon size={14} className="text-slate-400" />
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Notice SlideOver */}
      <SlideOver 
        isOpen={slideOverOpen} 
        onClose={() => setSlideOverOpen(false)} 
        title={editingNotice ? "Edit Notice" : "Create Notice"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Title</label>
            <input
              type="text"
              required
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              placeholder="Enter notice title"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Description</label>
            <textarea
              required
              rows="6"
              value={newNotice.description}
              onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white resize-none"
              placeholder="Write your announcement here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Priority</label>
              <select
                value={newNotice.priority}
                onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Audience</label>
              <select
                value={newNotice.audience}
                onChange={(e) => setNewNotice({ ...newNotice, audience: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              >
                <option value="All">All</option>
                <option value="Students">Students Only</option>
                <option value="Staff">Staff Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Schedule For (Optional)</label>
            <input
              type="datetime-local"
              value={newNotice.scheduledFor}
              onChange={(e) => setNewNotice({ ...newNotice, scheduledFor: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            />
            <p className="text-xs text-slate-500 mt-1">Leave blank to publish immediately.</p>
          </div>

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setSlideOverOpen(false)}
              className="flex-1 px-4 py-3 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} /> {editingNotice ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      </SlideOver>

    </div>
  );
};

export default Notices;
