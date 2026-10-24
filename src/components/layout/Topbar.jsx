import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Crown,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { UpgradeModal } from '../premium/UpgradeModal';
import { AddModal } from '../expenses/AddModal';

export function Topbar({ onMenuClick }) {
  const location = useLocation();
  const user = useStore((state) => state.user);
  const isPremium = Boolean(user?.isPremium);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('This Month');

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'Financial Dashboard',
          subtitle: `Welcome back, ${user?.name ? user.name.split(' ')[0] : 'friend'} • Overview of your assets & cash flow`,
        };
      case '/expenses':
        return {
          title: 'Transactions & Records',
          subtitle: 'Search, filter, and manage your income & expense history',
        };
      case '/analytics':
        return {
          title: 'Spending Analytics',
          subtitle: 'Deep insights into your financial habits and trends',
        };
      case '/budgets':
        return {
          title: 'Budget Management',
          subtitle: 'Set spending limits and keep your savings goals on track',
        };
      case '/chat':
        return {
          title: 'Gemini AI Financial Advisor',
          subtitle: 'Ask questions and get intelligent advice based on your data',
        };
      case '/settings':
        return {
          title: 'Preferences & Settings',
          subtitle: 'Manage your profile, currency, and local data backups',
        };
      default:
        return {
          title: 'Spendly',
          subtitle: 'Personal Finance Dashboard',
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <>
      <header className="h-20 bg-transparent flex items-center justify-between px-4 lg:px-8 py-4 gap-4 z-20">
        {/* Left Side: Mobile Menu Button + Page Title & Subtitle */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onMenuClick}
            className="neu-btn w-10 h-10 rounded-2xl flex items-center justify-center text-textSecondary hover:text-textPrimary lg:hidden shrink-0 cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight truncate">
              {pageInfo.title}
            </h1>
            <p className="text-xs text-textSecondary truncate hidden sm:block">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Search, Date Selector, Notifications, Add Transaction & Pro */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search Input */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-textSecondary pointer-events-none" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neu-inset w-48 lg:w-64 pl-9 pr-4 py-2 rounded-full text-xs text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Date Range Selector Pill */}
          <div className="hidden xl:flex items-center gap-1.5 neu-pill px-3 py-1.5 text-xs font-semibold text-textSecondary">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{dateRange}</span>
          </div>

          {/* Notification Button */}
          <button
            className="neu-btn w-10 h-10 rounded-2xl flex items-center justify-center text-textSecondary hover:text-textPrimary transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-primary absolute top-2.5 right-2.5 ring-2 ring-surface"></span>
          </button>

          {/* Pro Badge / Upgrade Button */}
          {isPremium ? (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="neu-pill px-3 py-1.5 hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer"
              title="Spendly Pro Plan Active"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>PRO</span>
            </button>
          ) : (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="neu-btn px-3.5 py-1.5 hidden sm:flex items-center gap-1.5 text-xs font-bold text-secondary border border-secondary/30 hover:border-secondary cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Upgrade</span>
            </button>
          )}

          {/* Add Transaction Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="neu-btn-primary px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-neu-accent"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden xs:inline">Add Transaction</span>
          </button>
        </div>
      </header>

      {/* Global Add Transaction Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Upgrade Pro Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
