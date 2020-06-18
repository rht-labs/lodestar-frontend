import React from 'react';
import { DataCard } from './data_card';
import { Engagement } from '../../schemas/engagement_schema';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../titled_data_point/titled_data_point';
import { format } from 'date-fns';
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
            {engagement?.start_date
              ? (engagement?.start_date).toDateString()
              : null}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={6}>
          <TitledDataPoint title="End Date">
            {engagement?.end_date
              ? (engagement?.end_date).toDateString()
              : null}
          </TitledDataPoint>
        </GridItem>
      </Grid>
    </DataCard>
  );
}
