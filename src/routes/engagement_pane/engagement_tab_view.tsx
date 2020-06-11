import React, { useState } from 'react';
import { EngagementViewProps } from '.';
import { Loading } from './Loading';
import { Tabs, Tab } from '@patternfly/react-core';
import { BasicInformation } from './form_views/01_basic_information';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { PointOfContact } from './form_views/02_point_of_contact';
import { ClusterUsers } from './form_views/04_cluster_users';
import { ClusterInformation } from './form_views/03_cluster_information';

interface EngagementTabViewProps extends EngagementViewProps {}

export function EngagementTabView({ engagement }: EngagementTabViewProps) {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
  } = useEngagements();
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabSelect = (e, tabIndex) => setCurrentTab(tabIndex);
  if (!engagement) {
    return <Loading />;
  }
  return (
    <Tabs activeKey={currentTab} onSelect={handleTabSelect}>
      <Tab title="Overview" eventKey={0}>
        Hello
      </Tab>
      <Tab title="Basic Information" eventKey={1}>
        <BasicInformation
          formOptions={formOptions}
          values={engagementFormState}
          onChange={updateEngagementFormField}
        />
        <PointOfContact
          values={engagementFormState}
          onChange={updateEngagementFormField}
        />
      </Tab>
      <Tab title="Users" eventKey={2}>
        <ClusterUsers
          formOptions={formOptions}
          values={engagementFormState}
          onChange={updateEngagementFormField}
        />
      </Tab>
      <Tab title="Cluster Information" eventKey={3}>
        <ClusterInformation
          formOptions={formOptions}
          values={engagementFormState}
          onChange={updateEngagementFormField}
        />
      </Tab>
    </Tabs>
  );
}
