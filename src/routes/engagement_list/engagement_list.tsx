import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { PageSection, Text } from '@patternfly/react-core';
import { Logger } from '../../utilities/logger';

export interface EngagementListProps {
  filter?: (engagement: Engagement) => boolean;
  title?: string;
}

function EngagementListItem({ engagement }: { engagement: Engagement }) {
  return <div>{engagement.project_name}</div>;
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

export function EngagementListView(props: EngagementListProps) {
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
      <PageSection>
        <Text component="h1">{title}</Text>
      </PageSection>
      <PageSection>
        <EngagementList engagements={filteredEngagements} />
      </PageSection>
    </>
  );
}
