import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Smartphone, Star, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import TestimonialCard from '../components/TestimonialCard';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student, Year 2",
      content: "UNISTAY has made my hostel life so much easier. Raising complaints is literally one click away!",
      avatar: "https://i.pravatar.cc/150?u=1"
    },
    {
      name: "Michael Chen",
      role: "Warden",
      content: "The dashboard gives me complete visibility over the hostel. Administrative work is cut down by 50%.",
      avatar: "https://i.pravatar.cc/150?u=2"
    },
    {
      name: "Priya Patel",
      role: "Student, Year 3",
      content: "I love the clean interface and dark mode. It feels like a modern app, not some old government portal.",
      avatar: "https://i.pravatar.cc/150?u=3"
    },
    {
      name: "James Wilson",
      role: "Administrator",
      content: "Seamless integration with our existing systems. The support team is fantastic.",
      avatar: "https://i.pravatar.cc/150?u=4"
    },
    {
      name: "Anita Roy",
      role: "Student, Year 1",
      content: "Digital onboarding was a breeze. I got my room allocated in minutes!",
      avatar: "https://i.pravatar.cc/150?u=5"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brandDark-950 overflow-x-hidden selection:bg-primary-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-slate-300 mb-8 shadow-sm hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              The Future of Hostel Living is Here
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold font-display text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
              Smart Living for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 bg-300% animate-gradient">
                Modern Students
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience seamless hostel management with UNISTAY. From instant room allocation to digital complaints, we've reimagined campus life.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto min-w-[180px] shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[180px]">
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats / Trust Indicators */}
            <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-slate-200/60 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Active Users', value: '10k+' },
                { label: 'Universities', value: '50+' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Rating', value: '4.9/5' },
              ].map((stat, idx) => (
                <div key={idx} className="group cursor-default">
                  <h4 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">{stat.value}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-brandDark-900 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold font-display text-slate-900 dark:text-white mb-4"
            >
              Everything you need to <br /> run a smart hostel
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              Powerful features designed to streamline operations and enhance the student living experience.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Digital Onboarding",
                desc: "Paperless admission process with instant room allocation and digital ID generation.",
                icon: Users,
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                title: "Smart Complaints",
                desc: "Real-time complaint tracking with status updates and automated escalation.",
                icon: Zap,
                color: "text-yellow-500",
                bg: "bg-yellow-500/10"
              },
              {
                title: "Secure Payments",
                desc: "Integrated payment gateway for hassle-free fee collection and financial tracking.",
                icon: Shield,
                color: "text-green-500",
                bg: "bg-green-500/10"
              },
              {
                title: "Mobile First",
                desc: "Fully responsive design that works perfectly on all devices for students on the go.",
                icon: Smartphone,
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              {
                title: "Attendance Tracking",
                desc: "Digital attendance system with biometric integration capabilities.",
                icon: CheckCircle,
                color: "text-pink-500",
                bg: "bg-pink-500/10"
              },
              {
                title: "Analytics Dashboard",
                desc: "Comprehensive insights into occupancy, payments, and facility usage.",
                icon: Star,
                color: "text-orange-500",
                bg: "bg-orange-500/10"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-brandDark-800 border border-slate-100 dark:border-brandDark-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Scroll Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-50 dark:bg-brandDark-950 overflow-hidden">
        <div className="container mx-auto px-6 mb-16">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold font-display text-slate-900 dark:text-white mb-4"
            >
              Loved by Students & Wardens
            </motion.h2>
          </div>
        </div>

        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8">
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>

          {/* Fade Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-brandDark-950 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-brandDark-950 to-transparent z-10"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto bg-gradient-to-br from-primary-900 to-brandDark-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Decorative Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem]">
              <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-primary-500/30 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-teal-400/20 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
                Ready to Transform Your Campus?
              </h2>
              <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of students and administrators using UNISTAY for a smarter, safer, and more efficient living experience.
              </p>
              <Link to="/signup">
                <Button variant="primary" size="lg" className="bg-white text-primary-900 hover:bg-primary-50 shadow-xl shadow-black/20 border-none">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
