import {
  AsleepIcon,
  OnRunningIcon,
  PendingIcon,
  TachometerAltIcon,
} from '@patternfly/react-icons';
import {
  Button,
  ButtonVariant,
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
import React, { ComponentClass } from 'react';

import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import { SummaryCount } from '../../../schemas/engagement';

export interface EngagementCountCardProps {
  summaryCount?: SummaryCount;
  isLoading?: boolean;
  onClickCount?: (status: string) => void
}

interface CountComponentProps {
  count: number;
  icon: ComponentClass<SVGIconProps>;
  status: string;
  subtitle: string;
  title: string;
  onClickCount: (status: string) => void
}
const CountComponent = ({ icon: Component, ...props }: CountComponentProps) => {
  return (
    <Flex
      direction={{ default: 'column' }}
      alignItems={{ default: 'alignItemsCenter' }}
      justifyContent={{ default: 'justifyContentCenter' }}
      style={{ height: '100%' }}
    >
      <FlexItem flex={{ default: 'flex_1' }}>
        <Button
          onClick={() => props.onClickCount(props.status)}
          data-cy={`button_${props.status}`}
          variant={ButtonVariant.link}
        >
          <Text component={TextVariants.h4}>
            {props.title}
          </Text>
        </Button>
      </FlexItem>
      <FlexItem>
        <Flex
          direction={{ default: 'column' }}
          justifyContent={{ default: 'justifyContentFlexEnd' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          <Component size="xl" />
          <TextContent>
            <Text component={TextVariants.h1}>{props.count || 0}</Text>
            <Text style={{ fontStyle: 'italic', fontSize: '0.8em' }}>
              {props.subtitle}
            </Text>
          </TextContent>
        </Flex>
      </FlexItem>
    </Flex>
  )
};

export function DwEngagementCount({
  summaryCount,
  isLoading = false,
  onClickCount,
}: EngagementCountCardProps) {
  return (
    <Card isCompact>
      <CardTitle>
        <TextContent>
          <Text
            component={TextVariants.h2}
            data-testid="engagement-count-card-title"
          >
            Engagement Summary
          </Text>
        </TextContent>
      </CardTitle>
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
                    onClickCount={onClickCount}
                    count={summaryCount?.any}
                    icon={TachometerAltIcon}
                    status={'all'}
                    subtitle={'All engagements in the system.'}
                    title="All Engagements"
                  />
                </GridItem>
                <GridItem md={6} lg={3}>
                  <CountComponent
                    onClickCount={onClickCount}
                    count={summaryCount?.active}
                    icon={OnRunningIcon}
                    status={'active'}
                    subtitle={'Engagements in progress.'}
                    title="Active Engagements"
                  />
                </GridItem>
                <GridItem md={6} lg={3}>
                  <CountComponent
                    onClickCount={onClickCount}
                    count={summaryCount?.upcoming}
                    icon={PendingIcon}
                    status={'upcoming'}
                    subtitle={'Engagements in the future.'}
                    title="Upcoming Engagements"
                  />
                </GridItem>
                <GridItem md={6} lg={3}>
                  <CountComponent
                    onClickCount={onClickCount}
                    count={summaryCount?.past + summaryCount?.terminating}
                    icon={AsleepIcon}
                    status={'past'}
                    subtitle={'All completed engagements.'}
                    title="Past Engagements"
                  />
                </GridItem>
              </Grid>
            </TextContent>
          </FlexItem>
        </Flex>
      </CardBody>
      <CardFooter />
    </Card>
  );
}
