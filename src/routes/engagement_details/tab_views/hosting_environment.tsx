import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { OpenshiftClusterSummaryCard } from '../../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';

export interface HostingEnvironmentTabProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
}

export function HostingEnvironmentTab({
  engagement,
  onChange,
  formOptions,
  onSave,
}: HostingEnvironmentTabProps) {
  return (
    <TextContent>
      <Grid hasGutter>
        <GridItem span={12}>
          <OpenshiftClusterSummaryCard
            onSave={onSave}
            formOptions={formOptions}
            onChange={onChange}
            engagement={engagement}
          />
        </GridItem>
      </Grid>
    </TextContent>
  );
}
