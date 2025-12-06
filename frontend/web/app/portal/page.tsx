import React from 'react';
import ClientPortal from '../../../components/ClientPortal';

interface Props {
  onLogout: () => void;
}

export default function PortalPage(props: Props) {
  return <ClientPortal {...props} />;
}
