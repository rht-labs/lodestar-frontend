import { useContext, useEffect } from 'react';

import { EngagementContext } from './engagement_context';
export interface EngagementHookUuid {
  uuid: string;
}
export interface EngagementHookProjectCustomerName {
  uuid?: string;
}
export const useEngagement = (
  params: EngagementHookProjectCustomerName = {}
) => {
  const engagementContext = useContext(EngagementContext);
  const { getEngagement, setCurrentEngagement } = engagementContext;
  const { uuid } = params;
  useEffect(() => {
    if (!uuid) {
      return;
    }
    getEngagement(uuid).then(engagement => {
      if (engagement) {
        setCurrentEngagement(engagement);
      }
    });
  }, [getEngagement, setCurrentEngagement, uuid]);

  return engagementContext;
};
