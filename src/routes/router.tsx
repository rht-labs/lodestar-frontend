import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { FeatureRequest } from '../components/feature_request/feature_request';
import { PrivateRoute } from '../components/authentication/private_route';
import { CallbackHandler } from '../components/authentication/callback_handler';
import { Dashboard } from './dashboard';
import { About } from './about';
import { UnauthorizedPage } from './unauthorized';
import LogoutPage from './logout';
import { Feature } from '../components/feature/feature';
import { LandingPage } from './landing_page/landing_page';
import { MainTemplate } from '../layout/main_template';
import { CreateNewEngagement } from './create_new_engagement/create_new_engagement';
import { EngagementListRoute } from './engagement_list/engagement_list_route';
import { ModalVisibilityProvider } from '../context/edit_modal_visibility_context/edit_modal_visibility_context';
import { useNotification } from '../context/notification_context/notification_hook';
import { EngagementStatus } from '../schemas/engagement';
import { Feedback } from '../components/omp_feedback/omp_feedback';
import { ErrorBoundary } from '../components/error_boundary/error_boundary';
import { Token } from '../packages/api_v1_sdk/token';
import { EngagementRoute } from './engagement/engagement_route';
import ScrollToTop from './scroll_to_top';
import { EngagementDetailView } from './engagement/engagement_details';

function WhatsMyToken() {
  return <pre>{Token.token.accessToken}</pre>;
}

export function LodestarRouter() {
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
      <PrivateRoute path="/whatsmytoken" component={WhatsMyToken} />
      <PrivateRoute path="/app">
        <MainTemplate>
          <ErrorBoundary>
            <>
              <Feedback />
              <Switch>
                {/* all other routes should be considered private */}
                <PrivateRoute path="/">
                  <Feature name={'reader'} inactiveComponent={UnauthorizedPage}>
                    {/* if a user is not authorized, show the unauthorized page */}
                    <Switch>
                      {/* else, show an authorized route */}
                      <Redirect exact from="/app" to="/app/dashboard" />
                      <PrivateRoute
                        path="/app/whatsmytoken"
                        component={WhatsMyToken}
                      />
                      <Route
                        path="/app/requestfeature"
                        component={FeatureRequest}
                      />
                      <PrivateRoute
                        path="/app/dashboard"
                        component={Dashboard}
                      />
                      <PrivateRoute path="/app/engagements">
                        <ModalVisibilityProvider>
                          <Switch>
                            <Redirect
                              exact
                              from="/app/engagements"
                              to="/app/engagements/all"
                            />
                            <PrivateRoute path="/app/engagements/all">
                              <EngagementListRoute title="Engagements" />
                            </PrivateRoute>
                            <PrivateRoute path="/app/engagements/upcoming">
                              <EngagementListRoute
                                filterDefinition={{
                                  allowedStatuses: [EngagementStatus.upcoming],
                                }}
                                title="Engagements"
                              />
                            </PrivateRoute>
                            <PrivateRoute path="/app/engagements/active">
                              <EngagementListRoute
                                filterDefinition={{
                                  allowedStatuses: [EngagementStatus.active],
                                }}
                                title="Engagements"
                              />
                            </PrivateRoute>
                            <PrivateRoute path="/app/engagements/terminating">
                              <EngagementListRoute
                                filterDefinition={{
                                  allowedStatuses: [
                                    EngagementStatus.terminating,
                                  ],
                                }}
                                title="Engagements"
                              />
                            </PrivateRoute>
                            <PrivateRoute path="/app/engagements/past">
                              <EngagementListRoute
                                filterDefinition={{
                                  allowedStatuses: [
                                    EngagementStatus.past,
                                    EngagementStatus.terminating,
                                  ],
                                }}
                                title="Engagements"
                              />
                            </PrivateRoute>
                            <PrivateRoute path="/app/engagements/new">
                              <EngagementRoute>
                                <CreateNewEngagement />
                              </EngagementRoute>
                            </PrivateRoute>
                            <PrivateRoute
                              path="/app/engagements/:customer_name/:project_name/"
                              component={() => (
                                <EngagementRoute>
                                  <ScrollToTop>
                                    <EngagementDetailView />
                                  </ScrollToTop>
                                </EngagementRoute>
                              )}
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
            </>
          </ErrorBoundary>
        </MainTemplate>
      </PrivateRoute>
    </Switch>
  );
}
