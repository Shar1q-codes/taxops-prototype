// Shows firm clients while data fetching lives in a dedicated hook.
import React from 'react';
import ClientsView from '../../../../components/ClientsView';
import { Client } from '../../../types';
import { useClients } from '../../../hooks/useClients';

export default function ClientsPage() {
  const { clients, loading, error, replaceClients } = useClients();

  const handleAddClient = (client: Client) => {
    replaceClients((prev) => [client, ...prev]);
  };

  const handleUpdateClient = (updated: Client) => {
    replaceClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteClient = (clientId: string) => {
    replaceClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading clients...</div>;
  }

  if (error) {
    return <div className="p-8 text-sm text-red-600">{error}</div>;
  }

  return (
    <ClientsView 
      clients={clients} 
      onAddClient={handleAddClient}
      onUpdateClient={handleUpdateClient}
      onDeleteClient={handleDeleteClient}
    />
  );
}
