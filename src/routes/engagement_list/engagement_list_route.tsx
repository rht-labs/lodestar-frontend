import React, { useEffect, useState, useCallback } from 'react';
import {
  PageSection,
  Text,
  PageSectionVariants,
  TextContent,
  Flex,
  FlexItem,
  Button,
} from '@patternfly/react-core';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import {
  engagementFilterFactory,
  engagementSortFactory,
} from '../../common/engagement_filter_factory';
import { Engagement } from '../../schemas/engagement';
import { EngagementFilter } from '../../schemas/engagement_filter';
import { EngagementFilterBar } from '../../components/engagement_filter_bar/engagement_filter_bar';
import { EngagementList } from '../../components/engagement_list/engagement_list';
import { Feature } from '../../components/feature/feature';
import { useFeedback } from '../../context/feedback_context/feedback_context';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
import { useEngagementCollection } from '../../hooks/engagement_collection_hook';
import { useEngagementFormConfig } from '../../context/engagement_config_context/engagement_config_hook';

export interface EngagementListRouteProps {
  filter?: (engagement: Engagement) => boolean;
  filterDefinition?: EngagementFilter;
  title?: string;
  subtitle?: string;
}

export function createBase64ParseableFilter(
  filterDefinition: EngagementFilter
): string {
  return btoa(JSON.stringify(filterDefinition));
}

export function EngagementListRoute(props: EngagementListRouteProps) {
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const feedbackContext = useFeedback();

  const location = useLocation();
  const params = qs.parse(location.search);
  const base64ParamFilter = params?.['filter'] ?? '';
  const { engagementService } = useServiceProviders();
  const { engagementFormConfig } = useEngagementFormConfig(engagementService);
  const {
    engagements: contextEngagements,
    getEngagements,
  } = useEngagementCollection({ feedbackContext, engagementService });
  useEffect(() => {
    if (!hasFetched) {
      setHasFetched(true);
      getEngagements();
    }
  }, [contextEngagements, getEngagements, hasFetched]);
  const [filterDefinition, setFilterDefinition] = useState<EngagementFilter>(

  );
  useEffect(() => {
    const paramFilter = atob(base64ParamFilter as string);
    let parsedFilter;
    if (!!paramFilter) {
      try {
        parsedFilter = JSON.parse(paramFilter);
      } catch (e) {
        parsedFilter = {};
      }
    }
    const initialFilter = {
      ...(parsedFilter ?? {}),
      ...(props.filterDefinition ?? {}),
    };
    setFilterDefinition(initialFilter);
  }, [base64ParamFilter, props.filterDefinition, setFilterDefinition]);

  const filter = engagementFilterFactory(filterDefinition);
  const sorter = engagementSortFactory(filterDefinition);

  const filteredEngagements = (filter && typeof filter === 'function'
    ? (contextEngagements ?? []).filter(filter)
    : contextEngagements
  ).sort(sorter);

  const title = props.title ?? 'Engagements';
  const subtitle = props.subtitle ?? '';
  const history = useHistory();
  const handleChange = useCallback(
    (propsFilter: EngagementFilter) => {
      history.replace(
        `${location.pathname}?filter=${createBase64ParseableFilter(
          propsFilter
        )}`
      );
      setFilterDefinition(propsFilter);
    },
    [setFilterDefinition, history, location.pathname]
  );
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <TextContent>
              <Text component="h1">{title}</Text>
              <Text component="p">{subtitle}</Text>
            </TextContent>
          </FlexItem>
          <Feature name={'writer'}>
            <FlexItem>
              <Button
                onClick={() => history.push('/app/engagements/new')}
                id={'button_create_new_engagement'}
                data-cy="create-new-engagement"
              >
                Create New Engagement
              </Button>
            </FlexItem>
          </Feature>
        </Flex>
      </PageSection>
      <PageSection>
        <div style={{ margin: '0 1rem' }}>
          <EngagementFilterBar
            availableRegions={
              engagementFormConfig?.basic_information?.engagement_regions
                ?.options ?? []
            }
            filter={filterDefinition}
            onChange={handleChange}
          />
        </div>
      </PageSection>
      <PageSection data-cy={'engagement_cards_section'}>
        <EngagementList engagements={filteredEngagements} />
      </PageSection>
    </>
  );
}
