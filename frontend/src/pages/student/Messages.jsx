import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function StudentMessages() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="p-6 rounded-full bg-slate-100 dark:bg-neutral-800 mb-6">
        <MessageSquare size={48} className="text-primary-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Messages Coming Soon</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        We are working on a new messaging system to help you connect with your roommates and hostel administration easily.
      </p>
    </div>
  );
}
