import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

export const PrivateRoute = (props: RouteProps) => {
  const { keycloak, initialized } = useKeycloak();
  if (!initialized) {
    return <div />;
  }
  if (keycloak.authenticated) {
    return <Route {...props} />;
  } else {
    keycloak.login();
    return <div />
  }
};
