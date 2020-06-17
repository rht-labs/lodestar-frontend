import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
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
import { Logger } from '../../utilities/logger';
import { Link, useHistory } from 'react-router-dom';

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
  const history = useHistory();
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
        <EngagementList engagements={filteredEngagements} />
      </PageSection>
    </>
  );
}
export interface EngagementListProps {
  filter?: (engagement: Engagement) => boolean;
  title?: string;
}

function EngagementListItem({ engagement }: { engagement: Engagement }) {
  return (
    <div>
      <Link
        to={`/app/engagements/${engagement.customer_name}/${engagement.project_name}`}
      >
        {engagement.project_name}
      </Link>
    </div>
  );
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
