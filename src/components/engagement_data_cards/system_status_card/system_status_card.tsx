import React from 'react';
import {DataCard} from '../data_card';
import {Engagement} from '../../../schemas/engagement_schema';
import {Button, ButtonVariant, Grid, GridItem} from '@patternfly/react-core';
import {CheckCircleIcon, ExclamationTriangleIcon} from "@patternfly/react-icons";

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
          <GridItem span={2}>
            <ExclamationTriangleIcon color="#EC7A08"/>
            Atlassian
          </GridItem>
          <GridItem span={2}>
            <CheckCircleIcon color="green"/>
            IBM Cloud
          </GridItem>
          <GridItem span={2}>
            <ExclamationTriangleIcon color="#EC7A08"/>
            Mural
          </GridItem>
          <GridItem span={2}>
            <ExclamationTriangleIcon color="#C9190B"/>
            Red Hat SSO
          </GridItem>
          <GridItem span={2}>
            <ExclamationTriangleIcon color="#EC7A08"/>
            Openshift Cluster
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}
