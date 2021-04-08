import React, { useState } from 'react';
import {
  Flex,
  FlexItem,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Select,
  SelectOption,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
import { DateWindowSelector } from '../../components/date_window_selector/date_window_selector';
import { Feature } from '../../components/feature/feature';
import { useEngagementFormConfig } from '../../context/engagement_config_context/engagement_config_hook';
import { DashboardPeopleEnabledCard } from '../../components/dashboard/widgets/dashboard_people_enabled_card';
import { EngagementCountWidget } from '../../components/dashboard/widgets/dw_engagement_count';
import { EngagementQueryMediator } from '../../components/dashboard/widgets/engagement_query_mediator';

export type DateFilter = { startDate: Date; endDate: Date };

export const DashboardDateContext = React.createContext<DateFilter | undefined>(
  undefined
);

export interface DashboardFilter {
  dates: DateFilter;
  regions: string[];
}

export function Dashboard() {
  const { engagementService } = useServiceProviders();
  const [isRegionSelectOpen, setIsRegionSelectOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const { engagementFormConfig } = useEngagementFormConfig(engagementService);

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
        <Grid hasGutter>
          <GridItem sm={12} xl={12}>
            <EngagementQueryMediator
              filter={{
                startDate: dateFilter?.startDate,
                endDate: dateFilter?.endDate,
              }}
              component={EngagementCountWidget}
            />
          </GridItem>
          <GridItem sm={12} xl={6} xl2={3}>
            <EngagementQueryMediator
              filter={{
                startDate: dateFilter?.startDate,
                endDate: dateFilter?.endDate,
                include: ['engagement_users'],
              }}
              component={DashboardPeopleEnabledCard}
            />
          </GridItem>
        </Grid>
      </PageSection>
    </DashboardDateContext.Provider>
  );
}
