import React from 'react';

import '@patternfly/react-core/dist/styles/base.css';

import { AuthProvider } from '../context/auth_context/auth_context';
import { VersionProvider } from '../context/version_context/version_context';
import {
  EngagementContext,
  EngagementProvider,
} from '../context/engagement_context/engagement_context';
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
import { EngagementFormProvider } from '../context/engagement_form_context/engagement_form_context';

export const TestStateWrapper = ({ children = null }) => {
  return (
    <ServiceProvider
      serviceFactory={createFakedServices({ shouldUseStaticData: true })}
    >
      <TestContexts>{children}</TestContexts>
    </ServiceProvider>
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
