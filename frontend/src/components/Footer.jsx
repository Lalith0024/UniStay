import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Changelog', href: '#' },
      { label: 'Roadmap', href: '#' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    Resources: [
      { label: 'Documentation', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Status', href: '#' },
    ],
    Legal: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] 
                  flex items-center justify-center text-white font-bold text-lg transition-transform duration-300 group-hover:scale-105">
                  U
                </div>
                <div className="absolute -inset-1 rounded-xl bg-[var(--cyan)] opacity-0 group-hover:opacity-30 
                  blur-md transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-display)' }}>
                UNISTAY
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-6 leading-relaxed">
              Modern hostel management for educational institutions. Streamline operations, 
              enhance student experience.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                    flex items-center justify-center text-[var(--text-muted)] 
                    hover:text-[var(--text-primary)] hover:border-[var(--border-accent)] 
                    transition-all duration-200"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] tracking-wider uppercase mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] 
                        transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter section */}
        <div className="py-8 border-y border-[var(--border-subtle)] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                Stay updated
              </h4>
              <p className="text-sm text-[var(--text-muted)]">
                Get the latest news and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                  text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                  focus:outline-none focus:border-[var(--border-accent)] transition-colors"
              />
              <button className="px-4 py-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                text-sm font-medium text-[var(--text-primary)] hover:border-[var(--border-accent)] 
                hover:bg-[var(--cyan-glow)] transition-all duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            {currentYear} UNISTAY. All rights reserved.
          </p>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs text-[var(--text-muted)]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
