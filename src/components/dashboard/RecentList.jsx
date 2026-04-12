import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryConfig } from '../../utils/categories';

export function RecentList({ expenses }) {
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-card border border-border p-5 rounded-xl h-[340px] flex flex-col">
      <h3 className="text-base font-semibold mb-4">Recent Transactions</h3>
      
      {recent.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted border border-dashed border-border rounded-xl">
          <span className="text-2xl mb-2">🍃</span>
          <p>No recent transactions</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {recent.map(exp => {
            const catConfig = getCategoryConfig(exp.category);
            return (
              <div key={exp.id} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${catConfig.color}20`, color: catConfig.color }}
                  >
                    {catConfig.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-textPrimary">{exp.title}</p>
                    <p className="text-xs text-muted flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catConfig.color }} />
                      {exp.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-textPrimary">{formatCurrency(exp.amount)}</p>
                  <p className="text-xs text-muted">{formatDate(exp.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
