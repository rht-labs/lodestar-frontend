import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { EngagementListItem } from './engagement_list_item';
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

export interface EngagementListProps {
  filter?: (engagement: Engagement) => boolean;
  title?: string;
}

export function EngagementList({ engagements }: { engagements: Engagement[] }) {
  if (!engagements || !engagements.length) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          There's nothing here.
        </Title>
        <EmptyStateBody>
          <p>There are no engagements that match your search criteria.</p>
        </EmptyStateBody>
      </EmptyState>
    );
  }
  return (
    <>
      {(engagements ?? []).map(e => (
        <EngagementListItem engagement={e} />
      ))}
    </>
  );
}
