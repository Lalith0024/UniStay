import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Features',     href: '/#features'     },
  { label: 'Testimonials', href: '/#testimonials'  },
  { label: 'About',        href: '/about'          },
];

/* ── Single nav pill link ── */
const NavLink = ({ href, label, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="nav-link"
    style={{ fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}
  >
    {label}
  </a>
);

/* ── Theme toggle pill ── */
const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle colour scheme"
      className={`theme-toggle ${isDark ? '' : 'theme-toggle--light'}`}
    >
      <div className="theme-toggle__thumb">
        {isDark
          ? <Moon size={11} strokeWidth={2.5} />
          : <Sun  size={11} strokeWidth={2.5} />
        }
      </div>
    </button>
  );
};

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const location = useLocation();

  /* Close mobile menu on route change */
  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBase = [
    'fixed top-0 left-0 right-0 z-[200]',
    'transition-all duration-500',
  ].join(' ');

  const navScrolled = scrolled
    ? 'py-3 backdrop-blur-2xl'
    : 'py-6';

  const navBg = scrolled
    ? 'bg-[var(--bg-base)]/80 border-b border-[var(--border-subtle)]'
    : 'bg-transparent border-b border-transparent';

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`${navBase} ${navScrolled} ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* ── Brand ────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 group z-10">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-base select-none transition-transform duration-500 group-hover:rotate-12"
              style={{
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                fontFamily: 'var(--font-display)',
              }}
            >
              U
            </div>
            <div
              className="absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"
              style={{ background: 'var(--cyan)' }}
            />
          </div>
          <span
            className="text-lg tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            UNISTAY
          </span>
        </Link>

        {/* ── Centered Nav Links (desktop) ─────────── */}
        <div
          className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2 px-2 py-1.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {NAV_LINKS.map(link => (
            <NavLink key={link.label} href={link.href} label={link.label} />
          ))}
        </div>

        {/* ── Right Actions (desktop) ──────────────── */}
        <div className="hidden md:flex items-center gap-4 z-10">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          <Link
            to="/login"
            className="text-sm font-medium transition-colors duration-200"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Log In
          </Link>

          <Link to="/signup">
            <button className="btn-primary" style={{ height: '2.5rem', padding: '0 1.25rem', fontSize: '0.875rem' }}>
              <span>Get Started</span>
            </button>
          </Link>
        </div>

        {/* ── Mobile Hamburger ─────────────────────── */}
        <button
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 z-10"
          style={{
            background: mobileOpen ? 'var(--cyan-glow)' : 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Open menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile Drawer ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1,  y: 0   }}
            exit={  { opacity: 0,  y: -12  }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="md:hidden absolute top-full left-0 right-0 p-6"
            style={{
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {/* Links */}
            <div className="flex flex-col gap-1 mb-6">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="section-divider mb-6" />

            {/* Theme + Actions */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-label" style={{ color: 'var(--text-muted)' }}>
                Appearance
              </span>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <button className="btn-ghost w-full" style={{ height: '2.75rem' }}>
                  Log In
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <button className="btn-primary w-full" style={{ height: '2.75rem' }}>
                  <span>Get Started</span>
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;