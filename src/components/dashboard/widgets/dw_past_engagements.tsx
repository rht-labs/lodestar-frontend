import { AsleepIcon } from '@patternfly/react-icons';
import React, { useEffect } from 'react';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../../context/engagement_collection_context/engagement_collection_context';
import { useServiceProviders } from '../../../context/service_provider_context/service_provider_context';
import { DashboardDataCard } from '../../dashboard_data_cards/dashboard_data_card';
import { DateFilter } from '../../../routes/dashboard';
import { EngagementStatus } from '../../../schemas/engagement';

export interface PastEngagementsWidgetProps {
  dates: DateFilter;
}

export const PastEngagementsWidget = (props: PastEngagementsWidgetProps) => {
  const { dates } = props;
  const { engagementService } = useServiceProviders();
  const filter: EngagementCollectionFilter = {
    include: ['customer_name'],
    endDate: dates?.endDate,
    startDate: dates?.startDate,
    engagementStatus: EngagementStatus.past,
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
