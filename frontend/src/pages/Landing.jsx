import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, Zap, Smartphone, CheckCircle, Users,
  CreditCard, BarChart3, Layout, Bell, ChevronRight,
  Sparkles, Star, Lock, Clock, FileText, Home, MessageSquare,
  Calendar, Wallet, Settings, TrendingUp, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardPreview from '../components/landing/DashboardPreview';
import FeatureCard from '../components/landing/FeatureCard';
import StepCard from '../components/landing/StepCard';
import LandingTestimonialCard from '../components/landing/LandingTestimonialCard';

/* ─── Easing Curves ─────────────────────────────────────── */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const EASE_SPRING = { type: "spring", stiffness: 100, damping: 15 };

/* ─── Animated Counter Hook ─────────────────────────────── */
const useCounter = (target, isInView, delay = 0) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const steps = 50;
      const interval = 1500 / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 4);
        setValue(Math.floor(target * eased));
        if (step >= steps) { setValue(target); clearInterval(timer); }
      }, interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, target, delay]);
  return value;
};

/* ─── Typewriter Effect ─────────────────────────────────── */
const WORDS = ['Simplified.', 'Digitized.', 'Modernized.'];

const Typewriter = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-block relative overflow-hidden" style={{ height: '1.1em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="gradient-text block"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};



