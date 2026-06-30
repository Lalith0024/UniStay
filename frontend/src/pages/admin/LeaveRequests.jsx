import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Pagination from '../../components/ui/Pagination';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import DataTable from '../../components/ui/DataTable';
import SlideOver from '../../components/ui/SlideOver';
import { Search, Map, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [triageNote, setTriageNote] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, status: statusFilter, search };
      const res = await axios.get(`${config.API_URL}/api/leaves`, {
        params,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setLeaves(res.data.data);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchLeaves();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, statusFilter, search]);

  const handleStatusUpdate = async (newStatus) => {
    if(!selectedLeave) return;
    try {
      // Backend expects status
      // We could add `note` if backend supported it, but we'll include it just in case
      await axios.patch(`${config.API_URL}/api/leaves/${selectedLeave._id}/status`,
        { status: newStatus, note: triageNote },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`Leave request marked as ${newStatus}`);
      setTriageNote('');
      setSlideOverOpen(false);
      fetchLeaves();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleView = (leave) => {
    setSelectedLeave(leave);
    setSlideOverOpen(true);
  };

  const tableColumns = [
    { header: 'Student', render: (row) => (
      <div>
        <div className="font-bold text-slate-900 dark:text-white">{row.studentId?.name || "Unknown"}</div>
        <div className="text-xs text-slate-500">Room {row.studentId?.room || "N/A"}</div>
      </div>
    )},
    { header: 'Reason', accessor: 'reason', cellClassName: 'max-w-xs truncate' },
    { header: 'Dates', render: (row) => (
      <div className="text-sm">
        {new Date(row.fromDate).toLocaleDateString()} - {new Date(row.toDate).toLocaleDateString()}
      </div>
    )},
    { header: 'Status', render: (row) => (
      <Badge variant={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : row.status === 'Checked Out' ? 'primary' : 'warning'}>
        {row.status}
      </Badge>
    )},
    { header: 'Requested On', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { header: '', render: (row) => (
      <button onClick={(e) => { e.stopPropagation(); handleView(row); }} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg">
        <Eye size={18} />
      </button>
    ), cellClassName: 'text-right' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Leave Requests" 
        description="Review, approve, or reject student out-passes and leave requests."
      />

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search student, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['All', 'Pending', 'Approved', 'Rejected', 'Checked Out'].map((status) => {
            const isActive = (status === 'All' && statusFilter === '') || statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => { setStatusFilter(status === 'All' ? '' : status); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${isActive ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'bg-slate-50 text-slate-600 dark:bg-zinc-950 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'}`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
        ) : leaves.length === 0 ? (
          <EmptyState icon={Map} title="No Leave Requests Found" description="There are no leave requests matching the criteria." />
        ) : (
          <DataTable columns={tableColumns} data={leaves} onRowClick={handleView} />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Triage SlideOver */}
      <SlideOver isOpen={slideOverOpen} onClose={() => setSlideOverOpen(false)} title="Leave Details">
        {selectedLeave && (
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-6 pb-6 custom-scrollbar">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono text-xs font-bold bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                  #{selectedLeave._id.slice(-6)}
                </span>
                <Badge variant={selectedLeave.status === 'Approved' ? 'success' : selectedLeave.status === 'Rejected' ? 'danger' : selectedLeave.status === 'Checked Out' ? 'primary' : 'warning'}>
                  {selectedLeave.status}
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{selectedLeave.reason}</h2>
                <div className="text-slate-500 dark:text-zinc-400 text-sm font-medium">
                  {new Date(selectedLeave.fromDate).toLocaleDateString()} to {new Date(selectedLeave.toDate).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Student</h4>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedLeave.studentId?.name || "Unknown"}</div>
                  <div className="text-sm text-slate-500">{selectedLeave.studentId?.email}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</h4>
                  <div className="font-bold text-slate-900 dark:text-white">Room {selectedLeave.studentId?.room || "N/A"}</div>
                  <div className="text-sm text-slate-500">Block {selectedLeave.studentId?.block || "-"}</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requested On</h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">{new Date(selectedLeave.createdAt).toLocaleString()}</div>
              </div>
            </div>

            {/* Approval Actions Container */}
            {selectedLeave.status === 'Pending' && (
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Note to Student (Optional)</label>
                  <textarea
                    rows="2"
                    value={triageNote}
                    onChange={(e) => setTriageNote(e.target.value)}
                    placeholder="Provide a reason or instructions..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm resize-none dark:text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleStatusUpdate('Rejected')} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <XCircle size={18} /> Reject
                  </button>
                  <button onClick={() => handleStatusUpdate('Approved')} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle size={18} /> Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </SlideOver>
    </div>
  );
};

export default LeaveRequests;
