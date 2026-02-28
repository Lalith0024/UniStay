import React from 'react';
import { motion } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const StepCard = ({ number, icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay }}
    className="relative text-center"
  >
    <div className="relative inline-flex mb-6">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
        flex items-center justify-center text-[var(--cyan)] transition-all duration-300 hover:scale-105 hover:border-[var(--border-accent)]">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)]
        flex items-center justify-center text-xs font-bold text-[var(--cyan)]">
        {number}
      </div>
    </div>
    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
    <p className="text-sm text-[var(--text-secondary)] max-w-[260px] mx-auto leading-relaxed">{description}</p>
  </motion.div>
);

export default StepCard;
