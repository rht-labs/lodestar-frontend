import React from 'react';

import '@patternfly/react-core/dist/styles/base.css';

import { AuthProvider } from '../context/auth_context/auth_context';
import { VersionProvider } from '../context/version_context/version_context';
import { EngagementProvider } from '../context/engagement_context/engagement_context';
import { FeatureToggles } from '../context/feature_toggles/feature_toggles';
import {
  ServiceProvider,
  useServiceProviders,
} from '../context/service_provider_context/service_provider_context';
import { FeedbackProvider } from '../context/feedback_context/feedback_context';

export const TestStateWrapper = ({ children = null }) => {
  return (
    <ServiceProvider shouldUseFaked={true}>
      <TestContexts>{children}</TestContexts>
    </ServiceProvider>
  );
};

function TestContexts({ children = null }) {
  const {
    authenticationService,
    engagementService,
    versionService,
  } = useServiceProviders();
  return (
    <FeedbackProvider>
      <AuthProvider authenticationService={authenticationService}>
        <EngagementProvider engagementService={engagementService}>
          <VersionProvider versionService={versionService}>
            <FeatureToggles>{children}</FeatureToggles>
          </VersionProvider>
        </EngagementProvider>
      </AuthProvider>
    </FeedbackProvider>
  );
}
