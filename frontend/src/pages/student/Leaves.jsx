import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
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
  ChevronDown,
  LogOut,
  LogIn,
  MapPin,
  FileText,
  Activity
} from 'lucide-react';
import config from '../../config';

const API_BASE_URL = config.API_URL;

export default function StudentLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'

  // Form State
  const [newLeave, setNewLeave] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Fetch all leaves for the student
      // In a real app, we might want to filter on backend, but for now we fetch all and sort client-side
      // to easily separate active vs history without complex backend queries right now.
      const response = await fetch(`${API_BASE_URL}/api/leaves?studentId=${user._id}&limit=100&sort=createdAt:desc`);
      const data = await response.json();

      if (data.data) {
        setLeaves(data.data);
      } else {
        setLeaves([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLoading(false);
    }
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user._id && !user.studentId) {
        alert('User not found. Please login again.');
        return;
      }

      const payload = {
        ...newLeave,
        studentId: user.studentId || user._id,
        status: 'Pending'
      };

      console.log('Submitting leave request:', payload);
      console.log('API URL:', `${API_BASE_URL}/api/leaves`);

      const response = await fetch(`${API_BASE_URL}/api/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        alert('Leave request submitted successfully!');
        setShowAddModal(false);
        setNewLeave({ fromDate: '', toDate: '', reason: '' });
        fetchLeaves();
        setActiveTab('active'); // Switch to active tab to show the new request
      } else {
        alert(`Error: ${data.message || 'Failed to submit request'}`);
      }
    } catch (error) {
      console.error('Error adding leave request:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCheckout = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaves/${id}/checkout`, {
        method: 'PATCH'
      });
      if (response.ok) fetchLeaves();
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  const handleCheckin = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaves/${id}/checkin`, {
        method: 'PATCH'
      });
      if (response.ok) fetchLeaves();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  // Filter Logic
  // Active: Pending, Approved, Checked Out
  // History: Rejected, Completed
  const activeLeaves = leaves.filter(l => ['Pending', 'Approved', 'Checked Out'].includes(l.status));
  const historyLeaves = leaves.filter(l => ['Rejected', 'Completed'].includes(l.status));

  // Get the most relevant active leave (the one created most recently)
  const currentLeave = activeLeaves.length > 0 ? activeLeaves[0] : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Leave Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Track your requests and travel history
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/20 dark:hover:shadow-white/20"
        >
          <Plus size={20} className="transition-transform group-hover:rotate-90" />
          <span>New Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'active'
            ? 'text-slate-900 dark:text-white'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
          Active Request
          {activeTab === 'active' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'history'
            ? 'text-slate-900 dark:text-white'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
          History
          {activeTab === 'history' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full"
            />
          )}
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'active' ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div>
              </div>
            ) : currentLeave ? (
              <TimelineView
                leave={currentLeave}
                onCheckout={() => handleCheckout(currentLeave._id)}
                onCheckin={() => handleCheckin(currentLeave._id)}
              />
            ) : (
              <EmptyState onAction={() => setShowAddModal(true)} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HistoryView leaves={historyLeaves} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddLeaveModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddLeave}
            newLeave={newLeave}
            setNewLeave={setNewLeave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

function TimelineView({ leave, onCheckout, onCheckin }) {
  const steps = [
    {
      id: 'request',
      title: 'Request Raised',
      date: leave.createdAt,
      status: 'completed',
      icon: FileText,
      description: 'Your leave request has been submitted successfully.'
    },
    {
      id: 'approval',
      title: 'Warden Approval',
      date: leave.updatedAt, // Approximate
      status: leave.status === 'Pending' ? 'current' : 'completed',
      icon: CheckCircle,
      description: leave.status === 'Pending'
        ? 'Waiting for warden approval...'
        : 'Your request has been approved by the warden.'
    },
    {
      id: 'checkout',
      title: 'Check Out',
      date: leave.checkoutDate,
      status: leave.status === 'Approved' ? 'current' : (leave.status === 'Checked Out' ? 'completed' : 'pending'),
      icon: LogOut,
      description: 'Scan QR or confirm at the gate to leave.',
      action: leave.status === 'Approved' ? onCheckout : null,
      actionLabel: 'Check Out Now'
    },
    {
      id: 'checkin',
      title: 'Check In',
      date: leave.checkinDate,
      status: leave.status === 'Checked Out' ? 'current' : 'pending',
      icon: LogIn,
      description: 'Mark your return to the hostel.',
      action: leave.status === 'Checked Out' ? onCheckin : null,
      actionLabel: 'Check In Now'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Details Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-slate-100 dark:border-neutral-700 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Current Trip</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{leave.reason}</h2>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
              leave.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
              {leave.status}
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-700/50 text-slate-600 dark:text-slate-300">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Duration</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-700/50 text-slate-600 dark:text-slate-300">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Requested On</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {new Date(leave.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Timeline */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-slate-100 dark:border-neutral-700 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Request Timeline</h3>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-neutral-700" />

            <div className="space-y-12">
              {steps.map((step, index) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                const isPending = step.status === 'pending';

                return (
                  <div key={step.id} className="relative flex gap-6 group">
                    {/* Icon Bubble */}
                    <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted
                      ? 'bg-emerald-500 border-emerald-100 dark:border-emerald-900/30 text-white'
                      : isCurrent
                        ? 'bg-white dark:bg-neutral-800 border-blue-500 text-blue-500 shadow-lg shadow-blue-500/20 scale-110'
                        : 'bg-slate-100 dark:bg-neutral-700 border-white dark:border-neutral-800 text-slate-400'
                      }`}>
                      <step.icon size={isCurrent ? 20 : 18} />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pt-1 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className={`text-lg font-bold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                          }`}>
                          {step.title}
                        </h4>
                        {step.date && (
                          <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-neutral-700/50 px-2 py-1 rounded-lg">
                            {new Date(step.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
                        {step.description}
                      </p>

                      {/* Action Button */}
                      {isCurrent && step.action && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={step.action}
                          className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                        >
                          {step.actionLabel}
                          <ChevronRight size={16} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-32 h-32 bg-slate-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <MapPin size={48} className="text-slate-300 dark:text-neutral-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        No Active Trips
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        You don't have any active leave requests. Planning to go somewhere?
      </p>
      <button
        onClick={onAction}
        className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
      >
        Start New Request
      </button>
    </div>
  );
}

function HistoryView({ leaves, loading }) {
  if (loading) return null;

  if (leaves.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>No past leave history found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leaves.map((leave, index) => (
        <motion.div
          key={leave._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-200 dark:border-neutral-700 hover:border-slate-300 dark:hover:border-neutral-600 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-700/50 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${leave.status === 'Completed'
              ? 'bg-slate-100 text-slate-600 dark:bg-neutral-700 dark:text-slate-300'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
              {leave.status}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
            {leave.reason}
          </h3>

          <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Requested {new Date(leave.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AddLeaveModal({ isOpen, onClose, onSubmit, newLeave, setNewLeave }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-neutral-700"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">New Request</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Where are you going?</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-700 transition-colors text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Reason / Destination
              </label>
              <input
                type="text"
                required
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                placeholder="e.g. Home, Wedding, Medical"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  From
                </label>
                <input
                  type="date"
                  required
                  value={newLeave.fromDate}
                  onChange={(e) => setNewLeave({ ...newLeave, fromDate: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  To
                </label>
                <input
                  type="date"
                  required
                  value={newLeave.toDate}
                  onChange={(e) => setNewLeave({ ...newLeave, toDate: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-6 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
