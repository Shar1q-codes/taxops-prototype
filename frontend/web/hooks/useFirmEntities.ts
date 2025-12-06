// Encapsulates loading of firm-level clients and engagements so pages remain presentational.
import { useEffect, useState } from 'react';
import { Client, Engagement } from '../types';
import { EngagementDataService, engagementDataService } from '../services/engagementDataService';

interface FirmEntitiesState {
  clients: Client[];
  engagements: Engagement[];
  loading: boolean;
  error: string | null;
}

interface FirmEntitiesApi extends FirmEntitiesState {
  replaceEngagements: (updater: (prev: Engagement[]) => Engagement[]) => void;
}

export function useFirmEntities(service: EngagementDataService = engagementDataService): FirmEntitiesApi {
  const [state, setState] = useState<FirmEntitiesState>({
    clients: [],
    engagements: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [clients, engagements] = await Promise.all([
          service.fetchClients(),
          service.fetchEngagements(),
        ]);

        if (!mounted) return;
        setState({ clients, engagements, loading: false, error: null });
      } catch (err) {
        console.error('Failed to load firm entities', err);
        if (!mounted) return;
        setState((prev) => ({ ...prev, loading: false, error: 'Failed to load data. Please try again.' }));
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [service]);

  const replaceEngagements = (updater: (prev: Engagement[]) => Engagement[]) => {
    setState((prev) => ({ ...prev, engagements: updater(prev.engagements) }));
  };

  return { ...state, replaceEngagements };
}
