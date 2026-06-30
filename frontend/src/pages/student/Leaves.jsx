import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Search, MapPin, X, CheckCircle, Clock, LogOut, LogIn, FileText, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import SlideOver from '../../components/ui/SlideOver';
import Badge from '../../components/ui/Badge';
import StatusStepper from '../../components/ui/StatusStepper';
import Timeline from '../../components/ui/Timeline';
import config from '../../config';
import { toast } from 'react-toastify';

const API_BASE_URL = config.API_URL;

export default function StudentLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newLeave, setNewLeave] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, [searchTerm]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${API_BASE_URL}/api/leaves?studentId=${user.studentId || user._id}&limit=100&sort=createdAt:desc`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      let fetchedLeaves = data.data || [];
      if (searchTerm) {
        fetchedLeaves = fetchedLeaves.filter(l => l.reason.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      setLeaves(fetchedLeaves);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLeaves([]);
      setLoading(false);
    }
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = { ...newLeave, studentId: user.studentId || user._id, status: 'Pending' };

      const response = await fetch(`${API_BASE_URL}/api/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Leave request submitted successfully!');
        setShowAddModal(false);
        setNewLeave({ fromDate: '', toDate: '', reason: '' });
        fetchLeaves();
      } else {
        toast.error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error adding leave request:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaves/${id}/${action}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        toast.success(`Successfully ${action === 'checkout' ? 'checked out' : 'checked in'}`);
        fetchLeaves();
        setSlideOverOpen(false);
      } else {
        toast.error(`Failed to ${action}`);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error(`Error occurred.`);
    }
  };

  const handleView = (leave) => {
    setSelectedLeave(leave);
    setSlideOverOpen(true);
  };

  const activeLeaves = leaves.filter(l => ['Pending', 'Approved', 'Checked Out'].includes(l.status));
  const historyLeaves = leaves.filter(l => ['Rejected', 'Completed'].includes(l.status));

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <PageHeader 
        title="Leave Management" 
        description="Track your out-passes, leave requests, and travel history."
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Request</span>
          </button>
        }
      />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
      ) : leaves.length === 0 ? (
        <EmptyState 
          icon={MapPin}
          title="No Leave History"
          description={searchTerm ? "No requests match your search." : "You have no active or past leave requests."}
          action={
            <button onClick={() => setShowAddModal(true)} className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors">
              Start a Request
            </button>
          }
        />
      ) : (
        <div className="space-y-8">
          {activeLeaves.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Clock size={18} className="text-primary-500"/> Active Requests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeLeaves.map((leave) => (
                  <LeaveCard key={leave._id} leave={leave} onClick={() => handleView(leave)} isActive />
                ))}
              </div>
            </div>
          )}

          {historyLeaves.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <FileText size={18} className="text-slate-500"/> Past History
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyLeaves.map((leave) => (
                  <LeaveCard key={leave._id} leave={leave} onClick={() => handleView(leave)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SlideOver Details */}
      <SlideOver isOpen={slideOverOpen} onClose={() => setSlideOverOpen(false)} title="Leave Details">
        {selectedLeave && (
          <div className="space-y-8 pb-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4">
              <span className="text-slate-500 font-mono text-xs font-bold bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                #{selectedLeave._id.slice(-6)}
              </span>
              <span className="text-xs text-slate-500">
                Requested {new Date(selectedLeave.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{selectedLeave.reason}</h2>
              <div className="flex gap-2 mb-6">
                <Badge variant={selectedLeave.status === 'Approved' ? 'success' : selectedLeave.status === 'Rejected' ? 'danger' : selectedLeave.status === 'Checked Out' ? 'primary' : selectedLeave.status === 'Completed' ? 'secondary' : 'warning'}>
                  {selectedLeave.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">From Date</h4>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  {new Date(selectedLeave.fromDate).toLocaleDateString()}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">To Date</h4>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  {new Date(selectedLeave.toDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Request Progress</h4>
              <StatusStepper 
                steps={['Pending', 'Approved', 'Checked Out', 'Completed']} 
                currentStatus={selectedLeave.status} 
              />
            </div>

            {selectedLeave.note && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Note from Warden</h4>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-900/30 font-medium">
                  "{selectedLeave.note}"
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedLeave.status === 'Approved' && (
              <div className="pt-4">
                <button onClick={() => handleAction(selectedLeave._id, 'checkout')} className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary-500/20">
                  <LogOut size={20} /> Check Out Now
                </button>
              </div>
            )}
            
            {selectedLeave.status === 'Checked Out' && (
              <div className="pt-4">
                <button onClick={() => handleAction(selectedLeave._id, 'checkin')} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20">
                  <LogIn size={20} /> Check In Now
                </button>
              </div>
            )}

          </div>
        )}
      </SlideOver>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">New Request</h3>
                  <p className="text-sm text-slate-500">Where are you heading?</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 p-2 rounded-lg"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddLeave} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1">Reason / Destination</label>
                  <input type="text" required value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} placeholder="e.g. Home, Wedding, Medical" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1">From Date</label>
                    <input type="date" required value={newLeave.fromDate} onChange={e => setNewLeave({...newLeave, fromDate: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1">To Date</label>
                    <input type="date" required value={newLeave.toDate} onChange={e => setNewLeave({...newLeave, toDate: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-primary-500 text-white font-bold rounded-xl mt-4 hover:bg-primary-600 shadow-lg shadow-primary-500/20">Submit Request</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LeaveCard({ leave, onClick, isActive }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`bg-white dark:bg-zinc-900 p-6 rounded-2xl border cursor-pointer group transition-all flex flex-col h-full ${isActive ? 'border-primary-200 dark:border-primary-900/50 shadow-md hover:shadow-lg' : 'border-slate-200 dark:border-zinc-800 shadow-sm hover:border-slate-300'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <Badge variant={leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : leave.status === 'Checked Out' ? 'primary' : leave.status === 'Completed' ? 'secondary' : 'warning'}>
          {leave.status}
        </Badge>
        <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-500' : 'bg-slate-50 dark:bg-zinc-800/50 text-slate-400 group-hover:bg-slate-100'}`}>
          {isActive ? <MapPin size={20} /> : <FileText size={20} />}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-1 group-hover:text-primary-600 transition-colors">
        {leave.reason}
      </h3>

      <div className="mt-auto space-y-2 text-sm text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />
          <span>{new Date(leave.fromDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {new Date(leave.toDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
        </div>
      </div>
    </motion.div>
  );
}
