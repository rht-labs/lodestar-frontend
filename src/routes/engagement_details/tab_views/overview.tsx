import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { EngagementSummaryCard } from '../../../components/engagement_data_cards/engagement_summary_card/engagement_summary_card';
import { PointOfContactCard } from '../../../components/engagement_data_cards/point_of_contact_card/point_of_contact_card';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { OpenShiftClusterSummaryCard } from '../../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';
import { UserCard } from '../../../components/engagement_data_cards/user_card/user_card';
import { GitHistoryCard } from '../../../components/engagement_data_cards/git_history_card/git_history_card';
export interface EngagementOverviewTabProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
}

export function EngagementOverviewTab({
  engagement,
  formOptions,
  onChange,
  onSave,
}: EngagementOverviewTabProps) {
  return (
    <TextContent>
      <Grid hasGutter>
        <GridItem span={12}>
          <EngagementSummaryCard
            onSave={onSave}
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagement}
          />
        </GridItem>
        <GridItem span={12}>
          <GitHistoryCard engagement={engagement} />
        </GridItem>
        <GridItem span={12}>
          <PointOfContactCard
            onSave={onSave}
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagement}
          />
        </GridItem>
        <GridItem span={12}>
          <OpenShiftClusterSummaryCard
            onSave={onSave}
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagement}
          />
        </GridItem>
        <GridItem span={12}>
          <UserCard
            onSave={onSave}
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagement}
          />
        </GridItem>
      </Grid>
    </TextContent>
  );
}
