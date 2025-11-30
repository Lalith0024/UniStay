import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Pagination from '../../components/ui/Pagination';
import { Check, X, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        status: statusFilter
      };
      const res = await axios.get(`${config.API_URL}/api/leaves`, { params });
      setLeaves(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`${config.API_URL}/api/leaves/${id}/status`, { status: newStatus });
      toast.success(`Leave request ${newStatus.toLowerCase()}`);
      fetchLeaves();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Leave Requests</h1>
        <div className="relative inline-flex bg-gradient-to-r from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-neutral-700/50 shadow-inner backdrop-blur-sm">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => {
            const isActive = (status === 'All' && statusFilter === '') || statusFilter === status;
            const getStatusColor = () => {
              if (status === 'Approved') return 'from-green-500 via-green-600 to-green-700';
              if (status === 'Rejected') return 'from-red-500 via-red-600 to-red-700';
              if (status === 'Pending') return 'from-yellow-500 via-yellow-600 to-yellow-700';
              return 'from-primary-500 via-primary-600 to-primary-700';
            };
            const getGlowColor = () => {
              if (status === 'Approved') return 'from-green-400 to-green-600';
              if (status === 'Rejected') return 'from-red-400 to-red-600';
              if (status === 'Pending') return 'from-yellow-400 to-yellow-600';
              return 'from-primary-400 to-primary-600';
            };
            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status === 'All' ? '' : status);
                  setPage(1);
                }}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group ${isActive
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

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading requests...</div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No leave requests found</div>
        ) : (
          leaves.map((leave) => (
            <div key={leave._id} className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {leave.studentId?.name || 'Unknown Student'}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                      {leave.status}
                    </span>
                  </h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User size={14} /> Room {leave.studentId?.room || 'N/A'}
                    </span>
                    <span>
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm bg-slate-50 dark:bg-neutral-900 p-3 rounded-lg border border-slate-100 dark:border-neutral-700">
                    "{leave.reason}"
                  </p>
                </div>
              </div>

              {leave.status === 'Pending' && (
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-colors font-medium"
                  >
                    <X size={18} /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20 transition-colors font-medium"
                  >
                    <Check size={18} /> Approve
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default LeaveRequests;
