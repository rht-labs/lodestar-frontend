import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { OpenShiftClusterSummaryCard } from '../../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';

export interface HostingEnvironmentTabProps {
  currentEngagement: Engagement;
  currentEngagementChanges: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
}

export function HostingEnvironmentTab({
  currentEngagementChanges,
  currentEngagement,
  onChange,
  formOptions,
  onSave,
  missingRequiredFields,
}: HostingEnvironmentTabProps) {
  return (
    <TextContent>
      <Grid hasGutter>
        <GridItem span={12}>
          <OpenShiftClusterSummaryCard
            onSave={onSave}
            formOptions={formOptions}
            onChange={onChange}
            currentEngagement={currentEngagement}
            currentEngagementChanges={currentEngagementChanges}
            missingRequiredFields={missingRequiredFields}
          />
        </GridItem>
      </Grid>
    </TextContent>
  );
}
