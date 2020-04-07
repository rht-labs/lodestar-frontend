import React, { useContext } from 'react';
import { SessionContext } from '../../context/session_context';
import { useLocation, Redirect } from 'react-router';

export const CallbackHandler = () => {
  const query = new URLSearchParams(useLocation().search);
  const code: string | null = query.get('code');
  const sessionContext = useContext(SessionContext);

  if (!code || sessionContext.isLoading) {
    // TODO: handle case where code is not present
    return null;
  }
  sessionContext.handleLoginCallback(code);
  return <Redirect to="/" />;
};
