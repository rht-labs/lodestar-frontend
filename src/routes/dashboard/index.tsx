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
import React, { useCallback, useEffect, useState } from 'react';

import { CategoryFilter } from '../../services/category_service/category_service';
import { DashboardPeopleEnabledCard } from '../../components/dashboard/widgets/dashboard_people_enabled_card';
import { DateWindowSelector } from '../../components/date_window_selector/date_window_selector';
import { DwEngagementCount } from '../../components/dashboard/widgets/dw_engagement_count';
import { DwLastArtifacts } from '../../components/dashboard/widgets/dw_last_artifact';
import { DwLastDemo } from '../../components/dashboard/widgets/dw_last_demo';
import { DwLastUpdated } from '../../components/dashboard/widgets/dw_last_updated_engagements';
import { DwLastUseCases } from '../../components/dashboard/widgets/dw_last_use_cases';
import { DwLastWeeklyReport } from '../../components/dashboard/widgets/dw_last_weekly_report';
import { DwTopTags } from '../../components/dashboard/widgets/dw_top_tags';
import { EnabledUsersFilter } from '../../services/enabled_users_service/enabled_users_service';
import { EngagementQueryMediator } from '../../components/dashboard/widgets/engagement_query_mediator';
import { Feature } from '../../components/feature/feature';
import { SortOrder } from '../../services/engagement_service/engagement_service';
import { SummaryCountFilter } from '../../services/summary_count_service/summary_count_service';
import { useCategories } from '../../hooks/use_categories';
import { useEnabledUsers } from '../../hooks/use_enabled_users';
import { useEngagementCollection } from '../../hooks/engagement_collection_hook';
import { useEngagementFormConfig } from '../../context/engagement_config_context/engagement_config_hook';
import { useHistory, useLocation } from 'react-router';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
import { useSummaryCount } from '../../hooks/use_summary_count';
import { useVersion } from '../../context/version_context/version_context';
import { withArtifacts } from '../../hocs/with_artifacts';
import { withUseCases } from '../../hocs/with_use_cases';

export type DateFilter = { startDate: Date; endDate: Date };

export const DashboardDateContext = React.createContext<DateFilter | undefined>(
  undefined
);

export interface DashboardFilter {
  dates: DateFilter;
  regions: string[];
}

