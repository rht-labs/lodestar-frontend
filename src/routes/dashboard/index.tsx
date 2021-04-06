import React, { useEffect, useState } from 'react';
import {
  Flex,
  FlexItem,
  Gallery,
  PageSection,
  PageSectionVariants,
  Select,
  SelectOption,
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
import { Feature } from '../../components/feature/feature';
import { useEngagementFormConfig } from '../../context/engagement_config_context/engagement_config_hook';

export type DateFilter = { startDate: Date; endDate: Date };

export const DashboardDateContext = React.createContext<DateFilter | undefined>(
  undefined
);

export interface DashboardFilter {
  dates: DateFilter;
  regions: string[];
}

export function Dashboard() {
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const feedbackContext = useFeedback();
  const { engagementService } = useServiceProviders();
  const { engagements, getEngagements } = useEngagementCollection({
    engagementService,
    feedbackContext,
  });
  const [isRegionSelectOpen, setIsRegionSelectOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const { engagementFormConfig } = useEngagementFormConfig(engagementService);

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

  const handleSelectRegions = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };
  const dashboardFilter = { dates: dateFilter, regions: selectedRegions };

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
        <Feature name="reader">
          <Flex
            justifyContent={{ default: 'justifyContentFlexEnd' }}
            style={{ marginBottom: '1rem' }}
          >
            <FlexItem>
              <Select
                width="12rem"
                placeholderText={'Select a region'}
                isOpen={isRegionSelectOpen}
                multiple={true}
                selections={selectedRegions}
                onSelect={(_, value) => handleSelectRegions(value as string)}
                onToggle={() => setIsRegionSelectOpen(!isRegionSelectOpen)}
              >
                {engagementFormConfig?.basic_information?.engagement_regions?.options?.map?.(
                  option => (
                    <SelectOption
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  )
                )}
              </Select>
            </FlexItem>
            <FlexItem>
              <DateWindowSelector onSelectWindow={handleSelectDateWindow} />
            </FlexItem>
          </Flex>
        </Feature>
        <Gallery hasGutter>
          <AllEngagementsWidget
            dates={dashboardFilter.dates}
            regions={selectedRegions}
          />
          <ActiveEngagementsWidget
            dates={dashboardFilter.dates}
            regions={selectedRegions}
          />
          <UpcomingEngagementsWidget
            dates={dashboardFilter.dates}
            regions={selectedRegions}
          />
          <PastEngagementsWidget
            dates={dashboardFilter.dates}
            regions={selectedRegions}
          />
        </Gallery>
      </PageSection>
    </DashboardDateContext.Provider>
  );
}
