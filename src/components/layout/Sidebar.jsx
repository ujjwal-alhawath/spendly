import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useStore();
  const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/expenses', label: 'Expenses', icon: '💸' },
    { to: '/chat', label: 'AI Chat', icon: '✨' },
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
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-2xl font-bold text-primary tracking-tight">Spendly</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => { if (window.innerWidth < 768) onClose(); }}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-primary/10 text-primary border-l-4 border-primary font-medium' 
                  : 'text-muted hover:text-textPrimary hover:bg-white/5 border-l-4 border-transparent'}
              `}
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-textPrimary">{user.name}</span>
                <span className="text-xs text-muted truncate max-w-[120px]">{user.email}</span>
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
    </>
  );
}
