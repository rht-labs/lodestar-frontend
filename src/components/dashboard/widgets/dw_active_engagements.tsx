import React, { useEffect } from 'react';
import { OnRunningIcon } from '@patternfly/react-icons';
import { useServiceProviders } from '../../../context/service_provider_context/service_provider_context';
import { DashboardDataCard } from '../../dashboard/widgets/dashboard_data_card';
import { DateFilter } from '../../../routes/dashboard';
import { Engagement, EngagementStatus } from '../../../schemas/engagement';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../../hooks/engagement_collection_hook';

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
  const { engagements = [], getEngagements } = useEngagementCollection({
    engagementService,
  });
  useEffect(() => {
    const filter: EngagementCollectionFilter = {
      endDate: dates?.endDate,
      engagementStatuses: statuses,
      startDate: dates?.startDate,
      engagementRegions: regions,
      include,
    };
    getEngagements(filter);
  }, [getEngagements, dates?.endDate, dates?.startDate, regions]);
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
