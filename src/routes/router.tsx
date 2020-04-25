import React from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { FeatureRequest } from '../components/feature_request';
import { PrivateRoute } from '../components/authentication/private_route';
import { CallbackHandler } from '../components/authentication/callback_handler';
import { EngagementPane } from './engagement_pane';
import { Admin } from './admin';
import { Dashboard } from './dashboard';
import { EngagementFormProvider } from '../context/engagement_form_context';
import { UnauthorizedPage } from './unauthorized';
import LogoutPage from './logout'

function _OMPRouter() {

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
        path="/admin"
        component={() => {
          return (
            <Admin />
          );
        }}
      />
      <PrivateRoute path="/private" component={() => <Redirect to="/" />} />
      <PrivateRoute path="/logout" component={() => <LogoutPage />} />
      <Route path="/feature-request" component={FeatureRequest} />
      <Route path="/auth_callback" component={CallbackHandler} />
      <Route path="/unauthorized" component={UnauthorizedPage} />
    </Switch>
  );
}

export const OMPRouter = React.memo(_OMPRouter);