import { useContext, useEffect } from 'react';

import { EngagementContext } from './engagement_context';
export interface EngagementHookUuid {
  uuid: string;
}
export interface EngagementHookProjectCustomerName {
  projectName?: string;
  customerName?: string;
}
export const useEngagement = (
  params: EngagementHookProjectCustomerName = {}
) => {
  const engagementContext = useContext(EngagementContext);
  const { getEngagement, setCurrentEngagement } = engagementContext;
  const { customerName, projectName } = params;
  useEffect(() => {
    if (!customerName || !projectName) {
      return;
    }
    getEngagement(customerName, projectName).then(engagement => {
      if (engagement) {
        setCurrentEngagement(engagement);
      } else {
      }
    });
  }, [customerName, projectName, getEngagement, setCurrentEngagement]);

  return engagementContext;
};
