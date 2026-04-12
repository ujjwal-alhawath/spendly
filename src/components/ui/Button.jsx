import React from 'react';

const variants = {
  primary: 'bg-primary text-background hover:bg-emerald-400 font-semibold',
  ghost: 'bg-transparent text-textPrimary hover:bg-white/5 border border-border',
  danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 font-semibold',
};

export function Button({ variant = 'primary', className = '', children, ...props }) {
  const baseStyle = 'px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
