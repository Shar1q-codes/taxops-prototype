import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { UserSettings } from '../../lib/settingsApi';

type SaveStatus = 'idle' | 'saved' | 'error';

export interface UserSettingsCardProps {
  value: UserSettings;
  onChange: (next: UserSettings) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  status?: SaveStatus;
  error?: string | null;
}

const timezones = [
  { value: 'browser', label: 'Use browser default' },
  { value: 'America/New_York', label: 'America/New_York (ET)' },
  { value: 'America/Chicago', label: 'America/Chicago (CT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
];

export function UserSettingsCard({
  value,
  onChange,
  onSave,
  saving,
  status = 'idle',
  error,
}: UserSettingsCardProps) {
  const initials = value.fullName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleInputChange =
    (field: keyof UserSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: event.target.value });
    };

  const handleSave = async () => {
    await onSave();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
            {initials || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">User Profile</h3>
            <p className="text-sm text-slate-500">Manage your personal information.</p>
          </div>
        </div>
        {status === 'saved' && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
            <BadgeCheck size={14} /> Saved
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="fullName"
              value={value.fullName}
              onChange={handleInputChange('fullName')}
              aria-label="Full name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              value={value.email}
              aria-label="Email"
              disabled
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50 text-slate-500"
            />
            <p className="text-xs text-slate-500">Email updates are managed by your admin.</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                {value.role}
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="timezone" className="text-sm font-medium text-slate-700">
              Timezone
            </label>
            <select
              id="timezone"
              value={value.timezone}
              onChange={(event) => onChange({ ...value, timezone: event.target.value })}
              aria-label="Timezone"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          {error && status === 'error' && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 rounded-b-xl flex items-center justify-end gap-3">
        {status === 'saved' && !error && (
          <span className="text-xs text-green-700 font-semibold">Profile saved</span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          aria-label="Save profile"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </div>
  );
}

export default UserSettingsCard;
