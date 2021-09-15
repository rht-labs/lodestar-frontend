import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

import { EnabledUsers } from '../../../schemas/engagement';
import { PeopleEnabledChart } from './people_enabled_chart';
import React from 'react';

export interface PeopleEnabledCardProps {
  usersEnabled?: EnabledUsers;
  isLoading?: boolean;
}

export function DashboardPeopleEnabledCard({
  usersEnabled,
  isLoading = false,
}: PeopleEnabledCardProps) {
  return (
    <Card isCompact>
      <CardTitle>
        <TextContent>
          <Text component={TextVariants.h2}>
            People Enabled {usersEnabled?.allUsersCount}
          </Text>
        </TextContent>
      </CardTitle>
      <CardBody style={{ marginTop: '1rem' }}>
        <Grid hasGutter>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Total Enabled</Text>
              <Text component={TextVariants.h1} style={{ color: '#59ABE3' }}>
                {usersEnabled?.allUsersCount}
              </Text>
            </TextContent>
          </GridItem>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Red Hat</Text>
              <Text component={TextVariants.h1} style={{ color: '#4db445' }}>
                {usersEnabled?.rhUsersCount}
              </Text>
            </TextContent>
          </GridItem>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Others</Text>
              <Text component={TextVariants.h1} style={{ color: '#a4c7a4' }}>
                {usersEnabled?.otherUsersCount}
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
              redHatterCount={usersEnabled?.rhUsersCount ?? 0}
              otherCount={usersEnabled?.otherUsersCount ?? 0}
            />
          </FlexItem>
        </Flex>
      </CardBody>
      <CardFooter />
    </Card>
  );
}
