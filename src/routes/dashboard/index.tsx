import React, {useEffect} from 'react';
import {Grid, GridItem, PageSection, PageSectionVariants, Text, TextContent, Title,} from '@patternfly/react-core';
import {DashboardDataCard} from "../../components/dashboard_data_cards/dashboard_data_card";
import {AsleepIcon, OnRunningIcon, PendingIcon, TachometerAltIcon} from "@patternfly/react-icons";
import {useEngagements} from "../../context/engagement_context/engagement_hook";
import {EngagementStatus} from "../../schemas/engagement_schema";
import {engagementFilterFactory} from '../../common/engagement_filter_factory';

export function Dashboard() {

  const { engagements, getEngagements } = useEngagements();

  useEffect(() => {
    if (engagements === undefined) {
      getEngagements();
    }
  }, [engagements, getEngagements]);

  const numberOfTotalEngagements = engagements?.length;
  const numberOfUpcomingEngagements = engagements?.filter(
    engagementFilterFactory({allowedStatuses: [EngagementStatus.upcoming]})
  ).length;
  const numberOfActiveEngagements = engagements?.filter(
    engagementFilterFactory({allowedStatuses: [EngagementStatus.active]})
  ).length;
  const numberOfPastEngagements = engagements?.filter(
    engagementFilterFactory({allowedStatuses: [EngagementStatus.past]})
  ).length;

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Title headingLevel="h1">Dashboard</Title>
          <Text component="p">This dashboard gives you an overview of all engagements and beyond.</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          <GridItem span={3}>
            <DashboardDataCard
              icon={TachometerAltIcon}
              numberOfEngagements={numberOfTotalEngagements}
              title={'Total Engagements'}
              subtitle={'All available engagements in the system. Including upcoming, active and past ones'}
              url={"/app/engagements/all"}/>
          </GridItem>
          <GridItem span={3}>
            <DashboardDataCard
              icon={PendingIcon}
              numberOfEngagements={numberOfUpcomingEngagements}
              title={'Upcoming Engagements'}
              subtitle={'Upcoming engagements in the future. The ones that have not been launched yet. '}
              url={"/app/engagements/upcoming"}/>
          </GridItem>
          <GridItem span={3}>
            <DashboardDataCard
              icon={OnRunningIcon}
              numberOfEngagements={numberOfActiveEngagements}
              title={'Active Engagements'}
              subtitle={'Engagements that are already in progress and running at the moment.'}
              url={"/app/engagements/active"}/>
          </GridItem>
          <GridItem span={3}>
            <DashboardDataCard
              icon={AsleepIcon}
              numberOfEngagements={numberOfPastEngagements}
              title={'Past Engagements'}
              subtitle={'Engagements that are finished, closed or archived.'}
              url={"/app/engagements/past"}/>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
}
