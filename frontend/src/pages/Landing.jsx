import React from 'react';
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

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const headline = "Smart Living for Modern Students";

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
    <div className="min-h-screen bg-slate-50 dark:bg-black overflow-x-hidden selection:bg-primary-500/30 font-sans transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-slate-300 mb-10 shadow-sm hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              The Future of Hostel Living is Here
            </motion.div>

            <motion.h1 className="text-5xl lg:text-7xl font-bold font-display text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1] overflow-hidden">
              <motion.span
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.05 }}
                aria-hidden
              >
                {headline.split(" ").map((word, index) => (
                  <span key={index} className="inline-block mr-4">
                    {word.split("").map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        variants={letterVariants}
                        transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience seamless hostel management with UNISTAY. From instant room allocation to digital complaints, we've reimagined campus life.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/signup" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto min-w-[180px] shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 py-4 text-lg">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[180px] py-4 text-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10">
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats / Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
            >
              {[
                { label: 'Active Users', value: '10k+' },
                { label: 'Universities', value: '50+' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Rating', value: '4.9/5' },
              ].map((stat, idx) => (
                <div key={idx} className="group cursor-default p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-300">
                  <h4 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">{stat.value}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white dark:bg-black relative transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold font-display text-slate-900 dark:text-white mb-6"
            >
              Everything you need to <br /> run a smart hostel
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
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
                whileHover={{ y: -8 }}
                className="p-10 rounded-[2rem] bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/40 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Scroll Testimonials */}
      <section id="testimonials" className="py-32 bg-slate-50 dark:bg-black overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-6 mb-20">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-4"
            >
              Loved by Students & Wardens
            </motion.h2>
          </div>
        </div>

        <div className="relative flex overflow-x-hidden group hover:pause">
          <div className="animate-marquee whitespace-nowrap flex gap-8 hover:pause">
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8 hover:pause">
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>

          {/* Fade Edges */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-50 dark:from-black to-transparent z-10 pointer-events-none transition-colors duration-300"></div>
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-50 dark:from-black to-transparent z-10 pointer-events-none transition-colors duration-300"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-gradient-to-br from-primary-900 to-neutral-900 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Decorative Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[3rem]">
              <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-primary-500/30 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-teal-400/20 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold font-display text-white mb-8">
                Ready to Transform Your Campus?
              </h2>
              <p className="text-primary-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of students and administrators using UNISTAY for a smarter, safer, and more efficient living experience.
              </p>
              <Link to="/signup">
                <Button variant="primary" size="lg" className="bg-white text-primary-900 hover:bg-primary-50 shadow-xl shadow-black/20 border-none px-10 py-5 text-lg h-auto">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

      <Footer />
    </div>
  );
};

export default Landing;
