import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Text,
  TextContent,
  TextVariants,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { PeopleEnabledChart } from './people_enabled_chart';

export function DashboardPeopleEnabledCard() {
  return (
    <Card isHoverable isCompact>
      <CardTitle>
        <TextContent>
          <Text component={TextVariants.h2}>People Enabled</Text>
        </TextContent>
      </CardTitle>
      <CardBody style={{ marginTop: '1rem' }}>
        <Grid hasGutter>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Total Enabled</Text>
              <Text component={TextVariants.h1} style={{ color: '#59ABE3' }}>
                38
              </Text>
            </TextContent>
          </GridItem>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Red Hatters</Text>
              <Text component={TextVariants.h1} style={{ color: '#a4c7a4' }}>
                10
              </Text>
            </TextContent>
          </GridItem>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Non Red Hatters</Text>
              <Text component={TextVariants.h1} style={{ color: '#4db445' }}>
                28
              </Text>
            </TextContent>
          </GridItem>
        </Grid>
        <PeopleEnabledChart />
      </CardBody>
    </Card>
  );
}
