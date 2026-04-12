import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-muted">{label}</label>}
      <input
        ref={ref}
        className={`bg-background border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors
          ${error ? 'border-red-500' : 'border-border'}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
