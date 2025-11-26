import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
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
  PieChart,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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

  // Management Data
  const [students, setStudents] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', room: '304', block: 'A', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', room: '305', block: 'A', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', room: '201', block: 'B', status: 'Active', joinDate: '2024-03-10' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', room: '402', block: 'C', status: 'Inactive', joinDate: '2023-12-05' },
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, number: '304', block: 'A', type: 'Double', capacity: 2, occupied: 2, rent: 8500, status: 'Occupied' },
    { id: 2, number: '305', block: 'A', type: 'Single', capacity: 1, occupied: 1, rent: 12000, status: 'Occupied' },
    { id: 3, number: '201', block: 'B', type: 'Triple', capacity: 3, occupied: 3, rent: 6500, status: 'Occupied' },
    { id: 4, number: '402', block: 'C', type: 'Double', capacity: 2, occupied: 0, rent: 8500, status: 'Available' },
    { id: 5, number: '103', block: 'A', type: 'Single', capacity: 1, occupied: 0, rent: 12000, status: 'Maintenance' },
  ]);

  const [complaints, setComplaints] = useState([
    { id: 1, student: 'Rahul Sharma', room: '304', issue: 'AC not working', priority: 'High', status: 'In Progress', date: '2024-11-20' },
    { id: 2, student: 'Priya Patel', room: '305', issue: 'Water leakage', priority: 'Medium', status: 'Resolved', date: '2024-11-18' },
    { id: 3, student: 'Amit Kumar', room: '201', issue: 'WiFi issue', priority: 'Low', status: 'Pending', date: '2024-11-21' },
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'occupied':
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
      case 'pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'available':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'maintenance':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
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

        {/* Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white dark:bg-brandDark-900 rounded-2xl border border-slate-200 dark:border-brandDark-800 overflow-hidden"
        >
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 dark:border-brandDark-800 bg-slate-50 dark:bg-brandDark-800/50">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'overview'
                  ? 'bg-white dark:bg-brandDark-900 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-brandDark-900/50'
                }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'students'
                  ? 'bg-white dark:bg-brandDark-900 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-brandDark-900/50'
                }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'rooms'
                  ? 'bg-white dark:bg-brandDark-900 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-brandDark-900/50'
                }`}
            >
              <Home className="w-4 h-4 inline-block mr-2" />
              Rooms ({rooms.length})
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'complaints'
                  ? 'bg-white dark:bg-brandDark-900 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-brandDark-900/50'
                }`}
            >
              <AlertCircle className="w-4 h-4 inline-block mr-2" />
              Complaints ({complaints.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                    Overview charts are displayed above. Switch tabs to manage Students, Rooms, or Complaints.
                  </p>
                </motion.div>
              )}

              {activeTab === 'students' && (
                <motion.div
                  key="students"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-brandDark-700 bg-white dark:bg-brandDark-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <button className="p-2 rounded-lg border border-slate-200 dark:border-brandDark-700 hover:bg-slate-50 dark:hover:bg-brandDark-800 transition-colors">
                        <Filter size={18} className="text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-brandDark-700 hover:bg-slate-50 dark:hover:bg-brandDark-800 transition-colors text-slate-700 dark:text-slate-300">
                        <Download size={18} />
                        Export
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors">
                        <UserPlus size={18} />
                        Add Student
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-brandDark-700">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Room</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Block</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Join Date</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b border-slate-100 dark:border-brandDark-800 hover:bg-slate-50 dark:hover:bg-brandDark-800/50 transition-colors">
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white font-medium">{student.name}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{student.email}</td>
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{student.room}</td>
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{student.block}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(student.status)}`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{student.joinDate}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-brandDark-700 transition-colors">
                                  <Edit size={16} className="text-slate-600 dark:text-slate-400" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <Trash2 size={16} className="text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'rooms' && (
                <motion.div
                  key="rooms"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search rooms..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-brandDark-700 bg-white dark:bg-brandDark-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors">
                      <Plus size={18} />
                      Add Room
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-brandDark-700">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Room No.</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Block</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Capacity</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Occupied</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Rent</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => (
                          <tr key={room.id} className="border-b border-slate-100 dark:border-brandDark-800 hover:bg-slate-50 dark:hover:bg-brandDark-800/50 transition-colors">
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white font-medium">{room.number}</td>
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{room.block}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{room.type}</td>
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{room.capacity}</td>
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{room.occupied}</td>
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">₹{room.rent}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(room.status)}`}>
                                {room.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-brandDark-700 transition-colors">
                                  <Edit size={16} className="text-slate-600 dark:text-slate-400" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <Trash2 size={16} className="text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'complaints' && (
                <motion.div
                  key="complaints"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search complaints..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-brandDark-700 bg-white dark:bg-brandDark-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <div key={complaint.id} className="p-4 rounded-lg border border-slate-200 dark:border-brandDark-700 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{complaint.issue}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {complaint.student} • Room {complaint.room} • {complaint.date}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                            <span className={`text-xs font-medium ${complaint.priority === 'High' ? 'text-red-500' :
                                complaint.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                              }`}>
                              {complaint.priority} Priority
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm transition-colors">
                            <CheckCircle size={14} />
                            Resolve
                          </button>
                          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-colors">
                            <Clock size={14} />
                            In Progress
                          </button>
                          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors">
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
