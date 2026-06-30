import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusStepper = ({ steps = [], currentStepIndex, orientation = 'horizontal' }) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`flex ${isHorizontal ? 'items-center justify-between' : 'flex-col gap-6'} w-full relative`}>
      {isHorizontal && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-zinc-800 rounded-full" />
      )}
      
      {!isHorizontal && (
        <div className="absolute left-5 top-0 bottom-0 w-1 bg-slate-100 dark:bg-zinc-800 rounded-full" />
      )}

      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;
        const isUpcoming = idx > currentStepIndex;

        return (
          <div key={idx} className={`relative flex ${isHorizontal ? 'flex-col items-center flex-1' : 'flex-row items-center gap-4'} z-10`}>
            {/* Connection Line fill (Horizontal) */}
            {isHorizontal && idx > 0 && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: isCompleted || isCurrent ? '100%' : '0%' }}
                className="absolute right-1/2 top-5 -translate-y-1/2 h-1 bg-primary-500 origin-left z-[-1] hidden" // Used actual absolute divs for lines above, this is for animation if needed
              />
            )}

            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500
              ${isCompleted 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 border-2 border-primary-500' 
                : isCurrent 
                  ? 'bg-white dark:bg-zinc-900 text-primary-500 border-4 border-primary-500 shadow-xl scale-110' 
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 border-2 border-transparent'
              }
            `}>
              {isCompleted ? <Check size={18} /> : (idx + 1)}
            </div>

            <div className={`${isHorizontal ? 'mt-3 text-center' : ''}`}>
              <p className={`text-sm font-bold ${isCurrent ? 'text-primary-600 dark:text-primary-400' : isUpcoming ? 'text-slate-400' : 'text-slate-700 dark:text-zinc-300'}`}>
                {step.label}
              </p>
              {step.description && (
                <p className={`text-xs mt-1 max-w-[120px] ${isUpcoming ? 'text-slate-300 dark:text-zinc-600' : 'text-slate-500'}`}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusStepper;
