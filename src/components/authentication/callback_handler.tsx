import React, { useState, useEffect } from 'react';
import { useSession } from '../../context/auth_context/auth_context';
import { useLocation, Redirect } from 'react-router';

export const CallbackHandler = () => {
  const query = new URLSearchParams(useLocation().search);
  const authContext = useSession();
  const [isHandlingCallback, setIsHandlingCallback] = useState<
    'initial' | 'handling' | 'completed'
  >('initial');
  const mountedRef = React.useRef(true);
  useEffect(() => {
    const code: string | null = query.get('code');
    if (isHandlingCallback !== 'handling' && code) {
      setIsHandlingCallback('handling');
      authContext.handleLoginCallback(code).then(() => {
        if (mountedRef.current) {
          setIsHandlingCallback('completed');
        }
      });
    }
    return () => {
      mountedRef.current = false;
    };
  }, [authContext, isHandlingCallback, query]);

  if (!authContext.sessionData) {
    return <div />;
  }
  return <Redirect to="/app" />;
};
