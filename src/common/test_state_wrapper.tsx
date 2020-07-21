import React from 'react';

import '@patternfly/react-core/dist/styles/base.css';

import { AuthProvider } from '../context/auth_context/auth_context';
import { VersionProvider } from '../context/version_context/version_context';
import { EngagementProvider } from '../context/engagement_context/engagement_context';
import { FeatureToggles } from '../context/feature_toggles/feature_toggles';
import { ServiceProvider } from '../context/service_provider_context/service_provider_context';
import { FeedbackProvider } from '../context/feedback_context/feedback_context';

export const TestStateWrapper = ({ children = null }) => {
  return (
    <ServiceProvider shouldUseFaked={true}>
      <FeedbackProvider>
        <AuthProvider>
          <EngagementProvider>
            <VersionProvider>
              <FeatureToggles>{children}</FeatureToggles>
            </VersionProvider>
          </EngagementProvider>
        </AuthProvider>
      </FeedbackProvider>
    </ServiceProvider>
  );
};
