import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Plus, Search, Filter, X, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import SlideOver from '../../components/ui/SlideOver';
import Badge from '../../components/ui/Badge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import StatusStepper from '../../components/ui/StatusStepper';
import Timeline from '../../components/ui/Timeline';
import config from '../../config';
import { toast } from 'react-toastify';

const API_BASE_URL = config.API_URL;

export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newComplaint, setNewComplaint] = useState({
    issue: '',
    description: '',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, [searchTerm]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      let url = `${API_BASE_URL}/api/complaints?limit=100&sort=createdAt:desc&studentId=${user.studentId || user._id}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      const data = await response.json();
      
      setComplaints(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
      setLoading(false);
    }
  };

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ ...newComplaint, studentId: user.studentId || user._id, status: 'Pending' })
      });

      if (response.ok) {
        toast.success("Complaint submitted successfully.");
        setShowAddModal(false);
        setNewComplaint({ issue: '', description: '', priority: 'Medium' });
        fetchComplaints();
      } else {
        toast.error("Failed to submit complaint.");
      }
    } catch (error) {
      console.error('Error adding complaint:', error);
      toast.error("An error occurred.");
    }
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setSlideOverOpen(true);
  };

  // Group complaints for Kanban
  const openComplaints = complaints.filter(c => c.status === 'Pending' || c.status === 'Open');
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress');
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Rejected');

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <PageHeader 
        title="My Complaints" 
        description="Track your maintenance requests and issues."
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Complaint</span>
          </button>
        }
      />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search your complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
      ) : complaints.length === 0 ? (
        <EmptyState 
          icon={AlertCircle}
          title="No issues reported"
          description={searchTerm ? "No complaints match your search." : "Everything looks good! Report an issue if you need maintenance."}
          action={
            <button onClick={() => setShowAddModal(true)} className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors">
              Report an Issue
            </button>
          }
        />
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          <KanbanColumn title="Pending" icon={Clock} count={openComplaints.length} color="warning">
            {openComplaints.map(c => <ComplaintCard key={c._id} complaint={c} onClick={() => handleView(c)} />)}
          </KanbanColumn>
          <KanbanColumn title="In Progress" icon={AlertCircle} count={inProgressComplaints.length} color="primary">
            {inProgressComplaints.map(c => <ComplaintCard key={c._id} complaint={c} onClick={() => handleView(c)} />)}
          </KanbanColumn>
          <KanbanColumn title="Resolved" icon={CheckCircle} count={resolvedComplaints.length} color="success">
            {resolvedComplaints.map(c => <ComplaintCard key={c._id} complaint={c} onClick={() => handleView(c)} />)}
          </KanbanColumn>
        </div>
      )}

      {/* SlideOver Details */}
      <SlideOver isOpen={slideOverOpen} onClose={() => setSlideOverOpen(false)} title="Complaint Details">
        {selectedComplaint && (
          <div className="space-y-8 pb-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4">
              <span className="text-slate-500 font-mono text-xs font-bold bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                #{selectedComplaint._id.slice(-6)}
              </span>
              <span className="text-xs text-slate-500">
                Filed on {new Date(selectedComplaint.date || selectedComplaint.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{selectedComplaint.issue}</h2>
              <div className="flex gap-2 mb-6">
                <Badge variant={selectedComplaint.status === 'Resolved' ? 'success' : selectedComplaint.status === 'Pending' ? 'warning' : selectedComplaint.status === 'In Progress' ? 'primary' : 'danger'}>
                  {selectedComplaint.status}
                </Badge>
                <PriorityBadge priority={selectedComplaint.priority} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
              <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {selectedComplaint.description}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Progress</h4>
              <StatusStepper 
                steps={['Pending', 'In Progress', 'Resolved']} 
                currentStatus={selectedComplaint.status} 
              />
            </div>

            {selectedComplaint.history && selectedComplaint.history.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">History</h4>
                <Timeline items={selectedComplaint.history.map((h, i) => ({
                  title: `Status: ${h.status}`,
                  description: h.note || 'No notes provided.',
                  time: new Date(h.timestamp).toLocaleString(),
                  isActive: i === 0
                }))} />
              </div>
            )}
          </div>
        )}
      </SlideOver>

      {/* Add Complaint Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Report an Issue</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 p-2 rounded-lg"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddComplaint} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1">Issue Title</label>
                  <input type="text" required value={newComplaint.issue} onChange={e => setNewComplaint({...newComplaint, issue: e.target.value})} placeholder="e.g. Broken window" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1">Description</label>
                  <textarea required rows={4} value={newComplaint.description} onChange={e => setNewComplaint({...newComplaint, description: e.target.value})} placeholder="Provide details..." className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1">Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map(p => (
                      <button key={p} type="button" onClick={() => setNewComplaint({...newComplaint, priority: p})} className={`py-2 rounded-xl text-sm font-bold border transition-colors ${newComplaint.priority === p ? 'bg-primary-500 text-white border-primary-500' : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800'}`}>{p}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-primary-500 text-white font-bold rounded-xl mt-4 hover:bg-primary-600">Submit</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents for Kanban
function KanbanColumn({ title, icon: Icon, count, children, color }) {
  const colorMap = {
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20',
    primary: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20',
    success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20',
  };

  return (
    <div className="flex flex-col bg-slate-50/50 dark:bg-zinc-950/50 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
          <Icon size={18} className={colorMap[color].split(' ')[0]} />
          {title}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colorMap[color]}`}>{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
        {children}
        {count === 0 && <p className="text-xs text-slate-400 text-center py-4">No {title.toLowerCase()} complaints.</p>}
      </div>
    </div>
  );
}

function ComplaintCard({ complaint, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md cursor-pointer group transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={complaint.priority} />
        <span className="text-[10px] font-mono text-slate-400">#{complaint._id.slice(-4)}</span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 group-hover:text-primary-600 line-clamp-2">{complaint.issue}</h4>
      <div className="flex items-center text-[10px] font-semibold text-slate-500">
        <Clock size={12} className="mr-1"/>
        {new Date(complaint.createdAt || complaint.date).toLocaleDateString()}
      </div>
    </motion.div>
  );
}
