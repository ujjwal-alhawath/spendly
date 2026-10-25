import React from 'react';

const variants = {
  primary: 'neu-btn-primary font-semibold',
  secondary: 'neu-btn-secondary font-semibold',
  surface: 'neu-btn text-textPrimary font-medium',
  ghost: 'bg-transparent text-textSecondary hover:text-textPrimary hover:bg-black/5 active:neu-inset-sm font-medium',
  danger: 'neu-btn text-danger hover:text-white hover:bg-danger font-semibold border-danger/20',
  inset: 'neu-inset text-textPrimary font-medium',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
  pill: 'px-5 py-2.5 text-sm rounded-full gap-2',
  icon: 'w-10 h-10 p-0 rounded-xl justify-center',
  'icon-sm': 'w-8 h-8 p-0 rounded-lg justify-center',
};

export function Button({
  variant = 'surface',
  size = 'md',
  className = '',
  children,
  disabled = false,
  ...props
}) {
  const baseStyle =
    'inline-flex items-center justify-center transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  return (
    <button
      className={`${baseStyle} ${variants[variant] || variants.surface} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
