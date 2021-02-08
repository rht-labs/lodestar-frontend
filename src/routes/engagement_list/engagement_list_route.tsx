import React, { useEffect, useState, useCallback } from 'react';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import {
  PageSection,
  Text,
  PageSectionVariants,
  TextContent,
  Flex,
  FlexItem,
  Button,
} from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import {
  engagementFilterFactory,
  engagementSortFactory,
} from '../../common/engagement_filter_factory';
import { Engagement } from '../../schemas/engagement';
import { EngagementFilter } from '../../schemas/engagement_filter';
import { EngagementFilterBar } from '../../components/engagement_filter_bar/engagement_filter_bar';
import { EngagementList } from '../../components/engagement_list/engagement_list';
import { Feature } from '../../components/feature/feature';

export interface EngagementListRouteProps {
  filter?: (engagement: Engagement) => boolean;
  filterDefinition?: EngagementFilter;
  title?: string;
  subtitle?: string;
}

export function EngagementListRoute(props: EngagementListRouteProps) {
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const { engagements: contextEngagements, getEngagements } = useEngagements();

  useEffect(() => {
    if (!hasFetched) {
      setHasFetched(true);
      getEngagements();
    }
  }, [contextEngagements, getEngagements, hasFetched]);
  const { filterDefinition: propsFilter } = props;
  const [filterDefinition, setFilterDefinition] = useState<EngagementFilter>(
    props.filterDefinition
  );

  useEffect(() => {
    setFilterDefinition(propsFilter);
  }, [propsFilter, setFilterDefinition]);

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
      setFilterDefinition(propsFilter);
    },
    [setFilterDefinition]
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
