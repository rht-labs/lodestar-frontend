import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Page,
} from '@patternfly/react-core';

import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { SessionProvider } from './context/session_context';
import { ConfigProvider } from './context/config_context';
import { EngagementProvider } from './context/engagement_context';
import { ErrorBoundary } from './components/error_boundary';
import { OMPHeader } from './components/omp_header';
import { OMPRouter } from './routes/router'

export const App = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <SessionProvider>
          <Router>
            <Providers>
              <MainTemplate>
                <MainTemplateRoutes />
              </MainTemplate>
            </Providers>
          </Router>
        </SessionProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

const Providers = ({ children }: { children: React.ReactChild }) => {
  return <EngagementProvider>{children}</EngagementProvider>;
};

const MainTemplateRoutes = () => {
  return (
    <OMPRouter/>
  );
};

const MainTemplate = React.memo(
  ({ children }: { children: React.ReactChild }) => {
    return (
      <Page
        header={
          <OMPHeader/>
        }
        style={{ height: '100vh' }}
      >
        {children}
      </Page>
    );
  }
);
