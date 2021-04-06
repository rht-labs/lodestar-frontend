import React, { useEffect } from 'react';
import { OnRunningIcon } from '@patternfly/react-icons';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../../context/engagement_collection_context/engagement_collection_context';
import { useServiceProviders } from '../../../context/service_provider_context/service_provider_context';
import { DashboardDataCard } from '../../dashboard_data_cards/dashboard_data_card';
import { DateFilter } from '../../../routes/dashboard';
import { Engagement, EngagementStatus } from '../../../schemas/engagement';

export interface ActiveEngagementsWidgetProps {
  dates: DateFilter;
  regions: string[];
}
const include: Array<keyof Engagement> = ['customer_name'];
const statuses = [EngagementStatus.active];

export const ActiveEngagementsWidget = (
  props: ActiveEngagementsWidgetProps
) => {
  const { dates, regions } = props;
  const { engagementService } = useServiceProviders();
  const filter: EngagementCollectionFilter = {
    endDate: dates?.endDate,
    engagementStatuses: statuses,
    startDate: dates?.startDate,
    engagementRegions: regions,
    include,
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
      icon={OnRunningIcon}
      numberOfEngagements={engagements.length}
      title={'Active Engagements'}
      subtitle={
        'Engagements that are already in progress and running at the moment.'
      }
      url={'/app/engagements/active'}
    />
  );
};
