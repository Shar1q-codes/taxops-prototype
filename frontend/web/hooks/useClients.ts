// Loads clients via the data service so UI code is insulated from API details.
import { useEffect, useState } from 'react';
import { Client } from '../types';
import { EngagementDataService, engagementDataService } from '../services/engagementDataService';

interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

interface ClientsApi extends ClientsState {
  replaceClients: (updater: (prev: Client[]) => Client[]) => void;
}

export function useClients(service: EngagementDataService = engagementDataService): ClientsApi {
  const [state, setState] = useState<ClientsState>({ clients: [], loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const clients = await service.fetchClients();
        if (!mounted) return;
        setState({ clients, loading: false, error: null });
      } catch (err) {
        console.error('Failed to load clients', err);
        if (!mounted) return;
        setState({ clients: [], loading: false, error: 'Failed to load clients. Please try again.' });
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [service]);

  const replaceClients = (updater: (prev: Client[]) => Client[]) =>
    setState((prev) => ({ ...prev, clients: updater(prev.clients) }));

  return { ...state, replaceClients };
}
