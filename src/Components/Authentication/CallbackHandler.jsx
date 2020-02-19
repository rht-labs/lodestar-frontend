import React, { Component, useContext } from "react";
import axios from "axios";
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
              onAuthSuccess={(
                accessToken,
                { response: authResponse, state }
              ) => {
                let currentTime = new Date();
                axios
                  .get(
                    "https://sso-omp-jasee.apps.s11.core.rht-labs.com/auth/realms/omp/protocol/openid-connect/userinfo",
                    {
                      headers: {
                        Authorization: `Bearer ${authResponse.access_token}`
                      }
                    }
                  )
                  .then(userDataResponse => {
                    // noinspection JSUnresolvedVariable
                    console.log("Performing login using sessionContext now");
                    console.log(userDataResponse.data);
                    ctx.performLogin({
                      profile: {
                        username: userDataResponse.data.preferred_username,
                        firstName: userDataResponse.data.given_name,
                        lastName: userDataResponse.data.family_name,
                        email: userDataResponse.data.email
                      },
                      tokens: {
                        accessToken: authResponse.access_token,
                        refreshToken: authResponse.refresh_token,
                        accessTokenExpiry: new Date(
                          currentTime.getTime() + authResponse.expires_in * 1000
                        ),
                        refreshTokenExpiry: new Date(
                          currentTime.getTime() +
                            authResponse.refresh_expires_in * 1000
                        )
                      },
                      roles: userDataResponse.data.groups
                    });
                  });
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
