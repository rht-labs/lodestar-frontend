import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Page,
} from '@patternfly/react-core';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { FeatureRequest } from './components/feature_request';
import { PrivateRoute } from './components/authentication/private_route';
import { CallbackHandler } from './components/authentication/callback_handler';
import { EngagementPane } from './routes/engagement_pane';
import { Admin } from './routes/admin';
import { Dashboard } from './routes/dashboard';
import { EngagementForm } from './routes/engagement_form';
import { SessionProvider } from './context/session_context';
import { ConfigProvider } from './context/config_context';
import { EngagementFormProvider } from './context/engagement_form_context';

import { EngagementProvider } from './context/engagement_context';
import { ErrorBoundary } from './components/error_boundary';
import { OMPHeader } from './components/omp_header';

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
    <Switch>
      <PrivateRoute
        exact
        path="/"
        component={() => {
          return (
            <Dashboard />
          );
        }}
      />
      <PrivateRoute
        exact
        path="/engagements"
        component={() => {
          return (
            <EngagementFormProvider>
              <EngagementPane />
            </EngagementFormProvider>
          );
        }}
      />
      <PrivateRoute
        exact
        path="/wizard"
        component={() => {
          return (
            <EngagementFormProvider>
              <EngagementForm />
            </EngagementFormProvider>
          );
        }}
      />
      <PrivateRoute
        exact
        path="/admin"
        component={() => {
          return (
            <Admin />
          );
        }}
      />
      <Route path="/feature-request" component={FeatureRequest} />
      <PrivateRoute path="/private" component={() => <Redirect to="/" />} />
      <Route path="/auth_callback" component={CallbackHandler} />
    </Switch>
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
