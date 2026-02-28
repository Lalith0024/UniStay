import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const LandingTestimonialCard = ({ quote, author, role, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay }}
    className="group relative w-[350px] whitespace-normal"
  >
    <div className="relative p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]
      hover:border-[var(--border-accent)] transition-all duration-300 h-full">
      <div className="flex gap-1.5 mb-5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={15} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
        ))}
      </div>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] flex items-center justify-center text-white font-semibold text-sm">
          {author[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{author}</p>
          <p className="text-xs text-[var(--text-muted)]">{role}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default LandingTestimonialCard;
