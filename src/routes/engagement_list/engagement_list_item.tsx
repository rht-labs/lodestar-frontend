import {
  Engagement,
  getEngagementStatus,
} from '../../schemas/engagement_schema';
import React from 'react';
import { EngagementListItemCard } from './engagement_list_item_card';
import { EngagementAtAGlance } from './engagement_at_a_glance';

export function EngagementListItem({ engagement }: { engagement: Engagement }) {
  const status = getEngagementStatus(engagement);
  return (
    <>
      <EngagementListItemCard
        title={engagement.project_name}
        customer={engagement.customer_name}
        project={engagement.project_name}
      >
        <EngagementAtAGlance engagement={engagement} status={status} />
      </EngagementListItemCard>
    </>
  );
}
