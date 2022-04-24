import React from 'react';
import { Engagement } from '../../schemas/engagement';
import { EngagementListItem } from '../engagement_list_item/engagement_list_item';
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router';

export interface EngagementListProps {
  filter?: (engagement: Engagement) => boolean;
}

function EngagementListEmptyState(props) {
  const history = useHistory();
  return (
    <EmptyState>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h4" size="lg">
        There's nothing here.
      </Title>
      <EmptyStateBody>
        <p style={{ marginBottom: '1rem' }}>
          There are no engagements that match your search criteria.
        </p>
        <Button onClick={() => history.push('/app/engagements/new')}>
          Create New
        </Button>
      </EmptyStateBody>
    </EmptyState>
  );
}

export function EngagementList({
  engagements,
  onCategorySelect,
}: {
  engagements: Partial<Engagement>[];
  onCategorySelect:(searchTerm:string, category:string) => void
}) {
  if (!engagements || !engagements.length) {
    return <EngagementListEmptyState />;
  }
  return (
    <>
      {(engagements ?? []).map(e => (
        <EngagementListItem
          key={`${e.project_name}${e.customer_name}`}
          engagement={e}
          onCategorySelect={onCategorySelect}
        />
      ))}
    </>
  );
}
