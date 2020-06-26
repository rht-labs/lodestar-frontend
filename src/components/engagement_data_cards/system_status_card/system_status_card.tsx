import React from 'react';
import {DataCard} from '../data_card';
import {Button, ButtonVariant, Grid, GridItem} from '@patternfly/react-core';
import {SubsystemDetails} from "./subsystem_details";
import {useEngagements} from "../../../context/engagement_context/engagement_hook";

export function SystemStatusCard() {
  const { activeEngagement } = useEngagements();
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
          {activeEngagement?.status?.subsystems.map( subsystem => (
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