import { useState } from 'react';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useServiceProviders } from '../service_provider_context/service_provider_context';

export const useEngagementConfig = () => {
  const { engagementService } = useServiceProviders();
  const [engagementFormConfig, setEngagementFormConfig] = useState<
    EngagementFormConfig
  >();

  const _getEngagementFormConfig = () => {
    if (!engagementFormConfig) {
      engagementService
        .getConfig()
        .then(config => setEngagementFormConfig(config));
    }
    return engagementFormConfig;
  };

  return { engagementFormConfig: _getEngagementFormConfig() };
};
