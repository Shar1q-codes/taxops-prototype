
// Orchestrates high-level route selection using a lightweight in-memory router.
import React from 'react';
import AppShell from './web/components/layouts/AppShell';
import DashboardPage from './web/app/app/dashboard/page.tsx';
import EngagementList from './web/app/app/engagements/page.tsx';
import EngagementView from './web/app/app/engagements/[id]/layout.tsx';
import ClientsView from './web/app/app/clients/page.tsx';
import Login from './web/app/auth/login/page.tsx';
import LandingPage from './web/app/(marketing)/page.tsx';
import ClientPortal from './web/app/portal/page.tsx';
import SettingsPage from './web/app/app/settings/page.tsx';
import { useAppRouter } from './web/hooks/useAppRouter';
import { SettingsProvider } from './web/hooks/useSettings';

export default function App() {
  const { route, params, navigate } = useAppRouter();

  // --- Views ---

  if (route === 'landing') return <LandingPage onLogin={() => navigate('login')} onPortal={() => navigate('portal')} />;
  if (route === 'login') return <Login onLoginSuccess={() => navigate('dashboard')} onBack={() => navigate('landing')} />;
  if (route === 'portal') return <ClientPortal onLogout={() => navigate('landing')} />;

  // Authenticated Shell
  
  let content;
  let breadcrumbs = [];

  switch (route) {
    case 'dashboard':
        content = <DashboardPage onNavigate={navigate} />;
        break;
    case 'clients':
        content = <ClientsView />;
        breadcrumbs = [{ label: 'Clients', path: 'clients' }];
        break;
    case 'engagements':
        content = <EngagementList onNavigate={navigate} />;
        breadcrumbs = [{ label: 'Engagements', path: 'engagements' }];
        break;
    case 'engagement_detail':
        content = <EngagementView engagementId={params.id} initialTab={params.tab} onNavigate={navigate} />;
        // Breadcrumbs handled inside EngagementView for dynamic names
        break;
    case 'settings':
        content = <SettingsPage />;
        breadcrumbs = [{ label: 'Settings', path: 'settings' }];
        break;
    default:
        content = <DashboardPage onNavigate={navigate} />;
  }

  return (
    <SettingsProvider>
      <AppShell activePath={route} onNavigate={navigate} breadcrumbs={breadcrumbs}>
          {content}
      </AppShell>
    </SettingsProvider>
  );
}
