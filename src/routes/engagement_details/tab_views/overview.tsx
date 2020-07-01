import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { EngagementSummaryCard } from '../../../components/engagement_data_cards/engagement_summary_card/engagement_summary_card';
import { PointOfContactCard } from '../../../components/engagement_data_cards/point_of_contact_card/point_of_contact_card';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { OpenShiftClusterSummaryCard } from '../../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';
import { UserCard } from '../../../components/engagement_data_cards/user_card/user_card';
import { ActivityHistoryCard } from '../../../components/engagement_data_cards/activity_history_card/activity_history_card';
import { SystemStatusCard } from '../../../components/engagement_data_cards/system_status_card/system_status_card';
export interface EngagementOverviewTabProps {
  activeEngagement: Engagement;
  engagementFormState: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
}

export function EngagementOverviewTab({
  activeEngagement,
  engagementFormState,
  missingRequiredFields,
  formOptions,
  onChange,
  onSave,
}: EngagementOverviewTabProps) {
  return (
    <TextContent>
      <Grid hasGutter>
        <GridItem span={12}>
          <EngagementSummaryCard
            engagementFormState={engagementFormState}
            activeEngagement={activeEngagement}
            onSave={onSave}
            onChange={onChange}
            formOptions={formOptions}
            missingRequiredFields={missingRequiredFields}
          />
        </GridItem>
        <GridItem span={12}>
          <SystemStatusCard activeEngagement={engagementFormState} />
        </GridItem>
        <GridItem span={12}>
          <PointOfContactCard
            onSave={onSave}
            onChange={onChange}
            formOptions={formOptions}
            activeEngagement={activeEngagement}
            engagementFormState={engagementFormState}
            missingRequiredFields={missingRequiredFields}
          />
        </GridItem>
        <GridItem span={12}>
          <OpenShiftClusterSummaryCard
            onSave={onSave}
            onChange={onChange}
            formOptions={formOptions}
            activeEngagement={engagementFormState}
            engagementFormState={engagementFormState}
            missingRequiredFields={missingRequiredFields}
          />
        </GridItem>
        <GridItem span={12}>
          <UserCard
            onSave={onSave}
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagementFormState}
          />
        </GridItem>
        <GridItem span={12}>
          <ActivityHistoryCard engagement={engagementFormState} />
        </GridItem>
      </Grid>
    </TextContent>
  );
}
