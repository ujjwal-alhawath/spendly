import React from 'react';

export function StatCard({ title, value, subValue, icon }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-textPrimary">{value}</h3>
        {subValue && (
          <p className="text-sm mt-1 text-primary">{subValue}</p>
        )}
      </div>
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl">
        {icon}
      </div>
    </div>
  );
}
