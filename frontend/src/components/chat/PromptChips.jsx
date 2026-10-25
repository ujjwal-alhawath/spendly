import React from 'react';
import { Sparkles } from 'lucide-react';

const CHIPS = [
  'Where am I spending the most?',
  'How can I save more this month?',
  'Analyze my spending habits',
  'Help me create a monthly budget',
];

export function PromptChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2.5 max-w-2xl mx-auto w-full justify-center">
      {CHIPS.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="neu-btn px-4 py-2 rounded-full text-xs font-semibold text-textSecondary hover:text-textPrimary hover:border-primary/40 flex items-center gap-1.5 transition-all cursor-pointer group"
        >
          <Sparkles className="w-3 h-3 text-primary group-hover:scale-110 transition-transform" />
          <span>{chip}</span>
        </button>
      ))}
    </div>
  );
}
