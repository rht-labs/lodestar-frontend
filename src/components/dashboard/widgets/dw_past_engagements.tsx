import { AsleepIcon } from '@patternfly/react-icons';
import React, { useEffect } from 'react';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../../context/engagement_collection_context/engagement_collection_context';
import { useServiceProviders } from '../../../context/service_provider_context/service_provider_context';
import { DashboardDataCard } from '../../dashboard_data_cards/dashboard_data_card';
import { DateFilter } from '../../../routes/dashboard';
import { Engagement, EngagementStatus } from '../../../schemas/engagement';

export interface PastEngagementsWidgetProps {
  dates: DateFilter;
  regions: string[];
}
const statuses = [EngagementStatus.past];
const include: Array<keyof Engagement> = ['customer_name'];

export const PastEngagementsWidget = (props: PastEngagementsWidgetProps) => {
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
      icon={AsleepIcon}
      numberOfEngagements={engagements.length}
      title={'Past Engagements'}
      subtitle={'Engagements that are finished, closed or archived.'}
      url={'/app/engagements/past'}
    />
  );
};
