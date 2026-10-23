import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UpgradeModal } from '../premium/UpgradeModal';

export function Topbar({ onMenuClick }) {
  const location = useLocation();
  const user = useStore(state => state.user);
  const isPremium = Boolean(user?.isPremium);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/expenses') return 'Expenses';
    if (location.pathname === '/chat') return 'AI Chat';
    return '';
  };

  return (
    <>
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg text-muted hover:text-textPrimary hover:bg-white/5 md:hidden"
            aria-label="Open sidebar menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-textPrimary">{getPageTitle()}</h1>
            {location.pathname === '/chat' && !isPremium && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium">
                🔒 Pro Required
              </span>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {isPremium ? (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm"
              title="Click to view plan"
            >
              <span>💎</span>
              <span className="hidden sm:inline">Spendly Pro</span>
              <span className="sm:hidden">PRO</span>
            </button>
          ) : (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-purple-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:text-white hover:border-emerald-400 text-xs font-semibold shadow-sm hover:shadow-emerald-500/10 transition-all cursor-pointer"
            >
              <span>⚡</span>
              <span>Upgrade to Pro</span>
              <span>💎</span>
            </button>
          )}
        </div>
      </header>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </>
  );
}
