import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar({ isOpen, onClose }) {
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
      </aside>
    </>
  );
}
