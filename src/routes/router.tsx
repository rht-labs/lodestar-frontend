import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { FeatureRequest } from '../components/feature_request';
import { PrivateRoute } from '../components/authentication/private_route';
import { CallbackHandler } from '../components/authentication/callback_handler';
import { EngagementPane } from './engagement_pane';
import { Admin } from './admin';
import { Dashboard } from './dashboard';
import { UnauthorizedPage } from './unauthorized';
import LogoutPage from './logout';
import { Feature } from '../components/feature';
import { APP_FEATURES } from '../common/app_features';
import { LandingPage } from './landing_page/landing_page';
import { Page } from '@patternfly/react-core';
import { OMPHeader } from '../components/omp_header';
import { Feedback } from '../components/omp_feedback';

function _OMPRouter() {
  return (
    <Switch>
      <Route path="/" exact component={LandingPage} />
      <Route path="/feature-request" component={FeatureRequest} />
      <Route path="/auth_callback" component={CallbackHandler} />
      <Route path="/unauthorized" component={UnauthorizedPage} />
      <Route path="/logout" component={LogoutPage} />
      <Route path="/app">
        <MainTemplate>
          <Switch>
            {/* all other routes should be considered private */}
            <PrivateRoute path="/">
              <Feature
                name={APP_FEATURES.reader}
                inactiveComponent={UnauthorizedPage}
              >
                {/* if a user is not authorized, show the unauthorized page */}
                <Switch>
                  {/* else, show an authorized route */}
                  <Redirect exact from="/app" to="/app/dashboard" />
                  <PrivateRoute path="/app/dashboard" component={Dashboard} />
                  <PrivateRoute exact path="/app/engagements">
                      <EngagementPane />
                  </PrivateRoute>
                  <PrivateRoute exact path="/app/admin">
                    <Admin />
                  </PrivateRoute>
                </Switch>
              </Feature>
            </PrivateRoute>
          </Switch>
        </MainTemplate>
      </Route>
    </Switch>
  );
}

const MainTemplate = React.memo(
  ({ children }: { children: React.ReactChild }) => {
    return (
      <Page header={<OMPHeader />} style={{ height: '100vh' }}>
        <Feedback />
        {children}
      </Page>
    );
  }
);

export const OMPRouter = React.memo(_OMPRouter);
