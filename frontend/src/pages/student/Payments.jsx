import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Download, History, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import SlideOver from '../../components/ui/SlideOver';
import PageHeader from '../../components/ui/PageHeader';
import { toast } from 'react-toastify';

export default function StudentPayments() {
  const [payments, setPayments] = useState([
    { id: 1, month: 'November 2024', amount: 8500, status: 'Paid', date: '2024-11-05', transactionId: 'TXN123456789' },
    { id: 2, month: 'October 2024', amount: 8500, status: 'Paid', date: '2024-10-05', transactionId: 'TXN987654321' },
    { id: 3, month: 'September 2024', amount: 8500, status: 'Paid', date: '2024-09-05', transactionId: 'TXN456789123' },
  ]);

  const [dueAmount, setDueAmount] = useState(8500);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle | processing | success

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'primary';
    }
  };

  const columns = [
    { header: 'Month', accessor: 'month', cellClassName: 'font-bold' },
    { header: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    { header: 'Transaction ID', accessor: 'transactionId', cellClassName: 'font-mono text-slate-500' },
    { header: 'Amount', render: (row) => <span className="font-bold">₹{row.amount.toLocaleString()}</span> },
    { header: 'Status', render: (row) => <Badge variant={getStatusColor(row.status)}>{row.status}</Badge> },
    { header: 'Receipt', cellClassName: 'text-right', render: () => (
      <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg text-primary-500 transition-colors inline-flex justify-center">
        <Download size={18} />
      </button>
    )}
  ];

  const handlePayNow = () => {
    setPaymentStatus('idle');
    setSlideOverOpen(true);
  };

  const simulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setDueAmount(0);
      setPayments(prev => [
        {
          id: Date.now(),
          month: 'December 2024',
          amount: 8500,
          status: 'Paid',
          date: new Date().toISOString().split('T')[0],
          transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`
        },
        ...prev
      ]);
      toast.success('Payment successful!');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <PageHeader 
        title="Fee Payments" 
        description="Manage your hostel fees, view past transactions, and download receipts."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-500/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <AlertCircle size={16} />
              <span className="text-sm font-bold uppercase tracking-wider">Current Due Amount</span>
            </div>
            <h2 className="text-5xl font-black mb-2 tracking-tight">₹{dueAmount.toLocaleString()}</h2>
            {dueAmount > 0 ? (
              <p className="text-primary-100 font-medium bg-white/10 inline-block px-3 py-1 rounded-lg">Due by 5th December 2024</p>
            ) : (
              <p className="text-emerald-300 font-bold bg-white/10 inline-block px-3 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 size={16} /> All caught up!
              </p>
            )}
          </div>

          {dueAmount > 0 && (
            <button 
              onClick={handlePayNow}
              className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
            >
              <CreditCard size={24} />
              Pay Now
            </button>
          )}
        </div>
      </motion.div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm flex-1">
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="text-slate-400" size={20} />
            Payment History
          </h3>
          <button className="text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-4 py-2 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-bold flex items-center gap-2 transition-colors">
            <Download size={16} />
            Statement
          </button>
        </div>

        <DataTable columns={columns} data={payments} />
      </div>

      <SlideOver isOpen={slideOverOpen} onClose={() => { if (paymentStatus !== 'processing') setSlideOverOpen(false); }} title="Checkout">
        <div className="flex flex-col h-full">
          {paymentStatus === 'idle' && (
            <div className="space-y-6 flex-1">
              <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Invoice Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                    <span>Hostel Rent (December)</span>
                    <span className="font-medium">₹5,000</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                    <span>Mess Charges (December)</span>
                    <span className="font-medium">₹3,500</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Late Fees</span>
                    <span>₹0</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-end">
                  <span className="text-slate-900 dark:text-white font-bold">Total Amount Due</span>
                  <span className="text-3xl font-black text-primary-600 dark:text-primary-500">₹8,500</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Payment Method</h3>
                
                {/* Dummy Payment Methods */}
                <label className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-2 border-primary-500 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" defaultChecked className="text-primary-500 focus:ring-primary-500 w-4 h-4" />
                    <span className="font-bold text-slate-900 dark:text-white">UPI (GPay, PhonePe)</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4" />
                </label>
                
                <label className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" className="text-primary-500 focus:ring-primary-500 w-4 h-4" />
                    <span className="font-bold text-slate-700 dark:text-zinc-300">Credit / Debit Card</span>
                  </div>
                  <CreditCard className="text-slate-400" />
                </label>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck size={16} className="text-emerald-500" />
                Payments are securely processed via Razorpay.
              </div>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-100 dark:border-zinc-800 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="text-primary-500" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Processing Payment...</h3>
                <p className="text-slate-500 mt-2">Please do not close this window or press back.</p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Payment Successful!</h3>
                <p className="text-slate-500 mb-6">Your transaction was processed successfully.</p>
                <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl inline-block text-left border border-slate-100 dark:border-zinc-800">
                  <p className="text-sm text-slate-500 mb-1">Transaction ID</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">{`TXN${Math.floor(Math.random() * 1000000000)}`}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/80 mt-auto">
            {paymentStatus === 'idle' && (
              <button onClick={simulatePayment} className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all text-lg">
                Pay ₹8,500
              </button>
            )}
            {paymentStatus === 'success' && (
              <button onClick={() => setSlideOverOpen(false)} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg transition-all text-lg hover:scale-105">
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </SlideOver>
    </div>
  );
}
