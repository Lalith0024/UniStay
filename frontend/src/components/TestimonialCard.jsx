import React from 'react';
import { Star } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const TestimonialCard = ({ name, role, content, avatar }) => {
  return (
    <div className="min-w-[350px] p-8 rounded-2xl bg-white dark:bg-brandDark-900 border border-slate-100 dark:border-brandDark-800 shadow-sm mx-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, starIdx) => (
            <Star key={starIdx} size={16} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">"{content}"</p>
      </div>
      <div className="flex items-center gap-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/20" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">{name}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
