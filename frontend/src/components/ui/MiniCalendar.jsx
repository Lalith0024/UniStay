import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MiniCalendar = ({ events = [], onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Map events to dates
  const eventDates = events.reduce((acc, event) => {
    const d = new Date(event.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            <ChevronLeft size={18} className="text-slate-600 dark:text-zinc-300" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            <ChevronRight size={18} className="text-slate-600 dark:text-zinc-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-400 dark:text-zinc-500 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = new Date().getDate() === day && 
                         new Date().getMonth() === currentDate.getMonth() && 
                         new Date().getFullYear() === currentDate.getFullYear();
          
          const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
          const dayEvents = eventDates[key] || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect && onDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              className={`
                relative p-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center
                ${isToday 
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' 
                  : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200'
                }
              `}
            >
              {day}
              {hasEvents && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((e, idx) => (
                    <span 
                      key={idx} 
                      className={`w-1 h-1 rounded-full ${e.color || 'bg-amber-500'} ${isToday ? 'bg-white' : ''}`}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
