import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { FeatureRequest } from '../components/feature_request';
import { PrivateRoute } from '../components/authentication/private_route';
import { CallbackHandler } from '../components/authentication/callback_handler';
import { EngagementPane } from './engagement_pane';
import { Admin } from './admin';
import { Dashboard } from './dashboard';
import { EngagementFormProvider } from '../context/engagement_form_context';
import { UnauthorizedPage } from './unauthorized';
import LogoutPage from './logout';
import { Feature } from '../components/feature';

function _OMPRouter() {
  return (
    <Switch>
      <Route path="/feature-request" component={FeatureRequest} />
      <Route path="/auth_callback" component={CallbackHandler} />
      <Route path="/unauthorized" component={UnauthorizedPage} />
      <Route path="/logout" component={() => <LogoutPage />} />
      {/* all other routes should be considered private */}
      <PrivateRoute path="/">
        <Feature name="manage_projects" inactiveComponent={UnauthorizedPage}>
          {/* if a user is not authorized, show the unauthorized page */}
          <Switch>
            {/* else, show an authorized route */}
            <Redirect exact from="/" to="/dashboard" />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/engagements">
              <EngagementFormProvider>
                <EngagementPane />
              </EngagementFormProvider>
            </PrivateRoute>
            <PrivateRoute exact path="/admin">
              <Admin />
            </PrivateRoute>
          </Switch>
        </Feature>
      </PrivateRoute>
    </Switch>
  );
}

export const OMPRouter = React.memo(_OMPRouter);
