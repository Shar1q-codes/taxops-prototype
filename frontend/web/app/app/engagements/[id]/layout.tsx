// Loads engagement details and hands them to the workspace view.
import React, { useMemo } from 'react';
import EngagementView from '../../../../../components/EngagementView';
import { EngagementTab } from '../../../../hooks/useEngagementWorkspace';
import { useEngagementDetails } from '../../../../hooks/useEngagementDetails';

interface Props {
  engagementId: string;
  initialTab?: string;
  onNavigate: (path: string) => void;
}

function toTab(tab?: string): EngagementTab {
  switch ((tab || '').toLowerCase()) {
    case 'audit':
      return 'AUDIT';
    case 'data':
      return 'DATA';
    case 'docs':
      return 'DOCS';
    case 'workpapers':
      return 'WORKPAPERS';
    case 'reports':
      return 'REPORTS';
    case 'overview':
    default:
      return 'OVERVIEW';
  }
}

export default function EngagementLayout({ engagementId, initialTab, onNavigate }: Props) {
  const { engagement, loading, error } = useEngagementDetails(engagementId);

  const tab = useMemo(() => toTab(initialTab), [initialTab]);

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading engagement...</div>;
  }

  if (error || !engagement) {
    return (
      <div className="p-8 space-y-4 text-sm text-slate-700">
        <div>{error || 'Could not load engagement details.'}</div>
        <button
          type="button"
          onClick={() => onNavigate('engagements')}
          className="inline-flex items-center px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Back to engagements
        </button>
      </div>
    );
  }

  return <EngagementView engagement={engagement} initialTab={tab} onNavigate={onNavigate} />;
}
