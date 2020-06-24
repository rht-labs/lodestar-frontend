import React, { useEffect, useState, useCallback } from 'react';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { EngagementList } from './engagement_list';
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
import { Engagement } from '../../schemas/engagement_schema';
import { EngagementFilter } from '../../schemas/engagement_filter';
import { EngagementFilterBar } from '../../components/engagement_filter/engagement_filter';

export interface EngagementListRouteProps {
  filter?: (engagement: Engagement) => boolean;
  newFilter?: EngagementFilter;
  title: string;
}

export function EngagementListRoute(props: EngagementListRouteProps) {
  const { engagements: contextEngagements, getEngagements } = useEngagements();
  useEffect(() => {
    if (contextEngagements === undefined) {
      getEngagements();
    }
  }, [contextEngagements, getEngagements]);
  const { newFilter } = props;
  const [filterDefinition, setFilterDefinition] = useState<EngagementFilter>(
    props.newFilter
  );

  useEffect(() => {
    setFilterDefinition(newFilter);
  }, [newFilter, setFilterDefinition]);

  const filter = engagementFilterFactory(filterDefinition);
  const sorter = engagementSortFactory(filterDefinition);

  const filteredEngagements = (filter && typeof filter === 'function'
    ? (contextEngagements ?? []).filter(filter)
    : contextEngagements
  ).sort(sorter);

  const title = props.title ?? 'Engagements';
  const history = useHistory();
  const handleChange = useCallback(
    (newFilter: EngagementFilter) => {
      setFilterDefinition(newFilter);
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
            </TextContent>
          </FlexItem>
          <FlexItem>
            <Button onClick={() => history.push('/app/engagements/new')}>
              Create New
            </Button>
          </FlexItem>
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
      <PageSection>
        <EngagementList engagements={filteredEngagements} />
      </PageSection>
    </>
  );
}
