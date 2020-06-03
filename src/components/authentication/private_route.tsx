import React, { useState, useEffect } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { SendToSSO } from './send_to_sso';
import { useSession } from '../../context/session_context/session_context';

export const PrivateRoute = (props: RouteProps) => {
  const { checkAuthStatus, authState } = useSession();
  const [authStatusChecked, setAuthStatusChecked] = useState<boolean>(false);
  useEffect(() => {
    setAuthStatusChecked(false);
    checkAuthStatus().then(() => {
      setAuthStatusChecked(true);
    });
  }, [authState, checkAuthStatus]);

  if (!authStatusChecked) {
    return <div />;
  }

  if (authState === 'authenticated') {
    return <Route {...props} />;
  } else if (authState === 'unauthorized') {
    return <Redirect to="/unauthorized" />;
  } else if (authState === 'unauthenticated') {
    return <SendToSSO />;
  } else {
    return <div />;
  }
};
