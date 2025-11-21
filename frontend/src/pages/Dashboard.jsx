import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Users,
  Home,
  AlertCircle,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  PieChart
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Sample data for charts
  const occupancyData = [
    { month: 'Jan', occupancy: 85, capacity: 100 },
    { month: 'Feb', occupancy: 92, capacity: 100 },
    { month: 'Mar', occupancy: 88, capacity: 100 },
    { month: 'Apr', occupancy: 95, capacity: 100 },
    { month: 'May', occupancy: 90, capacity: 100 },
    { month: 'Jun', occupancy: 97, capacity: 100 },
  ];

  const complaintData = [
    { name: 'Resolved', value: 145, color: '#00f2ea' },
    { name: 'Pending', value: 23, color: '#fbbf24' },
    { name: 'In Progress', value: 12, color: '#a78bfa' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const stats = [
    {
      label: 'Total Students',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Available Rooms',
      value: '34',
      change: '-5%',
      icon: Home,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Active Complaints',
      value: '12',
      change: '-23%',
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Revenue (MTD)',
      value: '₹67K',
      change: '+18%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
  ];

  const recentActivities = [
    { id: 1, type: 'New Student', name: 'Rahul Sharma', time: '5 mins ago', icon: Users },
    { id: 2, type: 'Complaint Resolved', name: 'Room 204 - AC Issue', time: '1 hour ago', icon: AlertCircle },
    { id: 3, type: 'Payment Received', name: 'Priya Patel - Room 305', time: '2 hours ago', icon: TrendingUp },
    { id: 4, type: 'Maintenance', name: 'Block A - Water Supply', time: '3 hours ago', icon: Settings },
  ];

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
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">UNISTAY Dashboard</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back, {user.name || 'User'}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-brandDark-800 transition-colors relative">
                <Bell size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-brandDark-900 rounded-2xl p-6 border border-slate-200 dark:border-brandDark-800 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Occupancy Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-brandDark-900 rounded-2xl p-6 border border-slate-200 dark:border-brandDark-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary-500" />
                  Occupancy Trend
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last 6 months</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f2ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="occupancy" stroke="#00f2ea" fillOpacity={1} fill="url(#colorOccupancy)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Complaint Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-brandDark-900 rounded-2xl p-6 border border-slate-200 dark:border-brandDark-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart size={20} className="text-primary-500" />
                  Complaint Status
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current month</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={complaintData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {complaintData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value, entry) => (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {value}: {entry.payload.value}
                      </span>
                    )}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Revenue Chart & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 bg-white dark:bg-brandDark-900 rounded-2xl p-6 border border-slate-200 dark:border-brandDark-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary-500" />
                  Revenue Overview
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly revenue in ₹</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#00f2ea" strokeWidth={3} dot={{ fill: '#00f2ea', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-brandDark-900 rounded-2xl p-6 border border-slate-200 dark:border-brandDark-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-primary-500" />
                Recent Activity
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-brandDark-800 transition-colors">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <activity.icon size={16} className="text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{activity.type}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{activity.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
