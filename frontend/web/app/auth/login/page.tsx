import React from 'react';
import Login from '../../../../components/Login';

interface Props {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export default function LoginPage(props: Props) {
  return <Login {...props} />;
}
