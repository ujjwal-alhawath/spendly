import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  PieChart,
  Sparkles,
  Settings,
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useStore();

  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'Transactions', icon: Receipt },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/budgets', label: 'Budgets', icon: PieChart },
    {
      to: '/chat',
      label: 'AI Advisor',
      icon: Sparkles,
      badge: 'SOON',
    },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#263449]/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col bg-background lg:bg-transparent
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static
          ${isCollapsed ? 'w-20' : 'w-64'}
          p-4 shrink-0
        `}
      >
        <div className="h-full bg-surface neu-card border border-white/80 rounded-3xl flex flex-col overflow-hidden relative">
          {/* Header & Logo */}
          <div className={`h-20 flex items-center px-5 border-b border-border/40 justify-between ${isCollapsed ? 'justify-center px-2' : ''}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white shadow-neu-sm shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-textPrimary tracking-tight">
                    Spend<span className="text-primary">ly</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-textSecondary">
                    Finance AI
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex w-7 h-7 rounded-xl neu-btn items-center justify-center text-textSecondary hover:text-textPrimary transition-all cursor-pointer ${
                isCollapsed ? 'absolute -right-3 top-7 z-20 bg-surface' : ''
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3.5 flex flex-col gap-2 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={handleNavClick}
                  className={({ isActive }) => `
                    group flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-200 cursor-pointer
                    ${isCollapsed ? 'justify-center px-2' : ''}
                    ${
                      isActive
                        ? 'neu-inset text-primary font-bold shadow-neu-inset-sm border border-primary/20'
                        : 'text-textSecondary hover:text-textPrimary hover:bg-white/40'
                    }
                  `}
                  title={isCollapsed ? link.label : undefined}
                >
                  <div className="relative shrink-0 flex items-center justify-center">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110`}
                    />
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-medium flex-1 truncate">
                      {link.label}
                    </span>
                  )}
                  {!isCollapsed && link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-primary/15 text-primary border border-primary/25">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Profile Section at Bottom */}
          <div className="p-3.5 border-t border-border/40 mt-auto bg-surface/80">
            <div
              className={`flex items-center gap-3 ${
                isCollapsed ? 'flex-col items-center justify-center' : 'justify-between'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-2xl neu-card flex items-center justify-center text-xs font-bold text-primary shrink-0 bg-primary/10 border border-primary/20">
                  {isAuthenticated && user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-textPrimary truncate">
                      {isAuthenticated ? (user?.name || 'User') : 'Guest Explorer'}
                    </span>
                    <span className="text-[11px] text-textSecondary truncate">
                      {isAuthenticated ? (user?.email || 'user@spendly.app') : 'Explore Mode'}
                    </span>
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-textSecondary hover:text-danger transition-colors cursor-pointer shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-primary hover:text-primary-dark transition-colors cursor-pointer shrink-0"
                  title="Log In"
                >
                  <LogIn className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
