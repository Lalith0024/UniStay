import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import { config } from '../config';
import campusImage from '../assets/image.png';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' // UI selection; backend role will be trusted when returned
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // send everything except confirmPassword
      const { confirmPassword, ...submitData } = formData;

      const res = await axios.post(`${config.API_URL}/auth/signup`, submitData);

      const token = res.data?.token;
      const user = res.data?.user;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success(`Welcome, ${user.name}! Account created.`);

        // Prefer backend role; fallback to frontend selection if backend didn't return role
        const role = user.role || formData.role;

        if (role === 'admin' || role === 'warden') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        // in case backend returns success but no token/user
        toast.success('Account created. Please log in.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={campusImage}
          alt="Campus Background"
          className="w-full h-full object-cover opacity-95"
        />
        <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-b from-white/40 via-white/30 to-white/50" />
      </div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-lg"
        >
          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-primary-500" />

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
              <p className="text-slate-500 dark:text-slate-400">Join UNISTAY for a smarter hostel life</p>
            </div>

            <form id="signupForm" onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="name"
                type="text"
                label="Full Name"
                icon={User}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                id="email"
                type="email"
                label="Email Address"
                icon={Mail}
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  icon={Check}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  I am a...
                </label>
                <div className="relative">
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-white/50 dark:bg-brandDark-800/50 backdrop-blur-sm border border-slate-200 dark:border-brandDark-700 rounded-xl py-3.5 pl-4 pr-10 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
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

              {/* Both form submit and button click call handleSubmit */}
              <Button
                type="button"
                onClick={handleSubmit}
                variant="gradient"
                isLoading={loading}
                className="w-full mt-2 shadow-xl shadow-primary-500/20"
              >
                Create Account <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-center text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">Sign In</Link>
              </p>
            </form>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
