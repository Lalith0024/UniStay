import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Pagination from '../../components/ui/Pagination';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
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
        status: statusFilter
      };
      const res = await axios.get(`${config.API_URL}/api/complaints`, { params });
      setComplaints(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`${config.API_URL}/api/complaints/${id}`, { status: newStatus });
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Complaints</h1>
        <div className="flex flex-wrap gap-2">
          {['', 'Pending', 'Resolved', 'Rejected'].map((status) => (
            <button
              key={status || 'all'}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${statusFilter === status
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                }`}
            >
              {status || 'All'}
            </button>
          ))}
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
              <div className="flex items-center gap-2 mt-4">
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

                {/* In Progress (disabled unless backend supports it) */}
                <button
                  disabled
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm opacity-70 cursor-not-allowed shadow-md shadow-yellow-500/20"
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
