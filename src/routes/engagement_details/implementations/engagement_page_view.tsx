import React from 'react';
import { EngagementViewProps } from '..';
import { Tabs, Tab } from '@patternfly/react-core';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { ClusterUsers } from '../tab_views/users';
import { EditPaneWrapper } from '../../../components/edit_pane_wrapper/edit_pane_wrapper';
import { useLocation, useHistory } from 'react-router';
import { EngagementOverviewTab } from '../tab_views/overview';
import { HostingEnvironmentTab } from '../tab_views/hosting_environment';
interface EngagementPageViewProps extends EngagementViewProps {}

enum TabNames {
  overview = 'overview',
  users = 'users',
  hostingEnvironment = 'hosting_environment',
}

export function EngagementPageView({ engagement }: EngagementPageViewProps) {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
    saveEngagement,
  } = useEngagements();

  return (
    <>
      <EngagementOverviewTab
        onSave={saveEngagement}
        formOptions={formOptions}
        onChange={updateEngagementFormField}
        engagement={engagementFormState}
      />
    </>
  );
}
