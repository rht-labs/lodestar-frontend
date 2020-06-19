import React from 'react';
import { Engagement } from "../../schemas/engagement_schema";
import { EngagementListItem } from './engagement_list_item';

export interface EngagementListProps {
  filter?: (engagement: Engagement) => boolean;
  title?: string;
}

export function EngagementList({ engagements }: { engagements: Engagement[] }) {

  return (
    <>
      {(engagements ?? []).map(e => (
        <EngagementListItem engagement={e} />
      ))}
    </>
  );
}