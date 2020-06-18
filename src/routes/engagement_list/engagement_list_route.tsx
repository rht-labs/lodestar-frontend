import React, { useEffect } from 'react';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import {EngagementList, EngagementListProps} from "./engagement_list";
import {
  PageSection,
  Text,
  PageSectionVariants,
  TextContent,
} from '@patternfly/react-core';
import { Logger } from '../../utilities/logger';

export function EngagementListRoute(props: EngagementListProps) {
  const { engagements: contextEngagements, getEngagements } = useEngagements();
  useEffect(() => {
    if (contextEngagements === undefined) {
      getEngagements();
    }
  }, [contextEngagements, getEngagements]);
  const filteredEngagements =
    props.filter && typeof props.filter === 'function'
      ? (contextEngagements ?? []).filter(props.filter)
      : contextEngagements;
  Logger.info(contextEngagements);
  const title = props.title ?? 'Engagements';
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{title}</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <EngagementList engagements={filteredEngagements} />
      </PageSection>
    </>
  );
}

