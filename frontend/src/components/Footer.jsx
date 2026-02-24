import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brandDark border-t border-white/5 pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5 space-y-10">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-500/20 group-hover:rotate-6 transition-all duration-500">
                  U
                </div>
                <div className="absolute -inset-1 bg-primary-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-3xl font-black font-display tracking-tighter text-white transition-colors group-hover:text-primary-400">
                  UNISTAY
                </span>
                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em] leading-none">Smart Living</span>
              </div>
            </Link>
            <p className="text-slate-400 text-xl leading-relaxed max-w-sm font-medium">
              We're not just building software; we're architecting the future of campus living. Seamless, secure, and modern.
            </p>
            <div className="flex items-center gap-6">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/20 transition-all duration-300"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.4em]">Products</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-slate-400 hover:text-white transition-colors font-semibold">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-semibold">Dashboard</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-semibold">Verification API</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-semibold">Native App</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.4em]">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-semibold">Our Story</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-semibold">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-semibold">Brand Kit</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-semibold">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.4em]">Join the Pulse</h4>
            <p className="text-slate-400 text-sm font-medium">Get the latest updates on campus tech and smart hostel management.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-slate-600 outline-none focus:border-primary-500/50 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary-500 text-brandDark rounded-xl font-black text-xs uppercase tracking-tighter hover:bg-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <span className="text-slate-600">© {new Date().getFullYear()} UNISTAY OS</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Audit</a>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
