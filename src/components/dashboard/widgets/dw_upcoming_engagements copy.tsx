import React, { useEffect } from 'react';
import { PendingIcon } from '@patternfly/react-icons';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../../context/engagement_collection_context/engagement_collection_context';
import { useServiceProviders } from '../../../context/service_provider_context/service_provider_context';
import { DashboardDataCard } from '../../dashboard_data_cards/dashboard_data_card';
import { DateFilter } from '../../../routes/dashboard';
import { EngagementStatus } from '../../../schemas/engagement';

export interface UpcomingEngagementsWidgetProps {
  dates: DateFilter;
}

export const UpcomingEngagementsWidget = (
  props: UpcomingEngagementsWidgetProps
) => {
  const { dates } = props;
  const { engagementService } = useServiceProviders();
  const filter: EngagementCollectionFilter = {
    include: ['customer_name'],
    endDate: dates?.endDate,
    startDate: dates?.startDate,
    engagementStatus: EngagementStatus.upcoming,
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
