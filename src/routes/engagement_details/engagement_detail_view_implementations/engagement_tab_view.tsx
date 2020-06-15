import React from 'react';
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
<<<<<<< HEAD
import { useLocation, useHistory } from 'react-router';
=======
>>>>>>> aeecaa6afbe721a620cbfa6ad3f5afd4c34c8128

interface EngagementTabViewProps extends EngagementViewProps {}

enum TabNames {
  basicInfo = 'basic_info',
  clusterInfo = 'cluster_info',
  users = 'users',
  overview = 'overview',
}

export function EngagementTabView({ engagement }: EngagementTabViewProps) {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
  } = useEngagements();
<<<<<<< HEAD
  const { pathname } = useLocation();
  const history = useHistory();
  const handleTabSelect = (_, tabIndex) => {
    history.push(
      `/app/engagements/${engagementFormState.customer_name}/${engagementFormState.project_name}/${tabIndex}`
    );
  };

  function getActiveKey() {
    if (pathname.includes('overview')) {
      return TabNames.overview;
    } else if (pathname.includes('basic_info')) {
      return TabNames.basicInfo;
    } else if (pathname.includes('cluster_info')) {
      return TabNames.clusterInfo;
    } else if (pathname.includes('users')) {
      return TabNames.users;
    }
    return TabNames.overview;
  }

  return (
    <Tabs isBox activeKey={getActiveKey()} onSelect={handleTabSelect}>
      <Tab title="Overview" eventKey={TabNames.overview} id="overview">
=======
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabSelect = (e, tabIndex) => setCurrentTab(tabIndex);

  return (
    <Tabs isBox activeKey={currentTab} onSelect={handleTabSelect}>
      <Tab title="Overview" eventKey={0} id="overview">
>>>>>>> aeecaa6afbe721a620cbfa6ad3f5afd4c34c8128
        <TabContentWrapper>
          <EngagementOverview engagement={engagement} />
        </TabContentWrapper>
      </Tab>
<<<<<<< HEAD
      <Tab
        title="Basic Information"
        eventKey={TabNames.basicInfo}
        id="basic_information"
      >
=======
      <Tab title="Basic Information" eventKey={1} id="basic_information">
>>>>>>> aeecaa6afbe721a620cbfa6ad3f5afd4c34c8128
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
<<<<<<< HEAD
      <Tab title="Users" eventKey={TabNames.users} id="users">
=======
      <Tab title="Users" eventKey={2} id="users">
>>>>>>> aeecaa6afbe721a620cbfa6ad3f5afd4c34c8128
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
<<<<<<< HEAD
      <Tab
        title="Cluster Information"
        eventKey={TabNames.clusterInfo}
        id="cluster_information"
      >
=======
      <Tab title="Cluster Information" eventKey={3} id="cluster_information">
>>>>>>> aeecaa6afbe721a620cbfa6ad3f5afd4c34c8128
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
