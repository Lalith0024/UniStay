import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  History
} from 'lucide-react';

export default function StudentPayments() {
  // Mock data for payments
  const [payments] = useState([
    { id: 1, month: 'November 2024', amount: 8500, status: 'Paid', date: '2024-11-05', transactionId: 'TXN123456789' },
    { id: 2, month: 'October 2024', amount: 8500, status: 'Paid', date: '2024-10-05', transactionId: 'TXN987654321' },
    { id: 3, month: 'September 2024', amount: 8500, status: 'Paid', date: '2024-09-05', transactionId: 'TXN456789123' },
  ]);

  const [dueAmount] = useState(8500);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'overdue':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Due Amount Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-slate-400 mb-1">Total Due Amount</p>
            <h2 className="text-4xl font-bold mb-2">₹{dueAmount.toLocaleString()}</h2>
            <p className="text-sm text-slate-400">Due by 5th December 2024</p>
          </div>

          <button className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            <CreditCard size={20} />
            Pay Now
          </button>
        </div>
      </motion.div>

      {/* Payment History */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-neutral-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="text-primary-500" size={20} />
            Payment History
          </h3>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
            <Download size={16} />
            Download Statement
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-neutral-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Month</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-neutral-700">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    {payment.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">
                    {payment.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      <CheckCircle size={12} />
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
