// Loads a single engagement detail record behind an injectable service to isolate data access from layout logic.
import { useEffect, useState } from 'react';
import { Engagement } from '../types';
import { EngagementDataService, engagementDataService } from '../services/engagementDataService';

interface EngagementDetailsState {
  engagement: Engagement | null;
  loading: boolean;
  error: string | null;
}

export function useEngagementDetails(
  engagementId: string,
  service: EngagementDataService = engagementDataService
): EngagementDetailsState {
  const [state, setState] = useState<EngagementDetailsState>({
    engagement: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const engagement = await service.fetchEngagementById(engagementId);
        if (!mounted) return;
        setState({ engagement, loading: false, error: null });
      } catch (err) {
        console.error('Failed to load engagement details', err);
        if (!mounted) return;
        setState({ engagement: null, loading: false, error: 'Could not load engagement details. Please try again.' });
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [engagementId, service]);

  return state;
}
