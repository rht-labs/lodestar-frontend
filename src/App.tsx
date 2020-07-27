import React, { useEffect } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/auth_context/auth_context';
import { VersionProvider } from './context/version_context/version_context';
import { ConfigProvider } from './context/config_context/config_context';
import { EngagementProvider } from './context/engagement_context/engagement_context';
import { ErrorBoundary } from './components/error_boundary/error_boundary';
import { OMPRouter } from './routes/router';
import { FeatureToggles } from './context/feature_toggles/feature_toggles';
import {
  ServiceProvider,
  useServiceProviders,
} from './context/service_provider_context/service_provider_context';
import { FeedbackProvider } from './context/feedback_context/feedback_context';
import { PublicConfigService } from './services/config_service/implementations/public_config_service';
import { NotificationProvider } from './context/notification_context/notification_context';
import { useConfig } from './context/config_context/config_hook';
import { ApiV1ServiceFactory } from './services/factories/service_factory';

export const App = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider configRepository={new PublicConfigService()}>
        <ServiceProviderWrapper>
          <AppContexts />
        </ServiceProviderWrapper>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

function ServiceProviderWrapper({ children }: { children: React.ReactChild }) {
  const { appConfig, fetchConfig } = useConfig();
  useEffect(() => {
    if (!appConfig) {
      fetchConfig();
    }
  }, [appConfig, fetchConfig]);
  if (!appConfig) {
    return null;
  }
  const serviceProviders = new ApiV1ServiceFactory(appConfig);
  return (
    <ServiceProvider serviceFactory={serviceProviders}>
      {children}
    </ServiceProvider>
  );
}

function AppContexts() {
  const {
    authenticationService,
    engagementService,
    notificationService,
    versionService,
  } = useServiceProviders();
  return (
    <FeedbackProvider>
      <AuthProvider authenticationService={authenticationService}>
        <NotificationProvider notificationService={notificationService}>
          <VersionProvider versionService={versionService}>
            <FeatureToggles>
              <Router>
                <EngagementProvider engagementService={engagementService}>
                  <OMPRouter />
                </EngagementProvider>
              </Router>
            </FeatureToggles>
          </VersionProvider>
        </NotificationProvider>
      </AuthProvider>
    </FeedbackProvider>
  );
}
