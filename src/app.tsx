import React, { useContext } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { AuthProvider, useSession } from './context/auth_context/auth_context';
import {
  VersionContext,
  VersionProvider,
} from './context/version_context/version_context';
import { ErrorBoundary } from './components/error_boundary/error_boundary';
import { LodestarRouter } from './routes/router';
import { FeatureToggles } from './context/feature_context/feature_toggles';
import {
  ServiceProvider,
  ServiceProviderContext,
} from './context/service_provider_context/service_provider_context';
import { FeedbackProvider } from './context/feedback_context/feedback_context';
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
import {
  FEATURE_VERSION_MAP,
  getFeaturesFromVersion,
} from './common/version_feature_factory';

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
            analyticsService,
          }) => {
            return (
              <Router>
                <AnalyticsProvider analyticsService={analyticsService}>
                  <>
                    {appConfig?.bannerMessages?.map(message => {
                      return (
                        <CustomGlobalBanner
                          key={message.message}
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
                                <FeatureProvider>
                                  <NavigationAnalytics>
                                    <LodestarRouter />
                                  </NavigationAnalytics>
                                </FeatureProvider>
                              </VersionProvider>
                            </NotificationProvider>
                          </AuthProvider>
                        </FeedbackProvider>
                      )}
                    </AnalyticsContext.Consumer>
                  </>
                </AnalyticsProvider>
              </Router>
            );
          }}
        </ServiceProviderContext.Consumer>
      </ServiceProvider>
    </ErrorBoundary>
  );
};

const FeatureProvider = ({ children }) => {
  const location = useLocation();
  const versionContext = useContext(VersionContext);
  const { appConfig } = useConfig();
  let version = versionContext.versions?.mainVersion?.value;
  if (appConfig?.allowVersionOverride) {
    const query = qs.parse(location.search);
    const queryVersion = query['lodestar-version'];
    if (queryVersion) {
      version = Array.isArray(queryVersion) ? queryVersion[0] : queryVersion;
    }
  }
  const authContext = useSession();
  const providedFeatures = [
    ...(authContext.roles ?? []),
    ...getFeaturesFromVersion(version, FEATURE_VERSION_MAP),
  ];
  return (
    <FeatureToggles features={providedFeatures}>{children}</FeatureToggles>
  );
};
