import React, { useState, useEffect } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { SendToSSO } from './send_to_sso';
import { useSession } from '../../context/auth_context/auth_context';

export const PrivateRoute = (props: RouteProps) => {
  const { checkAuthStatus, authState } = useSession();
  const [authStatusChecked, setAuthStatusChecked] = useState<boolean>(false);
  useEffect(() => {
    if (!authStatusChecked) {
      checkAuthStatus();
    }
    setAuthStatusChecked(true);
  }, [authState, checkAuthStatus, authStatusChecked]);

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
