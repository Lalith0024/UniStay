import React from 'react';

const PageHeader = ({ title, description, actions, breadcrumbs }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex-1 min-w-0">
        {breadcrumbs && (
          <nav className="flex text-sm text-slate-500 dark:text-zinc-400 mb-2">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center">
                {idx > 0 && <span className="mx-2 text-slate-300 dark:text-zinc-600">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white font-medium' : 'hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer'}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
