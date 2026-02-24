import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brandDark border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                U
              </div>
              <span className="text-2xl font-black font-display tracking-tight text-white">
                UNISTAY
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-lg">
              Empowering the next generation of campus living through smart technology and seamless automation.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Product</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-slate-400 hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} UNISTAY. All rights reserved. Made for modern campuses.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-slate-400 hover:text-primary-400 transition-all hover:scale-110"><Github size={22} /></a>
            <a href="#" className="text-slate-400 hover:text-primary-400 transition-all hover:scale-110"><Twitter size={22} /></a>
            <a href="#" className="text-slate-400 hover:text-primary-400 transition-all hover:scale-110"><Linkedin size={22} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
