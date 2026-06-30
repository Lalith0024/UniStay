import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary', to, delay = 0, subtitle }) => {
  const colorConfig = {
    primary: {
      iconBg: 'bg-blue-500',
      iconText: 'text-white',
      glow: 'shadow-blue-500/20',
      accent: 'border-l-blue-500',
      trendBg: 'bg-blue-50 dark:bg-blue-500/10',
      trendText: 'text-blue-600 dark:text-blue-400',
    },
    success: {
      iconBg: 'bg-emerald-500',
      iconText: 'text-white',
      glow: 'shadow-emerald-500/20',
      accent: 'border-l-emerald-500',
      trendBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      trendText: 'text-emerald-600 dark:text-emerald-400',
    },
    warning: {
      iconBg: 'bg-amber-500',
      iconText: 'text-white',
      glow: 'shadow-amber-500/20',
      accent: 'border-l-amber-500',
      trendBg: 'bg-amber-50 dark:bg-amber-500/10',
      trendText: 'text-amber-600 dark:text-amber-400',
    },
    danger: {
      iconBg: 'bg-rose-500',
      iconText: 'text-white',
      glow: 'shadow-rose-500/20',
      accent: 'border-l-rose-500',
      trendBg: 'bg-rose-50 dark:bg-rose-500/10',
      trendText: 'text-rose-600 dark:text-rose-400',
    },
    info: {
      iconBg: 'bg-violet-500',
      iconText: 'text-white',
      glow: 'shadow-violet-500/20',
      accent: 'border-l-violet-500',
      trendBg: 'bg-violet-50 dark:bg-violet-500/10',
      trendText: 'text-violet-600 dark:text-violet-400',
    }
  };

  const c = colorConfig[color] || colorConfig.primary;

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={14} className="text-emerald-500" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-rose-500" />;
    return <Minus size={14} className="text-slate-400" />;
  };

  const content = (
    <div className={`relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border-l-4 ${c.accent} border border-slate-200/60 dark:border-zinc-800 transition-all duration-300 h-full flex flex-col justify-between overflow-hidden ${to ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 group' : ''}`}>
      {/* Subtle gradient glow in corner */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 ${c.iconBg} opacity-[0.07] dark:opacity-[0.12] rounded-full blur-2xl pointer-events-none`} />

      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className={`p-3 rounded-xl ${c.iconBg} ${c.iconText} shadow-lg ${c.glow}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${c.trendBg} text-xs font-bold ${c.trendText}`}>
            {getTrendIcon()}
            {trendValue}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5">{value}</h3>
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">{subtitle}</p>}
      </div>

      {/* Clickability indicator */}
      {to && (
        <div className="flex items-center gap-1 mt-4 text-xs font-bold text-slate-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          View details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="h-full"
    >
      {to ? (
        <Link to={to} className="block h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
};

export default KPICard;
