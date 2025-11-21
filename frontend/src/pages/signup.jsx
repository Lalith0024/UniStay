import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...submitData } = formData;
      const res = await axios.post('/api/auth/signup', submitData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brandDark-950 flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-primary-500"></div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Create Account</h2>
              <p className="text-slate-500 dark:text-slate-400">Join UNISTAY for a smarter hostel life</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30"
                >
                  {error}
                </motion.div>
              )}

              <Input
                id="name"
                type="text"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                icon={User}
              />

              <Input
                id="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                icon={Mail}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  icon={Lock}
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  icon={Check}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">I am a</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-white/50 dark:bg-brandDark-800/50 backdrop-blur-sm border border-slate-200 dark:border-brandDark-700 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="warden">Warden</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <Button type="submit" variant="gradient" isLoading={loading} className="w-full mt-2 shadow-xl shadow-primary-500/20">
                Create Account <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
