import React from 'react';
import { getCategoryConfig } from '../../utils/categories';

export function Badge({ category }) {
  const config = getCategoryConfig(category);
  
  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${config.color}20`, color: config.color }}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
