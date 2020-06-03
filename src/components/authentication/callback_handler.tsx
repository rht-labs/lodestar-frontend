import React, { useState, useEffect } from 'react';
import { useSession } from '../../context/session_context/session_context';
import { useLocation, Redirect } from 'react-router';

export const CallbackHandler = () => {
  const query = new URLSearchParams(useLocation().search);
  const sessionContext = useSession();
  const [isHandlingCallback, setIsHandlingCallback] = useState<
    'initial' | 'handling' | 'completed'
  >('initial');
  const mountedRef = React.useRef(true);
  useEffect(() => {
    const code: string | null = query.get('code');
    if (isHandlingCallback !== 'handling' && code) {
      setIsHandlingCallback('handling');
      sessionContext.handleLoginCallback(code).then(() => {
        if (mountedRef.current) {
          setIsHandlingCallback('completed');
        }
      });
    }
    return () => {
      mountedRef.current = false;
    };
  }, [sessionContext, isHandlingCallback, query]);

  if (!sessionContext.sessionData) {
    return <div />;
  }
  return <Redirect to="/app" />;
};
