import React from 'react';
import {DataCard} from '../data_card';
import {Engagement} from '../../../schemas/engagement_schema';
import {Button, ButtonVariant, Grid, GridItem} from '@patternfly/react-core';
import {SubsystemDetails} from "./subsystem_details";

export interface SystemStatusCardProps {
  engagement: Engagement;
}

export function SystemStatusCard({engagement}: SystemStatusCardProps) {
  return (
    <>
      <DataCard
        actionButton={() => (
          <Button
            variant={ButtonVariant.link}
          >
            Edit
          </Button>
        )}
        title="System Status"
      >
        <Grid hasGutter>
          {engagement?.status?.subsystems.map( subsystem => (
            <GridItem span={2}>
              <SubsystemDetails
                title={subsystem.name}
                status={subsystem.status}
              />
            </GridItem>
          ))}
        </Grid>
      </DataCard>
    </>
  );
}