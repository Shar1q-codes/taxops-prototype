// Temporary in-memory notifications API. TODO: wire to backend notifications endpoints.

export type NotificationSeverity = "info" | "success" | "warning" | "error";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string; // ISO timestamp
  read: boolean;
  severity: NotificationSeverity;
  href?: string;
}

export interface NotificationSummary {
  unreadCount: number;
  items: NotificationItem[];
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let notificationStore: NotificationItem[] = [
  {
    id: "ntf-1",
    title: "Audit completed",
    message: "FY2024 Audit for Acme Corp has finished running.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
    severity: "success",
    href: "/app/engagements/eng-123/overview",
  },
  {
    id: "ntf-2",
    title: "High-risk findings detected",
    message: "3 high-severity findings detected in Payroll for Globex Inc.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: false,
    severity: "warning",
    href: "/app/engagements/eng-999/overview",
  },
  {
    id: "ntf-3",
    title: "New client added",
    message: "Soylent Corp was added by John Doe.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    severity: "info",
  },
];

function summarize(): NotificationSummary {
  const unreadCount = notificationStore.filter((n) => !n.read).length;
  return { unreadCount, items: [...notificationStore].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) };
}

export async function fetchNotifications(): Promise<NotificationSummary> {
  await delay(350);
  return summarize();
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(250);
  notificationStore = notificationStore.map((n) => (n.id === id ? { ...n, read: true } : n));
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay(300);
  notificationStore = notificationStore.map((n) => ({ ...n, read: true }));
}
