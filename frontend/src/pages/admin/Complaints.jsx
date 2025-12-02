import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Pagination from '../../components/ui/Pagination';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        status: statusFilter,
        search
      };
      const res = await axios.get(`${config.API_URL}/api/complaints`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComplaints(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchComplaints();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, statusFilter, search]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`${config.API_URL}/api/complaints/${id}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success(`Complaint marked as ${newStatus.toLowerCase()}`);
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setViewModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Complaints</h1>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={20} />
          <input
            type="text"
            placeholder="Search issue, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white shadow-sm"
          />
        </div>
      </div>

      <div>
        <div className="relative inline-flex bg-gradient-to-r from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-neutral-700/50 shadow-inner backdrop-blur-sm w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map((status) => {
              const isActive = (status === 'All' && statusFilter === '') || statusFilter === status;
              const getStatusColor = () => {
                if (status === 'Resolved') return 'from-green-500 via-green-600 to-green-700';
                if (status === 'Rejected') return 'from-red-500 via-red-600 to-red-700';
                if (status === 'Pending') return 'from-orange-500 via-orange-600 to-orange-700';
                if (status === 'In Progress') return 'from-yellow-500 via-yellow-600 to-yellow-700';
                return 'from-primary-500 via-primary-600 to-primary-700';
              };
              const getGlowColor = () => {
                if (status === 'Resolved') return 'from-green-400 to-green-600';
                if (status === 'Rejected') return 'from-red-400 to-red-600';
                if (status === 'Pending') return 'from-orange-400 to-orange-600';
                if (status === 'In Progress') return 'from-yellow-400 to-yellow-600';
                return 'from-primary-400 to-primary-600';
              };
              return (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status === 'All' ? '' : status);
                    setPage(1);
                  }}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group whitespace-nowrap ${isActive
                    ? 'text-white shadow-lg scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-102'
                    }`}
                >
                  {isActive && (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor()} animate-gradient-shift`}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      <div className={`absolute -inset-1 bg-gradient-to-r ${getGlowColor()} opacity-30 blur-lg group-hover:opacity-50 transition-opacity`}></div>
                    </>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-300/50 dark:from-neutral-700/50 dark:to-neutral-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <span className="relative z-10">{status}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-slate-500">
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-500">
            No complaints found
          </div>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              onClick={() => handleView(complaint)}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:shadow-md transition-all cursor-pointer group"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {complaint.issue}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {complaint.studentId?.name || "Unknown"} • Room{" "}
                    {complaint.studentId?.room || "N/A"} •{" "}
                    {new Date(complaint.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${complaint.status === "Resolved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : complaint.status === "Pending"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : complaint.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                  >
                    {complaint.status}
                  </span>

                  <span
                    className={`text-xs font-medium ${getPriorityColor(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority} Priority
                  </span>
                </div>
              </div>

              {/* BUTTONS — EXACT SAME STYLE AS ORIGINAL DASHBOARD */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {/* Resolve */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate(complaint._id, "Resolved");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm transition-colors shadow-md shadow-green-500/20"
                >
                  <CheckCircle size={14} /> Resolve
                </button>

                {/* In Progress */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate(complaint._id, "In Progress");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-colors shadow-md shadow-yellow-500/20"
                >
                  <Clock size={14} /> In Progress
                </button>

                {/* Reject */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate(complaint._id, "Rejected");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors shadow-md shadow-red-500/20"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* View Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ display: viewModal ? 'flex' : 'none' }}>
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-neutral-700 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-neutral-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Complaint Details</h3>
              <button
                onClick={() => setViewModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Issue</h4>
                <p className="text-lg font-medium text-slate-900 dark:text-white">{selectedComplaint.issue}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Status</h4>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${selectedComplaint.status === "Resolved"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : selectedComplaint.status === "Pending"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : selectedComplaint.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                    {selectedComplaint.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Priority</h4>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(selectedComplaint.priority)}`}>
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Student</h4>
                  <p className="text-slate-900 dark:text-white font-medium">{selectedComplaint.studentId?.name || "Unknown"}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedComplaint.studentId?.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Location</h4>
                  <p className="text-slate-900 dark:text-white font-medium">Room {selectedComplaint.studentId?.room || "N/A"}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Block {selectedComplaint.studentId?.block || "-"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date Submitted</h4>
                <p className="text-slate-900 dark:text-white font-medium">
                  {new Date(selectedComplaint.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {selectedComplaint.description && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Description</h4>
                  <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-100 dark:border-neutral-700 text-slate-700 dark:text-slate-300">
                    {selectedComplaint.description}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900/50 flex justify-end gap-3">
              <button
                onClick={() => setViewModal(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
              {selectedComplaint.status === 'Pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedComplaint._id, "In Progress");
                      setViewModal(false);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 shadow-lg shadow-yellow-500/20 transition-colors font-medium flex items-center gap-2"
                  >
                    <Clock size={18} /> Mark In Progress
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedComplaint._id, "Resolved");
                      setViewModal(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/20 transition-colors font-medium flex items-center gap-2"
                  >
                    <CheckCircle size={18} /> Mark Resolved
                  </button>
                </>
              )}
              {selectedComplaint.status === 'In Progress' && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedComplaint._id, "Resolved");
                    setViewModal(false);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/20 transition-colors font-medium flex items-center gap-2"
                >
                  <CheckCircle size={18} /> Mark Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
