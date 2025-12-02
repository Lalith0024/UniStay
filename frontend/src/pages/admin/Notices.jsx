import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Bell, Plus, Send, Trash2, Edit2 } from "lucide-react";
import { toast } from "react-toastify";

/* --------------------------
   SIMPLE PAGINATION COMPONENT
--------------------------- */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white dark:bg-neutral-800 disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-slate-700 dark:text-slate-300">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white dark:bg-neutral-800 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

/* --------------------------
         NOTICES PAGE
--------------------------- */
const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    priority: "Normal",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);

  /* Fetch Notices */
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.API_URL}/api/notices?page=${page}&limit=6`
      );

      setNotices(res.data.data || []);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page]);

  /* Create Notice */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_URL}/api/notices`, newNotice);

      toast.success("Notice posted successfully");

      setNewNotice({ title: "", description: "", priority: "Normal" });
      fetchNotices();
    } catch (error) {
      toast.error("Failed to post notice");
    }
  };

  /* Update Notice */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${config.API_URL}/api/notices/${editingNotice._id}`, {
        title: editingNotice.title,
        description: editingNotice.description,
        priority: editingNotice.priority
      });

      toast.success("Notice updated successfully");
      setEditModal(false);
      setEditingNotice(null);
      fetchNotices();
    } catch (error) {
      toast.error("Failed to update notice");
    }
  };

  /* Delete Notice */
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

  /* View Notice */
  const handleView = (notice) => {
    setSelectedNotice(notice);
    setViewModal(true);
  };

  /* Edit Notice */
  const handleEdit = (notice) => {
    setEditingNotice({ ...notice });
    setEditModal(true);
    setViewModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border-2 border-slate-200 dark:border-neutral-700 shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-primary-500 shadow-lg shadow-primary-500/30">
            <Bell size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Notices & Announcements
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-base">
              Manage and broadcast important information
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CREATE NOTICE FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl border-2 border-slate-200 dark:border-neutral-700 shadow-lg sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2.5 bg-primary-500 rounded-xl text-white shadow-md">
                <Plus size={20} />
              </div>
              Create Notice
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white placeholder:text-slate-400"
                  placeholder="Enter notice title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows="4"
                  value={newNotice.description}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white resize-none placeholder:text-slate-400"
                  placeholder="Write your announcement here..."
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={newNotice.priority}
                    onChange={(e) =>
                      setNewNotice({ ...newNotice, priority: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none cursor-pointer dark:text-white"
                  >
                    <option value="Normal">Normal Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/25 font-semibold text-sm mt-2"
              >
                <Send size={18} /> Post Notice
              </button>
            </form>
          </div>
        </div>

        {/* NOTICE LIST */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-gradient-to-br from-white to-slate-50 dark:from-neutral-800 dark:to-neutral-800 rounded-2xl border-2 border-slate-100 dark:border-neutral-700 shadow-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Loading notices...</p>
              </div>
            </div>
          ) : notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-white to-slate-50 dark:from-neutral-800 dark:to-neutral-800 rounded-2xl border-2 border-slate-100 dark:border-neutral-700 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Bell size={32} className="text-primary-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No notices posted yet</p>
              <p className="text-slate-400 text-sm mt-1">Create your first announcement</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div
                key={notice._id}
                onClick={() => handleView(notice)}
                className="bg-gradient-to-br from-white via-white to-slate-50/30 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800 p-6 rounded-2xl border-2 border-slate-100 dark:border-neutral-700 shadow-lg shadow-slate-200/80 dark:shadow-black/20 hover:shadow-2xl hover:shadow-primary-200/50 dark:hover:shadow-black/40 relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
              >
                {/* Decorative Gradient Background */}
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${notice.priority === 'Urgent'
                  ? 'from-red-200/40 via-red-100/20 to-transparent dark:from-red-500/10 dark:to-transparent'
                  : 'from-primary-200/40 via-primary-100/20 to-transparent dark:from-primary-500/10 dark:to-transparent'
                  } rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />

                {notice.priority === "Urgent" && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold shadow-lg shadow-red-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Urgent
                  </div>
                )}

                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notice._id);
                  }}
                  className="absolute bottom-4 right-4 p-2.5 text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-rose-500 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-start gap-5 relative z-10">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl border-2 ${notice.priority === 'Urgent'
                    ? 'bg-gradient-to-br from-red-500 to-rose-500 text-white border-red-200 dark:border-red-900/20 shadow-red-500/30'
                    : 'bg-gradient-to-br from-primary-500 to-teal-500 text-white border-primary-200 dark:border-primary-900/20 shadow-primary-500/30'
                    }`}>
                    <Bell size={24} className={notice.priority === 'Urgent' ? 'animate-bounce-slow' : ''} />
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 truncate pr-20 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {notice.title}
                    </h3>

                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-teal-400"></span>
                      {notice.createdAt
                        ? new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                        : "No Date"}
                    </p>

                    <div className="relative">
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-2 pr-4 break-words">
                        {notice.description}
                      </p>
                      {notice.description.length > 100 && (
                        <span className="text-primary-600 dark:text-primary-500 text-xs font-bold mt-2 inline-flex items-center gap-1 group-hover:gap-2 group-hover:underline transition-all">
                          Read more →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* PAGINATION (inside layout now, no break) */}
          {!loading && notices.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* View Notice Modal */}
      {viewModal && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-neutral-700 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-neutral-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Notice Details</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(selectedNotice);
                  }}
                  className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-500 dark:text-primary-400 transition-colors"
                  title="Edit notice"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => setViewModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                  <Bell size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white break-words">{selectedNotice.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Posted on {new Date(selectedNotice.createdAt).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Priority</h4>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${selectedNotice.priority === 'Urgent'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                  {selectedNotice.priority}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-100 dark:border-neutral-700 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                  {selectedNotice.description}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900/50 flex justify-end gap-3">
              <button
                onClick={() => setViewModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-neutral-600 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => handleEdit(selectedNotice)}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {editModal && editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-neutral-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-neutral-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Notice</h3>
              <button
                onClick={() => {
                  setEditModal(false);
                  setEditingNotice(null);
                }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows="5"
                  value={editingNotice.description}
                  onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Priority
                </label>
                <select
                  value={editingNotice.priority}
                  onChange={(e) => setEditingNotice({ ...editingNotice, priority: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none cursor-pointer dark:text-white"
                >
                  <option value="Normal">Normal Priority</option>
                  <option value="Urgent">Urgent Priority</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditModal(false);
                    setEditingNotice(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
