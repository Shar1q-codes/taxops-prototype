// Presents the engagements grid while delegating data loading to a shared hook.
import React from 'react';
import EngagementList from '../../../../components/EngagementList';
import { Engagement } from '../../../types';
import { useFirmEntities } from '../../../hooks/useFirmEntities';

interface Props {
  onNavigate: (path: string) => void;
}

export default function EngagementsPage({ onNavigate }: Props) {
  const { clients, engagements, loading, error, replaceEngagements } = useFirmEntities();

  const handleAddEngagement = (engagement: Engagement) => {
    replaceEngagements((prev) => [engagement, ...prev]);
  };

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading engagements...</div>;
  }

  if (error) {
    return <div className="p-8 text-sm text-red-600">{error}</div>;
  }

  return (
    <EngagementList 
      engagements={engagements} 
      clients={clients} 
      onSelectEngagement={(id) => onNavigate(`engagements/${id}/overview`)} 
      onAddEngagement={handleAddEngagement}
    />
  );
}
