import { useState } from 'react';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useServiceProviders } from '../service_provider_context/service_provider_context';

export const useEngagementConfig = () => {
  const { engagementService } = useServiceProviders();
  const [engagementFormConfig, setEngagementFormConfig] = useState<
    EngagementFormConfig
  >();

  const _getEngagementFormConfig = async () => {
    if (!engagementFormConfig) {
      setEngagementFormConfig(await engagementService.getConfig());
    }

    return engagementFormConfig;
  };

  return { engagementFormConfig: _getEngagementFormConfig() };
};
