import React from 'react';
import { Bell, BadgeCheck } from 'lucide-react';
import { NotificationSettings } from '../../lib/settingsApi';

type SaveStatus = 'idle' | 'saved' | 'error';

export interface NotificationsSettingsCardProps {
  value: NotificationSettings;
  onChange: (next: NotificationSettings) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  status?: SaveStatus;
  error?: string | null;
}

export function NotificationsSettingsCard({
  value,
  onChange,
  onSave,
  saving,
  status = 'idle',
  error,
}: NotificationsSettingsCardProps) {
  const handleToggle = (field: keyof NotificationSettings) => () => {
    onChange({ ...value, [field]: !value[field] });
  };

  const handleSave = async () => {
    await onSave();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="text-amber-500" size={18} />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
            <p className="text-sm text-slate-500">Choose how you want to stay informed.</p>
          </div>
        </div>
        {status === 'saved' && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
            <BadgeCheck size={14} /> Saved
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">
        <NotificationRow
          title="Email me when an audit completes"
          description="Receive a confirmation email each time an audit finishes running."
          checked={value.emailAuditCompleted}
          onToggle={handleToggle('emailAuditCompleted')}
        />
        <NotificationRow
          title="Email me when high-risk findings are detected"
          description="Critical findings will be emailed immediately."
          checked={value.emailHighRiskDetected}
          onToggle={handleToggle('emailHighRiskDetected')}
        />
        <NotificationRow
          title="Send weekly summary email"
          description="A weekly recap of engagement progress and outstanding items."
          checked={value.emailWeeklySummary}
          onToggle={handleToggle('emailWeeklySummary')}
        />
        <NotificationRow
          title="Show in-app announcements and product updates"
          description="Feature announcements, tips, and product updates inside the app."
          checked={value.inAppAnnouncements}
          onToggle={handleToggle('inAppAnnouncements')}
        />
        {error && status === 'error' && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        {status === 'saved' && !error && (
          <p className="text-xs font-semibold text-green-700">Preferences updated</p>
        )}
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 rounded-b-xl flex items-center justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          aria-label="Save notification preferences"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save notifications'}
        </button>
      </div>
    </div>
  );
}

interface NotificationRowProps {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

function NotificationRow({ title, description, checked, onToggle }: NotificationRowProps) {
  const switchId = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <div
      className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50 transition-colors"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
      role="button"
      aria-pressed={checked}
    >
      <div className="flex-1">
        <label htmlFor={switchId} className="text-sm font-semibold text-slate-900 cursor-pointer">
          {title}
        </label>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          id={switchId}
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="sr-only peer"
          aria-label={title}
        />
        <div className="h-5 w-10 rounded-full bg-slate-300 peer-checked:bg-blue-600 transition-colors relative">
          <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 peer-checked:translate-x-5" />
        </div>
      </label>
    </div>
  );
}

export default NotificationsSettingsCard;
