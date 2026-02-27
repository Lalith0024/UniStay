import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { config } from '../config';
import campusImage from '../assets/image.png';


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password
      };

      const res = await axios.post(`${config.API_URL}/auth/login`, payload);

      const token = res.data?.token;
      const user = res.data?.user;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success(`Welcome back, ${user.name}!`);

        const role = user.role || formData.role;

        if (role === 'admin' || role === 'warden') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          if (!user.room) {
            navigate('/onboarding', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={campusImage}
          alt="Campus Background"
          className="w-full h-full object-cover opacity-95"
        />
        <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-b from-white/40 via-white/30 to-white/50 dark:from-black/40 dark:via-black/30 dark:to-black/60" />
      </div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)]" />

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selector - Toggle Buttons */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Login as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('student')}
                    className={`relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${formData.role === 'student'
                      ? 'bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] text-white shadow-lg'
                      : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[var(--cyan)] dark:hover:border-[var(--cyan)]'
                      }`}
                  >
                    <User className="w-4 h-4 inline-block mr-2" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${formData.role === 'admin'
                      ? 'bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] text-white shadow-lg'
                      : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[var(--cyan)] dark:hover:border-[var(--cyan)]'
                      }`}
                  >
                    <User className="w-4 h-4 inline-block mr-2" />
                    Admin
                  </button>
                </div>
              </div>

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

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[var(--cyan)] hover:opacity-80 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200
                  bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)]
                  hover:opacity-90 hover:shadow-lg hover:shadow-[var(--cyan)]/25
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-[var(--cyan)] hover:opacity-80 transition-colors">
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
