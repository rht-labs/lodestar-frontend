import React from 'react';
import { useAnalytics } from '../../context/analytics_context/analytics_context';
import { useEngagementFormConfig } from '../../context/engagement_config_context/engagement_config_hook';
import { EngagementProvider } from '../../context/engagement_context/engagement_context';
import { useFeedback } from '../../context/feedback_context/feedback_context';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';

export const EngagementRoute = ({ children }) => {
  const { engagementService, categoryService } = useServiceProviders();
  const feedback = useFeedback();
  const analyticsContext = useAnalytics();
  const {
    engagementFormConfig,
    fetchEngagementFormConfig,
  } = useEngagementFormConfig(engagementService);
  return (
    <EngagementProvider
      fetchEngagementFormConfig={fetchEngagementFormConfig}
      feedbackContext={feedback}
      analyticsContext={analyticsContext}
      categoryService={categoryService}
      engagementService={engagementService}
      engagementFormConfig={engagementFormConfig}
    >
      {children}
    </EngagementProvider>
  );
};
