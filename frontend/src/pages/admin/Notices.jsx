import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Bell, Plus, Send, Trash2 } from "lucide-react";
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
  const [selectedNotice, setSelectedNotice] = useState(null);

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Notices & Announcements
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CREATE NOTICE FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                <Plus size={20} />
              </div>
              Create Notice
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
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
            <div className="text-center py-10 text-slate-500">
              Loading notices...
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No notices posted yet
            </div>
          ) : (
            notices.map((notice) => (
              <div
                key={notice._id}
                onClick={() => handleView(notice)}
                className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg hover:border-primary-500/30 transition-all duration-300"
              >
                {/* Decorative Gradient Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

                {notice.priority === "Urgent" && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl font-bold z-10 shadow-sm">
                    Urgent
                  </div>
                )}

                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notice._id);
                  }}
                  className="absolute bottom-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-20"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-start gap-5 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-inner">
                    <Bell size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate pr-8">
                      {notice.title}
                    </h3>

                    <p className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      {notice.createdAt
                        ? new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                        : "No Date"}
                    </p>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-2">
                      {notice.description}
                    </p>
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
              <button
                onClick={() => setViewModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                  <Bell size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedNotice.title}</h2>
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
                <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-100 dark:border-neutral-700 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.description}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900/50 flex justify-end">
              <button
                onClick={() => setViewModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-neutral-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
