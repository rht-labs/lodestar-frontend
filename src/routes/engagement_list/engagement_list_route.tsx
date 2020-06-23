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
  Engagement,
  getEngagementStatus,
} from '../../schemas/engagement_schema';
import { EngagementListFilter } from '../../schemas/engagement_filter';
import { EngagementFilter } from '../../components/engagement_filter/engagement_filter';

export interface EngagementListRouteProps {
  filter?: (engagement: Engagement) => boolean;
  newFilter?: EngagementListFilter;
  title: string;
}

const buildFilter = (
  filter?: EngagementListFilter
): ((engagement: Engagement) => boolean) => {
  if (!filter) {
    return () => true;
  }
  return (engagement: Engagement) => {
    const filterResults: boolean[] = [];
    if (filter.allowedStatuses) {
      filterResults.push(
        filter.allowedStatuses.includes(getEngagementStatus(engagement))
      );
    }
    if (filter.searchTerm) {
      filterResults.push(
        engagement.customer_name.toLowerCase().includes(filter.searchTerm) ||
          engagement.project_name.toLowerCase().includes(filter.searchTerm)
      );
    }
    return !!filterResults.length ? filterResults.every(r => !!r) : true;
  };
};

export function EngagementListRoute(props: EngagementListRouteProps) {
  const { engagements: contextEngagements, getEngagements } = useEngagements();
  useEffect(() => {
    if (contextEngagements === undefined) {
      getEngagements();
    }
  }, [contextEngagements, getEngagements]);
  const { newFilter } = props;
  const [filterDefinition, setFilterDefinition] = useState<
    EngagementListFilter
  >(props.newFilter);

  useEffect(() => {
    setFilterDefinition(newFilter);
  }, [newFilter, setFilterDefinition]);

  const filter = buildFilter(filterDefinition);
  const filteredEngagements =
    filter && typeof filter === 'function'
      ? (contextEngagements ?? []).filter(filter)
      : contextEngagements;

  const title = props.title ?? 'Engagements';
  const history = useHistory();
  const handleChange = useCallback(
    (newFilter: EngagementListFilter) => {
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
          <EngagementFilter filter={filterDefinition} onChange={handleChange} />
        </div>
      </PageSection>
      <PageSection>
        <EngagementList engagements={filteredEngagements} />
      </PageSection>
    </>
  );
}
