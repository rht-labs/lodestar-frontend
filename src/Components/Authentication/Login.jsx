import React, { Component } from 'react';
import { OauthSender } from '@jacobsee/react-oauth-flow';

export default class SendToSSO extends Component {
  render() {
    return (
      <OauthSender
        authorizeUrl="https://sso-omp-jasee.apps.s11.core.rht-labs.com/auth/realms/omp/protocol/openid-connect/auth"
        clientId={"open-management-portal"}
        redirectUri="http://localhost:3000/auth_callback"
        state={{ from: '/settings' }}
        render={({ url }) => <a href={url}>Log in with SSO</a>}
      />
    );
  }
}