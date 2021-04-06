import React from 'react';

import '@patternfly/react-core/dist/styles/base.css';

import { AuthProvider } from '../context/auth_context/auth_context';
import { VersionProvider } from '../context/version_context/version_context';
import { EngagementProvider } from '../context/engagement_context/engagement_context';
import { FeatureToggles } from '../context/feature_context/feature_toggles';
import {
  ServiceProvider,
  useServiceProviders,
} from '../context/service_provider_context/service_provider_context';
import {
  FeedbackContext,
  FeedbackProvider,
} from '../context/feedback_context/feedback_context';
import { AnalyticsProvider } from '../context/analytics_context/analytics_context';
import { createFakedServices } from '../services/factories/service_factory';
import { MemoryRouter } from 'react-router';
import { EngagementFormConfig } from '../schemas/engagement_config';

export const TestStateWrapper = ({ children = null }) => {
  return (
    <MemoryRouter>
      <ServiceProvider
        serviceFactory={createFakedServices({ shouldUseStaticData: true })}
      >
        <TestContexts>{children}</TestContexts>
      </ServiceProvider>
    </MemoryRouter>
  );
};

function TestContexts({ children = null }) {
  const {
    authService,
    engagementService,
    versionService,
    categoryService,
    analyticsService,
  } = useServiceProviders();
  return (
    <AnalyticsProvider analyticsService={analyticsService}>
      <FeedbackProvider>
        <FeedbackContext.Consumer>
          {feedbackContext => (
            <AuthProvider authService={authService}>
              <EngagementProvider
                engagementFormConfig={EngagementFormConfig.fromFake()}
                categoryService={categoryService}
                feedbackContext={feedbackContext}
                engagementService={engagementService}
              >
                <VersionProvider versionService={versionService}>
                  <FeatureToggles>{children}</FeatureToggles>
                </VersionProvider>
              </EngagementProvider>
            </AuthProvider>
          )}
        </FeedbackContext.Consumer>
      </FeedbackProvider>
    </AnalyticsProvider>
  );
}
