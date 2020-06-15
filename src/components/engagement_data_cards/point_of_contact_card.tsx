import React from 'react';
import { DataCard } from './data_card';
import { Engagement } from '../../schemas/engagement_schema';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../titled_data_point/titled_data_point';

export function PointOfContactCard({ engagement }: { engagement: Engagement }) {
  return (
    <DataCard title="Points of Contact">
      <Grid hasGutter>
        <GridItem span={6}>
          <TitledDataPoint title="Engagement Lead">
            {engagement?.engagement_lead_name}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={6}>
          <TitledDataPoint title="Technical Lead">
            {engagement?.technical_lead_name}
          </TitledDataPoint>
        </GridItem>
        <GridItem span={6}>
          <TitledDataPoint title="Customer Contact">
            {engagement?.customer_contact_name}
          </TitledDataPoint>
        </GridItem>
      </Grid>
    </DataCard>
  );
}
