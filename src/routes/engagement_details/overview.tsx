import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { EngagementSummaryCard } from '../../components/engagement_data_cards/engagement_summary_card/engagement_summary_card';
import { PointOfContactCard } from '../../components/engagement_data_cards/point_of_contact_card/point_of_contact_card';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { OpenShiftClusterSummaryCard } from '../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';
import { UserCard } from '../../components/engagement_data_cards/user_card/user_card';
import { ActivityHistoryCard } from '../../components/engagement_data_cards/activity_history_card/activity_history_card';
import { SystemStatusCard } from '../../components/engagement_data_cards/system_status_card/system_status_card';
import { FormManager } from '../../context/form_manager/form_manager';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { EngagementTimelineCard } from '../../components/engagement_data_cards/engagement_timeline_card/engagement_timeline_card';
export interface EngagementOverviewTabProps {
  currentEngagement: Engagement;
  currentEngagementChanges: Engagement;
  onChange: (fieldName: string, value: any) => void;
  engagementFormConfig: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
}

function EngagementFormManagerMediator({ children }) {
  const { fieldGroups } = FormManager.useFormManager();
  const { setFieldGroups } = useEngagements();

  useEffect(() => setFieldGroups(fieldGroups), [fieldGroups, setFieldGroups]);
  return children;
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
      <FormManager.Manager>
        <EngagementFormManagerMediator>
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
                  />
                </FormManager.Group>
              </div>
            </GridItem>
            <GridItem span={12}>
              {currentEngagement?.launch ? (
                <FormManager.Group groupName="System Status">
                  <div id="system_status_card">
                    <SystemStatusCard currentEngagement={currentEngagement} />
                  </div>
                </FormManager.Group>
              ) : (
                <></>
              )}
            </GridItem>
            <GridItem span={12}>
              <div id="poc_card">
                <FormManager.Group groupName="Point of Contact">
                  <PointOfContactCard
                    onSave={onSave}
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
              <div id="oc_summary_card">
                <FormManager.Group groupName="Hosting Environment">
                  <OpenShiftClusterSummaryCard
                    onSave={onSave}
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
                    onChange={onChange}
                    engagementFormConfig={engagementFormConfig}
                    engagement={currentEngagementChanges}
                  />
                </FormManager.Group>
              </div>
            </GridItem>
            <GridItem span={12}>
              <div id="timeline_card">
                <FormManager.Group groupName="Activity Timeline">
                  <EngagementTimelineCard
                    engagementFormConfig={engagementFormConfig}
                    artifacts={currentEngagementChanges.artifacts}
                    onSave={() => onSave(currentEngagementChanges)}
                    onChangeArtifacts={value =>
                      onChange('engagement_artifacts', value)
                    }
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
        </EngagementFormManagerMediator>
      </FormManager.Manager>
    </TextContent>
  );
}
