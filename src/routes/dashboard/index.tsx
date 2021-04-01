import React, { useEffect, useState } from 'react';
import {
  Gallery,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { useEngagementCollection } from '../../context/engagement_collection_context/engagement_collection_context';
import { useFeedback } from '../../context/feedback_context/feedback_context';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
import { DateWindowSelector } from '../../components/date_window_selector/date_window_selector';
import { AllEngagementsWidget } from '../../components/dashboard/widgets/dw_all_engagements';
import { ActiveEngagementsWidget } from '../../components/dashboard/widgets/dw_active_engagements';
import { PastEngagementsWidget } from '../../components/dashboard/widgets/dw_past_engagements';
import { UpcomingEngagementsWidget } from '../../components/dashboard/widgets/dw_upcoming_engagements copy';

export type DateFilter = { startDate: Date; endDate: Date };

export const DashboardDateContext = React.createContext<DateFilter | undefined>(
  undefined
);

export function Dashboard() {
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const feedbackContext = useFeedback();
  const { engagementService } = useServiceProviders();
  const { engagements, getEngagements } = useEngagementCollection({
    engagementService,
    feedbackContext,
  });

  useEffect(() => {
    if (!hasFetched) {
      getEngagements();
      setHasFetched(true);
    }
  }, [engagements, getEngagements, hasFetched, setHasFetched]);

  const [dateFilter, setDateFilter] = useState<DateFilter | undefined>(
    undefined
  );

  const handleSelectDateWindow = (date?: DateFilter) => {
    setDateFilter(date);
  };

  return (
    <DashboardDateContext.Provider value={dateFilter}>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Title headingLevel="h1">Dashboard</Title>
          <Text component="p">
            This dashboard gives you an overview of all engagements.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <DateWindowSelector onSelectWindow={handleSelectDateWindow} />
        <Gallery hasGutter>
          <AllEngagementsWidget dates={dateFilter} />
          <ActiveEngagementsWidget dates={dateFilter} />
          <UpcomingEngagementsWidget dates={dateFilter} />
          <PastEngagementsWidget dates={dateFilter} />
        </Gallery>
      </PageSection>
    </DashboardDateContext.Provider>
  );
}
