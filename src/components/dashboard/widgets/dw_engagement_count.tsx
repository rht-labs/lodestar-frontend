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
import {
  AsleepIcon,
  OnRunningIcon,
  PendingIcon,
  TachometerAltIcon,
} from '@patternfly/react-icons';
import React, { ComponentClass } from 'react';
import {
  Engagement,
  EngagementStatus,
  getEngagementStatus,
} from '../../../schemas/engagement';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';

export interface EngagementCountWidgetProps {
  engagements?: Partial<Engagement>[];
}
interface CountComponentProps {
  count: number;
  title: string;
  subtitle: string;
  icon: ComponentClass<SVGIconProps>;
}
const CountComponent = ({ icon: Component, ...props }: CountComponentProps) => (
  <Flex
    direction={{ default: 'column' }}
    alignItems={{ default: 'alignItemsCenter' }}
    justifyContent={{ default: 'justifyContentCenter' }}
    style={{ height: '100%' }}
  >
    <FlexItem flex={{ default: 'flex_1' }}>
      <Text component={TextVariants.h4}>{props.title}</Text>
    </FlexItem>
    <FlexItem>
      <Flex
        direction={{ default: 'column' }}
        justifyContent={{ default: 'justifyContentFlexEnd' }}
        alignItems={{ default: 'alignItemsCenter' }}
      >
        <Component size="xl" />
        <TextContent>
          <Text component={TextVariants.h1}>{props.count}</Text>
          <Text style={{ fontStyle: 'italic' }}>{props.subtitle}</Text>
        </TextContent>
      </Flex>
    </FlexItem>
  </Flex>
);
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
    <Card style={{ height: '100%' }}>
      <CardHeader>
        <TextContent>
          <Text
            component={TextVariants.h2}
            data-testid="engagement-count-card-title"
          >
            Engagement Summary
          </Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          style={{ height: '100%', width: '100%' }}
        >
          <FlexItem flex={{ default: 'flex_1' }}>
            <TextContent style={{ textAlign: 'center' }}>
              <Grid hasGutter>
                <GridItem md={6} lg={3}>
                  <CountComponent
                    count={engagementCounts[0]}
                    icon={TachometerAltIcon}
                    title="All Engagements"
                    subtitle={''}
                  />
                </GridItem>
                <GridItem md={6} lg={3}>
                  <CountComponent
                    count={engagementCounts[1]}
                    icon={OnRunningIcon}
                    title="Active Engagements"
                    subtitle={''}
                  />
                </GridItem>
                <GridItem md={6} lg={3}>
                  <CountComponent
                    count={engagementCounts[2]}
                    icon={PendingIcon}
                    title="Upcoming Engagements"
                    subtitle={''}
                  />
                </GridItem>
                <GridItem md={6} lg={3}>
                  <CountComponent
                    count={engagementCounts[3]}
                    icon={AsleepIcon}
                    title="Past Engagements"
                    subtitle={''}
                  />
                </GridItem>
              </Grid>
            </TextContent>
          </FlexItem>
        </Flex>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
