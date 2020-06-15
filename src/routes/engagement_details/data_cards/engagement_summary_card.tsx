import React from 'react';
import { DataCard } from '../../../components/data_card/data_card';
import { Engagement } from '../../../schemas/engagement_schema';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../../components/titled_data_point/titled_data_point';

export function EngagementSummaryCard({
  engagement,
}: {
  engagement?: Engagement;
}) {
  return (
    <DataCard title="Engagement Summary">
      <Grid hasGutter>
        <GridItem span={6}>
          <TitledDataPoint title="Company">
            {engagement?.customer_name}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={6}>
          <TitledDataPoint title="Project">
            {engagement?.project_name}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={6}>
          <TitledDataPoint title="Start Date">
            {engagement?.start_date}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={6}>
          <TitledDataPoint title="End Date">
            {engagement?.end_date}
          </TitledDataPoint>
        </GridItem>
      </Grid>
    </DataCard>
  );
}
