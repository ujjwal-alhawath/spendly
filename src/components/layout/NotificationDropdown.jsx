import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Check,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useExpenseStats } from '../../hooks/useExpenseStats';
import { formatCurrency } from '../../utils/formatters';

export function NotificationDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const {
    user,
    expenses,
    monthlyBudget,
    currency,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useStore();

  const stats = useExpenseStats(expenses, monthlyBudget);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('#notification-bell-btn')
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build real contextual notifications from stats if empty
  const activeNotifications =
    notifications && notifications.length > 0
      ? notifications
      : [
          // Dynamic budget alert
          ...(stats.budgetUsedPercent > 80
            ? [
                {
                  id: 'notif-budget-warn',
                  title: stats.budgetUsedPercent > 100 ? 'Budget Exceeded' : 'Budget Warning',
                  message: `You have consumed ${stats.budgetUsedPercent.toFixed(0)}% of your monthly ${formatCurrency(monthlyBudget, currency)} target.`,
                  type: 'warning',
                  icon: AlertTriangle,
                  link: '/budgets',
                  time: 'Just now',
                  read: false,
                },
              ]
            : []),
          // Top spending category
          ...(stats.topCategory !== 'None'
            ? [
                {
                  id: 'notif-top-cat',
                  title: 'Top Category Insight',
                  message: `${stats.topCategory} accounts for your largest expense (${formatCurrency(stats.topCategoryAmount, currency)}).`,
                  type: 'info',
                  icon: TrendingUp,
                  link: '/analytics',
                  time: 'Today',
                  read: false,
                },
              ]
            : []),
          // AI Tip
          {
            id: 'notif-ai-tip',
            title: 'Gemini AI Advisory Ready',
            message: 'Ask Gemini AI how to optimize your savings and trim unnecessary subscriptions.',
            type: 'ai',
            icon: Sparkles,
            link: '/chat',
            time: '2 hours ago',
            read: false,
          },
          // Account welcome
          {
            id: 'notif-welcome',
            title: `Welcome, ${user?.name ? user.name.split(' ')[0] : 'friend'}!`,
            message: 'Your personal finance workspace is active with soft neumorphic controls.',
            type: 'success',
            icon: CheckCircle2,
            link: '/',
            time: '1 day ago',
            read: true,
          },
        ];

  const unreadCount = activeNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 w-80 sm:w-96 bg-surface neu-card border border-white/90 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-textPrimary tracking-tight">
              Notifications
            </h3>
            <span className="text-[10px] text-textSecondary font-semibold">
              {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
            </span>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsAsRead()}
            className="neu-btn px-2.5 py-1 rounded-lg text-[10px] font-bold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Mark read</span>
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="my-2 space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {activeNotifications.length === 0 ? (
          <div className="py-8 text-center text-textSecondary flex flex-col items-center">
            <Bell className="w-8 h-8 text-textSecondary/40 mb-2" />
            <p className="text-xs font-semibold text-textPrimary">No notifications</p>
            <p className="text-[10px] text-textSecondary mt-0.5">
              Financial alerts and budget updates will appear here.
            </p>
          </div>
        ) : (
          activeNotifications.map((notif) => {
            const Icon = notif.icon || Bell;
            const isWarning = notif.type === 'warning';
            const isAI = notif.type === 'ai';

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-2xl neu-inset transition-all cursor-pointer flex items-start gap-3 hover:bg-white/50 group relative
                  ${notif.read ? 'opacity-70' : 'opacity-100 border border-primary/30'}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl neu-icon-box flex items-center justify-center shrink-0 mt-0.5
                    ${
                      isWarning
                        ? 'text-warning bg-warning/15'
                        : isAI
                        ? 'text-secondary bg-secondary/15'
                        : 'text-primary bg-primary/15'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-textPrimary truncate group-hover:text-primary transition-colors">
                      {notif.title}
                    </h4>
                    <span className="text-[9px] text-textSecondary whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-textSecondary leading-snug mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 self-center" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between">
        <button
          onClick={() => {
            clearNotifications();
            onClose();
          }}
          className="text-[10px] text-textSecondary hover:text-danger font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear all</span>
        </button>

        <button
          onClick={() => {
            navigate('/settings');
            onClose();
          }}
          className="text-[10px] text-primary hover:text-primary-hover font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Preferences</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
