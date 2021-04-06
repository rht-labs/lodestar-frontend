import React, { useEffect } from 'react';
import { PendingIcon } from '@patternfly/react-icons';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../../context/engagement_collection_context/engagement_collection_context';
import { useServiceProviders } from '../../../context/service_provider_context/service_provider_context';
import { DashboardDataCard } from '../../dashboard_data_cards/dashboard_data_card';
import { DateFilter } from '../../../routes/dashboard';
import { Engagement, EngagementStatus } from '../../../schemas/engagement';

export interface UpcomingEngagementsWidgetProps {
  dates: DateFilter;
  regions: string[];
}
const statuses = [EngagementStatus.upcoming];
const include: Array<keyof Engagement> = ['customer_name'];

export const UpcomingEngagementsWidget = (
  props: UpcomingEngagementsWidgetProps
) => {
  const { dates, regions } = props;
  const { engagementService } = useServiceProviders();
  const filter: EngagementCollectionFilter = {
    include,
    endDate: dates?.endDate,
    startDate: dates?.startDate,
    engagementStatuses: statuses,
    engagementRegions: regions,
  };
  const { engagements = [], getEngagements } = useEngagementCollection({
    engagementService,
    filter,
  });
  useEffect(() => {
    getEngagements();
  }, [getEngagements]);
  return (
    <DashboardDataCard
      icon={PendingIcon}
      numberOfEngagements={engagements.length}
      title={'Upcoming Engagements'}
      subtitle={'Upcoming engagements in the future, and are not launched yet.'}
      url={'/app/engagements/upcoming'}
    />
  );
};
