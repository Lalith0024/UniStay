import React, { useState, useEffect } from 'react';
import { BedDouble, AlertCircle, Calendar, CreditCard, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import Badge from '../../components/ui/Badge';
import KPICard from '../../components/ui/KPICard';
import MiniCalendar from '../../components/ui/MiniCalendar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [notices, setNotices] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const studentId = user.studentId || user._id;
    
    try {
      const [complaintsRes, leavesRes, noticesRes] = await Promise.allSettled([
        axios.get(`${config.API_URL}/api/complaints?studentId=${studentId}&limit=50&sort=createdAt:desc`, { headers }),
        axios.get(`${config.API_URL}/api/leaves?studentId=${studentId}&limit=50&sort=createdAt:desc`, { headers }),
        axios.get(`${config.API_URL}/api/notices?limit=5`),
      ]);

      const allComplaints = complaintsRes.status === 'fulfilled' ? (complaintsRes.value.data.data || []) : [];
      const allLeaves = leavesRes.status === 'fulfilled' ? (leavesRes.value.data.data || []) : [];
      
      setComplaints(allComplaints);
      setLeaves(allLeaves);
      setNotices(noticesRes.status === 'fulfilled' ? (noticesRes.value.data.data || []) : []);

      // Build chart data (last 7 days)
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

      // Build simulated payment data for chart
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const pData = months.map(m => ({
        month: m,
        Rent: 5000,
        Mess: Math.floor(Math.random() * (3000 - 2000) + 2000),
      }));
      setPaymentData(pData);

      // Build calendar events
      const events = [
        ...allComplaints.filter(c => c.status !== 'Resolved').map(c => ({ date: c.date || c.createdAt, type: 'complaint', color: 'bg-orange-500' })),
        ...allLeaves.filter(l => l.status === 'Approved' || l.status === 'Pending').map(l => ({ date: l.fromDate || l.createdAt, type: 'leave', color: 'bg-blue-500' }))
      ];
      setCalendarEvents(events);

    } catch (err) {
      console.error('Student dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingComplaints = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress');
  const activeLeaves = leaves.filter(l => l.status === 'Pending' || l.status === 'Approved');

  const kpis = [
    { title: 'Room Status', value: user?.room ? `Room ${user.room}` : 'Unassigned', icon: BedDouble, color: 'success', to: '/student/profile', subtitle: user?.block ? `Block ${user.block}` : '' },
    { title: 'Open Complaints', value: loading ? '—' : pendingComplaints.length, icon: AlertCircle, color: 'warning', to: '/student/complaints', subtitle: 'Action required' },
    { title: 'Active Leaves', value: loading ? '—' : activeLeaves.length, icon: Calendar, color: 'primary', to: '/student/leaves', subtitle: 'Pending & Approved' },
    { title: 'Next Payment', value: '₹5,000', icon: CreditCard, color: 'danger', to: '/student/payments', subtitle: 'Due in 5 days' },
  ];

  return (
    <motion.div className="space-y-6 max-w-[1400px] mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hi, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Here is your hostel activity summary.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/student/complaints" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
            <AlertCircle size={18} />
            File Complaint
          </Link>
          <Link to="/student/leaves" className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
            <Calendar size={18} />
            Apply Leave
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((stat, idx) => (
          <KPICard key={idx} {...stat} delay={idx * 0.05} />
        ))}
      </div>

      {/* Charts & Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Expenses */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Expense History</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Rent & Mess fees (Simulated)</p>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            {loading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-zinc-800/50 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tw-colors-slate-200)" className="opacity-50 dark:opacity-10" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tw-colors-white)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <Bar dataKey="Rent" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Mess" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Activity */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Leaves vs Complaints (7 Days)</p>
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
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tw-colors-slate-200)" className="opacity-50 dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tw-colors-white)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="Leaves" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLeaves)" />
                  <Area type="monotone" dataKey="Complaints" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorComplaints)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-0 overflow-hidden flex flex-col justify-center">
          <MiniCalendar events={calendarEvents} />
        </div>

      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Complaints */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Complaints</h3>
            <Link to="/student/complaints" className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="p-4 h-14 animate-pulse"><div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-1/2"></div></div>)
            ) : complaints.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-zinc-500">No complaints filed</p>
              </div>
            ) : (
              complaints.slice(0, 4).map(c => (
                <div key={c._id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.issue}</p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{new Date(c.date || c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={c.status === 'Resolved' ? 'success' : c.status === 'Pending' ? 'warning' : c.status === 'In Progress' ? 'primary' : 'danger'}>
                    {c.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Leaves */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leave Requests</h3>
            <Link to="/student/leaves" className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="p-4 h-14 animate-pulse"><div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-1/2"></div></div>)
            ) : leaves.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar size={24} className="text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-zinc-500">No leave history</p>
              </div>
            ) : (
              leaves.slice(0, 4).map(l => (
                <div key={l._id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{l.reason}</p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                      {new Date(l.fromDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : l.status === 'Checked Out' ? 'primary' : 'warning'}>
                    {l.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={16} className="text-violet-500" />
              Notices
            </h3>
            <Link to="/student/notices" className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="p-4 h-16 animate-pulse"><div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-3/4 mb-2"></div><div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded w-1/2"></div></div>)
            ) : notices.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-zinc-500">No notices posted.</div>
            ) : (
              notices.slice(0, 4).map(n => (
                <Link key={n._id} to="/student/notices" className="block p-4 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.priority === 'Urgent' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{n.title}</p>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default StudentDashboard;
