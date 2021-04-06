import { TachometerAltIcon } from '@patternfly/react-icons';
import React, { useEffect } from 'react';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../../context/engagement_collection_context/engagement_collection_context';
import { useServiceProviders } from '../../../context/service_provider_context/service_provider_context';
import { DashboardDataCard } from '../../dashboard_data_cards/dashboard_data_card';
import { DateFilter } from '../../../routes/dashboard';
import { Engagement } from '../../../schemas/engagement';

export interface AllEngagementsWidgetProps {
  dates: DateFilter;
  regions: string[];
}
const include: Array<keyof Engagement> = ['customer_name'];

export const AllEngagementsWidget = (props: AllEngagementsWidgetProps) => {
  const { dates, regions } = props;
  const { engagementService } = useServiceProviders();
  const filter: EngagementCollectionFilter = {
    include,
    endDate: dates?.endDate,
    startDate: dates?.startDate,
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
      icon={TachometerAltIcon}
      numberOfEngagements={engagements.length}
      title={'All Engagements'}
      subtitle={
        'All available engagements in the system. Including upcoming, active and past ones'
      }
      url={'/app/engagements/all'}
    />
  );
};
