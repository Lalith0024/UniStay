import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, Users, Home, Clock, TrendingUp, MessageSquare, CreditCard, CheckCircle, FileText } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const DashboardPreview = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 
        rounded-3xl blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.3 }}
        className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl"
        style={{ background: 'var(--bg-card)' }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="ml-4 flex-1 max-w-md">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
              <Lock size={12} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">unistay.app/dashboard</span>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6 space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-[var(--text-primary)]">Dashboard Overview</h4>
              <p className="text-xs text-[var(--text-muted)]">Welcome back, Admin</p>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                <Bell size={14} className="text-[var(--text-secondary)]" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)]" />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Students', value: '248', icon: Users, color: 'text-cyan-400' },
              { label: 'Active Rooms', value: '156', icon: Home, color: 'text-purple-400' },
              { label: 'Pending Requests', value: '12', icon: Clock, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={14} className={stat.color} />
                  <span className="text-xs text-[var(--text-muted)]">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[var(--text-primary)]">Occupancy Rate</span>
              <div className="flex items-center gap-1 text-emerald-400 text-xs">
                <TrendingUp size={12} />
                <span>+12%</span>
              </div>
            </div>
            <div className="flex items-end gap-2 h-24">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 88].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[var(--cyan)]/60 to-[var(--purple)]/60"
                  style={{ height: `${h}%`, opacity: 0.3 + (h / 200) }} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)]">
              <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
            </div>
          </div>

          {/* Recent activity */}
          <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">Recent Activity</span>
            <div className="mt-3 space-y-2">
              {[
                { text: 'New complaint filed', time: '2 min ago', icon: MessageSquare },
                { text: 'Room allocation updated', time: '15 min ago', icon: Home },
                { text: 'Payment received', time: '1 hour ago', icon: CreditCard },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                    <item.icon size={12} className="text-[var(--text-secondary)]" />
                  </div>
                  <span className="text-[var(--text-secondary)] flex-1">{item.text}</span>
                  <span className="text-[var(--text-muted)]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating notification */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-8 top-1/4 hidden lg:block"
      >
        <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl
          backdrop-blur-xl flex items-center gap-3 min-w-[200px]">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-primary)]">Payment Confirmed</p>
            <p className="text-[10px] text-[var(--text-muted)]">Room 302 - Semester Fee</p>
          </div>
        </div>
      </motion.div>

      {/* Floating notification 2 */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-8 bottom-1/3 hidden lg:block"
      >
        <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl
          backdrop-blur-xl flex items-center gap-3 min-w-[200px]">
          <div className="w-10 h-10 rounded-lg bg-[var(--cyan-glow)] flex items-center justify-center">
            <FileText size={18} className="text-[var(--cyan)]" />
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-primary)]">Leave Approved</p>
            <p className="text-[10px] text-[var(--text-muted)]">Student ID: ST-2847</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPreview;
