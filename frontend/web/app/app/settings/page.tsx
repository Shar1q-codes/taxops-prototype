"use client";

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import FirmSettingsCard from '../../../components/settings/firm-settings-card';
import UserSettingsCard from '../../../components/settings/user-settings-card';
import NotificationsSettingsCard from '../../../components/settings/notifications-settings-card';
import SecuritySettingsCard from '../../../components/settings/security-settings-card';
import {
  FirmSettings,
  NotificationSettings,
  SecuritySettings,
  UserSettings,
} from '../../../lib/settingsApi';
import { useSettings } from '../../../hooks/useSettings';

type CardKey = 'firm' | 'user' | 'notifications' | 'security';
type SaveStatus = 'idle' | 'saved' | 'error';

export default function SettingsPage() {
  const { settings, loading, error: loadError, refresh, updateLocal, saveFirm, saveUser, saveNotifications, saveSecurity } = useSettings();
  const [saving, setSaving] = useState<Record<CardKey, boolean>>({
    firm: false,
    user: false,
    notifications: false,
    security: false,
  });
  const [saveStatus, setSaveStatus] = useState<Record<CardKey, SaveStatus>>({
    firm: 'idle',
    user: 'idle',
    notifications: 'idle',
    security: 'idle',
  });
  const [saveError, setSaveError] = useState<Record<CardKey, string | null>>({
    firm: null,
    user: null,
    notifications: null,
    security: null,
  });

  const handleFirmChange = (next: FirmSettings) => {
    updateLocal((prev) => ({ ...prev, firm: next }));
  };

  const handleUserChange = (next: UserSettings) => {
    updateLocal((prev) => ({ ...prev, user: next }));
  };

  const handleNotificationChange = (next: NotificationSettings) => {
    updateLocal((prev) => ({ ...prev, notifications: next }));
  };

  const handleSecurityChange = (next: SecuritySettings) => {
    updateLocal((prev) => ({ ...prev, security: next }));
  };

  const saveSection = async (key: CardKey, action: () => Promise<void>, errorMessage: string) => {
    setSaving((prev) => ({ ...prev, [key]: true }));
    setSaveStatus((prev) => ({ ...prev, [key]: 'idle' }));
    setSaveError((prev) => ({ ...prev, [key]: null }));
    try {
      await action();
      setSaveStatus((prev) => ({ ...prev, [key]: 'saved' }));
    } catch (err) {
      console.error(err);
      setSaveStatus((prev) => ({ ...prev, [key]: 'error' }));
      setSaveError((prev) => ({ ...prev, [key]: errorMessage }));
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSaveFirm = async () => {
    if (!settings) return;
    await saveSection(
      'firm',
      async () => {
        await saveFirm(settings.firm);
      },
      'Unable to save firm settings. Please retry.'
    );
  };

  const handleSaveUser = async () => {
    if (!settings) return;
    await saveSection(
      'user',
      async () => {
        await saveUser(settings.user);
      },
      'Unable to save profile. Please retry.'
    );
  };

  const handleSaveNotifications = async () => {
    if (!settings) return;
    await saveSection(
      'notifications',
      async () => {
        await saveNotifications(settings.notifications);
      },
      'Unable to save notification preferences. Please retry.'
    );
  };

  const handleSaveSecurity = async () => {
    if (!settings) return;
    await saveSection(
      'security',
      async () => {
        await saveSecurity(settings.security);
      },
      'Unable to save security settings. Please retry.'
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <SkeletonCard />
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader />
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} />
          <span>{loadError}</span>
          <button
            onClick={refresh}
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <FirmSettingsCard
            value={settings.firm}
            onChange={handleFirmChange}
            onSave={handleSaveFirm}
            saving={saving.firm}
            status={saveStatus.firm}
            error={saveError.firm}
          />
        </div>

        <div className="space-y-6">
          <UserSettingsCard
            value={settings.user}
            onChange={handleUserChange}
            onSave={handleSaveUser}
            saving={saving.user}
            status={saveStatus.user}
            error={saveError.user}
          />

          <NotificationsSettingsCard
            value={settings.notifications}
            onChange={handleNotificationChange}
            onSave={handleSaveNotifications}
            saving={saving.notifications}
            status={saveStatus.notifications}
            error={saveError.notifications}
          />

          <SecuritySettingsCard
            value={settings.security}
            onChange={handleSecurityChange}
            onSave={handleSaveSecurity}
            saving={saving.security}
            status={saveStatus.security}
            error={saveError.security}
          />
        </div>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="text-slate-500">
        Manage firm configuration, your profile, and notification preferences.
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 animate-pulse space-y-4">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-3 bg-slate-200 rounded w-1/4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
      </div>
      <div className="h-10 bg-slate-200 rounded" />
    </div>
  );
}
