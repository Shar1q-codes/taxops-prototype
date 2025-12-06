import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  fetchSettings,
  updateFirmSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateUserSettings,
  FirmSettings,
  NotificationSettings,
  SecuritySettings,
  SettingsBundle,
  UserSettings,
} from '../lib/settingsApi';

interface SettingsContextValue {
  settings: SettingsBundle | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateLocal: (updater: (prev: SettingsBundle) => SettingsBundle) => void;
  saveFirm: (payload: FirmSettings) => Promise<FirmSettings>;
  saveUser: (payload: UserSettings) => Promise<UserSettings>;
  saveNotifications: (payload: NotificationSettings) => Promise<NotificationSettings>;
  saveSecurity: (payload: SecuritySettings) => Promise<SecuritySettings>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateLocal = useCallback(
    (updater: (prev: SettingsBundle) => SettingsBundle) => {
      setSettings((prev) => (prev ? updater(prev) : prev));
    },
    []
  );

  const saveFirm = useCallback(
    async (payload: FirmSettings) => {
      const updated = await updateFirmSettings(payload);
      setSettings((prev) => (prev ? { ...prev, firm: updated } : prev));
      return updated;
    },
    []
  );

  const saveUser = useCallback(
    async (payload: UserSettings) => {
      const updated = await updateUserSettings(payload);
      setSettings((prev) => (prev ? { ...prev, user: updated } : prev));
      return updated;
    },
    []
  );

  const saveNotifications = useCallback(
    async (payload: NotificationSettings) => {
      const updated = await updateNotificationSettings(payload);
      setSettings((prev) => (prev ? { ...prev, notifications: updated } : prev));
      return updated;
    },
    []
  );

  const saveSecurity = useCallback(
    async (payload: SecuritySettings) => {
      const updated = await updateSecuritySettings(payload);
      setSettings((prev) => (prev ? { ...prev, security: updated } : prev));
      return updated;
    },
    []
  );

  const value: SettingsContextValue = {
    settings,
    loading,
    error,
    refresh,
    updateLocal,
    saveFirm,
    saveUser,
    saveNotifications,
    saveSecurity,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
