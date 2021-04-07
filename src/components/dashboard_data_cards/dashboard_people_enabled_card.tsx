import React, { useEffect } from 'react';
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
import { DateFilter } from '../../routes/dashboard';
import {
  EngagementCollectionFilter,
  useEngagementCollection,
} from '../../context/engagement_collection_context/engagement_collection_context';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';

export interface PeopleEnabledCardProps {
  dates: DateFilter;
  regions: string[];
}

export function DashboardPeopleEnabledCard(props: PeopleEnabledCardProps) {
  const { engagementService } = useServiceProviders();
  const { dates, regions } = props;
  const { engagements = [], getEngagements } = useEngagementCollection({
    engagementService,
  });
  useEffect(() => {
    const filter: EngagementCollectionFilter = {
      include: ['engagement_users'],
      endDate: dates?.endDate,
      startDate: dates?.startDate,
      engagementRegions: regions,
    };
    getEngagements(filter);
  }, [getEngagements, dates?.endDate, dates?.startDate, regions]);
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
              <Text component={TextVariants.h4}>Red Hatters</Text>
              <Text component={TextVariants.h1} style={{ color: '#a4c7a4' }}>
                {redHatCount}
              </Text>
            </TextContent>
          </GridItem>
          <GridItem span={4}>
            <TextContent style={{ textAlign: 'center' }}>
              <Text component={TextVariants.h4}>Non Red Hatters</Text>
              <Text component={TextVariants.h1} style={{ color: '#4db445' }}>
                {emails.length - redHatCount}
              </Text>
            </TextContent>
          </GridItem>
        </Grid>
        <PeopleEnabledChart
          redHatterCount={redHatCount}
          otherCount={emails.length - redHatCount}
        />
      </CardBody>
    </Card>
  );
}
