import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Home,
  FileText,
  Calendar,
  Bell,
  LogOut,
  Sun,
  Moon,
  User,
  CreditCard,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Complaint Update', message: 'Your WiFi complaint is now resolved', time: '5m ago', read: false },
    { id: 2, title: 'Payment Due', message: 'Monthly rent due on 5th', time: '1h ago', read: false },
    { id: 3, title: 'New Notice', message: 'Hostel maintenance scheduled', time: '2h ago', read: true },
  ]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const links = [
    {
      label: "Dashboard",
      href: "/student/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "My Room",
      href: "/student/room",
      icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Complaints",
      href: "/student/complaints",
      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Leave Requests",
      href: "/student/leaves",
      icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Payments",
      href: "/student/payments",
      icon: <CreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Notices",
      href: "/student/notices",
      icon: <Bell className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Messages",
      href: "/student/messages",
      icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row bg-neutral-50 dark:bg-neutral-900 w-full h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo Section */}
            <div className="flex items-center gap-2 px-2 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
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
                icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
              }}
              onClick={handleLogout}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-900 relative">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40">
          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              {location.pathname.includes('dashboard') ? 'Dashboard' :
                location.pathname.includes('room') ? 'My Room' :
                  location.pathname.includes('complaints') ? 'Complaints' :
                    location.pathname.includes('leaves') ? 'Leave Requests' :
                      location.pathname.includes('payments') ? 'Payments' :
                        location.pathname.includes('notices') ? 'Notices' :
                          location.pathname.includes('messages') ? 'Messages' :
                            location.pathname.includes('profile') ? 'My Profile' : 'Student Portal'}
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all relative hover:text-primary-500 dark:hover:text-primary-400"
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
                    className="absolute right-0 mt-4 w-80 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-neutral-700 overflow-hidden z-50 ring-1 ring-black/5"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-neutral-700 flex justify-between items-center bg-slate-50/50 dark:bg-neutral-800/50">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                      <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        className="text-xs text-primary-500 hover:text-primary-600 font-medium"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-100 dark:border-neutral-700 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm font-semibold ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-medium">{notification.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all shadow-sm hover:shadow-md"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {user?.name?.split(' ')[0] || 'Student'}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-72 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-neutral-700 overflow-hidden z-50 ring-1 ring-black/5"
                  >
                    <div className="p-6 border-b border-slate-100 dark:border-neutral-700 bg-gradient-to-br from-slate-50 to-white dark:from-neutral-800 dark:to-neutral-900">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white dark:ring-neutral-800">
                          {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate text-lg">{user?.name || 'Student'}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{user?.email || 'student@unistay.com'}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wide">
                            Student
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        to="/student/profile"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-700 group-hover:bg-white dark:group-hover:bg-neutral-600 transition-colors text-slate-500 dark:text-slate-400 group-hover:text-primary-500 dark:group-hover:text-primary-400">
                          <User size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">My Profile</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">View and edit your details</span>
                        </div>
                      </Link>

                      <div className="h-px bg-slate-100 dark:bg-neutral-700 my-1 mx-2"></div>

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
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
