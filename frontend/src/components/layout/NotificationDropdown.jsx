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

export function NotificationDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const notifications = useStore((state) => state.notifications || []);
  const markNotificationAsRead = useStore((state) => state.markNotificationAsRead);
  const markAllNotificationsAsRead = useStore((state) => state.markAllNotificationsAsRead);
  const clearNotifications = useStore((state) => state.clearNotifications);
  const deleteNotification = useStore((state) => state.deleteNotification);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
      case 'danger':
        return AlertTriangle;
      case 'ai':
        return Sparkles;
      case 'success':
        return CheckCircle2;
      case 'info':
      case 'analytics':
        return TrendingUp;
      default:
        return Bell;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 w-80 sm:w-96 bg-surface neu-card border border-white/90 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neu-icon-box flex items-center justify-center text-primary bg-primary/10">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-textPrimary tracking-tight">
              Notifications
            </h3>
            <span className="text-[10px] text-textSecondary font-semibold">
              {unreadCount > 0
                ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}`
                : 'All caught up'}
            </span>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            id="mark-all-read-btn"
            onClick={() => markAllNotificationsAsRead()}
            className="neu-btn px-2.5 py-1 rounded-xl text-[10px] font-bold text-primary hover:text-primary-hover hover:scale-105 flex items-center gap-1 cursor-pointer transition-all shadow-neu-sm"
          >
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>Mark read</span>
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="my-2 space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-textSecondary flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-textSecondary/40 mb-3">
              <Bell className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-xs font-bold text-textPrimary">No notifications</p>
            <p className="text-[11px] text-textSecondary mt-0.5 max-w-[210px] leading-relaxed">
              You are all caught up! When you receive alerts or updates, they will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = getNotificationIcon(notif.type);
            const isWarning = notif.type === 'warning' || notif.type === 'danger';
            const isAI = notif.type === 'ai';
            const isSuccess = notif.type === 'success';

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-2xl neu-inset transition-all cursor-pointer flex items-start gap-3 hover:bg-white/50 group relative
                  ${notif.read ? 'opacity-65 bg-surface/50 border border-transparent' : 'opacity-100 bg-white/70 border border-primary/30'}`}
              >
                {/* Icon box */}
                <div
                  className={`w-9 h-9 rounded-xl neu-icon-box flex items-center justify-center shrink-0 mt-0.5
                    ${
                      isWarning
                        ? 'text-amber-500 bg-amber-500/15'
                        : isAI
                        ? 'text-secondary bg-secondary/15'
                        : isSuccess
                        ? 'text-primary bg-primary/15'
                        : 'text-blue-500 bg-blue-500/15'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs truncate transition-colors group-hover:text-primary ${
                        notif.read ? 'font-semibold text-textSecondary' : 'font-extrabold text-textPrimary'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[9px] text-textSecondary/70 shrink-0 whitespace-nowrap">
                      {notif.time || 'Recently'}
                    </span>
                  </div>
                  <p className="text-[11px] text-textSecondary leading-snug mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                </div>

                {/* Quick actions: Mark Read & Delete */}
                <div className="flex items-center gap-1 shrink-0 self-center">
                  {!notif.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationAsRead(notif.id);
                      }}
                      title="Mark as read"
                      className="w-6 h-6 rounded-lg neu-btn flex items-center justify-center text-primary hover:text-primary-hover hover:scale-110 transition-all cursor-pointer"
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    title="Remove alert"
                    className="w-6 h-6 rounded-lg neu-btn flex items-center justify-center text-textSecondary/50 hover:text-danger hover:scale-110 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 ml-0.5" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between">
        <button
          id="clear-all-notif-btn"
          disabled={notifications.length === 0}
          onClick={() => clearNotifications()}
          className={`text-[10px] font-semibold flex items-center gap-1 transition-colors ${
            notifications.length === 0
              ? 'text-textSecondary/30 cursor-not-allowed'
              : 'text-textSecondary hover:text-danger cursor-pointer'
          }`}
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
