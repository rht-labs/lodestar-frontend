import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import React from 'react';
import {
  Engagement,
  EngagementStatus,
  getEngagementStatus,
} from '../../../schemas/engagement';

export interface EngagementCountWidgetProps {
  engagements?: Partial<Engagement>[];
}
export const EngagementCountWidget = (
  props: EngagementCountWidgetProps = {}
) => {
  const { engagements = [] } = props;
  const engagementCounts = [
    engagements.length,
    engagements.filter(e => getEngagementStatus(e) === EngagementStatus.active)
      .length,
    engagements.filter(
      e => getEngagementStatus(e) === EngagementStatus.upcoming
    ).length,
    engagements.filter(e => getEngagementStatus(e) === EngagementStatus.past)
      .length,
  ];
  return (
    <Card>
      <CardHeader>
        <TextContent>
          <Text data-testid="engagement-count-card-title">Engagements</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <TextContent style={{ textAlign: 'center' }}>
          <Grid hasGutter>
            <GridItem md={6} lg={3}>
              <Flex
                direction={{ default: 'column' }}
                alignItems={{ default: 'alignItemsCenter' }}
                style={{ height: '100%' }}
              >
                <FlexItem flex={{ default: 'flex_1' }}>
                  <Text component={TextVariants.h4}>All Engagements</Text>
                </FlexItem>
                <FlexItem>
                  <TextContent>
                    <Text component={TextVariants.h1}>
                      {engagementCounts[0]}
                    </Text>
                  </TextContent>
                </FlexItem>
              </Flex>
            </GridItem>
            <GridItem md={6} lg={3}>
              <Flex
                direction={{ default: 'column' }}
                alignItems={{ default: 'alignItemsCenter' }}
                style={{ height: '100%' }}
              >
                <FlexItem flex={{ default: 'flex_1' }}>
                  <Text component={TextVariants.h4}>Active Engagements</Text>
                </FlexItem>
                <FlexItem>
                  <TextContent>
                    <Text component={TextVariants.h1}>
                      {engagementCounts[1]}
                    </Text>
                  </TextContent>
                </FlexItem>
              </Flex>
            </GridItem>
            <GridItem md={6} lg={3}>
              <Flex
                direction={{ default: 'column' }}
                alignItems={{ default: 'alignItemsCenter' }}
                style={{ height: '100%' }}
              >
                <FlexItem flex={{ default: 'flex_1' }}>
                  <Text component={TextVariants.h4}>Upcoming Engagements</Text>
                </FlexItem>
                <FlexItem>
                  <TextContent>
                    <Text component={TextVariants.h1}>
                      {engagementCounts[2]}
                    </Text>
                  </TextContent>
                </FlexItem>
              </Flex>
            </GridItem>
            <GridItem md={6} lg={3}>
              <Flex
                direction={{ default: 'column' }}
                alignItems={{ default: 'alignItemsCenter' }}
                style={{ height: '100%' }}
              >
                <FlexItem flex={{ default: 'flex_1' }}>
                  <Text component={TextVariants.h4}>Past Engagements</Text>
                </FlexItem>
                <FlexItem>
                  <TextContent>
                    <Text component={TextVariants.h1}>
                      {engagementCounts[3]}
                    </Text>
                  </TextContent>
                </FlexItem>
              </Flex>
            </GridItem>
          </Grid>
        </TextContent>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
