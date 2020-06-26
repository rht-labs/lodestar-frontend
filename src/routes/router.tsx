import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { FeatureRequest } from '../components/feature_request';
import { PrivateRoute } from '../components/authentication/private_route';
import { CallbackHandler } from '../components/authentication/callback_handler';
import { Dashboard } from './dashboard';
import { About } from './about';
import { UnauthorizedPage } from './unauthorized';
import LogoutPage from './logout';
import { Feature } from '../components/feature';
import { APP_FEATURES } from '../common/app_features';
import { LandingPage } from './landing_page/landing_page';
import { MainTemplate } from '../layout/main_template';
import { CreateNewEngagement } from './create_new_engagement/create_new_engagement';
import { EngagementListRoute } from './engagement_list/engagement_list_route';
import { EngagementDetailView } from './engagement_details';
import { ModalVisibilityProvider } from '../context/edit_modal_visibility_context/edit_modal_visibility_context';
import { useNotification } from '../context/notification_context/notification_hook';
import { EngagementStatus } from '../schemas/engagement_schema';

function _OMPRouter() {
  const { fetchNotifications } = useNotification();
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Switch>
      <Route path="/" exact component={LandingPage} />
      <Route path="/auth_callback" component={CallbackHandler} />
      <Route path="/unauthorized" component={UnauthorizedPage} />
      <Route path="/logout" component={LogoutPage} />
      <PrivateRoute path="/app">
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
                  <Route
                    path="/app/requestfeature"
                    component={FeatureRequest}
                  />
                  <PrivateRoute path="/app/dashboard" component={Dashboard} />
                  <PrivateRoute path="/app/engagements">
                    <ModalVisibilityProvider>
                      <Switch>
                        <Redirect
                          exact
                          from="/app/engagements"
                          to="/app/engagements/all"
                        />
                        <PrivateRoute path="/app/engagements/all">
                          <EngagementListRoute title="All Engagements"
                                               subtitle="All available engagements in the system. Including upcoming, active and past ones."/>
                        </PrivateRoute>
                        <PrivateRoute path="/app/engagements/upcoming">
                          <EngagementListRoute
                            filterDefinition={{
                              allowedStatuses: [EngagementStatus.upcoming],
                            }}
                            title="Upcoming Engagements"
                            subtitle="Upcoming engagements in the future. The ones that have not been launched yet. "
                          />
                        </PrivateRoute>
                        <PrivateRoute path="/app/engagements/active">
                          <EngagementListRoute
                            filterDefinition={{
                              allowedStatuses: [EngagementStatus.active],
                            }}
                            title="Active Engagements"
                            subtitle="Engagements that are already in progress and running at the moment."
                          />
                        </PrivateRoute>
                        <PrivateRoute path="/app/engagements/past">
                          <EngagementListRoute
                            filterDefinition={{
                              allowedStatuses: [EngagementStatus.past],
                            }}
                            title="Past Engagements"
                            subtitle="Engagements that are finished, closed or archived."
                          />
                        </PrivateRoute>
                        <PrivateRoute path="/app/engagements/new">
                          <CreateNewEngagement />
                        </PrivateRoute>
                        <PrivateRoute
                          path="/app/engagements/:customer_name/:project_name"
                          component={EngagementDetailView}
                        />
                      </Switch>
                    </ModalVisibilityProvider>
                  </PrivateRoute>
                  <PrivateRoute exact path="/app/about">
                    <About />
                  </PrivateRoute>
                </Switch>
              </Feature>
            </PrivateRoute>
          </Switch>
        </MainTemplate>
      </PrivateRoute>
    </Switch>
  );
}

export const OMPRouter = React.memo(_OMPRouter);
