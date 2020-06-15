import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { EngagementSummaryCard } from '../../../components/engagement_data_cards/engagement_summary_card';
import { PointOfContactCard } from '../../../components/engagement_data_cards/point_of_contact_card';
import { OpenshiftClusterSummaryCard } from '../../../components/engagement_data_cards/openshift_cluster_summary';

export interface EngagementOverviewCardProps {
  engagement: Engagement;
}

export function EngagementOverview({
  engagement,
}: EngagementOverviewCardProps) {
  return (
    <TextContent>
      <div>
        <Grid hasGutter>
          <GridItem span={6}>
            <EngagementSummaryCard engagement={engagement} />
          </GridItem>
          <GridItem span={6}>
            <PointOfContactCard engagement={engagement} />
          </GridItem>
          <GridItem span={12}>
            <OpenshiftClusterSummaryCard engagement={engagement} />
          </GridItem>
        </Grid>
      </div>
    </TextContent>
  );
}
