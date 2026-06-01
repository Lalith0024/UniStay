import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  Home, 
  Calendar, 
  Wrench, 
  Bell, 
  CheckCircle2, 
  Users, 
  BarChart3, 
  Megaphone,
  AlertCircle,
  FileCheck,
  Zap
} from 'lucide-react';

const AnimatedText = ({ children, delay = 0 }) => {
  const words = typeof children === 'string' ? children.split(' ') : [];
  return (
    <span>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + idx * 0.05, duration: 0.3 }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export const OnboardingModal = ({ show, onClose, userRole = 'student' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const hasResetRef = useRef(false);

  useEffect(() => {
    if (show && !hasResetRef.current) {
      setCurrentStep(0);
      hasResetRef.current = true;
    } else if (!show) {
      hasResetRef.current = false;
    }
  }, [show]);

  // Dynamic slides based on the user's role
  const studentSteps = [
    {
      title: "Welcome to UniStay 🎓",
      description: "Your modern, digital portal for seamless student housing management.",
      icon: Sparkles,
      color: "from-cyan-500 to-blue-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 relative overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl relative z-10"
          >
            <Home className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Decorative floating orbits */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute inset-0 w-48 h-48 border border-cyan-500/20 rounded-full flex items-center justify-between"
          >
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute inset-0 w-64 h-64 border border-blue-500/10 rounded-full flex items-center justify-around"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-300" />
          </motion.div>
        </div>
      )
    },
    {
      title: "Smart Room Booking 🔑",
      description: "Skip the queues! Auto-allocate a perfect room or inspect block occupancy in seconds.",
      icon: Home,
      color: "from-blue-500 to-indigo-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 gap-6">
          <div className="grid grid-cols-2 gap-4 w-72">
            {[101, 102].map((room, idx) => (
              <motion.div
                key={room}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.15 }}
                className="bg-white/5 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/10 shadow-lg text-center"
              >
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Block A</div>
                <div className="text-xl font-extrabold text-white mb-2">Room {room}</div>
                {/* Simulated occupancy meter */}
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: idx === 0 ? '50%' : '100%' }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r ${idx === 0 ? 'from-cyan-400 to-blue-500' : 'from-indigo-400 to-purple-500'}`}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">
                  {idx === 0 ? "1/2 Occupied" : "Full"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Digital Leaves & Passes 📅",
      description: "Apply for leaves or weekend passes instantly. Track approval status live on your dash.",
      icon: Calendar,
      color: "from-indigo-500 to-purple-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 relative">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            className="w-72 bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-purple-500/30 shadow-2xl relative"
          >
            {/* Glossy header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">UniStay Gatepass</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 }}
                className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1"
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                APPROVED
              </motion.div>
            </div>
            
            <div className="text-sm font-bold text-white mb-1">Weekend Outing Pass</div>
            <div className="text-xs text-slate-400 mb-4">Valid: Nov 1st - Nov 5th</div>

            {/* Mock Barcode */}
            <div className="flex gap-1 h-8 items-center bg-white/5 p-2 rounded-lg justify-center overflow-hidden border border-white/5">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-slate-300 h-full rounded" 
                  style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px`, opacity: 0.8 }} 
                />
              ))}
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Instant Ticket Support 🛠️",
      description: "Spot an issue? File complaints immediately and track their live resolution progress.",
      icon: Wrench,
      color: "from-purple-500 to-pink-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-72 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-4 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white">WiFi Not Connecting</div>
              <div className="text-[10px] text-slate-400">Raised: Room 101 • Priority: High</div>
            </div>
            <motion.div
              animate={{ 
                backgroundColor: ["rgba(245, 158, 11, 0.1)", "rgba(16, 185, 129, 0.1)"],
                color: ["rgb(245, 158, 11)", "rgb(16, 185, 129)"]
              }}
              transition={{ delay: 1, duration: 1.5, fill: "forwards" }}
              className="text-[9px] font-bold border border-current px-2 py-0.5 rounded-full"
            >
              RESOLVED
            </motion.div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Bulletins & Broadcasts 📣",
      description: "Receive urgent guidelines, notifications, and mess updates straight from the warden.",
      icon: Bell,
      color: "from-pink-500 to-rose-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 relative">
          <motion.div
            initial={{ rotate: -15, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-xl relative z-10"
          >
            <Megaphone className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* concentric sound waves */}
          {[1, 2, 3].map((wave) => (
            <motion.div
              key={wave}
              initial={{ scale: 0.5, opacity: 0.5 }}
              animate={{ scale: 1.8 + wave * 0.4, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.5, delay: wave * 0.5, ease: 'easeOut' }}
              className="absolute w-24 h-24 border border-rose-500/30 rounded-full"
            />
          ))}
        </div>
      )
    }
  ];

  const adminSteps = [
    {
      title: "Warden Administration 💼",
      description: "Welcome to your centralized command center for complete hostel management.",
      icon: Sparkles,
      color: "from-cyan-500 to-blue-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 relative overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl relative z-10"
          >
            <Users className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Floating rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 w-52 h-52 border border-cyan-500/20 rounded-full flex items-center justify-between"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-md" />
            <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-md" />
          </motion.div>
        </div>
      )
    },
    {
      title: "Hostel Occupancy & Rooms 🏢",
      description: "Monitor occupancies, inspect block performance metrics, and assign room allocations live.",
      icon: BarChart3,
      color: "from-blue-500 to-indigo-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 gap-6 w-full px-12">
          <div className="w-full space-y-4 bg-white/5 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/10 shadow-xl">
            <div className="text-xs font-bold text-white flex justify-between">
              <span>Block A Occupancy</span>
              <span className="text-cyan-400">85%</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              />
            </div>
            
            <div className="text-xs font-bold text-white flex justify-between mt-2">
              <span>Block B Occupancy</span>
              <span className="text-purple-400">62%</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '62%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-400 to-indigo-500"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Leave Authorizations 📝",
      description: "Audit student leave passes. Grant approvals or decline requests in a single tap.",
      icon: FileCheck,
      color: "from-indigo-500 to-purple-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 gap-4 w-full px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-72 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden"
          >
            <div className="text-xs font-bold text-white mb-1">Leave Request: Rahul Sharma</div>
            <div className="text-[10px] text-slate-400 mb-3">Reason: Family function • 4 Days</div>
            
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-bold transition-colors">
                Decline
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition-all"
              >
                Approve
              </motion.button>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Maintenance Dispatch 🛠",
      description: "Delegate incoming tickets to workers and review priority lists for rapid resolutions.",
      icon: Wrench,
      color: "from-purple-500 to-pink-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 gap-4 w-full px-12">
          <div className="w-72 bg-white/5 p-4 rounded-xl border border-slate-200/10 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-slate-400">
              <span>WORK ORDER SEVERITY</span>
              <span className="text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 animate-pulse" /> CRITICAL
              </span>
            </div>
            
            <div className="text-xs font-extrabold text-white">Power Outage - Block B</div>
            <div className="text-[10px] text-slate-400">Triggered: 10 mins ago • Assigned: Electrician team</div>
          </div>
        </div>
      )
    },
    {
      title: "Notice Board Broadcasting 📢",
      description: "Post instant notifications, updates, and events directly to the student portal feeds.",
      icon: Bell,
      color: "from-pink-500 to-rose-600",
      content: (
        <div className="flex flex-col items-center justify-center h-64 relative">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-xl relative z-10"
          >
            <Megaphone className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-6 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-[10px] text-slate-300 shadow-2xl flex items-center gap-2 max-w-[240px]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Notice Broadcasted Successfully!</span>
          </motion.div>
        </div>
      )
    }
  ];

  const steps = userRole === 'admin' ? adminSteps : studentSteps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetStarted = () => {
    localStorage.removeItem('unistay_first_signup');
    onClose();
  };

  const activeStep = steps[currentStep] || steps[0];
  const IconComponent = activeStep.icon;

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Blurred Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleGetStarted}
          className="absolute inset-0 bg-[#070709]/75 backdrop-blur-[10px] cursor-pointer"
        />

        {/* Modal Window Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-lg bg-[#0e0f12]/90 dark:bg-[#0c0d10]/95 border border-slate-200/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-10 backdrop-blur-md"
        >
          {/* Header Progress Strip */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-800">
            <motion.div
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full bg-gradient-to-r ${activeStep.color}`}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={handleGetStarted}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-white bg-slate-900/50 border border-white/5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Slides Carousel Container */}
          <div className="p-8 md:p-10 pt-12 flex flex-col items-center">
            
            {/* Slide Interactive Content Component */}
            <div className="w-full bg-[#13151b]/40 rounded-[24px] border border-white/5 mb-6 overflow-hidden">
              {activeStep.content}
            </div>

            {/* Typography */}
            <div className="text-center w-full min-h-[96px] mb-8 px-2">
              <h2 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center justify-center gap-2">
                <IconComponent className="w-6 h-6 text-slate-400" />
                <AnimatedText delay={0.1}>{activeStep.title}</AnimatedText>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                <AnimatedText delay={0.4}>{activeStep.description}</AnimatedText>
              </p>
            </div>

            {/* Footer Nav Controls */}
            <div className="w-full flex items-center justify-between mt-auto">
              
              {/* Dot Indicators */}
              <div className="flex gap-2 items-center">
                {steps.map((_, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ 
                      width: currentStep === idx ? 24 : 8,
                      opacity: currentStep === idx ? 1 : 0.4 
                    }}
                    transition={{ duration: 0.3 }}
                    className={`h-2 rounded-full bg-gradient-to-r ${currentStep === idx ? activeStep.color : 'from-slate-600 to-slate-600'}`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {currentStep > 0 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900/90 border border-slate-200/5 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                ) : (
                  <button
                    onClick={handleGetStarted}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    Skip
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all hover:shadow-lg active:scale-95 bg-gradient-to-r ${activeStep.color} cursor-pointer`}
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGetStarted}
                    className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-xl transition-all bg-gradient-to-r ${activeStep.color} cursor-pointer`}
                  >
                    Get Started
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
