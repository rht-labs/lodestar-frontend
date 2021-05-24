import { useContext, useEffect } from 'react';

import { EngagementContext } from './engagement_context';
export interface EngagementHookUuid {
  uuid: string;
}
export interface EngagementHookProjectCustomerName {
  projectName?: string;
  customerName?: string;
  uuid?: string;
}
export const useEngagement = (
  params: EngagementHookProjectCustomerName = {}
) => {
  const engagementContext = useContext(EngagementContext);
  const { getEngagement, setCurrentEngagement } = engagementContext;
  const { customerName, projectName, uuid } = params;
  useEffect(() => {
    if (!(!!customerName && !!projectName) && !uuid) {
      return;
    }
    getEngagement(customerName, projectName, uuid).then(engagement => {
      if (engagement) {
        setCurrentEngagement(engagement);
      } else {
      }
    });
  }, [customerName, projectName, getEngagement, setCurrentEngagement, uuid]);

  return engagementContext;
};
