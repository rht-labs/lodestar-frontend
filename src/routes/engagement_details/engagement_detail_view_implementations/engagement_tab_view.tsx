import React from 'react';
import { EngagementViewProps } from '..';
import { Tabs, Tab } from '@patternfly/react-core';
import { BasicInformation } from '../form_views/01_basic_information';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { PointOfContact } from '../form_views/02_point_of_contact';
import { ClusterUsers } from '../form_views/04_cluster_users';
import { ClusterInformation } from '../form_views/03_cluster_information';
import { EditPaneWrapper } from '../../../components/edit_pane_wrapper/edit_pane_wrapper';
import { useLocation, useHistory } from 'react-router';
import { EngagementOverview } from '../tab_views/overview';
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
        <TabContentWrapper>
          <EngagementOverview engagement={engagementFormState} />
        </TabContentWrapper>
      </Tab>
      <Tab
        title="Basic Information"
        eventKey={TabNames.basicInfo}
        id="basic_information"
      >
        <TabContentWrapper>
          <EditPaneWrapper engagement={engagementFormState}>
            <BasicInformation
              formOptions={formOptions}
              engagement={engagementFormState}
              onChange={updateEngagementFormField}
            />
            <PointOfContact
              engagement={engagementFormState}
              onChange={updateEngagementFormField}
            />
          </EditPaneWrapper>
        </TabContentWrapper>
      </Tab>
      <Tab title="Users" eventKey={TabNames.users} id="users">
        <TabContentWrapper>
          <EditPaneWrapper engagement={engagementFormState}>
            <ClusterUsers
              formOptions={formOptions}
              engagement={engagementFormState}
              onChange={updateEngagementFormField}
            />
          </EditPaneWrapper>
        </TabContentWrapper>
      </Tab>
      <Tab
        title="Cluster Information"
        eventKey={TabNames.clusterInfo}
        id="cluster_information"
      >
        <TabContentWrapper>
          <EditPaneWrapper engagement={engagementFormState}>
            <ClusterInformation
              formOptions={formOptions}
              engagement={engagementFormState}
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
