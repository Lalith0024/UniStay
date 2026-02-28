import React from 'react';
import { motion } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const FeatureCard = ({ icon: Icon, title, description, delay = 0, color = "cyan" }) => {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay }}
      className="group relative"
    >
      <div className={`relative overflow-hidden rounded-2xl p-6 h-full transition-all duration-500
        bg-[var(--bg-card)] border border-[var(--border-subtle)] 
        hover:border-[var(--border-accent)] hover:shadow-2xl hover:shadow-${color}-500/10
        hover:-translate-y-1`}
      >
        {/* Glow effect */}
        <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${colorMap[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} border ${colorMap[color].split(' ')[3]} 
            flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={22} strokeWidth={1.8} />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
