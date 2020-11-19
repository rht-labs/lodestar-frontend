import React from 'react';
import { Engagement, Artifact } from '../../schemas/engagement';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { EngagementSummaryCard } from '../../components/engagement_data_cards/engagement_summary_card/engagement_summary_card';
import { PointOfContactCard } from '../../components/engagement_data_cards/point_of_contact_card/point_of_contact_card';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { OpenShiftClusterSummaryCard } from '../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';
import { UserCard } from '../../components/engagement_data_cards/user_card/user_card';
import { ActivityHistoryCard } from '../../components/engagement_data_cards/activity_history_card/activity_history_card';
import { SystemStatusCard } from '../../components/engagement_data_cards/system_status_card/system_status_card';
import { FormManager } from '../../context/form_manager/form_manager';
import { EngagementTimelineCard } from '../../components/engagement_data_cards/engagement_timeline_card/engagement_timeline_card';
export interface EngagementOverviewTabProps {
  clearCurrentChanges: () => void;
  currentEngagement: Engagement;
  currentEngagementChanges: Engagement;
  onChange: (fieldName: string, value: any) => void;
  engagementFormConfig: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
}

export function EngagementOverview({
  clearCurrentChanges,
  currentEngagement,
  currentEngagementChanges,
  missingRequiredFields,
  engagementFormConfig,
  onChange,
  onSave,
}: EngagementOverviewTabProps) {
  return (
    <TextContent>
      <FormManager.Manager>
        <Grid hasGutter>
          <GridItem span={12}>
            <div id="engagement_summary_card">
              <FormManager.Group groupName="Engagement Summary">
                <EngagementSummaryCard
                  currentEngagementChanges={currentEngagementChanges}
                  currentEngagement={currentEngagement}
                  onSave={onSave}
                  onChange={onChange}
                  engagementFormConfig={engagementFormConfig}
                  missingRequiredFields={missingRequiredFields}
                  onClear={clearCurrentChanges}
                />
              </FormManager.Group>
            </div>
          </GridItem>
          {currentEngagement?.launch ? (
            <GridItem span={12}>
              <FormManager.Group groupName="System Status">
                <div id="system_status_card">
                  <SystemStatusCard currentEngagement={currentEngagement} />
                </div>
              </FormManager.Group>
            </GridItem>
          ) : (
            <></>
          )}
          <GridItem span={12}>
            <div id="poc_card">
              <FormManager.Group groupName="Point of Contact">
                <PointOfContactCard
                  onSave={onSave}
                  onClear={clearCurrentChanges}
                  onChange={onChange}
                  engagementFormConfig={engagementFormConfig}
                  currentEngagement={currentEngagement}
                  currentEngagementChanges={currentEngagementChanges}
                  missingRequiredFields={missingRequiredFields}
                />
              </FormManager.Group>
            </div>
          </GridItem>
          <GridItem span={12}>
            <div id="user_card">
              <FormManager.Group groupName="Users">
                <UserCard
                  onSave={onSave}
                  onClear={clearCurrentChanges}
                  onChange={onChange}
                  engagementFormConfig={engagementFormConfig}
                  engagement={currentEngagementChanges}
                />
              </FormManager.Group>
            </div>
          </GridItem>
          <GridItem span={12}>
            <div id="oc_summary_card">
              <FormManager.Group groupName="Hosting Environment">
                <OpenShiftClusterSummaryCard
                  onSave={hostingEnvironments => {
                    onSave({
                      ...currentEngagementChanges,
                      hosting_environments: hostingEnvironments,
                    });
                  }}
                  onClear={clearCurrentChanges}
                  onChange={hostingEnvironments => {
                    onChange('hosting_environments', hostingEnvironments);
                  }}
                  engagementFormConfig={engagementFormConfig}
                  currentEngagementChanges={currentEngagementChanges}
                  missingRequiredFields={missingRequiredFields}
                />
              </FormManager.Group>
            </div>
          </GridItem>
          <GridItem span={12}>
            <div id="timeline_card">
              <FormManager.Group groupName="Engagement Artifacts">
                <EngagementTimelineCard
                  artifacts={currentEngagementChanges.artifacts}
                  onClear={clearCurrentChanges}
                  onSave={(artifacts: Artifact[]) => {
                    onSave({ ...currentEngagementChanges, artifacts });
                  }}
                  onChangeArtifacts={value => onChange('artifacts', value)}
                />
              </FormManager.Group>
            </div>
          </GridItem>
          <GridItem span={12}>
            <div id="activity_card">
              <FormManager.Group groupName="Activity History">
                <ActivityHistoryCard engagement={currentEngagement} />
              </FormManager.Group>
            </div>
          </GridItem>
        </Grid>
      </FormManager.Manager>
    </TextContent>
  );
}
