import React from 'react';
import { useAnalytics } from '../../context/analytics_context/analytics_context';
import { useSession } from '../../context/auth_context/auth_context';
import { useEngagementFormConfig } from '../../context/engagement_config_context/engagement_config_hook';
import { EngagementProvider } from '../../context/engagement_context/engagement_context';
import { useFeedback } from '../../context/feedback_context/feedback_context';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
import ScrollToTop from '../scroll_to_top';
import { EngagementDetailView } from './engagement_details';

export const EngagementRoute = () => {
  const { engagementService, categoryService } = useServiceProviders();
  const feedback = useFeedback();
  const analyticsContext = useAnalytics();
  const authContext = useSession();
  const { engagementFormConfig } = useEngagementFormConfig(engagementService);
  return (
    <EngagementProvider
      authContext={authContext}
      feedbackContext={feedback}
      analyticsContext={analyticsContext}
      categoryService={categoryService}
      engagementService={engagementService}
      engagementFormConfig={engagementFormConfig}
    >
      <ScrollToTop>
        <EngagementDetailView />
      </ScrollToTop>
    </EngagementProvider>
  );
};
