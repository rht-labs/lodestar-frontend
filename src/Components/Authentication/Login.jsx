import { AppSettings } from '../../settings/config';

const OAUTH_CONFIG = {
  clientId: AppSettings.clientId,
  redirectUri: `${AppSettings.baseUrl}/auth_callback`,
  state: {
    from: '/settings'
  }
}

const OAUTH_URL = `${AppSettings.authBaseUrl}/auth?client_id=${OAUTH_CONFIG.clientId}&redirect_uri=${encodeURI(OAUTH_CONFIG.redirectUri)}&response_type=code&state=${encodeURI(JSON.stringify(OAUTH_CONFIG.state))}`

export default function SendToSSO() {
  window.location = OAUTH_URL
  return null
}