import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Users, BedDouble, AlertCircle, Calendar } from 'lucide-react';

const DashboardOverview = () => {
  // Dummy Data
  const stats = [
    { title: 'Total Students', value: '450', icon: Users, color: 'bg-blue-500' },
    { title: 'Rooms Occupied', value: '85%', icon: BedDouble, color: 'bg-green-500' },
    { title: 'Pending Complaints', value: '12', icon: AlertCircle, color: 'bg-orange-500' },
    { title: 'Leave Requests', value: '5', icon: Calendar, color: 'bg-purple-500' },
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
              <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Area Chart */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Occupancy Trends</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Line Chart - Complaints */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Complaints Resolution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="complaints" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Pie & Activity */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Room Status</h3>
            <div className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section (Compact) */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { title: 'New Student Registered', desc: 'Rahul Kumar joined CSE Dept', time: '2 mins ago', icon: Users, color: 'bg-blue-500' },
                { title: 'Complaint Resolved', desc: 'WiFi issue in Room 302 fixed', time: '1 hour ago', icon: AlertCircle, color: 'bg-green-500' },
                { title: 'New Notice Posted', desc: 'Holiday announcement for Diwali', time: '3 hours ago', icon: Calendar, color: 'bg-purple-500' },
                { title: 'Room Maintenance', desc: 'Block A water supply check', time: '5 hours ago', icon: BedDouble, color: 'bg-orange-500' },
                { title: 'Leave Approved', desc: 'Amit Singh (Room 101)', time: '1 day ago', icon: Calendar, color: 'bg-purple-500' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-neutral-700 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10 text-${activity.color.split('-')[1]}-600 shrink-0 mt-0.5`}>
                    <activity.icon size={16} className={activity.color.replace('bg-', 'text-')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.title}</h4>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">{activity.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
