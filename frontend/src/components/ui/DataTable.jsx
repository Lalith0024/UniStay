import React from 'react';
import { twMerge } from 'tailwind-merge';

const DataTable = ({ columns, data, loading, emptyState, className, onRowClick }) => {
  return (
    <div className={twMerge("bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 shadow-sm overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={twMerge("px-6 py-3.5 text-[11px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider", col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8">
                  <div className="flex flex-col space-y-4 px-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr 
                  key={row.id || row._id || rowIdx} 
                  className={twMerge(
                    "hover:bg-blue-50/40 dark:hover:bg-zinc-800/60 transition-colors",
                    onRowClick ? "cursor-pointer" : ""
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={twMerge("px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-zinc-300", col.cellClassName)}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  {emptyState || (
                    <div className="text-center py-8 text-slate-500 dark:text-zinc-500">No data available</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
