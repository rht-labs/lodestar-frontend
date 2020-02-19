import React, { Component } from 'react';
import { OauthReceiver } from '@jacobsee/react-oauth-flow';

export default class CallbackHandler extends Component {
  handleSuccess = async (accessToken, { response, state }) => {
    console.log('Successfully authorized');
    // await setProfileFromDropbox(accessToken);
    // await redirect(state.from);
  };

  handleError = error => {
    console.error('An error occured');
    console.error(error.message);
  };

  render() {
    return (
      <OauthReceiver
        tokenUrl="https://sso-omp-jasee.apps.s11.core.rht-labs.com/auth/realms/omp/protocol/openid-connect/token"
        clientId={"open-management-portal"}
        // clientSecret={"7776ca0c-9da2-48e4-921a-d821851a95d2"}
        redirectUri="http://localhost:3000/auth_callback"
        onAuthSuccess={this.handleSuccess}
        onAuthError={this.handleError}
        render={({ processing, state, error }) => (
          <div>
            {processing && <p>Authorizing now...</p>}
            {error && (
              <p className="error">An error occured: {error.message}</p>
            )}
          </div>
        )}
      />
    );
  }
}