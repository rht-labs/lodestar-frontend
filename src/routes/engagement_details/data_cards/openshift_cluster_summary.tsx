import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { DataCard } from '../../../components/data_card/data_card';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../../components/titled_data_point/titled_data_point';

export function OpenshiftClusterSummaryCard({
  engagement,
}: {
  engagement: Engagement;
}) {
  return (
    <DataCard title="Openshift Information">
      <Grid hasGutter>
        <GridItem span={3}>
          <TitledDataPoint title="Cloud Provider">
            {engagement.ocp_cloud_provider_name}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={3}>
          <TitledDataPoint title="Openshift Version">
            {engagement.ocp_version}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={3}>
          <TitledDataPoint title="Storage Size">
            {engagement.ocp_persistent_storage_size}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={3}>
          <TitledDataPoint title="Cloud Region">
            {engagement.ocp_cloud_provider_region}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={3}>
          <TitledDataPoint title="Cloud Provider">
            {engagement.ocp_cluster_size}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={3}>
          <TitledDataPoint title="Subdomain">
            {engagement.ocp_sub_domain}
          </TitledDataPoint>
        </GridItem>
      </Grid>
    </DataCard>
  );
}
