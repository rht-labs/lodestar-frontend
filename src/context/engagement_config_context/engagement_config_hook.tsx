import { useCallback, useEffect, useState } from 'react';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { EngagementService } from '../../services/engagement_service/engagement_service';
export const useEngagementFormConfig = (
  engagementService: EngagementService
) => {
  const [engagementFormConfig, setEngagementFormConfig] = useState<
    EngagementFormConfig
  >(null);

  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const fetchEngagementFormConfig = useCallback(
    (engagementType: string) => {
      engagementService.getConfig(engagementType).then(setEngagementFormConfig);
    },
    [engagementService]
  );

  useEffect(() => {
    if (!engagementFormConfig && !hasFetched) {
      setHasFetched(true);
      engagementService.getConfig().then(setEngagementFormConfig);
    }
  }, [
    hasFetched,
    setHasFetched,
    engagementFormConfig,
    setEngagementFormConfig,
    engagementService,
  ]);
  return {
    engagementFormConfig,
    fetchEngagementFormConfig,
  };
};
