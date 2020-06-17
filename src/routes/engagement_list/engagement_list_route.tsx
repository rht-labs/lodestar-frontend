import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import {
  PageSection,
  Text,
  PageSectionVariants,
  TextContent,
} from '@patternfly/react-core';
import { Logger } from '../../utilities/logger';
import { EngagementListItem } from './engagement_list_item';

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
export interface EngagementListProps {
  filter?: (engagement: Engagement) => boolean;
  title?: string;
}

function EngagementList({ engagements }: { engagements: Engagement[] }) {

  return (
    <>
      {(engagements ?? []).map(e => (
        <EngagementListItem engagement={e} />
      ))}
    </>

  );
}
