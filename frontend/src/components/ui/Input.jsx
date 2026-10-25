import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      pill = false,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3.5 text-textSecondary pointer-events-none flex items-center justify-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full bg-surface neu-inset text-textPrimary placeholder:text-textSecondary/60 transition-all text-sm
              ${pill ? 'rounded-full' : 'rounded-xl'}
              ${icon ? 'pl-10 pr-4' : 'px-4'}
              py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60
              ${error ? 'border-danger ring-1 ring-danger/40' : ''}
              ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-danger font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
