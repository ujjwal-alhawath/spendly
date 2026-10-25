import React from 'react';

export function NeumorphicCard({
  children,
  className = '',
  interactive = false,
  inset = false,
  p = 'p-5 sm:p-6',
  as: Component = 'div',
  onClick,
  ...props
}) {
  const baseClasses = inset
    ? 'neu-inset rounded-2xl'
    : interactive
    ? 'neu-card-interactive'
    : 'neu-card';

  return (
    <Component
      className={`${baseClasses} ${p} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}
