import React from 'react';

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <div className="glass-card p-8 md:p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
