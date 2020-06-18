import {Engagement} from "../../schemas/engagement_schema";
import React from 'react';
import {EngagementListItemCard} from './engagement_list_item_card';
import {EngagementDetails} from './engagement_details';

function EngagementStatus(launchDate?: Date, startDate?: Date, endDate?: Date): string {
  const Today = new Date();

  if (launchDate) {
    if (startDate <= Today && endDate > Today) {
      return "active";
    }
    else return "past";
  }
  else return "upcoming";
}

export function EngagementListItem({engagement}: { engagement: Engagement }) {

  const status = EngagementStatus(engagement.launch, engagement.start_date, engagement.end_date);
  return (
    <>
      <EngagementListItemCard title={engagement.project_name}>
        <EngagementDetails engagement={engagement} status={status}/>
      </EngagementListItemCard>
    </>
  );
}