import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { SessionProvider } from './context/session_context/session_context';
import { VersionProvider } from './context/version_context/version_context';
import { ConfigProvider } from './context/config_context/config_context';
import { EngagementProvider } from './context/engagement_context/engagement_context';
import { ErrorBoundary } from './components/error_boundary';
import { OMPRouter } from './routes/router';
import { FeatureToggles } from './context/feature_toggles/feature_toggles';
import { ServiceProvider } from './context/service_provider_context/service_provider_context';
import { FeedbackProvider } from './context/feedback_context';
import { PublicConfigService } from './services/config_service/implementations/public_config_service';
import { GlobalLoadingProvider } from './context/global_loading_context/global_loading_context';
import { NotificationProvider } from './context/notification_context/notification_context';

export const App = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider configRepository={new PublicConfigService()}>
        <ServiceProvider>
          <FeedbackProvider>
            <SessionProvider>
              <NotificationProvider>
                <VersionProvider>
                  <FeatureToggles>
                    <Router>
                      <EngagementProvider>
                        <GlobalLoadingProvider>
                          <OMPRouter />
                        </GlobalLoadingProvider>
                      </EngagementProvider>
                    </Router>
                  </FeatureToggles>
                </VersionProvider>
              </NotificationProvider>
            </SessionProvider>
          </FeedbackProvider>
        </ServiceProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};