/* ─── Main Landing Page ─────────────────────────────────── */
const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } }
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, var(--purple) 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div className="absolute inset-0 dot-grid opacity-10" />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content */}
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8
                  bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-[var(--cyan)] opacity-75" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--cyan)]" />
                  </span>
                  <span className="text-xs font-medium text-[var(--cyan)] tracking-wide">Now in Beta</span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-2"
                  style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                  Hostel Life
                </h1>
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                  style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1, minHeight: '1.1em' }}>
                  <Typewriter />
                </div>
              </motion.div>

              {/* Subheadline */}
              <motion.p variants={itemVariants}
                className="text-lg text-[var(--text-secondary)] max-w-lg mb-8 leading-relaxed">
                A modern platform designed for educational institutions to streamline hostel operations,
                from room allocations to complaint management — all in one place.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <button className="btn-primary group">
                    <span className="flex items-center gap-2">
                      Start Free Trial
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="btn-ghost">
                    Sign In to Dashboard
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right - Dashboard Preview */}
            <div className="hidden lg:block">
              <DashboardPreview />
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--cyan)] to-transparent" />
        </motion.div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="py-24 lg:py-32 border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold text-[var(--cyan)] tracking-widest uppercase mb-4 block">Features</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-display)' }}>
                Everything you need
              </h2>
              <p className="text-[var(--text-secondary)] text-lg">
                Built from the ground up to solve real problems faced by hostel administrators and students.
              </p>
            </motion.div>
          </div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Home}
              title="Smart Room Allocation"
              description="Automated room assignments based on preferences, availability, and student profiles."
              delay={0}
              color="cyan"
            />
            <FeatureCard
              icon={MessageSquare}
              title="Complaint Management"
              description="Students can raise issues instantly. Wardens track and resolve with full transparency."
              delay={0.1}
              color="purple"
            />
            <FeatureCard
              icon={CreditCard}
              title="Fee Management"
              description="Track payments, generate receipts, and send reminders — all automated."
              delay={0.2}
              color="emerald"
            />
            <FeatureCard
              icon={Calendar}
              title="Leave Requests"
              description="Digital leave applications with approval workflows and parent notifications."
              delay={0.3}
              color="amber"
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Occupancy rates, complaint trends, and financial insights at a glance."
              delay={0.4}
              color="rose"
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="Enterprise-grade security with role-based access control for all data."
              delay={0.5}
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 lg:py-32 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold text-[var(--purple)] tracking-widest uppercase mb-4 block">How It Works</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-display)' }}>
                Get started in minutes
              </h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
                No complex setup. No IT team required. Just sign up and start managing.
              </p>
            </motion.div>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line - desktop only */}
            <div className="hidden lg:block absolute top-8 left-[16.67%] right-[16.67%] h-px 
              bg-gradient-to-r from-transparent via-[var(--border-accent)] to-transparent" />

            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                number="1"
                icon={Layout}
                title="Create Your Account"
                description="Sign up with your institutional email. Verification is instant and secure."
                delay={0}
              />
              <StepCard
                number="2"
                icon={Settings}
                title="Configure Your Hostel"
                description="Add blocks, rooms, and set policies. Import student data via CSV."
                delay={0.15}
              />
              <StepCard
                number="3"
                icon={Zap}
                title="Go Live"
                description="Share access with students. They onboard themselves. You manage effortlessly."
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS SECTION ═══ */}
      <section className="py-24 lg:py-32 border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold text-[var(--cyan)] tracking-widest uppercase mb-4 block">Why UNISTAY</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-display)' }}>
                Built for modern educational institutions
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8">
                We understand the challenges of hostel management. That&apos;s why we built a platform
                that actually works for administrators, wardens, and students alike.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Clock, text: 'Save 10+ hours every week on administrative tasks' },
                  { icon: Users, text: 'Improve student satisfaction with faster response times' },
                  { icon: Lock, text: 'Keep data secure with bank-level encryption' },
                  { icon: Smartphone, text: 'Access from anywhere — desktop, tablet, or mobile' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                      flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-[var(--cyan)]" />
                    </div>
                    <p className="text-[var(--text-secondary)] pt-2">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--cyan)]/10 to-[var(--purple)]/10" />
                <div className="p-8 space-y-6">
                  {/* Mock feature cards */}
                  {[
                    { icon: Bell, title: 'Instant Notifications', desc: 'Real-time alerts for complaints & requests' },
                    { icon: Wallet, title: 'Payment Tracking', desc: 'Automated fee collection & reminders' },
                    { icon: Award, title: 'Student Profiles', desc: 'Complete student information at a glance' },
                  ].map((card, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]
                      hover:border-[var(--border-accent)] transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center">
                        <card.icon size={22} className="text-[var(--cyan)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">{card.title}</h4>
                        <p className="text-sm text-[var(--text-muted)]">{card.desc}</p>
                      </div>
                      <ChevronRight size={18} className="ml-auto text-[var(--text-muted)]" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-24 lg:py-32 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold text-[var(--gold)] tracking-widest uppercase mb-4 block">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-display)' }}>
                Loved by early adopters
              </h2>
              <p className="text-[var(--text-secondary)] text-lg">
                Here&apos;s what the first institutions using UNISTAY have to say.
              </p>
            </motion.div>
          </div>

          {/* Testimonials Marquee */}
          <div className="relative overflow-hidden w-full">
            <div className="flex animate-marquee whitespace-nowrap gap-6 w-max py-4">
              {[...Array(2)].map((_, listIdx) => (
                <div key={listIdx} className="flex gap-6">
                  <LandingTestimonialCard
                    quote="The complaint management system alone has saved us countless hours. Students love the transparency."
                    author="Dr. Sharma"
                    role="Hostel Warden"
                  />
                  <LandingTestimonialCard
                    quote="Finally, a hostel management system that doesn't look like it's from 2005. Clean, fast, and intuitive."
                    author="Rahul K."
                    role="Student, Year 3"
                  />
                  <LandingTestimonialCard
                    quote="Room allocations used to take days. Now it's done in minutes. The automation is incredible."
                    author="Prof. Patel"
                    role="Administration Head"
                  />
                  <LandingTestimonialCard
                    quote="Managing parent communications and leave requests is so much more organized now."
                    author="Ms. Ananya"
                    role="Warden, Block B"
                  />
                  <LandingTestimonialCard
                    quote="The analytics dashboard provides great insights into hostel occupancy and fee collections."
                    author="Mr. Vikram"
                    role="Hostel Director"
                  />
                </div>
              ))}
            </div>
            {/* Gradient overlays for smooth fading at edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg-surface)] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--bg-surface)] to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      {/* ═══ PRICING SECTION ═══ */}
      <section className="py-24 lg:py-32 border-t border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold text-[var(--cyan)] tracking-widest uppercase mb-4 block">Pricing</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-display)' }}>
                Simple, transparent pricing
              </h2>
              <p className="text-[var(--text-secondary)] text-lg">
                Start free. Scale as you grow. No hidden fees.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Starter</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6">Perfect for small hostels</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--text-primary)]">Free</span>
                <span className="text-[var(--text-muted)]"> forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Up to 50 students', 'Basic room management', 'Complaint tracking', 'Email support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle size={16} className="text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <button className="w-full btn-ghost">Get Started</button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--cyan)]/50"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--cyan)] text-xs font-semibold text-white">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Institution</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6">For growing institutions</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--text-primary)]">$29</span>
                <span className="text-[var(--text-muted)]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited students', 'Advanced analytics', 'Payment integration', 'Priority support', 'Custom branding'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle size={16} className="text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <button className="w-full btn-primary">
                  <span>Start Free Trial</span>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}

      <Footer />
    </div>
  );
};

export default Landing;
