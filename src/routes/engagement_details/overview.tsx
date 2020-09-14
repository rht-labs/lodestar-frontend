import React from 'react';
import { Engagement } from '../../schemas/engagement';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { EngagementSummaryCard } from '../../components/engagement_data_cards/engagement_summary_card/engagement_summary_card';
import { PointOfContactCard } from '../../components/engagement_data_cards/point_of_contact_card/point_of_contact_card';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { OpenShiftClusterSummaryCard } from '../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';
import { UserCard } from '../../components/engagement_data_cards/user_card/user_card';
import { ActivityHistoryCard } from '../../components/engagement_data_cards/activity_history_card/activity_history_card';
import { SystemStatusCard } from '../../components/engagement_data_cards/system_status_card/system_status_card';
export interface EngagementOverviewTabProps {
  currentEngagement: Engagement;
  currentEngagementChanges: Engagement;
  onChange: (fieldName: string, value: any) => void;
  engagementFormConfig: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
}

export function EngagementOverview({
  currentEngagement,
  currentEngagementChanges,
  missingRequiredFields,
  engagementFormConfig,
  onChange,
  onSave,
}: EngagementOverviewTabProps) {
  return (
    <TextContent>
      <Grid hasGutter>
        <GridItem span={12}>
          <div id="engagement_summary_card">
            <EngagementSummaryCard
              currentEngagementChanges={currentEngagementChanges}
              currentEngagement={currentEngagement}
              onSave={onSave}
              onChange={onChange}
              engagementFormConfig={engagementFormConfig}
              missingRequiredFields={missingRequiredFields}
            />
          </div>
        </GridItem>
        <GridItem span={12}>
          {currentEngagement?.launch ? (
            <div id="system_status_card">
              <SystemStatusCard currentEngagement={currentEngagement} />
            </div>
          ) : (
            <></>
          )}
        </GridItem>
        <GridItem span={12}>
          <div id="poc_card">
            <PointOfContactCard
              onSave={onSave}
              onChange={onChange}
              engagementFormConfig={engagementFormConfig}
              currentEngagement={currentEngagement}
              currentEngagementChanges={currentEngagementChanges}
              missingRequiredFields={missingRequiredFields}
            />
          </div>
        </GridItem>
        <GridItem span={12}>
          <div id="oc_summary_card">
            <OpenShiftClusterSummaryCard
              onSave={onSave}
              onChange={onChange}
              engagementFormConfig={engagementFormConfig}
              currentEngagement={currentEngagement}
              currentEngagementChanges={currentEngagementChanges}
              missingRequiredFields={missingRequiredFields}
            />
          </div>
        </GridItem>
        <GridItem span={12}>
          <div id="user_card">
            <UserCard
              onSave={onSave}
              onChange={onChange}
              engagementFormConfig={engagementFormConfig}
              engagement={currentEngagementChanges}
            />
          </div>
        </GridItem>
        <GridItem span={12}>
          <div id="activity_card">
            <ActivityHistoryCard engagement={currentEngagement} />
          </div>
        </GridItem>
      </Grid>
    </TextContent>
  );
}
