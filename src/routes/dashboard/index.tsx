import React, { useEffect, useState } from 'react';
import {
  Flex,
  FlexItem,
  Gallery,
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
import { useVersion } from '../../context/version_context/version_context';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
import { DateWindowSelector } from '../../components/date_window_selector/date_window_selector';
import { Feature } from '../../components/feature/feature';
import { useEngagementFormConfig } from '../../context/engagement_config_context/engagement_config_hook';
import { useEngagementCollection } from '../../hooks/engagement_collection_hook';
import { DashboardPeopleEnabledCard } from '../../components/dashboard/widgets/dashboard_people_enabled_card';
import { EngagementCountWidget } from '../../components/dashboard/widgets/dw_engagement_count';
import { EngagementQueryMediator } from '../../components/dashboard/widgets/engagement_query_mediator';
import { DwTopTags } from '../../components/dashboard/widgets/dw_top_tags';
import { withCategories } from '../../hocs/with_categories';
import { DwLastUpdated } from '../../components/dashboard/widgets/dw_last_updated_engagements';
import { Engagement, EngagementStatus } from '../../schemas/engagement';
import { engagementFilterFactory } from '../../common/engagement_filter_factory';
import { SortOrder } from '../../services/engagement_service/engagement_service';
import { useHistory } from 'react-router';
import { DwLastUseCases } from '../../components/dashboard/widgets/dw_last_use_cases';
import { withUseCases } from '../../hocs/with_use_cases';
import { withArtifacts } from '../../hocs/with_artifacts';
import { DwLastArtifacts } from '../../components/dashboard/widgets/dw_last_artifact';
import { DashboardDataCard } from '../../components/dashboard/widgets/dashboard_data_card';
import {
  AsleepIcon,
  OnRunningIcon,
  PendingIcon,
  TachometerAltIcon,
} from '@patternfly/react-icons';
import { DwLastDemo } from '../../components/dashboard/widgets/dw_last_demo';
import { DwLastWeeklyReport } from '../../components/dashboard/widgets/dw_last_weekly_report';
import { createBase64ParseableFilter } from '../engagement_list/engagement_list_route';

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
  
  const {
    engagementService,
    artifactService,
    useCaseService,
  } = useServiceProviders();
  const [isRegionSelectOpen, setIsRegionSelectOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const { engagementFormConfig } = useEngagementFormConfig(engagementService);
  const { engagements, getEngagements } = useEngagementCollection({
    engagementService,
  });
  const history = useHistory();
  useEffect(() => {
    getEngagements({ perPage: 10000, pageNumber: 1,  exclude: ['commits']});
  }, [getEngagements]);

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
    return `${process.env.PUBLIC_URL}/images/world-${sortedRegions.join('-')}.${sortedRegions.length > 1 ? 'png' : 'svg'
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
            <Feature
              name={'newDashboard'}
              inactiveComponent={() => (
                <DashBoardGallery engagements={engagements} />
              )}
            >
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
                    onSelect={(_, value) =>
                      handleSelectRegions(value as string)
                    }
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
                    <DateWindowSelector
                      onSelectWindow={handleSelectDateWindow}
                    />
                  </Feature>
                </FlexItem>
              </Flex>

              <Grid hasGutter>
                <GridItem colSpan={2} sm={12} xl={12} xl2={12}>
                  <EngagementQueryMediator
                    filter={{
                      startDate: dateFilter?.startDate,
                      endDate: dateFilter?.endDate,
                      engagementRegions: selectedRegions,
                      include: [
                        'project_name',
                        'start_date',
                        'end_date',
                        'archive_date',
                        'launch',
                      ],
                    }}
                    component={({ engagements }) => (
                      <EngagementCountWidget
                        engagements={engagements}
                        onClickCount={(status: string) => {
                          history.push(
                            `/app/engagements/${status}?filter=${createBase64ParseableFilter(
                              {
                                engagementRegions:
                                  selectedRegions.length > 0
                                    ? selectedRegions
                                    : undefined,
                              }
                            )}`
                          );
                        }}
                      />
                    )}
                  />
                </GridItem>
                <GridItem colSpan={2} sm={12} md={6}>
                  <EngagementQueryMediator
                    filter={{
                      startDate: dateFilter?.startDate,
                      endDate: dateFilter?.endDate,
                      engagementRegions: selectedRegions,
                      include: ['engagement_users'],
                    }}
                    component={DashboardPeopleEnabledCard}
                  />
                </GridItem>
                <GridItem colSpan={1} sm={12} md={6} xl={6} xl2={6}>
                  {withCategories(DwTopTags, {
                    page: 1,
                    perPage: 5,
                    startDate: dateFilter?.startDate,
                    endDate: dateFilter?.endDate,
                    regions: selectedRegions,
                  })}
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
                        onClick={(customerName, projectName) => {
                          history.push(
                            `/app/engagements/${customerName}/${projectName}/`
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
                      }),
                    engagementService.getEngagementById
                  )}
                </GridItem>
                <GridItem sm={12} xl={12} xl2={6}>
                  {withArtifacts(
                    ({ artifacts, engagements }) => (
                      <DwLastDemo demos={artifacts} engagements={engagements} />
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
                      }),
                    engagementService.getEngagementById
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
                      }),

                    engagementService.getEngagementById
                  )}
                </GridItem>
              </Grid>
            </Feature>
          </Feature>
        </div>
      </PageSection>
    </DashboardDateContext.Provider>
  );
}

//TODO: Nuke after new dashboards launch
const DashBoardGallery = ({
  engagements,
}: {
  engagements: Array<Partial<Engagement>>;
}) => {
  const numberOfTotalEngagements = engagements?.length;
  const numberOfUpcomingEngagements = engagements?.filter(
    engagementFilterFactory({ allowedStatuses: [EngagementStatus.upcoming] })
  ).length;
  const numberOfcurrentEngagements = engagements?.filter(
    engagementFilterFactory({ allowedStatuses: [EngagementStatus.active] })
  ).length;
  const numberOfPastEngagements = engagements?.filter(
    engagementFilterFactory({
      allowedStatuses: [EngagementStatus.past, EngagementStatus.terminating],
    })
  ).length;
  return (
    <Gallery hasGutter>
      <DashboardDataCard
        icon={TachometerAltIcon}
        numberOfEngagements={numberOfTotalEngagements}
        title={'All Engagements'}
        subtitle={
          'All available engagements in the system. Including upcoming, active and past ones'
        }
        url={'/app/engagements/all'}
      />

      <DashboardDataCard
        icon={PendingIcon}
        numberOfEngagements={numberOfUpcomingEngagements}
        title={'Upcoming Engagements'}
        subtitle={
          'Upcoming engagements in the future, and are not launched yet.'
        }
        url={'/app/engagements/upcoming'}
      />

      <DashboardDataCard
        icon={OnRunningIcon}
        numberOfEngagements={numberOfcurrentEngagements}
        title={'Active Engagements'}
        subtitle={
          'Engagements that are already in progress and running at the moment.'
        }
        url={'/app/engagements/active'}
      />

      <DashboardDataCard
        icon={AsleepIcon}
        numberOfEngagements={numberOfPastEngagements}
        title={'Past Engagements'}
        subtitle={'Engagements that are finished, closed or archived.'}
        url={'/app/engagements/past'}
      />
    </Gallery>
  );
};
