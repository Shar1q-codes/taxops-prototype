import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bell, AlertTriangle, CheckCircle2, Info, XCircle, Loader2 } from 'lucide-react';
import {
  NotificationSummary,
  NotificationItem,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../lib/notificationsApi';

interface NotificationBellProps {
  onNavigate?: (path: string) => void;
}

export default function NotificationBell({ onNavigate }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && summary === null && !loading && !error) {
      void load();
    }
  }, [open, summary, loading, error, load]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const unreadCount = summary?.unreadCount ?? 0;
  const badgeText = unreadCount > 9 ? '9+' : `${unreadCount}`;

  const markAll = async () => {
    if (!summary || summary.unreadCount === 0) return;
    const prev = summary;
    setSummary({
      unreadCount: 0,
      items: summary.items.map((i) => ({ ...i, read: true })),
    });
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error(err);
      setSummary(prev);
      setError('Unable to update notifications. Please retry.');
    }
  };

  const handleItemClick = async (item: NotificationItem) => {
    if (!summary) return;
    const prev = summary;
    const nextItems = summary.items.map((n) => (n.id === item.id ? { ...n, read: true } : n));
    const nextUnread = Math.max(0, summary.unreadCount - (item.read ? 0 : 1));
    setSummary({ unreadCount: nextUnread, items: nextItems });

    if (item.href) {
      const path = item.href.replace(/^\/app\//, '').replace(/^\//, '');
      if (onNavigate) {
        onNavigate(path);
      } else {
        window.location.href = item.href;
      }
    }

    try {
      await markNotificationRead(item.id);
    } catch (err) {
      console.error(err);
      setSummary(prev);
      setError('Unable to update notification. Please retry.');
    }
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="p-6 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-slate-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md mx-3 my-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={load}
            className="text-xs font-semibold text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!summary || summary.items.length === 0) {
      return (
        <div className="p-6 text-sm text-slate-500 text-center">
          You're all caught up.
        </div>
      );
    }

    return (
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {summary.items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
              item.read ? 'bg-white' : 'bg-blue-50/50'
            }`}
          >
            <SeverityIcon severity={item.severity} />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${item.read ? 'text-slate-800' : 'text-slate-900'}`}>
                  {item.title}
                </p>
                {!item.read && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />}
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{item.message}</p>
              <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(item.createdAt)}</p>
            </div>
          </button>
        ))}
      </div>
    );
  }, [loading, error, summary, handleItemClick, load]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold">
            {badgeText}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-30">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {summary && summary.unreadCount > 0 && !loading && !error && (
              <button
                onClick={markAll}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>
          {content}
        </div>
      )}
    </div>
  );
}

function SeverityIcon({ severity }: { severity: NotificationItem['severity'] }) {
  const classes: Record<NotificationItem['severity'], string> = {
    info: 'text-slate-500 bg-slate-100',
    success: 'text-green-600 bg-green-100',
    warning: 'text-amber-600 bg-amber-100',
    error: 'text-red-600 bg-red-100',
  };

  const Icon = severity === 'success' ? CheckCircle2 : severity === 'warning' ? AlertTriangle : severity === 'error' ? XCircle : Info;

  return (
    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${classes[severity]}`}>
      <Icon size={16} />
    </div>
  );
}

function formatTimeAgo(iso: string): string {
  const created = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - created;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y ago`;
}
