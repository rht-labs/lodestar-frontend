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
  CardFooter,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { PeopleEnabledChart } from './people_enabled_chart';
import { Engagement } from '../../../schemas/engagement';

export interface PeopleEnabledCardProps {
  engagements?: Partial<Engagement>[];
}

export function DashboardPeopleEnabledCard(props: PeopleEnabledCardProps) {
  const { engagements = [] } = props;
  const emails = Object.keys(
    engagements.reduce(
      (prev, curr) => ({
        ...prev,
        ...curr.engagement_users?.reduce(
          (prev, curr) => ({ ...prev, [curr?.email]: true }),
          {}
        ),
      }),
      {}
    )
  );
  const redHatCount = emails.filter(e => e.toLowerCase().includes('redhat.com'))
    .length;

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
                {emails.length}
              </Text>
            </TextContent>
          </GridItem>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Red Hat</Text>
              <Text component={TextVariants.h1} style={{ color: '#a4c7a4' }}>
                {redHatCount}
              </Text>
            </TextContent>
          </GridItem>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Others</Text>
              <Text component={TextVariants.h1} style={{ color: '#4db445' }}>
                {emails.length - redHatCount}
              </Text>
            </TextContent>
          </GridItem>
        </Grid>
        <Flex
          style={{ width: '100%' }}
          justifyContent={{ default: 'justifyContentCenter' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          <FlexItem>
            <PeopleEnabledChart
              redHatterCount={redHatCount}
              otherCount={emails.length - redHatCount}
            />
          </FlexItem>
        </Flex>
      </CardBody>
      <CardFooter />
    </Card>
  );
}
