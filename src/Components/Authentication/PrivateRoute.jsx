import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import SendToSSO from "./Login";
import { SessionContext } from "../../Context/sessionContext";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <SessionContext.Consumer>
    {ctx => {
      return (
        <Route
          {...rest}
          render={props =>
            ctx.userLoggedIn === true ? (
              <Component {...props} />
            ) : (
              <SendToSSO />
            )
          }
        />
      );
    }}
  </SessionContext.Consumer>
);

export default PrivateRoute;
