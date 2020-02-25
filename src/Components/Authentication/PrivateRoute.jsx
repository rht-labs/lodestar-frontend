import React from "react";
import { Route } from "react-router-dom";
import SendToSSO from "./Login";
import { useState } from "react";
import { useEffect } from "react";
import { AuthenticationRepository } from "../../repositories/authentication/authentication_repository";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  useEffect(() => {
    AuthenticationRepository.getInstance().isLoggedIn().then((authLoggedInResponse) => {
      setIsLoggedIn(authLoggedInResponse)
    })
  })
  return isLoggedIn ? (<Route
    {...rest}
    render={props =>
      <Component {...props} />
    }
  />) : isLoggedIn === false ? <SendToSSO /> : <div />
}

export default PrivateRoute;
