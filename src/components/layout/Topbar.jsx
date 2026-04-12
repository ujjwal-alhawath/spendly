import React from 'react';
import { useLocation } from 'react-router-dom';

export function Topbar({ onMenuClick }) {
  const location = useLocation();
  
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/expenses') return 'Expenses';
    if (location.pathname === '/chat') return 'AI Chat';
    return '';
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-muted hover:text-textPrimary hover:bg-white/5 md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-textPrimary">{getPageTitle()}</h1>
      </div>
    </header>
  );
}
