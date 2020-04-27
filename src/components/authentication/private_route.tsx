import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { SendToSSO } from './send_to_sso';
import { SessionContext } from '../../context/session_context';

export const PrivateRoute = (props: RouteProps) => {
  const sessionContext = useContext(SessionContext);

  if (sessionContext.authState === 'authenticated') {
    return <Route {...props} />;
  } else if (sessionContext.authState === 'unauthorized') {
    return <Redirect to="/unauthorized" />;
  } else if (sessionContext.authState === 'unauthenticated') {
    return <SendToSSO />;
  } else {
    return <div />;
  }
};
