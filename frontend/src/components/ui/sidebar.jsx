"use client";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const SidebarContext = createContext(undefined);
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};
export const SidebarProvider = ({ children, open: openProp, setOpen: setOpenProp, animate = true }) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (<SidebarContext.Provider value={{ open, setOpen, animate }}>{children}</SidebarContext.Provider>);
};
export const Sidebar = ({ children, open, setOpen, animate }) => (<SidebarProvider open={open} setOpen={setOpen} animate={animate}>{children}</SidebarProvider>);
export const SidebarBody = (props) => (<><DesktopSidebar {...props} /><MobileSidebar {...props} /></>);
export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn("h-full px-4 py-4 hidden md:flex md:flex-col bg-white dark:bg-zinc-900 border-r border-slate-200/60 dark:border-zinc-800 w-[300px] flex-shrink-0 overflow-y-auto sidebar-scroll", className)}
      animate={{ width: animate ? (open ? "300px" : "60px") : "300px" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <div className={cn("h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-white dark:bg-zinc-900 border-b border-slate-200/60 dark:border-zinc-800 w-full")} {...props}>
      <div className="flex justify-end z-20 w-full"><Menu className="text-neutral-800 dark:text-zinc-200" onClick={() => setOpen(!open)} /></div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn("fixed h-full w-full inset-0 bg-white dark:bg-zinc-950 p-10 z-[100] flex flex-col justify-between", className)}
          >
            <div className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-zinc-200" onClick={() => setOpen(!open)}><X /></div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export const SidebarLink = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();
  const location = useLocation();
  const isActive = location.pathname.startsWith(link.href) && link.href !== "#";
  
  return (
    <Link 
      to={link.href} 
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-xl transition-colors",
        isActive ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold" : "hover:bg-slate-50 dark:hover:bg-zinc-900 text-neutral-700 dark:text-zinc-200",
        className
      )} 
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{ display: animate ? (open ? "inline-block" : "none") : "inline-block", opacity: animate ? (open ? 1 : 0) : 1 }}
        className={cn(
          "text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0",
          isActive ? "text-primary-600 dark:text-primary-400" : "text-neutral-700 dark:text-zinc-200"
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
