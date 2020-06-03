import React from 'react';
import { useConfig } from '../../context/config_context/config_hook';

export function SendToSSO() {
  const configContext = useConfig();
  const OAUTH_CONFIG = {
    clientId: configContext.appConfig?.clientId,
    redirectUri: `${configContext.appConfig?.baseUrl}/auth_callback`,
    state: {
      from: '/settings',
    },
  };

  const OAUTH_URL = `${configContext.appConfig?.authBaseUrl}/auth?client_id=${
    OAUTH_CONFIG.clientId
  }&redirect_uri=${encodeURI(
    OAUTH_CONFIG.redirectUri
  )}&response_type=code&prompt=select_account&state=${encodeURI(
    JSON.stringify(OAUTH_CONFIG.state)
  )}`;
  window.location = (OAUTH_URL as any) as Location;
  return <div />;
}
