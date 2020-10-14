import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/auth_context/auth_context';
import { VersionProvider } from './context/version_context/version_context';
import { EngagementProvider } from './context/engagement_context/engagement_context';
import { ErrorBoundary } from './components/error_boundary/error_boundary';
import { LodestarRouter } from './routes/router';
import { FeatureToggles } from './context/feature_context/feature_toggles';
import {
  ServiceProvider,
  ServiceProviderContext,
} from './context/service_provider_context/service_provider_context';
import {
  FeedbackContext,
  FeedbackProvider,
} from './context/feedback_context/feedback_context';
import {
  AnalyticsProvider,
  AnalyticsContext,
} from './context/analytics_context/analytics_context';
import { NotificationProvider } from './context/notification_context/notification_context';
import { useConfig } from './context/config_context/config_hook';
import {
  createApiV1Services,
  createFakedServices,
} from './services/factories/service_factory';
import CustomGlobalBanner from './components/custom_global_banner/custom_global_banner';
import { Config } from './schemas/config';
import { NavigationAnalytics } from './components/navigation_analytics/navigation_analytics';

export const App = ({ config }: { config: Config }) => {
  const serviceProviders =
    process.env.REACT_APP_USE_FAKED === 'true'
      ? createFakedServices({ shouldUseStaticData: false })
      : createApiV1Services(config);

  const { appConfig } = useConfig();

  return (
    <ErrorBoundary>
      <ServiceProvider serviceFactory={serviceProviders}>
        <ServiceProviderContext.Consumer>
          {({
            authService,
            notificationService,
            versionService,
            engagementService,
            categoryService,
            analyticsService,
          }) => {
            return (
              <AnalyticsProvider analyticsService={analyticsService}>
                <>
                  {appConfig?.bannerMessages?.map(message => {
                    return (
                      <CustomGlobalBanner
                        color={message.backgroundcolor}
                        message={message.message}
                      />
                    );
                  })}
                  <AnalyticsContext.Consumer>
                    {analyticsContext => (
                      <FeedbackProvider>
                        <AuthProvider
                          authService={authService}
                          analyticsContext={analyticsContext}
                        >
                          <NotificationProvider
                            notificationService={notificationService}
                          >
                            <VersionProvider versionService={versionService}>
                              <FeatureToggles>
                                <Router>
                                  <FeedbackContext.Consumer>
                                    {feedbackContext => (
                                      <EngagementProvider
                                        feedbackContext={feedbackContext}
                                        engagementService={engagementService}
                                        categoryService={categoryService}
                                      >
                                        <NavigationAnalytics>
                                          <LodestarRouter />
                                        </NavigationAnalytics>
                                      </EngagementProvider>
                                    )}
                                  </FeedbackContext.Consumer>
                                </Router>
                              </FeatureToggles>
                            </VersionProvider>
                          </NotificationProvider>
                        </AuthProvider>
                      </FeedbackProvider>
                    )}
                  </AnalyticsContext.Consumer>
                </>
              </AnalyticsProvider>
            );
          }}
        </ServiceProviderContext.Consumer>
      </ServiceProvider>
    </ErrorBoundary>
  );
};
