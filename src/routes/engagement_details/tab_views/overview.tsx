import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { EngagementSummaryCard } from '../../../components/engagement_data_cards/engagement_summary_card/engagement_summary_card';
import { PointOfContactCard } from '../../../components/engagement_data_cards/point_of_contact_card/point_of_contact_card';
import { OpenshiftClusterSummaryCard } from '../../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';
import { EngagementFormConfig } from '../../../schemas/engagement_config';

export interface EngagementOverviewTabProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
}

export function EngagementOverviewTab({
  engagement,
  formOptions,
  onChange,
}: EngagementOverviewTabProps) {
  return (
    <TextContent>
      <div>
        <Grid hasGutter>
          <GridItem span={8}>
            <EngagementSummaryCard
              onChange={onChange}
              formOptions={formOptions}
              engagement={engagement}
            />
          </GridItem>
          <GridItem span={4}>
            <PointOfContactCard
              onChange={onChange}
              formOptions={formOptions}
              engagement={engagement}
            />
          </GridItem>
          <GridItem span={12}>
            <OpenshiftClusterSummaryCard
              formOptions={formOptions}
              onChange={onChange}
              engagement={engagement}
            />
          </GridItem>
        </Grid>
      </div>
    </TextContent>
  );
}
