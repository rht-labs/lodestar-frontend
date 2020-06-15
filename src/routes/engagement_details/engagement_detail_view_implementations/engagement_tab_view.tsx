import React, { useState } from 'react';
import { EngagementViewProps } from '..';
import { Tabs, Tab, Grid, GridItem, TextContent } from '@patternfly/react-core';
import { BasicInformation } from '../form_views/01_basic_information';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { PointOfContact } from '../form_views/02_point_of_contact';
import { ClusterUsers } from '../form_views/04_cluster_users';
import { ClusterInformation } from '../form_views/03_cluster_information';
import { Engagement } from '../../../schemas/engagement_schema';
import { EngagementSummaryCard } from '../data_cards/engagement_summary_card';
import { PointOfContactCard } from '../data_cards/point_of_contact_card';
import { OpenshiftClusterSummaryCard } from '../data_cards/openshift_cluster_summary';
import { EditPaneWrapper } from '../../../components/edit_pane_wrapper/edit_pane_wrapper';

interface EngagementTabViewProps extends EngagementViewProps {}

export function EngagementTabView({ engagement }: EngagementTabViewProps) {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
  } = useEngagements();
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabSelect = (e, tabIndex) => setCurrentTab(tabIndex);

  return (
    <Tabs isBox activeKey={currentTab} onSelect={handleTabSelect}>
      <Tab title="Overview" eventKey={0} id="overview">
        <TabContentWrapper>
          <EngagementOverview engagement={engagement} />
        </TabContentWrapper>
      </Tab>
      <Tab title="Basic Information" eventKey={1} id="basic_information">
        <TabContentWrapper>
          <EditPaneWrapper engagement={engagement}>
            <BasicInformation
              formOptions={formOptions}
              values={engagementFormState}
              onChange={updateEngagementFormField}
            />
            <PointOfContact
              values={engagementFormState}
              onChange={updateEngagementFormField}
            />
          </EditPaneWrapper>
        </TabContentWrapper>
      </Tab>
      <Tab title="Users" eventKey={2} id="users">
        <TabContentWrapper>
          <EditPaneWrapper engagement={engagement}>
            <ClusterUsers
              formOptions={formOptions}
              values={engagementFormState}
              onChange={updateEngagementFormField}
            />
          </EditPaneWrapper>
        </TabContentWrapper>
      </Tab>
      <Tab title="Cluster Information" eventKey={3} id="cluster_information">
        <TabContentWrapper>
          <EditPaneWrapper engagement={engagement}>
            <ClusterInformation
              formOptions={formOptions}
              values={engagementFormState}
              onChange={updateEngagementFormField}
            />
          </EditPaneWrapper>
        </TabContentWrapper>
      </Tab>
    </Tabs>
  );
}

function TabContentWrapper(props: { children: any }) {
  return <div style={{ paddingTop: 20 }}>{props.children}</div>;
}

function EngagementOverview({ engagement }: { engagement?: Engagement }) {
  return (
    <TextContent>
      <div>
        <Grid hasGutter>
          <GridItem span={6}>
            <EngagementSummaryCard engagement={engagement} />
          </GridItem>
          <GridItem span={6}>
            <PointOfContactCard engagement={engagement} />
          </GridItem>
          <GridItem span={12}>
            <OpenshiftClusterSummaryCard engagement={engagement} />
          </GridItem>
        </Grid>
      </div>
    </TextContent>
  );
}
