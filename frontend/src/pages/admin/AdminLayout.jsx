import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  FileText,
  Calendar,
  Bell,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Complaint', message: 'WiFi issue in Room 101', time: '5m ago', read: false },
    { id: 2, title: 'Leave Request', message: 'Rahul requested leave', time: '1h ago', read: false },
    { id: 3, title: 'System Update', message: 'Maintenance scheduled', time: '2h ago', read: true },
  ]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Rooms",
      href: "/admin/rooms",
      icon: <BedDouble className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Complaints",
      href: "/admin/complaints",
      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Leave Requests",
      href: "/admin/leaves",
      icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Notices",
      href: "/admin/notices",
      icon: <Bell className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-900 w-full h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo Section */}
            <div className="flex items-center gap-2 py-4 border-b border-neutral-200 dark:border-neutral-800">
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
                icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
              }}
              onClick={handleLogout}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-neutral-900 relative">
        {/* Top Header Bar */}
        <div className="flex items-center justify-end gap-4 px-4 md:px-8 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40">
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
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-slate-200 dark:border-neutral-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 dark:border-neutral-700 flex justify-between items-center">
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
                        className={`p-4 border-b border-slate-100 dark:border-neutral-700 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">{notification.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 bg-slate-50 dark:bg-neutral-900/50 border-t border-slate-100 dark:border-neutral-700 text-center">
                  <Link to="/admin/notifications" className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all shadow-sm hover:shadow-md"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium text-sm"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-neutral-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
