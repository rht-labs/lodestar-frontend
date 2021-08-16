import React, { useEffect } from 'react';
import { useServiceProviders } from '../../../context/service_provider_context/service_provider_context';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../../hooks/engagement_collection_hook';
import { Engagement } from '../../../schemas/engagement';

export interface RequiresEngagementCollection {
  engagements: Partial<Engagement>[];
}
export interface EngagementQueryMediatorProps {
  filter: EngagementCollectionFilter;
  component: React.FunctionComponent<{ engagements: Partial<Engagement>[] }>;
}
export const EngagementQueryMediator = (
  props: EngagementQueryMediatorProps
) => {
  const { engagementService } = useServiceProviders();
  const { filter: propsFilter, component: Component } = props;
  const { engagements = [], getEngagements } = useEngagementCollection({
    engagementService,
  });
  useEffect(() => {
    const filter: EngagementCollectionFilter = {
      startDate: propsFilter?.startDate,
      endDate: propsFilter?.endDate,
      engagementRegions: propsFilter?.engagementRegions,
      perPage: propsFilter?.perPage,
      pageNumber: propsFilter?.pageNumber,
      sortField: propsFilter?.sortField,
      sortOrder: propsFilter?.sortOrder,
      include: propsFilter?.include,
      exclude: propsFilter?.exclude,
    };
    getEngagements(filter);
  }, [
    propsFilter?.endDate,
    propsFilter?.perPage,
    propsFilter?.pageNumber,
    propsFilter?.startDate,
    propsFilter?.sortField,
    propsFilter?.include,
    propsFilter?.exclude,
    propsFilter?.sortOrder,
    getEngagements,
    propsFilter?.engagementRegions,
  ]);
  return <Component engagements={engagements} />;
};
