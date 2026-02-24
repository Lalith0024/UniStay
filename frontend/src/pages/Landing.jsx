import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, Zap, Smartphone, Star, Users, CreditCard,
  BarChart2, Layout, Globe, Activity, CheckCircle, Play,
  Bell, ChevronRight, Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ─── Easing ───────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1];

/* ─── Typewriter ────────────────────────────────────────── */
const WORDS = ['Smart Living.', 'Seamless Management.', 'Modern Campus.'];

const Typewriter = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % WORDS.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-block" style={{ position: 'relative', overflow: 'hidden', display: 'block', lineHeight: 1 }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0,      opacity: 1 }}
          exit={{    y: '-110%', opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="gradient-text"
          style={{ display: 'block' }}
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

/* ─── Animated Counter ──────────────────────────────────── */
const useCounter = (target, isInView, delay = 0) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const isFloat = !Number.isInteger(target);
      const steps = 60;
      const interval = 1800 / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(parseFloat((target * eased).toFixed(isFloat ? 1 : 0)));
        if (step >= steps) { setValue(target); clearInterval(timer); }
      }, interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, target, delay]);
  return value;
};

const StatCard = ({ icon: Icon, value, suffix, label, delay, color }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCounter(parseFloat(value), inView, delay);
  const isFloat = !Number.isInteger(parseFloat(value));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE, delay: delay / 1000 }}
      className="stat-card"
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: color + '18', color }}
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div
        className="mb-1 flex items-baseline gap-0.5"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.25rem', lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
      >
        {isFloat ? count.toFixed(1) : Math.floor(count)}
        <span style={{ color, fontSize: '1.5rem' }}>{suffix}</span>
      </div>
      <p className="text-label" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </motion.div>
  );
};

