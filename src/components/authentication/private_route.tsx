import React, { useContext } from "react";
import { Route } from "react-router-dom";
import SendToSSO from "./login";
import { useState } from "react";
import { useEffect } from "react";
import SessionContext from "../../context/session_context";

const AUTHENTICATION_STATES = {
  authenticated: "authenticated",
  unauthenticated: "unauthenticated",
  initial: "initial"
};

interface PrivateRouteProps {
  path: string;
  component: (props: any) => JSX.Element;
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const [authenticationStatus, setAuthenticationStatus] = useState(
    AUTHENTICATION_STATES.initial
  );
  const sessionContext = useContext(SessionContext);
  useEffect(() => {
    sessionContext.isLoggedIn().then(authLoggedInResponse => {
      setAuthenticationStatus(
        authLoggedInResponse
          ? AUTHENTICATION_STATES.authenticated
          : AUTHENTICATION_STATES.unauthenticated
      );
    });
  });

  if (authenticationStatus === AUTHENTICATION_STATES.authenticated) {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else if (authenticationStatus === AUTHENTICATION_STATES.unauthenticated) {
    return <SendToSSO />;
  } else {
    return <div />;
  }
};

export default PrivateRoute;
