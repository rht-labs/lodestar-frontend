import React from 'react';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { EngagementSummaryCard } from '../../components/engagement_data_cards/engagement_summary_card/engagement_summary_card';
import { PointOfContactCard } from '../../components/engagement_data_cards/point_of_contact_card/point_of_contact_card';
import { OpenShiftClusterSummaryCard } from '../../components/engagement_data_cards/openshift_cluster_card/openshift_cluster_card';
import { UserCard } from '../../components/engagement_data_cards/user_card/user_card';
import { ActivityHistoryCard } from '../../components/engagement_data_cards/activity_history_card/activity_history_card';
import { SystemStatusCard } from '../../components/engagement_data_cards/system_status_card/system_status_card';
import { FormManager } from '../../context/form_manager/form_manager';
import { EngagementTimelineCard } from '../../components/engagement_data_cards/engagement_timeline_card/engagement_timeline_card';
import { useEngagements } from '../../context/engagement_context/engagement_hook';

export function EngagementOverview() {
  const { currentEngagement } = useEngagements();
  return (
    <TextContent>
      <FormManager.Manager>
        <Grid hasGutter>
          <GridItem span={12}>
            <div id="engagement_summary_card">
              <FormManager.Group groupName="Engagement Summary">
                <EngagementSummaryCard />
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
                <PointOfContactCard />
              </FormManager.Group>
            </div>
          </GridItem>
          <GridItem span={12}>
            <div id="user_card">
              <FormManager.Group groupName="Users">
                <UserCard />
              </FormManager.Group>
            </div>
          </GridItem>
          <GridItem span={12}>
            <div id="oc_summary_card">
              <FormManager.Group groupName="Hosting Environment">
                <OpenShiftClusterSummaryCard />
              </FormManager.Group>
            </div>
          </GridItem>
          <GridItem span={12}>
            <div id="timeline_card">
              <FormManager.Group groupName="Engagement Artifacts">
                <EngagementTimelineCard />
              </FormManager.Group>
            </div>
          </GridItem>
          <GridItem span={12}>
            <div id="activity_card">
              <FormManager.Group groupName="Activity History">
                <ActivityHistoryCard />
              </FormManager.Group>
            </div>
          </GridItem>
        </Grid>
      </FormManager.Manager>
    </TextContent>
  );
}
