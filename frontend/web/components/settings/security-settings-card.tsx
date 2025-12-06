import React, { useMemo } from 'react';
import { ShieldCheck, BadgeCheck, Info } from 'lucide-react';
import { SecuritySettings } from '../../lib/settingsApi';

type SaveStatus = 'idle' | 'saved' | 'error';

export interface SecuritySettingsCardProps {
  value: SecuritySettings;
  onChange: (next: SecuritySettings) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  status?: SaveStatus;
  error?: string | null;
}

export function SecuritySettingsCard({
  value,
  onChange,
  onSave,
  saving,
  status = 'idle',
  error,
}: SecuritySettingsCardProps) {
  const mfaHint = useMemo(
    () => value.mfaEnabled && 'MFA setup will open on your next login.',
    [value.mfaEnabled]
  );

  const handleToggle = (field: keyof SecuritySettings) => () => {
    onChange({ ...value, [field]: !value[field] });
  };

  const handleSave = async () => {
    await onSave();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={18} />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Security</h3>
            <p className="text-sm text-slate-500">Protect account access and alerts.</p>
          </div>
        </div>
        {status === 'saved' && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
            <BadgeCheck size={14} /> Saved
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">
        <SecurityRow
          title="Multi-factor authentication (MFA)"
          description="Add an extra layer of protection for firm owners and admins."
          checked={value.mfaEnabled}
          onToggle={handleToggle('mfaEnabled')}
        />
        {mfaHint && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
            <Info size={14} /> {mfaHint}
          </div>
        )}
        <SecurityRow
          title="Login alerts"
          description="Email me when a new device signs in to my account."
          checked={value.loginAlertsEnabled}
          onToggle={handleToggle('loginAlertsEnabled')}
        />
        {error && status === 'error' && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 rounded-b-xl flex items-center justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          aria-label="Save security settings"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save security settings'}
        </button>
      </div>
    </div>
  );
}

interface SecurityRowProps {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

function SecurityRow({ title, description, checked, onToggle }: SecurityRowProps) {
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

export default SecuritySettingsCard;
