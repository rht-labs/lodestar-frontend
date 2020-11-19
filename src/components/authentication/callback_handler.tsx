import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from '../../context/auth_context/auth_context';
import { useLocation, Redirect } from 'react-router';

export const CallbackHandler = () => {
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
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
  if (authContext.authError) {
    return <Redirect to="/logout" />;
  }
  if (!isAuthed) {
    return <div />;
  }
  const state = query.get('state') ? JSON.parse(query.get('state')) : null;
  return <Redirect to={state?.from ? state?.from : '/app'} />;
};
