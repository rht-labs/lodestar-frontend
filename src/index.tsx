import './wdyr';
import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';
import Keycloak from 'keycloak-js';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { App } from './app';
import { unstable_trace as trace } from 'scheduler/tracing';
import './assets/css/overrides.css';
import { Token } from './packages/api_v1_sdk/token';
import {
  ConfigProvider,
  ConfigContext,
} from './context/config_context/config_context';
import { createConfigService } from './services/factories/config_service_factory';
import { setUpValidation } from './utilities/app_setup';

setUpValidation();

const AppWithConfig = () => {
  return (
    <ConfigProvider
      configRepository={createConfigService(
        process.env.REACT_APP_USE_FAKED === 'true'
      )}
    >
      <ConfigContext.Consumer>
        {({ appConfig, fetchConfig }) => {
          if (!appConfig) {
            fetchConfig();
            return null;
          }
          const keycloak = Keycloak({
            url: appConfig.authBaseUrl,
            realm: 'ETL',
            clientId: appConfig.clientId,
          });
          return (
            <ReactKeycloakProvider
              onTokens={tokens => {
                Token.token = {
                  accessToken: tokens.token,
                  refreshToken: tokens.refreshToken,
                };
              }}
              initOptions={{}}
              authClient={keycloak}
            >
              <App config={appConfig} />
            </ReactKeycloakProvider>
          );
        }}
      </ConfigContext.Consumer>
    </ConfigProvider>
  );
};

if (process.env.NODE_ENV === 'development') {
  trace('initial render', performance.now(), () =>
    ReactDOM.render(
      <Profiler
        id="application"
        onRender={(
          id: string,
          phase: 'mount' | 'update',
          actualDuration: number,
          baseDuration: number,
          startTime: number,
          commitTime: number,
          interactions: Set<any>
        ) => {}}
      >
        <AppWithConfig />
      </Profiler>,
      document.getElementById('root')
    )
  );
} else {
  ReactDOM.render(<AppWithConfig />, document.getElementById('root'));
}
