import React from 'react';
import { EngagementViewProps } from '..';
import { Tabs, Tab } from '@patternfly/react-core';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { ClusterUsers } from '../tab_views/users';
import { EditPaneWrapper } from '../../../components/edit_pane_wrapper/edit_pane_wrapper';
import { useLocation, useHistory } from 'react-router';
import { EngagementOverviewTab } from '../tab_views/overview';
import { HostingEnvironmentTab } from '../tab_views/hosting_environment';
interface EngagementTabViewProps extends EngagementViewProps {}

enum TabNames {
  overview = 'overview',
  users = 'users',
  hostingEnvironment = 'hosting_environment',
}

export function EngagementTabView({ engagement }: EngagementTabViewProps) {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
    saveEngagement,
  } = useEngagements();
  const { pathname } = useLocation();
  const history = useHistory();
  const handleTabSelect = (_, tabIndex) => {
    history.push(
      `/app/engagements/${engagementFormState.customer_name}/${engagementFormState.project_name}/${tabIndex}`
    );
  };

  function getActiveKey() {
    const activeTab = Object.keys(TabNames).find(e => {
      return pathname.includes(TabNames[e]);
    });
    if (activeTab) {
      return TabNames[activeTab];
    }
    return TabNames.overview;
  }

  return (
    <Tabs isBox activeKey={getActiveKey()} onSelect={handleTabSelect}>
      <Tab title="Overview" eventKey={TabNames.overview} id="overview">
        <TabContentWrapper>
          <EngagementOverviewTab
            onSave={saveEngagement}
            formOptions={formOptions}
            onChange={updateEngagementFormField}
            engagement={engagementFormState}
          />
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
        title="Hosting Environment"
        eventKey={TabNames.hostingEnvironment}
        id={'hosting_environment'}
      >
        <TabContentWrapper>
          <EditPaneWrapper engagement={engagementFormState}>
            <HostingEnvironmentTab
              onSave={saveEngagement}
              formOptions={formOptions}
              engagement={engagement}
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