export function Dashboard() {
  const versionContext = useVersion();

  useEffect(() => {
    if (!versionContext.versions) {
      versionContext?.fetchVersions();
    }
  }, [versionContext]);

  const history = useHistory();
  const location = useLocation();

  const {
    categoryService,
    engagementService,
    artifactService,
    useCaseService,
    enabledUsersService,
    summaryCountService,
  } = useServiceProviders();
  const [isRegionSelectOpen, setIsRegionSelectOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState(() => {
    const search = new URLSearchParams(location.search);
    const initialState = search.get('regions') ? search.get('regions').split(',') : [];
    return initialState;
  });
  const { engagementFormConfig } = useEngagementFormConfig(engagementService);
  const { getEngagements } = useEngagementCollection({
    engagementService,
  });

  useEffect(() => {
    getEngagements({ perPage: 10000, pageNumber: 1, exclude: ['commits'] });
  }, [getEngagements]);

  useEffect(() => {
    const params = selectedRegions.length === 0 ? '' : `?regions=${selectedRegions.join(',')}`;
    history.replace(`${location.pathname}${params}`)
  }, [selectedRegions, history, location.pathname]);

  const [dateFilter, setDateFilter] = useState<DateFilter | undefined>(
    undefined
  );

  const categoryFetcher = useCallback(() => {
    const filter: CategoryFilter = {
      regions: selectedRegions,
    };
    return categoryService.fetchCategories(filter);
  }, [categoryService, selectedRegions]);

  const { categories, isLoading: isLoadingCategories } = useCategories(
    categoryFetcher
  );

  const enabledUsersFetcher = useCallback(() => {
    const filter: EnabledUsersFilter = {
      regions: selectedRegions,
    };
    return enabledUsersService.getEnabledUsers(filter);
  }, [enabledUsersService, selectedRegions]);

  const { enabledUsers, isLoading: isLoadingEnabledUsers } = useEnabledUsers(
    enabledUsersFetcher
  );

  const summaryCountFetcher = useCallback(() => {
    const filter: SummaryCountFilter = {
      regions: selectedRegions,
    };
    return summaryCountService.getSummaryCount(filter);
  }, [summaryCountService, selectedRegions]);

  const { summaryCount, isLoading: isLoadingSummaryCount } = useSummaryCount(
    summaryCountFetcher
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
                <Feature
                  name={'dashboardDateSelector'}
                  inactiveComponent={() => <div />}
                >
                  <DateWindowSelector onSelectWindow={handleSelectDateWindow} />
                </Feature>
              </FlexItem>
            </Flex>

            <Grid hasGutter>
              <GridItem colSpan={2} sm={12} xl={12} xl2={12}>
                <DwEngagementCount
                  summaryCount={summaryCount}
                  isLoading={isLoadingSummaryCount}
                  onClickCount={(status: string) => {
                    let filter = '';
                    if(selectedRegions.length > 0) {
                      filter = "?regions=" + selectedRegions.join(',');
                    }
                    history.push(`/app/engagements/${status}${filter}`);
                  }}
                />
              </GridItem>
              <GridItem colSpan={1} sm={12} md={6} xl={6} xl2={6}>
                <DashboardPeopleEnabledCard
                  usersEnabled={enabledUsers}
                  isLoading={isLoadingEnabledUsers}
                />
              </GridItem>
              <GridItem colSpan={1} sm={12} md={6} xl={6} xl2={6}>
                <DwTopTags
                  categories={categories}
                  isLoading={isLoadingCategories}
                />
              </GridItem>
              <GridItem sm={12} xl={12} xl2={6}>
                <EngagementQueryMediator
                  filter={{
                    pageNumber: 1,
                    engagementRegions: selectedRegions,
                    perPage: 5,
                    sortField: 'last_update',
                    sortOrder: SortOrder.DESC,
                    startDate: dateFilter?.startDate,
                    endDate: dateFilter?.endDate,
                  }}
                  component={props => (
                    <DwLastUpdated
                      {...props}
                      onClick={(uuid) => {
                        history.push(
                          `/app/engagements/${uuid}`
                        );
                      }}
                    />
                  )}
                />
              </GridItem>
              <GridItem sm={12} xl={12} xl2={6}>
                {withUseCases(DwLastUseCases, () =>
                  useCaseService.getUseCases({
                    page: 1,
                    perPage: 5,
                    startDate: dateFilter?.startDate,
                    endDate: dateFilter?.endDate,
                    regions: selectedRegions,
                  })
                )}
              </GridItem>
              <GridItem sm={12} xl={12} xl2={6}>
                {withArtifacts(
                  DwLastArtifacts,
                  () =>
                    artifactService.getArtifacts({
                      page: 1,
                      perPage: 5,
                      startDate: dateFilter?.startDate,
                      endDate: dateFilter?.endDate,
                      regions: selectedRegions,
                      sortOrder: 'DESC',
                      sortFields: 'updated',
                    })
                )}
              </GridItem>
              <GridItem sm={12} xl={12} xl2={6}>
                {withArtifacts(
                  ({ artifacts, engagements }) => (
                    <DwLastDemo demos={artifacts} />
                  ),
                  () =>
                    artifactService.getArtifacts({
                      page: 1,
                      perPage: 5,
                      type: 'demo',
                      startDate: dateFilter?.startDate,
                      endDate: dateFilter?.endDate,
                      regions: selectedRegions,
                      sortOrder: 'DESC',
                      sortFields: 'updated',
                    })
                )}
              </GridItem>
              <GridItem sm={12} xl={12} xl2={6}>
                {withArtifacts(
                  DwLastWeeklyReport,
                  () =>
                    artifactService.getArtifacts({
                      page: 1,
                      perPage: 5,
                      type: 'weeklyReport',
                      startDate: dateFilter?.startDate,
                      endDate: dateFilter?.endDate,
                      regions: selectedRegions,
                      sortOrder: 'DESC',
                      sortFields: 'updated',
                    })
                )}
              </GridItem>
            </Grid>
          </Feature>
        </div>
      </PageSection>
    </DashboardDateContext.Provider>
  );
}
