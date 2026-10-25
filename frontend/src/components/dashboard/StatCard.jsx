import React from 'react';
import { SummaryCard } from './SummaryCard';

export function StatCard({ title, value, subValue, icon }) {
  return (
    <div className="bg-surface neu-card p-5 sm:p-6 flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-textPrimary tracking-tight">
          {value}
        </h3>
        {subValue && (
          <p className="text-xs mt-1.5 text-primary font-bold">{subValue}</p>
        )}
      </div>
      <div className="w-12 h-12 rounded-2xl neu-icon-box flex items-center justify-center text-xl text-primary bg-primary/10 border border-primary/20">
        {icon}
      </div>
    </div>
  );
}
