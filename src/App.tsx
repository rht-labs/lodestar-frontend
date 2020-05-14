import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { SessionProvider } from './context/session_context';
import { VersionProvider } from './context/version_context';
import { ConfigProvider } from './context/config_context';
import { EngagementProvider } from './context/engagement_context';
import { ErrorBoundary } from './components/error_boundary';
import { OMPRouter } from './routes/router';
import { FeatureToggles } from './context/feature_toggles';
import { FeedbackProvider } from './context/feedback_context';

export const App = () => {
  return (
    <ErrorBoundary>
      <FeedbackProvider>
        <ConfigProvider>
          <SessionProvider>
            < VersionProvider>
              <FeatureToggles>
                <Router>
                  <Providers>
                    <OMPRouter />
                  </Providers>
                </Router>
              </FeatureToggles>
            </VersionProvider>
          </SessionProvider>
        </ConfigProvider>
      </FeedbackProvider>
    </ErrorBoundary>
  );
};

const Providers = ({ children }: { children: React.ReactChild }) => {
  return <EngagementProvider>{children}</EngagementProvider>;
};

