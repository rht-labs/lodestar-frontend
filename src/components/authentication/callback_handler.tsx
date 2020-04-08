import React, { useContext, useState, useEffect } from 'react';
import { SessionContext } from '../../context/session_context';
import { useLocation, Redirect } from 'react-router';

export const CallbackHandler = () => {
  const query = new URLSearchParams(useLocation().search);
  const sessionContext = useContext(SessionContext);
  const [isHandlingCallback, setIsHandlingCallback] = useState<
    'initial' | 'handling' | 'completed'
  >('initial');
  
  useEffect(() => {
    const code: string | null = query.get('code');
    if (isHandlingCallback !== 'handling' && code) {
      setIsHandlingCallback('handling');
      sessionContext.handleLoginCallback(code).then(() => {
        setIsHandlingCallback('completed');
      });
    }
  }, [sessionContext, isHandlingCallback, query]);

  if (!sessionContext.sessionData) {
    return <div />;
  }
  return <Redirect to="/" />;
};
