import React, { useContext } from 'react';
import { SessionContext } from '../../context/session_context';
import { useLocation, Redirect } from 'react-router';

export const CallbackHandler = () => {
  const query = new URLSearchParams(useLocation().search);
  const code: string | null = query.get('code');
  const sessionContext = useContext(SessionContext);

  if (!code) {
    // TODO: handle case where code is not present
    return null;
  }
  if (sessionContext.isLoading) {
    sessionContext.handleLoginCallback(code);
    return null;
  }
  return <Redirect to="/" />;
};
