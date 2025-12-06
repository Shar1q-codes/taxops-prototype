// Temporary in-memory settings API until real backend endpoints are available.
// TODO: Wire to backend settings endpoints.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface FirmSettings {
  firmName: string;
  firmEin?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  fiscalYearEndMonth: number; // 1–12
  defaultTaxYear: number;
}

export interface UserSettings {
  fullName: string;
  email: string;
  role: string;
  timezone: string;
}

export interface NotificationSettings {
  emailAuditCompleted: boolean;
  emailHighRiskDetected: boolean;
  emailWeeklySummary: boolean;
  inAppAnnouncements: boolean;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  loginAlertsEnabled: boolean;
}

export interface SettingsBundle {
  firm: FirmSettings;
  user: UserSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

let settingsStore: SettingsBundle = {
  firm: {
    firmName: 'Elevate CPA, LLC',
    firmEin: '12-3456789',
    addressLine1: '123 Audit Ave',
    addressLine2: 'Suite 500',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    fiscalYearEndMonth: 12,
    defaultTaxYear: new Date().getFullYear(),
  },
  user: {
    fullName: 'John Doe',
    email: 'partner@elevatecpa.com',
    role: 'PARTNER',
    timezone: 'America/New_York',
  },
  notifications: {
    emailAuditCompleted: true,
    emailHighRiskDetected: true,
    emailWeeklySummary: true,
    inAppAnnouncements: true,
  },
  security: {
    mfaEnabled: false,
    loginAlertsEnabled: true,
  },
};

export async function fetchSettings(): Promise<SettingsBundle> {
  await delay(400);
  return { ...settingsStore };
}

export async function updateFirmSettings(payload: FirmSettings): Promise<FirmSettings> {
  await delay(400);
  settingsStore = { ...settingsStore, firm: { ...payload } };
  return settingsStore.firm;
}

export async function updateUserSettings(payload: UserSettings): Promise<UserSettings> {
  await delay(400);
  settingsStore = { ...settingsStore, user: { ...payload } };
  return settingsStore.user;
}

export async function updateNotificationSettings(payload: NotificationSettings): Promise<NotificationSettings> {
  await delay(400);
  settingsStore = { ...settingsStore, notifications: { ...payload } };
  return settingsStore.notifications;
}

export async function updateSecuritySettings(payload: SecuritySettings): Promise<SecuritySettings> {
  await delay(400);
  settingsStore = { ...settingsStore, security: { ...payload } };
  return settingsStore.security;
}
