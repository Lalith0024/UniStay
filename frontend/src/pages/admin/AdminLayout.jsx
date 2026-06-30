import React, { useState, useEffect, useRef } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import config from "../../config";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  FileText,
  Calendar,
  Bell,
  LogOut,
  Sun,
  Moon,
  HelpCircle,
  ChevronDown,
  User
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingModal } from "../../components/ui/OnboardingModal";
import AnnouncementTicker from "../../components/ui/AnnouncementTicker";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [user, setUser] = useState(null);
  const [urgentNotice, setUrgentNotice] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Fetch real notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${config.API_URL || ''}/api/notices?limit=3`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const noticesList = data.data || [];
        const urgent = noticesList.find(n => n.priority === 'Urgent');
        if (urgent) setUrgentNotice(urgent);
        setNotifications(noticesList.map(n => ({
          id: n._id,
          type: 'notice',
          title: n.title,
          message: n.description?.substring(0, 80) || '',
          time: new Date(n.createdAt).toLocaleDateString(),
          read: false
        })));
      } catch (e) {
        console.error('Failed to fetch notifications:', e);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    if (localStorage.getItem('unistay_first_signup') === 'true') {
      setShowTour(true);
    }
  }, []);

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: <Users className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Rooms",
      href: "/admin/rooms",
      icon: <BedDouble className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Complaints",
      href: "/admin/complaints",
      icon: <FileText className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Leave Requests",
      href: "/admin/leaves",
      icon: <Calendar className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Notices",
      href: "/admin/notices",
      icon: <Bell className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row bg-slate-100 dark:bg-zinc-950 w-full h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo Section */}
            <div className="flex items-center gap-2 py-4 border-b border-neutral-200 dark:border-zinc-800/80">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                U
              </div>
              {open && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col"
                >
                  <span className="font-bold text-lg text-neutral-800 dark:text-white tracking-tight">UNISTAY</span>
                </motion.div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Logout",
                href: "#",
                icon: <LogOut className="h-5 w-5 flex-shrink-0" />,
              }}
              onClick={handleLogout}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-100 dark:bg-zinc-950 relative">
        <AnnouncementTicker 
          notice={urgentNotice} 
          onClose={() => setUrgentNotice(null)} 
          basePath="/admin/notices" 
        />
        {/* Top Header Bar */}
        <div className="flex items-center justify-end gap-4 px-4 md:px-8 py-3 border-b border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-full text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all relative hover:text-primary-500 dark:hover:text-primary-400"
            >
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-4 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-zinc-800 overflow-hidden z-50 ring-1 ring-black/5"
              >
                <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  <button
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    className="text-xs text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 dark:border-zinc-800 last:border-0 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-zinc-300'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notification.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-950/50 border-t border-slate-100 dark:border-zinc-800 text-center">
                  <Link to="/admin/notifications" className="text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-primary-500 transition-colors">
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
          </button>

          {/* Help / Tour Retrigger */}
          <button
            onClick={() => setShowTour(true)}
            className="p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md cursor-pointer"
            title="Show Admin Tour"
            aria-label="Show Admin Tour"
          >
            <HelpCircle size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all shadow-sm hover:shadow-md group"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {user?.name?.split(' ')[0] || 'Admin'}
                </span>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden z-50 ring-1 ring-black/5"
                >
                  <div className="p-6 border-b border-slate-100 dark:border-zinc-800 bg-gradient-to-br from-slate-50 to-white dark:from-neutral-800 dark:to-neutral-900">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white dark:ring-neutral-800">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate text-lg">{user?.name || 'Admin User'}</h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 truncate font-medium">{user?.email || 'admin@unistay.com'}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wide">
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors text-red-500 dark:text-red-400">
                        <LogOut size={18} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">Sign Out</span>
                        <span className="text-xs text-red-400/80">End your session safely</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-zinc-950">
          <Outlet />
        </div>
        <OnboardingModal show={showTour} onClose={() => setShowTour(false)} userRole="admin" />
      </div>
    </div>
  );
}
