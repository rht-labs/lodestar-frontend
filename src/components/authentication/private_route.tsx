import React, { useContext } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { SendToSSO } from './send_to_sso';
import { SessionContext } from '../../context/session_context';

interface PrivateRouteProps extends RouteProps {
  path: string;
  component: (props: any) => JSX.Element;
}

export const PrivateRoute = ({
  component: Component,
  ...rest
}: PrivateRouteProps) => {
  const sessionContext = useContext(SessionContext);

  console.log('private', sessionContext.authState);
  if (sessionContext.authState === 'authenticated') {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else if (sessionContext.authState === 'unauthenticated') {
    return <SendToSSO />;
  } else {
    return <div />;
  }
};
