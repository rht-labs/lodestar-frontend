import React, { useContext, useState } from 'react';
import { SessionContext } from '../../context/session_context';
import { useLocation, Redirect } from 'react-router';

export const CallbackHandler = () => {
  const query = new URLSearchParams(useLocation().search);
  const code: string | null = query.get('code');
  const sessionContext = useContext(SessionContext);
  const [isHandlingCallback, setIsHandlingCallback] = useState<boolean>(false);
  if (!code) {
    // TODO: handle case where code is not present
    return null;
  }
  if (!isHandlingCallback) {
    console.log(code);

    setIsHandlingCallback(true);
    sessionContext.handleLoginCallback(code);
    return null;
  }
  if (!sessionContext.sessionData) {
    console.log('me');
    return <div />;
  }
  return <Redirect to="/" />;
};
