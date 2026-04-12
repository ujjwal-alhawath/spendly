import React from 'react';

const CHIPS = [
  "Where am I overspending?",
  "Compare my last 2 months",
  "How can I save ₹5000 this month?",
  "What's my biggest waste?"
];

export function PromptChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 max-w-3xl mx-auto w-full justify-center lg:justify-start">
      {CHIPS.map(chip => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="px-3 py-1.5 bg-card border border-border rounded-full text-xs font-medium text-muted hover:text-textPrimary hover:border-primary/50 transition-colors"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
