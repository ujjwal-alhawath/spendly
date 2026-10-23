import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UpgradeModal } from '../premium/UpgradeModal';

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useStore();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const isPremium = Boolean(user?.isPremium);

  const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/expenses', label: 'Expenses', icon: '💸' },
    { 
      to: '/chat', 
      label: 'AI Chat', 
      icon: '✨', 
      badge: isPremium ? '💎 PRO' : '🔒 PRO',
      isPro: true
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
      `}>
        <div className="h-16 flex items-center px-6 border-b border-border justify-between">
          <span className="text-2xl font-bold text-primary tracking-tight">Spendly</span>
          {isPremium && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PRO
            </span>
          )}
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => { if (window.innerWidth < 768) onClose(); }}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-primary/10 text-primary border-l-4 border-primary font-medium' 
                  : 'text-muted hover:text-textPrimary hover:bg-white/5 border-l-4 border-transparent'}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </div>

              {link.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isPremium
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/10 text-gray-400 border border-white/10'
                }`}>
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* Upgrade Banner for Free Users */}
          {!isPremium && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-purple-500/10 to-transparent border border-emerald-500/20 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <span className="text-xs font-bold text-white tracking-wide">SPENDLY PRO</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Unlock AI financial advisor, unlimited chat queries, and deep spending insights.
              </p>
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="mt-1 w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Upgrade to Pro</span>
                <span>✨</span>
              </button>
            </div>
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-textPrimary">{user.name}</span>
                  {isPremium ? (
                    <span 
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="cursor-pointer text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30"
                      title="Manage Pro Plan"
                    >
                      PRO
                    </span>
                  ) : (
                    <span 
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="cursor-pointer text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-gray-400 font-medium"
                      title="Click to upgrade"
                    >
                      FREE
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted truncate max-w-[130px]">{user.email}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-muted hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </aside>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </>
  );
}
