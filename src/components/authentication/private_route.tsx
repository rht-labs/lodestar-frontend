import React, { useState, useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { SendToSSO } from './send_to_sso';
import { useSession } from '../../context/auth_context/auth_context';

export const PrivateRoute = (props: RouteProps) => {
  const { checkIsAuthenticated } = useSession();
  const [authStatusChecked, setAuthStatusChecked] = useState<boolean>(false);
  const [isAuthed, setIsAuthed] = useState<boolean>(null);
  useEffect(() => {
    if (!authStatusChecked) {
      checkIsAuthenticated().then(isAuthenticated =>
        setIsAuthed(isAuthenticated)
      );
    }
    setAuthStatusChecked(true);
  }, [checkIsAuthenticated, authStatusChecked]);

  if (isAuthed) {
    return <Route {...props} />;
  } else if (isAuthed === false) {
    return <SendToSSO />;
  } else {
    return <div />;
  }
};
