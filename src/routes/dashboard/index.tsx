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
  SelectVariant,
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
import { DwTopTags } from '../../components/dashboard/widgets/dw_top_tags';
import { withCategories } from '../../components/hocs/with_categories';
import { DwLastUpdated } from '../../components/dashboard/widgets/dw_last_updated_engagements';
import { SortOrder } from '../../services/engagement_service/engagement_service';
import { useHistory } from 'react-router';

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
  const history = useHistory();

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

  const getRegionImageSource = () => {
    const sortedRegions = selectedRegions.sort().map(s => s.toLowerCase());
    if (sortedRegions.length === 0) {
      return `${process.env.PUBLIC_URL}/images/world.svg`;
    }
    return `${process.env.PUBLIC_URL}/images/world-${sortedRegions.join('-')}.${
      sortedRegions.length > 1 ? 'png' : 'svg'
    }`;
  };

  return (
    <DashboardDateContext.Provider value={dateFilter}>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Flex
            justifyContent={{ default: 'justifyContentSpaceBetween' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            <FlexItem>
              <Title headingLevel="h1">Dashboard</Title>
              <Text component="p">
                This dashboard gives you an overview of all engagements.
              </Text>
            </FlexItem>
            <FlexItem>
              <img
                src={getRegionImageSource()}
                alt="Selected regions"
                width="200rm"
              />
            </FlexItem>
          </Flex>
        </TextContent>
      </PageSection>
      <PageSection>
        <div style={{ maxWidth: '1300px' }}>
          <Feature name="reader">
            <Flex
              justifyContent={{ default: 'justifyContentFlexEnd' }}
              style={{ marginBottom: '1rem' }}
            >
              <FlexItem>
                <Select
                  variant={SelectVariant.checkbox}
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
                        isSelected={selectedRegions.includes(option.value)}
                        key={option.value}
                        value={option.value}
                        label={option.label.toUpperCase()}
                      >
                        {option.label}
                      </SelectOption>
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
            <GridItem colSpan={2} sm={12} xl={12} xl2={12}>
              <EngagementQueryMediator
                filter={{
                  startDate: dateFilter?.startDate,
                  endDate: dateFilter?.endDate,
                }}
                component={({ engagements }) => (
                  <EngagementCountWidget engagements={engagements} />
                )}
              />
            </GridItem>
            <GridItem colSpan={2} sm={12} md={6}>
              <EngagementQueryMediator
                filter={{
                  startDate: dateFilter?.startDate,
                  endDate: dateFilter?.endDate,
                  include: ['engagement_users'],
                }}
                component={DashboardPeopleEnabledCard}
              />
            </GridItem>
            <GridItem colSpan={1} sm={12} md={6} xl={6} xl2={6}>
              {withCategories(DwTopTags, {})}
            </GridItem>
            <GridItem sm={12} xl={12} xl2={6}>
              <EngagementQueryMediator
                filter={{
                  pageNumber: 1,
                  perPage: 5,
                  sortField: 'last_update',
                  sortOrder: SortOrder.DESC,
                }}
                component={props => (
                  <DwLastUpdated
                    {...props}
                    onClick={(customerName, projectName) => {
                      history.push(
                        `/app/engagements/${customerName}/${projectName}/`
                      );
                    }}
                  />
                )}
              />
            </GridItem>
          </Grid>
        </div>
      </PageSection>
    </DashboardDateContext.Provider>
  );
}
