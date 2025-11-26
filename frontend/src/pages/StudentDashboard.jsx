import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Home,
  AlertCircle,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const roomInfo = {
    number: '304',
    block: 'A',
    floor: '3rd',
    type: 'Double Sharing',
    rent: '₹8,500/month',
    dueDate: '5th of every month'
  };

  const myComplaints = [
    { id: 1, title: 'AC not working', status: 'In Progress', date: '2024-11-20', priority: 'High' },
    { id: 2, title: 'Water leakage in bathroom', status: 'Resolved', date: '2024-11-18', priority: 'Medium' },
    { id: 3, title: 'WiFi connectivity issue', status: 'Pending', date: '2024-11-21', priority: 'Low' },
  ];

  const payments = [
    { id: 1, month: 'November 2024', amount: '₹8,500', status: 'Paid', date: '2024-11-05' },
    { id: 2, month: 'October 2024', amount: '₹8,500', status: 'Paid', date: '2024-10-05' },
    { id: 3, month: 'September 2024', amount: '₹8,500', status: 'Paid', date: '2024-09-05' },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brandDark-950">
      {/* Navbar */}
      <nav className="bg-white dark:bg-brandDark-900 border-b border-slate-200 dark:border-brandDark-800 sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-brandDark-900/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                U
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">UNISTAY</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-brandDark-800 transition-colors relative">
                <Bell size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-brandDark-800">
                <User size={18} className="text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.name || 'Student'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-brandDark-800 hover:bg-slate-200 dark:hover:bg-brandDark-700 transition-colors text-slate-700 dark:text-slate-300"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-teal-400 rounded-2xl p-8 mb-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
          <p className="text-white/90">Room {roomInfo.number}, Block {roomInfo.block} • {roomInfo.type}</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-brandDark-900 rounded-2xl p-6 border border-slate-200 dark:border-brandDark-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Home className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Room {roomInfo.number}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Block {roomInfo.block}, {roomInfo.floor} Floor</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-brandDark-900 rounded-2xl p-6 border border-slate-200 dark:border-brandDark-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                1 Active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">3 Complaints</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">1 Pending, 1 In Progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-brandDark-900 rounded-2xl p-6 border border-slate-200 dark:border-brandDark-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Paid
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{roomInfo.rent}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Due on {roomInfo.dueDate}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-brandDark-900 rounded-2xl border border-slate-200 dark:border-brandDark-800 overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-brandDark-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'overview'
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-brandDark-800'
                }`}
            >
              <Home className="w-4 h-4 inline-block mr-2" />
              Room Details
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'complaints'
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-brandDark-800'
                }`}
            >
              <AlertCircle className="w-4 h-4 inline-block mr-2" />
              My Complaints
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'payments'
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-brandDark-800'
                }`}
            >
              <CreditCard className="w-4 h-4 inline-block mr-2" />
              Payments
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-brandDark-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Room Type</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{roomInfo.type}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-brandDark-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monthly Rent</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{roomInfo.rent}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-brandDark-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Block</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">Block {roomInfo.block}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-brandDark-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Floor</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{roomInfo.floor} Floor</p>
                  </div>
                </div>
                <button className="w-full mt-4 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  Raise a Complaint
                </button>
              </motion.div>
            )}

            {activeTab === 'complaints' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {myComplaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 rounded-lg border border-slate-200 dark:border-brandDark-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{complaint.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <Calendar size={14} />
                          {complaint.date}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-4 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <AlertCircle size={18} />
                  New Complaint
                </button>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 rounded-lg border border-slate-200 dark:border-brandDark-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{payment.month}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{payment.amount}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