/* ─── Floating Dashboard Mockup ─────────────────────────── */
const DashboardMockup = () => (
  <div className="relative w-full max-w-lg mx-auto select-none">
    {/* Ambient glow */}
    <div
      className="absolute top-1/2 left-1/2 w-[110%] h-[110%] rounded-full blur-[100px] opacity-30 pointer-events-none"
      style={{ transform: 'translate(-50%,-50%)', background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}
    />

    {/* Main card */}
    <motion.div
      className="animate-float relative rounded-3xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Titlebar */}
      <div
        className="flex items-center gap-2 px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,99,88,0.6)' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,189,46,0.6)' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(40,200,64,0.6)' }} />
        <div className="ml-auto w-28 h-2 rounded-full" style={{ background: 'var(--border-subtle)' }} />
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-2">
          <div className="space-y-1.5">
            <div className="h-2.5 w-28 rounded-full" style={{ background: 'var(--border-subtle)' }} />
            <div className="h-2 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
          <div className="w-9 h-9 rounded-full" style={{ background: 'var(--cyan-glow)', border: '1px solid var(--border-accent)' }} />
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { color: 'var(--cyan)',   label: 'Rooms Occupied' },
            { color: 'var(--purple)', label: 'Complaints' },
          ].map(({ color, label }) => (
            <div
              key={label}
              className="rounded-2xl p-4 space-y-3"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="w-8 h-8 rounded-xl" style={{ background: color + '22' }} />
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="h-2 w-3/5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="h-2 w-20 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <div className="flex items-end gap-1.5 h-16">
            {[45, 68, 38, 85, 55, 78, 62].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-lg bar"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, var(--cyan), var(--purple))`,
                  opacity: 0.55 + (h / 200),
                  animationDelay: `${idx * 0.08}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>

    {/* Floating notification — Payment */}
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -left-12 top-1/3 rounded-2xl px-4 py-3 flex items-center gap-3 hidden lg:flex"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        minWidth: 210,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(0,212,160,0.15)', color: '#00D4A0' }}
      >
        <CheckCircle size={18} strokeWidth={2} />
      </div>
      <div>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, fontFamily: 'var(--font-body)' }}>
          Payment Received
        </p>
        <p className="text-label" style={{ color: 'var(--text-muted)', marginTop: 2 }}>
          Transaction #8291
        </p>
      </div>
    </motion.div>

    {/* Floating notification — Verification */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute -right-12 bottom-1/4 rounded-2xl px-4 py-3 flex items-center gap-3 hidden lg:flex"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        minWidth: 210,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--cyan-glow)', color: 'var(--cyan)' }}
      >
        <Users size={18} strokeWidth={2} />
      </div>
      <div>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, fontFamily: 'var(--font-body)' }}>
          Student Verified
        </p>
        <p className="text-label" style={{ color: 'var(--text-muted)', marginTop: 2 }}>
          ID #SID-20291
        </p>
      </div>
    </motion.div>
  </div>
);

/* ─── Feature Card ──────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, accent, delay = 0, span = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.65, ease: EASE, delay }}
    className={`glass-card p-8 flex flex-col ${span}`}
    style={{ minHeight: 220 }}
  >
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0"
      style={{ background: accent + '18', color: accent }}
    >
      <Icon size={22} strokeWidth={1.8} />
    </div>
    <h3 className="text-h3 mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
    <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: 4 }}>{desc}</p>
    <div
      className="mt-auto pt-5 flex items-center gap-1 text-label transition-colors"
      style={{ color: accent, cursor: 'default' }}
    >
      Learn more <ChevronRight size={13} />
    </div>
  </motion.div>
);

/* ─── Step Card ─────────────────────────────────────────── */
const StepCard = ({ number, icon: Icon, title, desc, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.65, ease: EASE, delay }}
    className="relative flex flex-col items-center text-center p-8"
  >
    <div className="relative mb-8">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{
          background: accent + '14',
          border: `1px solid ${accent}30`,
          color: accent,
        }}
      >
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <div
        className="absolute -top-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
        style={{
          background: 'var(--bg-base)',
          border: `2px solid var(--border-subtle)`,
          color: accent,
          fontFamily: 'var(--font-display)',
        }}
      >
        {number}
      </div>
    </div>
    <h3 className="text-h3 mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
    <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 260 }}>{desc}</p>
  </motion.div>
);

/* ─── Testimonial Card ──────────────────────────────────── */
const TestimonialCard = ({ name, role, content, avatar, rating }) => (
  <div
    className="flex-shrink-0 p-7 rounded-3xl flex flex-col justify-between"
    style={{
      width: 380,
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
    }}
  >
    <div>
      <div className="flex gap-1 mb-5" style={{ color: 'var(--gold)' }}>
        {Array.from({ length: rating }).map((_, j) => (
          <Star key={j} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
        "{content}"
      </p>
    </div>
    <div className="flex items-center gap-4 mt-7 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div
        className="w-11 h-11 rounded-full p-0.5"
        style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}
      >
        <img src={avatar} alt={name} className="w-full h-full rounded-full block" style={{ objectFit: 'cover' }} />
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {name}
        </p>
        <p className="text-label mt-0.5" style={{ color: 'var(--text-muted)' }}>{role}</p>
      </div>
    </div>
  </div>
);

/* ─── Testimonials data ─────────────────────────────────── */
const TESTIMONIALS = [
  { name: 'Sarah Johnson',  role: 'Student, Year 2',   rating: 5, avatar: 'https://i.pravatar.cc/150?u=1', content: 'UNISTAY made my hostel life effortless. Raising complaints is literally one tap.' },
  { name: 'Michael Chen',   role: 'Warden',             rating: 5, avatar: 'https://i.pravatar.cc/150?u=2', content: 'Complete visibility over the hostel. Administrative overhead dropped by 50%.' },
  { name: 'Priya Patel',    role: 'Student, Year 3',   rating: 5, avatar: 'https://i.pravatar.cc/150?u=3', content: 'Clean interface, fast dark mode — feels like a modern product, not a government portal.' },
  { name: 'James Wilson',   role: 'Administrator',      rating: 5, avatar: 'https://i.pravatar.cc/150?u=4', content: 'Seamless integration with our existing systems. Support team is world-class.' },
  { name: 'Anita Roy',      role: 'Student, Year 1',   rating: 5, avatar: 'https://i.pravatar.cc/150?u=5', content: 'Digital onboarding was a breeze. Got my room allocated within minutes of arriving.' },
];

/* ════════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════ */
const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 0.45], [0, 60]);

  /* Stagger for hero text */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 32 },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.75, ease: EASE } },
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      <Navbar />

      {/* ══ HERO ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center overflow-hidden pt-24"
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-30 animate-blob-1"
            style={{ background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full opacity-20 animate-blob-2"
            style={{ background: 'radial-gradient(circle, var(--purple) 0%, transparent 70%)', filter: 'blur(100px)' }}
          />
          {/* dot grid */}
          <div className="absolute inset-0 dot-grid" />
          {/* edge fade */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, var(--bg-base)/0 70%, var(--bg-base) 100%)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            {/* Left — Text */}
            <motion.div variants={container} initial="hidden" animate="show">

              {/* Badge */}
              <motion.div variants={item}>
                <div
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-10"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span
                    className="relative flex w-2 h-2"
                  >
                    <span
                      className="animate-ping-slow absolute inline-flex w-full h-full rounded-full"
                      style={{ background: 'var(--cyan)', opacity: 0.7 }}
                    />
                    <span
                      className="relative inline-flex w-2 h-2 rounded-full"
                      style={{ background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }}
                    />
                  </span>
                  <span className="text-label" style={{ color: 'var(--cyan)' }}>
                    The Future of Hostel Living
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.div variants={item}>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(3rem, 6.5vw, 5.25rem)',
                    lineHeight: 0.92,
                    letterSpacing: '-0.04em',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem',
                  }}
                >
                  UNISTAY
                </h1>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    marginBottom: '1.75rem',
                    minHeight: '1.05em',
                  }}
                >
                  <Typewriter />
                </div>
              </motion.div>

              {/* Sub */}
              <motion.p
                variants={item}
                className="text-body-lg mb-10"
                style={{ color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.65 }}
              >
                The most advanced hostel OS for modern universities — from instant room allocation to real-time analytics, all in one place.
              </motion.p>

              {/* CTA row */}
              <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-12">
                <Link to="/signup">
                  <button className="btn-primary" style={{ height: '3.25rem', padding: '0 1.75rem', fontSize: '0.9375rem' }}>
                    <span className="flex items-center gap-2">
                      Get Started Free
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="btn-ghost flex items-center gap-3" style={{ height: '3.25rem' }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)' }}
                    >
                      <Play size={12} fill="currentColor" style={{ marginLeft: 2 }} />
                    </div>
                    Watch Demo
                  </button>
                </Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                variants={item}
                className="flex items-center gap-4 p-4 rounded-2xl w-fit"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(n => (
                    <img
                      key={n}
                      src={`https://i.pravatar.cc/80?u=${n + 30}`}
                      alt=""
                      className="w-9 h-9 rounded-full"
                      style={{ border: '2.5px solid var(--bg-base)', objectFit: 'cover' }}
                    />
                  ))}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ border: '2.5px solid var(--bg-base)', background: 'var(--cyan)', color: '#fff', fontFamily: 'var(--font-display)' }}
                  >
                    +5k
                  </div>
                </div>
                <div className="h-8 w-px" style={{ background: 'var(--border-subtle)' }} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                  Trusted by <strong style={{ color: 'var(--text-primary)' }}>10,000+ students</strong><br />
                  across 50+ universities
                </p>
              </motion.div>
            </motion.div>

            {/* Right — Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
              className="hidden lg:block"
              style={{ perspective: 1200 }}
            >
              <DashboardMockup />
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-label" style={{ color: 'var(--text-muted)' }}>Scroll to explore</span>
          <div
            className="w-px h-10"
            style={{ background: 'linear-gradient(to bottom, var(--cyan), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ══ STATS ══════════════════════════════════════════ */}
      <section className="py-24" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users}    value="10"   suffix="k+" label="Active Users"        delay={100} color="var(--cyan)"   />
            <StatCard icon={Globe}    value="50"   suffix="+"  label="Partner Universities" delay={200} color="var(--purple)" />
            <StatCard icon={Activity} value="99.9" suffix="%"  label="Server Uptime"        delay={300} color="#00D4A0"       />
            <StatCard icon={Star}     value="4.9"  suffix="/5" label="Student Rating"       delay={400} color="var(--gold)"   />
          </div>
        </div>
      </section>

      {/* ══ FEATURES ═══════════════════════════════════════ */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section header */}
          <div className="max-w-2xl mb-20">
            <p className="text-label mb-4" style={{ color: 'var(--cyan)' }}>Platform Features</p>
            <h2 className="text-h1 mb-5" style={{ color: 'var(--text-primary)' }}>
              Everything you need to run a smart hostel.
            </h2>
            <p className="text-body-lg" style={{ color: 'var(--text-secondary)' }}>
              Purpose-built tools that remove friction for students and administrators alike.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Hero feature — spans 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: EASE }}
              className="md:col-span-2 rounded-3xl p-10 relative overflow-hidden flex flex-col justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(0,194,255,0.12) 0%, rgba(124,92,252,0.12) 100%)',
                border: '1px solid var(--border-accent)',
                minHeight: 320,
              }}
            >
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'var(--cyan)', filter: 'blur(80px)', transform: 'translate(30%,-30%)' }}
              />
              <div className="relative z-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7"
                  style={{ background: 'rgba(0,194,255,0.15)', color: 'var(--cyan)', border: '1px solid var(--border-accent)' }}
                >
                  <Layers size={26} strokeWidth={1.6} />
                </div>
                <h3 className="text-h2 mb-3" style={{ color: 'var(--text-primary)' }}>On-Click Digital Onboarding</h3>
                <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.7 }}>
                  Students upload their documents once. AI verifies instantly. Rooms are allocated before they finish unpacking. Zero paper. Zero queues.
                </p>
              </div>
              <div className="relative z-10 flex gap-3 mt-8">
                {['AI Verification', 'Instant Allocation', 'Digital ID'].map(tag => (
                  <span
                    key={tag}
                    className="text-label px-4 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(0,194,255,0.08)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--cyan)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <FeatureCard delay={0.1} icon={Zap}        title="Smart Complaints"   desc="Real-time issue tracking with automated warden notifications and escalation timers."   accent="var(--purple)" />
            <FeatureCard delay={0.2} icon={CreditCard} title="Secure Payments"    desc="Enterprise-grade payment gateway. Fee collection, receipts, and financial history in one dashboard." accent="var(--cyan)" />
            <FeatureCard delay={0.3} icon={Smartphone}  title="Mobile-First Core" desc="Native-level performance on every screen. Students manage everything from their pocket." accent="#00D4A0" />
            <FeatureCard delay={0.4} icon={BarChart2}   title="Analytics Dashboard" desc="Occupancy rates, complaint trends, revenue graphs — actionable insights at a glance." accent="var(--gold)" />
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════ */}
      <section
        className="py-32"
        style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-label mb-4" style={{ color: 'var(--purple)' }}>How It Works</p>
            <h2 className="text-h1 mb-5" style={{ color: 'var(--text-primary)' }}>Up and running in three steps.</h2>
            <p className="text-body-lg" style={{ color: 'var(--text-secondary)' }}>
              No lengthy onboarding. No IT team required. Just a modern hostel, fully digital.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute top-10 left-1/6 right-1/6 h-px hidden lg:block"
              style={{ background: 'linear-gradient(90deg, transparent, var(--border-accent), transparent)' }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StepCard number="01" icon={Shield} title="Register Your Institution"  desc="Securely onboard your hostel and sync student records in minutes."               accent="var(--cyan)"   delay={0.0} />
              <StepCard number="02" icon={Layout} title="Configure Rooms & Policies"  desc="Set up blocks, rooms, fee structures, and staff permissions in our unified grid."  accent="var(--purple)" delay={0.15} />
              <StepCard number="03" icon={Globe}  title="Go Live"                     desc="Open your digital doors — students self-manage, wardens oversee, data flows freely." accent="#00D4A0"       delay={0.30} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═══════════════════════════════════ */}
      <section id="testimonials" className="py-32" style={{ overflow: 'hidden' }}>
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <p className="text-label mb-4" style={{ color: 'var(--gold)' }}>Testimonials</p>
          <h2 className="text-h1" style={{ color: 'var(--text-primary)' }}>Loved by students & wardens.</h2>
        </div>

        {/* Infinite marquee */}
        <div className="relative">
          {/* Edge fades */}
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--bg-base), transparent)' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--bg-base), transparent)' }}
          />
          <div className="flex gap-5 animate-marquee pl-5" style={{ width: 'max-content' }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative rounded-[2.5rem] p-16 md:p-24 text-center overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Glows */}
            <div
              className="absolute -top-1/2 -left-1/4 w-3/4 h-full rounded-full opacity-20 pointer-events-none"
              style={{ background: 'var(--cyan)', filter: 'blur(120px)' }}
            />
            <div
              className="absolute -bottom-1/2 -right-1/4 w-3/4 h-full rounded-full opacity-15 pointer-events-none"
              style={{ background: 'var(--purple)', filter: 'blur(120px)' }}
            />

            <div className="relative z-10">
              <p className="text-label mb-5" style={{ color: 'var(--cyan)' }}>Ready to upgrade?</p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: 'var(--text-primary)',
                  marginBottom: '1.5rem',
                }}
              >
                Transform your campus.<br />
                <span className="gradient-text">Starting today.</span>
              </h2>
              <p
                className="text-body-lg mb-10 mx-auto"
                style={{ color: 'var(--text-secondary)', maxWidth: 520 }}
              >
                Join thousands of students and administrators who've modernised their campus life with UNISTAY.
              </p>

              {/* Split CTA — clear login vs signup */}
              <div
                className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 rounded-2xl mb-8"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
              >
                <Link to="/login">
                  <button
                    className="btn-ghost w-full sm:w-auto"
                    style={{ height: '3rem', padding: '0 1.5rem', borderRadius: '0.875rem', borderColor: 'transparent' }}
                  >
                    Already a member? Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    className="btn-primary w-full sm:w-auto"
                    style={{ height: '3rem', padding: '0 1.75rem', borderRadius: '0.875rem', fontSize: '0.9375rem' }}
                  >
                    <span className="flex items-center gap-2">
                      Create Free Account
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                </Link>
              </div>

              <p className="text-label" style={{ color: 'var(--text-muted)' }}>
                No credit card required · Cancel anytime · GDPR compliant
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;