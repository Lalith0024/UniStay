import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, Zap, Smartphone, Star, Users, CheckCircle,
  Play, MousePointer2, CreditCard, Layout, BarChart, Bell, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';

// --- Typewriter Component ---
const TypewriterHeadline = () => {
  const words = ["Smart Living.", "Seamless Management.", "Modern Campus."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[1.2em] relative overflow-hidden inline-flex flex-col">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// --- Animated Stats Counter ---
const StatCounter = ({ value, suffix, label, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      if (isNaN(end)) return;

      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <div className="text-4xl font-bold text-white mb-2 flex items-baseline gap-1">
          {isNaN(parseInt(value)) ? value : count}
          <span className="text-primary-500">{suffix}</span>
        </div>
        <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">{label}</div>
      </div>
    </motion.div>
  );
};

// --- Mockup Illustration ---
const DashboardMockup = () => {
  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl border border-white/10 bg-[#12121e] shadow-2xl overflow-hidden group">
      {/* Navbar Mock */}
      <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
        <div className="ml-4 w-32 h-2 bg-white/10 rounded-full"></div>
      </div>

      {/* Content Mock */}
      <div className="p-6 grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="h-32 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-white/10 p-4">
            <div className="w-24 h-3 bg-white/20 rounded-full mb-3"></div>
            <div className="w-48 h-2 bg-white/10 rounded-full mb-2"></div>
            <div className="w-40 h-2 bg-white/10 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 rounded-2xl bg-white/5 border border-white/5 p-4">
              <div className="w-12 h-12 rounded-lg bg-primary-500/20 mb-2"></div>
              <div className="w-16 h-2 bg-white/10 rounded-full"></div>
            </div>
            <div className="h-24 rounded-2xl bg-white/5 border border-white/5 p-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 mb-2"></div>
              <div className="w-16 h-2 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-64 rounded-2xl bg-white/5 border border-white/5 p-4 relative overflow-hidden">
            <div className="w-full h-full flex flex-col justify-end">
              <div className="w-full h-1/2 bg-primary-500/10 rounded-t-xl"></div>
              <div className="w-full h-1/3 bg-primary-500/20 rounded-t-xl scale-x-90 translate-y-1"></div>
            </div>
            <div className="absolute top-4 left-4 w-16 h-2 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 -left-10 p-4 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">Room Allocated</div>
            <div className="text-[10px] text-slate-400">Successfully verified</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-20 -right-10 p-4 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
            <BarChart size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">99.9% Uptime</div>
            <div className="text-[10px] text-slate-400">System Status: Active</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Landing = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student, Year 2",
      content: "UNISTAY has made my hostel life so much easier. Raising complaints is literally one click away!",
      avatar: "https://i.pravatar.cc/150?u=1",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Warden",
      content: "The dashboard gives me complete visibility over the hostel. Administrative work is cut down by 50%.",
      avatar: "https://i.pravatar.cc/150?u=2",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Student, Year 3",
      content: "I love the clean interface and dark mode. It feels like a modern app, not some old government portal.",
      avatar: "https://i.pravatar.cc/150?u=3",
      rating: 4
    },
    {
      name: "James Wilson",
      role: "Administrator",
      content: "Seamless integration with our existing systems. The support team is fantastic.",
      avatar: "https://i.pravatar.cc/150?u=4",
      rating: 5
    },
    {
      name: "Anita Roy",
      role: "Student, Year 1",
      content: "Digital onboarding was a breeze. I got my room allocated in minutes!",
      avatar: "https://i.pravatar.cc/150?u=5",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-brandDark text-white selection:bg-primary-500/30 font-sans overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-primary-500/20 rounded-full blur-[180px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[180px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brandDark/0 via-brandDark/50 to-brandDark"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium text-primary-400 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                Reimagining Student Living
              </div>

              <h1 className="text-6xl lg:text-8xl font-black font-display tracking-tighter leading-[0.9] mb-8">
                UNISTAY <br />
                <TypewriterHeadline />
              </h1>

              <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                Empower your campus with a smart, unified platform for student management, room allocation, and digital complaints. All in one place.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <Link to="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group focus:outline-none"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <Button variant="primary" size="lg" className="relative bg-primary-500 hover:bg-primary-400 border-none px-10 py-5 text-lg flex items-center gap-2 shadow-2xl">
                      Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" size="lg" className="border border-white/10 hover:bg-white/5 px-10 py-5 text-lg flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 transition-all">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-brandDark shadow-lg" />
                  ))}
                </div>
                <div className="text-sm text-slate-400">
                  <span className="text-white font-bold text-lg block leading-none">10,000+</span>
                  students across 50+ universities
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative perspective-1000 hidden lg:block"
            >
              <div className="absolute -inset-20 bg-primary-500/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-20 relative bg-brandDark">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCounter icon={Users} value="10" suffix="k+" label="Active Users" />
            <StatCounter icon={Layout} value="50" suffix="+" label="Universities" />
            <StatCounter icon={Zap} value="99" suffix=".9%" label="System Uptime" />
            <StatCounter icon={Star} value="4.9" suffix="/5" label="Student Rating" />
          </div>
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section id="features" className="py-32 relative bg-brandDark overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-5xl lg:text-6xl font-black font-display mb-6 tracking-tight">
              Everything You Need to <br />
              <span className="text-primary-500">Run a Smart Hostel</span>
            </h2>
            <p className="text-xl text-slate-400">
              Powerful tools designed to simplify management and scale your campus operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[250px] gap-6">
            {/* Main Feature */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-8 md:row-span-2 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-indigo-700 p-12 relative overflow-hidden group border border-white/10"
            >
              <div className="absolute right-[-10%] top-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white mb-8 border border-white/20">
                    <Users size={32} />
                  </div>
                  <h3 className="text-4xl font-bold mb-4">Digital Onboarding</h3>
                  <p className="text-primary-100 text-lg max-w-md leading-relaxed">
                    Seamless paperless admission process with instant room allocation and digital identity verification for every student.
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold uppercase tracking-widest">Efficiency +80%</div>
                  <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold uppercase tracking-widest">Real-time</div>
                </div>
              </div>

              {/* Decorative Mockup Element */}
              <div className="absolute right-10 bottom-10 w-64 aspect-square bg-brandDark/50 rounded-2xl border border-white/10 rotate-6 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 hidden lg:block">
                <div className="p-4 space-y-3">
                  <div className="w-full h-8 rounded bg-primary-500/20"></div>
                  <div className="w-2/3 h-4 rounded bg-white/10"></div>
                  <div className="w-1/2 h-4 rounded bg-white/10"></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-1 rounded-[2.5rem] bg-slate-900 border border-white/10 p-8 group relative overflow-hidden"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Smart Complaints</h3>
                <p className="text-slate-400 text-sm">Automated ticketing system with real-time status tracking.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-1 rounded-[2.5rem] bg-slate-900 border border-white/10 p-8 group relative overflow-hidden"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 mb-6">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Secure Payments</h3>
                <p className="text-slate-400 text-sm">Integrated gateway for hassle-free fee collection.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-1 rounded-[2.5rem] bg-slate-900 border border-white/10 p-8 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 mb-6">
                  <Smartphone size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Mobile First</h3>
                <p className="text-slate-400 text-sm">Perfect experience on every device.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-1 rounded-[2.5rem] bg-slate-900 border border-white/10 p-8 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 mb-6">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Attendance</h3>
                <p className="text-slate-400 text-sm">Digital tracking with facial recognition support.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 md:row-span-1 rounded-[2.5rem] bg-slate-900 border border-white/10 p-8 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 mb-6">
                  <BarChart size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Analytics</h3>
                <p className="text-slate-400 text-sm">Deep insights into hostel operations.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-32 bg-brandDark relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black font-display mb-4">How It Works</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Three simple steps to transition your hostel to the digital age.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent -translate-y-1/2 hidden lg:block"></div>

            <div className="grid lg:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  step: "01",
                  title: "Register & Verify",
                  desc: "Quick sign-up with institutional ID verification for absolute security.",
                  icon: Shield,
                  color: "bg-primary-500"
                },
                {
                  step: "02",
                  title: "Get Room Allocated",
                  desc: "Automated smart allocation based on preferences and availability.",
                  icon: Layout,
                  color: "bg-purple-500"
                },
                {
                  step: "03",
                  title: "Manage Everything",
                  desc: "Control complaints, payments, and leave requests from your dashboard.",
                  icon: Smartphone,
                  color: "bg-indigo-500"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative group text-center"
                >
                  <div className={`w-24 h-24 rounded-full ${item.color} flex items-center justify-center text-white mx-auto mb-10 shadow-2xl relative z-10 group-hover:scale-110 transition-transform`}>
                    <item.icon size={40} />
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-brandDark border-4 border-slate-800 flex items-center justify-center text-xs font-bold font-display">{item.step}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed px-6">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="py-32 bg-brandDark overflow-hidden">
        <div className="container mx-auto px-6 mb-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
              <h2 className="text-5xl font-black font-display mb-4 tracking-tighter">Loved by Students</h2>
              <p className="text-xl text-slate-400">Join the community transition to smart living.</p>
            </div>
            <div className="flex gap-4">
              <div className="h-14 w-14 rounded-full border border-white/10 flex items-center justify-center text-slate-400 cursor-not-allowed opacity-50"><ArrowRight className="rotate-180" /></div>
              <div className="h-14 w-14 rounded-full border border-primary-500 flex items-center justify-center text-primary-500 cursor-pointer animate-pulse"><ArrowRight /></div>
            </div>
          </div>
        </div>

        <div className="flex gap-8 px-6 overflow-x-auto scrollbar-hide">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              className="min-w-[400px] p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg text-white leading-relaxed mb-10 italic">"{t.content}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-purple-500">
                  <img src={t.avatar} className="w-full h-full rounded-full border-2 border-brandDark" alt={t.name} />
                </div>
                <div>
                  <div className="font-bold text-white leading-none mb-1">{t.name}</div>
                  <div className="text-xs text-slate-400 font-medium">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[4rem] bg-gradient-to-tr from-brandDark via-slate-900 to-brandDark border border-white/10 p-16 md:p-32 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black font-display mb-10 leading-tight">
                Ready to Level Up Your <br />
                <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Campus Experience?</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/signup">
                  <Button variant="primary" size="lg" className="px-12 py-6 text-xl rounded-2xl shadow-2xl shadow-primary-500/20">
                    Build Your Smart Hostel Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" size="lg" className="px-12 py-6 text-xl rounded-2xl border border-white/10 hover:bg-white/5">
                    View Interactive Demo
                  </Button>
                </Link>
              </div>
              <p className="mt-10 text-slate-500 font-medium">No credit card required. Free for up to 50 students.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #0a0a0f;
        }

        .font-display {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Landing;
