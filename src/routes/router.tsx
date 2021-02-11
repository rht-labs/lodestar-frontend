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
import { EngagementDetailView } from './engagement_details/engagement_details';
import { ModalVisibilityProvider } from '../context/edit_modal_visibility_context/edit_modal_visibility_context';
import { useNotification } from '../context/notification_context/notification_hook';
import { EngagementStatus } from '../schemas/engagement';
import { Feedback } from '../components/omp_feedback/omp_feedback';
import { ErrorBoundary } from '../components/error_boundary/error_boundary';
import { useSession } from '../context/auth_context/auth_context';
import ScrollToTop from './scroll_to_top';
import {
  EngagementConfigContext,
  EngagementConfigProvider,
} from '../context/engagement_config_context/engagement_config_context';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';
import { useFeedback } from '../context/feedback_context/feedback_context';
import { EngagementProvider } from '../context/engagement_context/engagement_context';

function WhatsMyToken() {
  const { sessionData } = useSession();
  return <pre>{sessionData?.tokens?.accessToken}</pre>;
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
        <CombinedEngagementWrapper>
          <MainTemplate>
            <ErrorBoundary>
              <>
                <Feedback />
                <Switch>
                  {/* all other routes should be considered private */}
                  <PrivateRoute path="/">
                    <Feature
                      name={'writer'}
                      inactiveComponent={UnauthorizedPage}
                    >
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
                                    allowedStatuses: [
                                      EngagementStatus.upcoming,
                                    ],
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
                                    allowedStatuses: [EngagementStatus.past, EngagementStatus.terminating],
                                  }}
                                  title="Engagements"
                                />
                              </PrivateRoute>
                              <PrivateRoute path="/app/engagements/new">
                                <CreateNewEngagement />
                              </PrivateRoute>
                              <PrivateRoute
                                path="/app/engagements/:customer_name/:project_name/"
                                component={() => (
                                  <ScrollToTop>
                                    <EngagementDetailView />
                                  </ScrollToTop>
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
        </CombinedEngagementWrapper>
      </PrivateRoute>
    </Switch>
  );
}

const CombinedEngagementWrapper = ({ children }) => {
  const { engagementService, categoryService } = useServiceProviders();
  const feedbackContext = useFeedback();
  const authContext = useSession();
  return (
    <EngagementConfigProvider engagementService={engagementService}>
      <EngagementConfigContext.Consumer>
        {config => {
          if (!config) {
            return null;
          }
          return (
            <EngagementProvider
              engagementFormConfig={config}
              authContext={authContext}
              feedbackContext={feedbackContext}
              engagementService={engagementService}
              categoryService={categoryService}
            >
              {children}
            </EngagementProvider>
          );
        }}
      </EngagementConfigContext.Consumer>
    </EngagementConfigProvider>
  );
};
