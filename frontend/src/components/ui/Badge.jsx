import React from 'react';
import { getCategoryConfig } from '../../utils/categories';

export function Badge({ category, type = 'category', variant = 'soft' }) {
  if (type === 'income') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
        <span>+</span> Income
      </span>
    );
  }

  if (type === 'expense') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger/15 text-danger border border-danger/25">
        <span>-</span> Expense
      </span>
    );
  }

  const config = getCategoryConfig(category);

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all"
      style={{
        backgroundColor: `${config.color}18`,
        color: config.color,
        borderColor: `${config.color}35`,
      }}
    >
      <span className="text-xs">{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
