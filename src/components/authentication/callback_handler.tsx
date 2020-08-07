import React, { useState, useEffect } from 'react';
import { useSession } from '../../context/auth_context/auth_context';
import { useLocation, Redirect } from 'react-router';

export const CallbackHandler = () => {
  const query = new URLSearchParams(useLocation().search);
  const authContext = useSession();
  const [hasRunCheck, setHasRunCheck] = useState<boolean>(false);
  const [isAuthed, setIsAuthed] = useState<boolean>(null);
  useEffect(() => {
    const code: string | null = query.get('code');
    if (!hasRunCheck && code) {
      setHasRunCheck(true);
      authContext.handleLoginCallback(code).then(async () => {
        if (await authContext.checkIsAuthenticated()) {
          setIsAuthed(true);
        }
      });
    }
  }, [authContext, hasRunCheck, query]);

  if (!isAuthed) {
    return <div />;
  }
  return <Redirect to="/app" />;
};
