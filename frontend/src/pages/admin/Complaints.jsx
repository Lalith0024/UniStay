import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Pagination from '../../components/ui/Pagination';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import DataTable from '../../components/ui/DataTable';
import SlideOver from '../../components/ui/SlideOver';
import PriorityBadge from '../../components/ui/PriorityBadge';
import Timeline from '../../components/ui/Timeline';
import { Search, AlertCircle, Eye, CheckCircle, Clock, XCircle, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [triageNote, setTriageNote] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, status: statusFilter, search };
      const res = await axios.get(`${config.API_URL}/api/complaints`, {
        params,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setComplaints(res.data.data);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to fetch complaints");
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

  const handleStatusUpdate = async (newStatus) => {
    if(!selectedComplaint) return;
    try {
      // API expects optional 'note' field to append to history
      await axios.patch(`${config.API_URL}/api/complaints/${selectedComplaint._id}`,
        { status: newStatus, note: triageNote },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`Complaint marked as ${newStatus}`);
      setTriageNote('');
      setSlideOverOpen(false);
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setSlideOverOpen(true);
  };

  const tableColumns = [
    { header: 'ID', render: (row) => <span className="text-slate-500 font-mono text-xs">#{row._id.slice(-6)}</span> },
    { header: 'Issue', accessor: 'issue', cellClassName: 'font-bold' },
    { header: 'Student', render: (row) => (
      <div>
        <div className="font-semibold">{row.studentId?.name || "Unknown"}</div>
        <div className="text-xs text-slate-500">Room {row.studentId?.room || "N/A"}</div>
      </div>
    )},
    { header: 'Priority', render: (row) => <PriorityBadge priority={row.priority} /> },
    { header: 'Status', render: (row) => (
      <Badge variant={row.status === 'Resolved' ? 'success' : row.status === 'Pending' ? 'warning' : row.status === 'In Progress' ? 'primary' : 'danger'}>
        {row.status}
      </Badge>
    )},
    { header: 'Date', render: (row) => new Date(row.date || row.createdAt).toLocaleDateString() },
    { header: '', render: (row) => (
      <button onClick={(e) => { e.stopPropagation(); handleView(row); }} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg">
        <Eye size={18} />
      </button>
    ), cellClassName: 'text-right' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Complaints Triage" 
        description="Review, triage, and resolve student maintenance and service requests."
      />

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search issue, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map((status) => {
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
        ) : complaints.length === 0 ? (
          <EmptyState icon={AlertCircle} title="No Complaints Found" description="You have no complaints matching the criteria." />
        ) : (
          <DataTable columns={tableColumns} data={complaints} onRowClick={handleView} />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Triage SlideOver */}
      <SlideOver isOpen={slideOverOpen} onClose={() => setSlideOverOpen(false)} title="Triage Complaint">
        {selectedComplaint && (
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-6 pb-6 custom-scrollbar">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono text-xs font-bold bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                  #{selectedComplaint._id.slice(-6)}
                </span>
                <Badge variant={selectedComplaint.status === 'Resolved' ? 'success' : selectedComplaint.status === 'Pending' ? 'warning' : selectedComplaint.status === 'In Progress' ? 'primary' : 'danger'}>
                  {selectedComplaint.status}
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{selectedComplaint.issue}</h2>
                <div className="inline-block"><PriorityBadge priority={selectedComplaint.priority} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Student</h4>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedComplaint.studentId?.name || "Unknown"}</div>
                  <div className="text-sm text-slate-500">{selectedComplaint.studentId?.email}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</h4>
                  <div className="font-bold text-slate-900 dark:text-white">Room {selectedComplaint.studentId?.room || "N/A"}</div>
                  <div className="text-sm text-slate-500">Block {selectedComplaint.studentId?.block || "-"}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {selectedComplaint.description}
                </div>
              </div>

              {/* History Timeline */}
              {selectedComplaint.history && selectedComplaint.history.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Update History</h4>
                  <Timeline items={selectedComplaint.history.map((h, i) => ({
                    title: `Status changed to ${h.status}`,
                    description: h.note,
                    time: new Date(h.timestamp).toLocaleString(),
                    isActive: i === 0
                  }))} />
                </div>
              )}
            </div>

            {/* Triage Actions Container */}
            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Internal Note (Optional)</label>
                <textarea
                  rows="2"
                  value={triageNote}
                  onChange={(e) => setTriageNote(e.target.value)}
                  placeholder="Add a note to the history log..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm resize-none dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                {selectedComplaint.status !== 'In Progress' && selectedComplaint.status !== 'Resolved' && (
                  <button onClick={() => handleStatusUpdate('In Progress')} className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Clock size={18} /> In Progress
                  </button>
                )}
                {selectedComplaint.status !== 'Resolved' && (
                  <button onClick={() => handleStatusUpdate('Resolved')} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle size={18} /> Resolve
                  </button>
                )}
                {selectedComplaint.status === 'Pending' && (
                  <button onClick={() => handleStatusUpdate('Rejected')} className="flex-1 py-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <XCircle size={18} /> Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
};

export default Complaints;
