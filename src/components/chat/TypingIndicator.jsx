import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-surface neu-card border border-white/80 rounded-2xl rounded-tl-sm w-20">
      <div
        className="w-2 h-2 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="w-2 h-2 rounded-full bg-secondary animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="w-2 h-2 rounded-full bg-accentPink animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
