import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import { config } from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${config.API_URL}/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.name}!`);

      // Route based on role
      if (formData.role === 'admin' || formData.role === 'warden') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brandDark-950 flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-teal-400"></div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                id="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                icon={Mail}
              />

              <div className="space-y-1">
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  icon={Lock}
                />
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Select Role</label>
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

              <Button type="submit" variant="gradient" isLoading={loading} className="w-full shadow-xl shadow-primary-500/20">
                Sign In <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
