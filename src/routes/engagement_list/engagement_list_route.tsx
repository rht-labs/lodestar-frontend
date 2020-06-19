import React, { useEffect } from 'react';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import {EngagementList, EngagementListProps} from "./engagement_list";
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
import { useHistory } from 'react-router-dom';

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
