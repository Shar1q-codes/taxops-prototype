import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { FirmSettings } from '../../lib/settingsApi';

type SaveStatus = 'idle' | 'saved' | 'error';

export interface FirmSettingsCardProps {
  value: FirmSettings;
  onChange: (next: FirmSettings) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  status?: SaveStatus;
  error?: string | null;
}

const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const countries = ['United States', 'Canada', 'United Kingdom', 'India', 'Australia', 'Other'];

export function FirmSettingsCard({
  value,
  onChange,
  onSave,
  saving,
  status = 'idle',
  error,
}: FirmSettingsCardProps) {
  const isEinMalformed = Boolean(value.firmEin && !/^\d{2}-?\d{7}$/.test(value.firmEin));
  const isTaxYearValid = value.defaultTaxYear >= 2015 && value.defaultTaxYear <= 2035;
  const isValid =
    Boolean(value.firmName?.trim()) &&
    Boolean(value.fiscalYearEndMonth) &&
    Boolean(value.defaultTaxYear) &&
    isTaxYearValid &&
    !saving;

  const handleInputChange =
    (field: keyof FirmSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value: raw } = event.target;
      const nextValue =
        field === 'fiscalYearEndMonth' || field === 'defaultTaxYear'
          ? Number(raw)
          : raw;
      onChange({ ...value, [field]: nextValue });
    };

  const handleSelectChange =
    (field: keyof FirmSettings) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value: raw } = event.target;
      const nextValue = field === 'fiscalYearEndMonth' ? Number(raw) : raw;
      onChange({ ...value, [field]: nextValue });
    };

  const handleSave = async () => {
    if (!isValid) return;
    await onSave();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Firm</p>
            <h3 className="text-lg font-semibold text-slate-900">Firm Settings</h3>
            <p className="text-sm text-slate-500">
              These settings apply across all engagements in your firm.
            </p>
          </div>
          {status === 'saved' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
              <BadgeCheck size={14} /> Saved
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="firmName" className="text-sm font-medium text-slate-700">
              Firm Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firmName"
              value={value.firmName}
              onChange={handleInputChange('firmName')}
              aria-label="Firm name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="firmEin" className="text-sm font-medium text-slate-700">
              Firm EIN
            </label>
            <input
              id="firmEin"
              value={value.firmEin ?? ''}
              onChange={handleInputChange('firmEin')}
              aria-label="Firm EIN"
              placeholder="12-3456789"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {isEinMalformed && (
              <p className="text-xs text-amber-600">
                EIN looks malformed. Use 9 digits (e.g., 12-3456789).
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="addressLine1" className="text-sm font-medium text-slate-700">
              Address line 1
            </label>
            <input
              id="addressLine1"
              value={value.addressLine1 ?? ''}
              onChange={handleInputChange('addressLine1')}
              aria-label="Address line 1"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="addressLine2" className="text-sm font-medium text-slate-700">
              Address line 2
            </label>
            <input
              id="addressLine2"
              value={value.addressLine2 ?? ''}
              onChange={handleInputChange('addressLine2')}
              aria-label="Address line 2"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="city" className="text-sm font-medium text-slate-700">
              City
            </label>
            <input
              id="city"
              value={value.city ?? ''}
              onChange={handleInputChange('city')}
              aria-label="City"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="state" className="text-sm font-medium text-slate-700">
              State / Province
            </label>
            <input
              id="state"
              value={value.state ?? ''}
              onChange={handleInputChange('state')}
              aria-label="State or province"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="postalCode" className="text-sm font-medium text-slate-700">
              Postal code
            </label>
            <input
              id="postalCode"
              value={value.postalCode ?? ''}
              onChange={handleInputChange('postalCode')}
              aria-label="Postal code"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="country" className="text-sm font-medium text-slate-700">
              Country
            </label>
            <select
              id="country"
              value={value.country ?? 'United States'}
              onChange={handleSelectChange('country')}
              aria-label="Country"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="fiscalYearEndMonth" className="text-sm font-medium text-slate-700">
                Fiscal year end <span className="text-red-500">*</span>
              </label>
              <select
                id="fiscalYearEndMonth"
                value={value.fiscalYearEndMonth}
                onChange={handleSelectChange('fiscalYearEndMonth')}
                aria-label="Fiscal year end month"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              >
                {monthOptions.map((label, idx) => (
                  <option key={label} value={idx + 1}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="defaultTaxYear" className="text-sm font-medium text-slate-700">
                Default tax year <span className="text-red-500">*</span>
              </label>
              <input
                id="defaultTaxYear"
                type="number"
                min={2015}
                max={2035}
                value={value.defaultTaxYear}
                onChange={handleInputChange('defaultTaxYear')}
                aria-label="Default tax year"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {!isTaxYearValid && (
                <p className="text-xs text-amber-600">Use a year between 2015 and 2035.</p>
              )}
            </div>
          </div>
        </div>

        {error && status === 'error' && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 rounded-b-xl flex items-center justify-end gap-3">
        {status === 'saved' && !error && (
          <span className="text-xs text-green-700 font-semibold">Settings saved</span>
        )}
        <button
          onClick={handleSave}
          disabled={!isValid}
          aria-label="Save firm settings"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

export default FirmSettingsCard;
