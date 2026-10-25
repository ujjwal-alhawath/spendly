import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-[#cbd3df]/50 rounded-2xl ${className}`}
    ></div>
  );
}
