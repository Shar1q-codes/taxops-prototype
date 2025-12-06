import React from 'react';
import LandingPage from '../../../components/LandingPage';

interface Props {
  onLogin: () => void;
  onPortal: () => void;
}

export default function MarketingPage(props: Props) {
  return <LandingPage {...props} />;
}
