import React, { Component, useContext } from "react";
import { OauthReceiver } from "@jacobsee/react-oauth-flow";
import { SessionContext } from "../../Context/sessionContext";

export default class CallbackHandler extends Component {
  render() {
    return (
      <SessionContext.Consumer>
        {ctx => {
          return (
            <OauthReceiver
              tokenUrl="https://sso-omp-jasee.apps.s11.core.rht-labs.com/auth/realms/omp/protocol/openid-connect/token"
              clientId={"open-management-portal"}
              redirectUri="http://localhost:3000/auth_callback"
              onAuthSuccess={(accessToken, { response, state }) => {
                let currentTime = new Date();
                ctx.performLogin({
                  profile: {},
                  tokens: {
                    accessToken: response.access_token,
                    refreshToken: response.refresh_token,
                    accessTokenExpiry: new Date(
                      currentTime.getTime() + response.expires_in * 1000
                    ),
                    refreshTokenExpiry: new Date(
                      currentTime.getTime() + response.refresh_expires_in * 1000
                    )
                  }
                });
                console.log("Toggled login in Context now");
                console.log(response);
              }}
              onAuthError={error => {
                console.error("An error occurred");
                console.error(error.message);
              }}
              render={({ processing, state, error }) => (
                <div>
                  {processing && <p>Authorizing now...</p>}
                  {error && (
                    <p className="error">An error occurred: {error.message}</p>
                  )}
                </div>
              )}
            />
          );
        }}
      </SessionContext.Consumer>
    );
  }
}
