import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, BedDouble, AlertCircle, Calendar, Plus, Megaphone, Check, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import KPICard from '../../components/ui/KPICard';
import Badge from '../../components/ui/Badge';
import MiniCalendar from '../../components/ui/MiniCalendar';
import { toast } from 'react-toastify';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, rooms: 0, complaints: 0, leaves: 0, occupancy: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [blockData, setBlockData] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const [studentsRes, roomsRes, complaintsRes, leavesRes] = await Promise.allSettled([
        axios.get(`${config.API_URL}/api/students`, { headers }),
        axios.get(`${config.API_URL}/api/rooms`, { headers }),
        axios.get(`${config.API_URL}/api/complaints?limit=100&sort=createdAt:desc`, { headers }),
        axios.get(`${config.API_URL}/api/leaves?limit=100&sort=createdAt:desc`, { headers }),
      ]);

      const studentsData = studentsRes.status === 'fulfilled' ? studentsRes.value.data : null;
      const roomsData = roomsRes.status === 'fulfilled' ? roomsRes.value.data : null;
      const complaintsData = complaintsRes.status === 'fulfilled' ? complaintsRes.value.data : null;
      const leavesData = leavesRes.status === 'fulfilled' ? leavesRes.value.data : null;

      const totalStudents = studentsData?.meta?.total || studentsData?.data?.length || 0;
      const totalRooms = roomsData?.meta?.total || roomsData?.data?.length || 0;
      const occupiedRooms = roomsData?.data?.filter(r => r.occupants?.length > 0)?.length || 0;
      const occupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      
      const allComplaints = complaintsData?.data || [];
      const pendingComplaints = allComplaints.filter(c => c.status === 'Pending' || c.status === 'In Progress');
      
      const allLeaves = leavesData?.data || [];
      const pendingLeaves = allLeaves.filter(l => l.status === 'Pending');

      setStats({
        students: totalStudents,
        rooms: totalRooms,
        complaints: pendingComplaints.length,
        leaves: pendingLeaves.length,
        occupancy,
      });
      setRecentComplaints(allComplaints.slice(0, 4));
      setRecentLeaves(allLeaves.slice(0, 4));

      // Build Activity chart data (last 7 days)
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          name: d.toLocaleDateString('en-US', { weekday: 'short' }),
          dateString: d.toISOString().split('T')[0],
          Complaints: 0,
          Leaves: 0
        };
      });

      allComplaints.forEach(c => {
        const dateStr = new Date(c.date || c.createdAt).toISOString().split('T')[0];
        const day = last7Days.find(d => d.dateString === dateStr);
        if (day) day.Complaints++;
      });
      
      allLeaves.forEach(l => {
        const dateStr = new Date(l.createdAt || l.fromDate).toISOString().split('T')[0];
        const day = last7Days.find(d => d.dateString === dateStr);
        if (day) day.Leaves++;
      });
      setChartData(last7Days);

      // Build Block Occupancy Data
      if (roomsData?.data?.length > 0) {
        const blocks = {};
        roomsData.data.forEach(r => {
          const b = r.block || 'A';
          if (!blocks[b]) blocks[b] = { name: `Block ${b}`, Total: 0, Occupied: 0 };
          blocks[b].Total += 1;
          if (r.occupants?.length > 0) blocks[b].Occupied += 1;
        });
        setBlockData(Object.values(blocks));
      } else {
        // Fallback for visual completeness if no rooms exist
        setBlockData([
          { name: 'Block A', Total: 50, Occupied: 42 },
          { name: 'Block B', Total: 50, Occupied: 38 },
          { name: 'Block C', Total: 40, Occupied: 15 },
        ]);
      }

      // Build calendar events
      const events = [
        ...pendingComplaints.map(c => ({ date: c.date || c.createdAt, type: 'complaint', color: 'bg-orange-500' })),
        ...pendingLeaves.map(l => ({ date: l.fromDate || l.createdAt, type: 'leave', color: 'bg-blue-500' }))
      ];
      setCalendarEvents(events);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintAction = async (id, action) => {
    try {
      await axios.patch(`${config.API_URL}/api/complaints/${id}`, { status: action }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Complaint marked as ${action}`);
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to update complaint');
    }
  };

  const handleLeaveAction = async (id, action) => {
    try {
      await axios.patch(`${config.API_URL}/api/leaves/${id}/status`, { status: action }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Leave ${action.toLowerCase()}`);
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to update leave');
    }
  };

  const kpis = [
    { title: 'Total Students', value: loading ? '—' : stats.students, icon: Users, color: 'info', to: '/admin/students' },
    { title: 'Occupancy Rate', value: loading ? '—' : `${stats.occupancy}%`, icon: BedDouble, color: 'success', to: '/admin/rooms' },
    { title: 'Open Complaints', value: loading ? '—' : stats.complaints, icon: AlertCircle, color: 'warning', to: '/admin/complaints', subtitle: 'Pending + In Progress' },
    { title: 'Pending Leaves', value: loading ? '—' : stats.leaves, icon: Calendar, color: 'primary', to: '/admin/leaves' },
  ];

  return (
    <motion.div className="space-y-6 max-w-[1400px] mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {JSON.parse(localStorage.getItem('user') || '{}')?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Here's what's happening across your hostel today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/admin/students" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
            <Plus size={18} />
            Add Student
          </Link>
          <Link to="/admin/notices" className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 rounded-xl font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors">
            <Megaphone size={18} />
            Post Notice
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((stat, idx) => (
          <KPICard key={idx} {...stat} delay={idx * 0.05} />
        ))}
      </div>

      {/* Charts & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Occupancy by Block */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Block Occupancy</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Total vs Occupied Rooms</p>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            {loading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-zinc-800/50 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={blockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tw-colors-slate-200)" className="opacity-50 dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tw-colors-white)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <Bar dataKey="Total" fill="#e2e8f0" className="dark:fill-zinc-800" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="Occupied" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Activity */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Activity Timeline</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Leaves vs Complaints (7 Days)</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Leaves
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                Complaints
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            {loading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-zinc-800/50 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLeaves" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tw-colors-slate-200)" className="opacity-50 dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tw-colors-white)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="Leaves" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeaves)" />
                  <Area type="monotone" dataKey="Complaints" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorComplaints)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 overflow-hidden flex flex-col justify-center">
          <MiniCalendar events={calendarEvents} />
        </div>
      </div>

      {/* Lists Row: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Complaints */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Complaints</h3>
            </div>
            <Link to="/admin/complaints" className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 flex-1">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="p-4 h-16 animate-pulse"><div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-2/3"></div></div>)
            ) : recentComplaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-zinc-500">No active complaints.</div>
            ) : (
              recentComplaints.map((c) => (
                <div key={c._id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.issue}</p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                      Room {c.studentId?.room || 'N/A'} • {new Date(c.date || c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {c.status === 'Pending' ? (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleComplaintAction(c._id, 'In Progress')} className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-500/15 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/25">
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <Badge variant={c.status === 'Resolved' ? 'success' : c.status === 'In Progress' ? 'primary' : 'warning'}>
                      {c.status}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leave Requests</h3>
            </div>
            <Link to="/admin/leaves" className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 flex-1">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="p-4 h-16 animate-pulse"><div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-2/3"></div></div>)
            ) : recentLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-zinc-500">No pending leave requests.</div>
            ) : (
              recentLeaves.map((l) => (
                <div key={l._id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{l.reason}</p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                      {l.studentId?.name || 'Unknown'} • {new Date(l.fromDate).toLocaleDateString()}
                    </p>
                  </div>
                  {l.status === 'Pending' ? (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleLeaveAction(l._id, 'Approved')} className="p-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/25">
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}>
                      {l.status}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Tools */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admin Tools</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: 'Manage Rooms', icon: BedDouble, to: '/admin/rooms', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { label: 'View Analytics', icon: TrendingUp, to: '/admin/complaints', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
              { label: 'Add Student', icon: Plus, to: '/admin/students', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
              { label: 'Post Notice', icon: Megaphone, to: '/admin/notices', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            ].map((action, idx) => (
              <Link key={idx} to={action.to} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/60 hover:shadow-sm hover:border-slate-200 dark:hover:border-zinc-700 transition-all group">
                <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                  <action.icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{action.label}</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 dark:text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default DashboardOverview;
