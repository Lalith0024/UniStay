import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  AlertCircle,
  CreditCard,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API_BASE_URL from '../../config';

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    complaints: { total: 0, pending: 0, resolved: 0 },
    leaves: { total: 0, pending: 0, approved: 0 },
    payments: { due: 0, paid: 0 },
    notices: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock Data for Fallback
  const mockData = {
    stats: {
      complaints: { total: 12, pending: 3, resolved: 9 },
      leaves: { total: 5, pending: 1, approved: 4 },
      payments: { due: 8500, paid: 42500 },
      notices: 8
    },
    recentComplaints: [
      { _id: '1', issue: 'WiFi Connectivity', status: 'In Progress', priority: 'High', description: 'Internet is very slow in room 304 since yesterday.', date: new Date().toISOString() },
      { _id: '2', issue: 'Leaking Tap', status: 'Pending', priority: 'Medium', description: 'Bathroom tap is leaking continuously.', date: new Date(Date.now() - 86400000).toISOString() },
      { _id: '3', issue: 'AC Not Cooling', status: 'Resolved', priority: 'High', description: 'AC unit needs servicing.', date: new Date(Date.now() - 172800000).toISOString() }
    ],
    recentNotices: [
      { _id: '1', title: 'Hostel Night 2024', priority: 'High', description: 'Join us for a night of music, dance, and fun on Dec 15th!', date: new Date().toISOString() },
      { _id: '2', title: 'Maintenance Schedule', priority: 'Medium', description: 'Water tank cleaning scheduled for next Sunday.', date: new Date(Date.now() - 86400000).toISOString() },
      { _id: '3', title: 'Exam Schedule Released', priority: 'High', description: 'Final semester exam dates have been announced.', date: new Date(Date.now() - 172800000).toISOString() }
    ],
    activityData: [
      { month: 'Jul', complaints: 1, leaves: 0 },
      { month: 'Aug', complaints: 2, leaves: 1 },
      { month: 'Sep', complaints: 0, leaves: 2 },
      { month: 'Oct', complaints: 3, leaves: 1 },
      { month: 'Nov', complaints: 1, leaves: 0 },
      { month: 'Dec', complaints: 2, leaves: 1 },
    ]
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);

      // Fetch complaints
      const complaintsRes = await fetch(`${API_BASE_URL}/api/complaints?limit=5&sort=createdAt:desc`);
      const complaintsData = await complaintsRes.json();

      // Fetch leaves
      const leavesRes = await fetch(`${API_BASE_URL}/api/leaves?limit=5&sort=createdAt:desc`);
      const leavesData = await leavesRes.json();

      // Fetch notices
      const noticesRes = await fetch(`${API_BASE_URL}/api/notices?limit=5&sort=createdAt:desc`);
      const noticesData = await noticesRes.json();

      // Use API data if available, otherwise fallback to mock data
      const hasComplaints = complaintsData.data && complaintsData.data.length > 0;
      const hasLeaves = leavesData.data && leavesData.data.length > 0;
      const hasNotices = noticesData.data && noticesData.data.length > 0;

      setRecentComplaints(hasComplaints ? complaintsData.data : mockData.recentComplaints);
      setRecentLeaves(hasLeaves ? leavesData.data : []); // Leaves usually personal, maybe don't mock list if empty
      setRecentNotices(hasNotices ? noticesData.data : mockData.recentNotices);

      // Calculate stats
      const pendingComplaints = hasComplaints ? (complaintsData.data?.filter(c => c.status === 'Pending').length || 0) : mockData.stats.complaints.pending;
      const resolvedComplaints = hasComplaints ? (complaintsData.data?.filter(c => c.status === 'Resolved').length || 0) : mockData.stats.complaints.resolved;

      const pendingLeaves = hasLeaves ? (leavesData.data?.filter(l => l.status === 'Pending').length || 0) : mockData.stats.leaves.pending;
      const approvedLeaves = hasLeaves ? (leavesData.data?.filter(l => l.status === 'Approved').length || 0) : mockData.stats.leaves.approved;

      setStats({
        complaints: {
          total: hasComplaints ? (complaintsData.meta?.total || 0) : mockData.stats.complaints.total,
          pending: pendingComplaints,
          resolved: resolvedComplaints
        },
        leaves: {
          total: hasLeaves ? (leavesData.meta?.total || 0) : mockData.stats.leaves.total,
          pending: pendingLeaves,
          approved: approvedLeaves
        },
        payments: mockData.stats.payments, // Mock payments for now
        notices: hasNotices ? (noticesData.meta?.total || 0) : mockData.stats.notices
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to full mock data on error
      setRecentComplaints(mockData.recentComplaints);
      setRecentNotices(mockData.recentNotices);
      setStats(mockData.stats);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'approved':
      case 'paid':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30';
      case 'rejected':
      case 'overdue':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'text-rose-500 font-medium';
      case 'medium':
      case 'normal':
        return 'text-amber-500 font-medium';
      case 'low':
        return 'text-emerald-500 font-medium';
      default:
        return 'text-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-neutral-700"></div>
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-teal-400 dark:from-primary-900 dark:via-primary-800 dark:to-teal-900 p-8 md:p-10 shadow-xl shadow-primary-500/20"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={120} className="text-white" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-3"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                Academic Year 2024-25
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
              </h2>
              <p className="text-white/90 text-lg font-medium max-w-xl">
                Room {user?.room || '304'}, Block {user?.block || 'A'} • {user?.department || 'Computer Science'}
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-white/80 text-sm text-right">Last login: Today, 9:00 AM</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700 hover:border-blue-200 dark:hover:border-blue-500/30 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 group-hover:scale-110 transition-transform duration-300">
              <Home className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Room {user?.room || '304'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Block {user?.block || 'A'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700 hover:border-orange-200 dark:hover:border-orange-500/30 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="w-6 h-6 text-orange-500 dark:text-orange-400" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20">
              {stats.complaints.pending} Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{stats.complaints.total} Complaints</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stats.complaints.resolved} Resolved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700 hover:border-purple-200 dark:hover:border-purple-500/30 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
              {stats.leaves.pending} Pending
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{stats.leaves.total} Leaves</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stats.leaves.approved} Approved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="group bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-500/30 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
              Paid
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">₹{stats.payments.due}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Monthly Rent</p>
        </motion.div>
      </div>

      {/* Activity Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-primary-500" />
                Activity Overview
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complaints vs Leaves (Last 6 months)</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeaves" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#1e293b',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#1e293b' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="complaints"
                  name="Complaints"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorComplaints)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="leaves"
                  name="Leaves"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLeaves)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link
              to="/student/complaints"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-100 dark:border-orange-500/20 hover:shadow-md hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                  <AlertCircle size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">New Complaint</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/student/leaves"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-500/20 hover:shadow-md hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                  <Calendar size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Request Leave</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/student/payments"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-500/20 hover:shadow-md hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CreditCard size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Pay Rent</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/student/notices"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-500/20 hover:shadow-md hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Bell size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">View Notices</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <AlertCircle size={20} className="text-primary-500" />
              Recent Complaints
            </h3>
            <Link to="/student/complaints" className="text-sm text-primary-600 hover:text-primary-700 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentComplaints.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <CheckCircle size={40} className="mb-2 opacity-50" />
                <p>No complaints yet</p>
              </div>
            ) : (
              recentComplaints.slice(0, 3).map((complaint) => (
                <div key={complaint._id} className="group p-4 rounded-xl border border-slate-100 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-700/30 hover:bg-white dark:hover:bg-neutral-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {complaint.issue}
                    </h4>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">{complaint.description}</p>
                  <div className="flex items-center gap-3 border-t border-slate-100 dark:border-neutral-700 pt-3">
                    <span className={`text-xs flex items-center gap-1 ${getPriorityColor(complaint.priority)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {complaint.priority}
                    </span>
                    <span className="text-slate-300 dark:text-neutral-600">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(complaint.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-slate-100 dark:border-neutral-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Bell size={20} className="text-primary-500" />
              Recent Notices
            </h3>
            <Link to="/student/notices" className="text-sm text-primary-600 hover:text-primary-700 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentNotices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Bell size={40} className="mb-2 opacity-50" />
                <p>No notices yet</p>
              </div>
            ) : (
              recentNotices.slice(0, 3).map((notice) => (
                <div key={notice._id} className="group p-4 rounded-xl border border-slate-100 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-700/30 hover:bg-white dark:hover:bg-neutral-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {notice.title}
                    </h4>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${getPriorityColor(notice.priority)} bg-opacity-10`}>
                      {notice.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">{notice.description}</p>
                  <div className="flex items-center gap-2 border-t border-slate-100 dark:border-neutral-700 pt-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(notice.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
