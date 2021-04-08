import {
  Card,
  CardBody,
  CardHeader,
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
        <Grid hasGutter>
          <GridItem md={6} lg={3}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>All Engagements</Text>
              <Text component={TextVariants.h1}>{engagementCounts[0]}</Text>
            </TextContent>
          </GridItem>
          <GridItem md={6} lg={3}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Active Engagements</Text>
              <Text component={TextVariants.h1}>{engagementCounts[1]}</Text>
            </TextContent>
          </GridItem>
          <GridItem md={6} lg={3}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Upcoming Engagements</Text>
              <Text component={TextVariants.h1}>{engagementCounts[2]}</Text>
            </TextContent>
          </GridItem>
          <GridItem md={6} lg={3}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Past Engagements</Text>
              <Text component={TextVariants.h1}>{engagementCounts[3]}</Text>
            </TextContent>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};
