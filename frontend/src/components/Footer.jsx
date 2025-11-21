import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-brandDark-950 border-t border-slate-200 dark:border-brandDark-800 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg">
                U
              </div>
              <span className="text-xl font-bold font-display text-slate-900 dark:text-white">
                UNISTAY
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Revolutionizing hostel management with smart technology.
              Making campus living seamless, secure, and enjoyable for everyone.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-brandDark-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} UNISTAY. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Github size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
