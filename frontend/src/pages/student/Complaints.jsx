import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  X,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown
} from 'lucide-react';
import config from '../../config';

const API_BASE_URL = config.API_URL;

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const limit = 10;

  const [newComplaint, setNewComplaint] = useState({
    issue: '',
    description: '',
    priority: 'Medium'
  });

  // Mock Data
  const mockComplaints = [
    { _id: '1', issue: 'WiFi Connectivity', status: 'In Progress', priority: 'High', description: 'Internet is very slow in room 304 since yesterday.', date: new Date().toISOString() },
    { _id: '2', issue: 'Leaking Tap', status: 'Pending', priority: 'Medium', description: 'Bathroom tap is leaking continuously.', date: new Date(Date.now() - 86400000).toISOString() },
    { _id: '3', issue: 'AC Not Cooling', status: 'Resolved', priority: 'High', description: 'AC unit needs servicing.', date: new Date(Date.now() - 172800000).toISOString() },
    { _id: '4', issue: 'Broken Chair', status: 'Pending', priority: 'Low', description: 'Study chair leg is broken.', date: new Date(Date.now() - 259200000).toISOString() },
    { _id: '5', issue: 'Light Bulb Fused', status: 'Resolved', priority: 'Low', description: 'Main room light is not working.', date: new Date(Date.now() - 345600000).toISOString() }
  ];

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, searchTerm, filterStatus, filterPriority]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      let url = `${API_BASE_URL}/api/complaints?page=${currentPage}&limit=${limit}&sort=createdAt:desc`;

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }
      if (filterPriority !== 'all') {
        url += `&priority=${filterPriority}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setComplaints(data.data);
        setTotalPages(data.meta?.totalPages || 1);
        setTotalComplaints(data.meta?.total || 0);
      } else {
        // Fallback to mock data if API returns empty (for demo purposes)
        // Only use mock data if no search/filter is active to avoid confusion
        if (!searchTerm && filterStatus === 'all' && filterPriority === 'all') {
          setComplaints(mockComplaints);
          setTotalPages(1);
          setTotalComplaints(mockComplaints.length);
        } else {
          setComplaints([]);
          setTotalPages(1);
          setTotalComplaints(0);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      // Fallback to mock data on error
      setComplaints(mockComplaints);
      setTotalPages(1);
      setTotalComplaints(mockComplaints.length);
      setLoading(false);
    }
  };

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newComplaint,
          studentId: user.studentId || user._id,
          status: 'Pending'
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewComplaint({ issue: '', description: '', priority: 'Medium' });
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error adding complaint:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30';
      case 'rejected':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30';
      case 'medium':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30';
      case 'low':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30';
      default:
        return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <CheckCircle size={16} />;
      case 'in progress':
        return <Clock size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Complaints</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and track your maintenance requests
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-teal-400 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-slate-200 dark:border-neutral-700 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 appearance-none transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          {/* Priority Filter */}
          <div className="relative group">
            <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 appearance-none transition-all cursor-pointer"
            >
              <option value="all">All Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-12 border border-slate-200 dark:border-neutral-700 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No complaints found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            You haven't raised any complaints yet. If you're facing any issues, please let us know.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-primary-500/25"
          >
            <Plus size={20} />
            <span>New Complaint</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint, index) => (
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-200 dark:border-neutral-700 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`p-3 rounded-xl ${getPriorityColor(complaint.priority)} bg-opacity-10 dark:bg-opacity-10`}>
                      <AlertCircle size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {complaint.issue}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {complaint.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm pl-[60px]">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(complaint.priority)} bg-opacity-10 border-opacity-20`}>
                      {complaint.priority} Priority
                    </span>
                    <span className="text-slate-300 dark:text-neutral-600">•</span>
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock size={14} />
                      {new Date(complaint.date || complaint.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 pl-[60px] md:pl-0">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setShowDetailModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-neutral-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-slate-200 dark:border-neutral-700 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Add Complaint Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">New Complaint</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Submit a new maintenance request</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-700 transition-colors text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddComplaint} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newComplaint.issue}
                    onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                    placeholder="e.g., WiFi not working"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-neutral-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-neutral-700 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewComplaint({ ...newComplaint, priority: p })}
                        className={`py-3 rounded-xl text-sm font-semibold border transition-all ${newComplaint.priority === p
                          ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25'
                          : 'bg-white dark:bg-neutral-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-600'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-teal-400 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Submit Complaint
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Complaint Details</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">ID: #{selectedComplaint._id.slice(-6)}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-700 transition-colors text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-50 dark:bg-neutral-700/30 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Issue</label>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedComplaint.issue}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-neutral-700/30 p-4 rounded-xl border border-slate-100 dark:border-neutral-700">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Status</label>
                    <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusIcon(selectedComplaint.status)}
                      {selectedComplaint.status}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Priority</label>
                    <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border ${getPriorityColor(selectedComplaint.priority)} bg-opacity-10`}>
                      <AlertCircle size={16} />
                      {selectedComplaint.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-neutral-700 pt-6">
                  <Clock size={16} />
                  <span>Submitted on {new Date(selectedComplaint.date || selectedComplaint.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
