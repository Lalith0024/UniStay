import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Users, BedDouble, AlertCircle, Calendar, Plus, Megaphone, FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Alert from '../../components/ui/Alert';

const DashboardOverview = () => {
  // Dummy Data
  const stats = [
    { title: 'Total Students', value: '450', icon: Users, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { title: 'Rooms Occupied', value: '85%', icon: BedDouble, iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    { title: 'Pending Complaints', value: '12', icon: AlertCircle, iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    { title: 'Leave Requests', value: '5', icon: Calendar, iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  ];

  const quickActions = [
    { label: 'Add Student', icon: Plus, path: '/admin/students', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Post Notice', icon: Megaphone, path: '/admin/notices', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Manage Rooms', icon: BedDouble, path: '/admin/rooms', color: 'bg-emerald-600 hover:bg-emerald-700' },
  ];

  const areaData = [
    { name: 'Jan', students: 400 },
    { name: 'Feb', students: 420 },
    { name: 'Mar', students: 450 },
    { name: 'Apr', students: 450 },
    { name: 'May', students: 430 },
    { name: 'Jun', students: 460 },
  ];

  const pieData = [
    { name: 'Occupied', value: 350 },
    { name: 'Vacant', value: 100 },
    { name: 'Maintenance', value: 50 },
  ];

  const lineData = [
    { name: 'Mon', complaints: 4, resolved: 3 },
    { name: 'Tue', complaints: 7, resolved: 5 },
    { name: 'Wed', complaints: 5, resolved: 4 },
    { name: 'Thu', complaints: 8, resolved: 7 },
    { name: 'Fri', complaints: 6, resolved: 6 },
    { name: 'Sat', complaints: 3, resolved: 2 },
    { name: 'Sun', complaints: 2, resolved: 2 },
  ];

  const COLORS = ['#10B981', '#E5E7EB', '#F59E0B'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 p-8 md:p-10 shadow-sm border border-slate-200 dark:border-neutral-700"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-300 text-lg max-w-xl font-medium">
              Here's what's happening in your hostel today. You have <span className="text-orange-500 font-bold">12 pending complaints</span> to review.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.path}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${action.color}`}
              >
                <action.icon size={18} strokeWidth={2.5} />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative Background Elements - Made very subtle for white theme */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-slate-50 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-50 dark:opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-slate-50 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-50 dark:opacity-20 animate-blob animation-delay-2000"></div>
      </motion.div>

      {/* System Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Alert
          type="warning"
          title="Scheduled Maintenance"
          message="Server maintenance is scheduled for tonight at 2:00 AM. System may be unavailable for 30 mins."
        />
        <Alert
          type="info"
          title="New Feature Available"
          message="You can now bulk-approve leave requests from the Students tab."
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.badge}`}>
                +2.5%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-8">
          {/* Area Chart */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-slate-100 dark:border-neutral-700 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Occupancy Trends</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Student enrollment over time</p>
              </div>
              <select className="bg-slate-50 dark:bg-neutral-700 border-none text-sm rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                  <Area type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Line Chart - Complaints */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-slate-100 dark:border-neutral-700 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Complaints Resolution</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Weekly resolution performance</p>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="complaints" name="New Complaints" stroke="#F59E0B" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10B981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Pie & Activity */}
        <div className="space-y-8">
          {/* Pie Chart */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-slate-100 dark:border-neutral-700 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Room Status</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Current occupancy distribution</p>
            <div className="h-[250px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={5}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">500</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Rooms</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity Section */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-slate-100 dark:border-neutral-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {[
                { title: 'New Student Registered', desc: 'Rahul Kumar joined CSE Dept', time: '2 mins ago', icon: Users, color: 'bg-blue-500' },
                { title: 'Complaint Resolved', desc: 'WiFi issue in Room 302 fixed', time: '1 hour ago', icon: AlertCircle, color: 'bg-green-500' },
                { title: 'New Notice Posted', desc: 'Holiday announcement for Diwali', time: '3 hours ago', icon: Megaphone, color: 'bg-purple-500' },
                { title: 'Room Maintenance', desc: 'Block A water supply check', time: '5 hours ago', icon: BedDouble, color: 'bg-orange-500' },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full ${activity.color} bg-opacity-10 flex items-center justify-center text-${activity.color.split('-')[1]}-600 group-hover:scale-110 transition-transform duration-300`}>
                      <activity.icon size={18} className={activity.color.replace('bg-', 'text-')} />
                    </div>
                    {idx !== 3 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-100 dark:bg-neutral-700 -z-10"></div>}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activity.title}</h4>
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-neutral-700 px-2 py-0.5 rounded-full">{activity.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
