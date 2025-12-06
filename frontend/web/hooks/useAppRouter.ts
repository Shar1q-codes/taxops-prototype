// Holds the in-memory routing state and path parsing so App.tsx only composes pages.
import { useCallback, useState } from 'react';

export type AppRoute =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'engagements'
  | 'engagement_detail'
  | 'clients'
  | 'portal'
  | 'settings';

interface NavigationState {
  route: AppRoute;
  params: Record<string, any>;
}

function resolvePath(path: string): NavigationState {
  if (path.startsWith('engagements/')) {
    const [, id, tab] = path.split('/');
    const resolvedTab = tab || 'overview';
    return { route: 'engagement_detail', params: { id, tab: resolvedTab } };
  }

  if (path === 'logout') {
    return { route: 'landing', params: {} };
  }

  const known: AppRoute[] = ['landing', 'login', 'dashboard', 'engagements', 'clients', 'portal', 'settings'];
  if (known.includes(path as AppRoute)) {
    return { route: path as AppRoute, params: {} };
  }

  return { route: 'dashboard', params: {} };
}

export function useAppRouter(initialRoute: AppRoute = 'landing') {
  const [state, setState] = useState<NavigationState>({ route: initialRoute, params: {} });

  const navigate = useCallback((path: string) => {
    setState(resolvePath(path));
  }, []);

  return { route: state.route, params: state.params, navigate };
}
