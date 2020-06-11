import React from 'react';
import { Wizard } from '@patternfly/react-core';
import { BasicInformation } from './tabs/01_basic_information';
import { PointOfContact } from './tabs/02_point_of_contact';
import { ClusterInformation } from './tabs/03_cluster_information';
import { ClusterUsers } from './tabs/04_cluster_users';
import { Loading } from './Loading';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { OMPEngagementButtonPane } from '../../components/omp_engagement_button_pane';

export function EngagementWizard() {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
  } = useEngagements();

  const steps = getWizardSteps(
    formOptions,
    engagementFormState,
    updateEngagementFormField
  );

  return (
    <Wizard
      isInPage
      isCompactNav
      steps={steps}
      footer={<CustomWizardFooter />}
    />
  );
}

function CustomWizardFooter() {
  return (
    <div style={{ zIndex: 100 }}>
      <OMPEngagementButtonPane />
    </div>
  );
}

function getWizardSteps(
  formOptions,
  engagementFormState,
  updateEngagementFormField
) {
  return [
    {
      name: 'Basic Information',
      component: (
        <BasicInformation
          formOptions={formOptions}
          values={engagementFormState}
          onChange={updateEngagementFormField}
        />
      ),
    },
    {
      name: 'Point of Contact',
      component: (
        <PointOfContact
          values={engagementFormState}
          onChange={updateEngagementFormField}
        />
      ),
    },
    {
      name: 'Cluster Information',
      component: !formOptions ? (
        <Loading />
      ) : (
        <ClusterInformation
          formOptions={formOptions}
          values={engagementFormState}
          onChange={updateEngagementFormField}
        />
      ),
    },
    {
      name: 'Users',
      component: (
        <ClusterUsers
          formOptions={formOptions}
          values={engagementFormState}
          onChange={updateEngagementFormField}
        />
      ),
    },
  ];
}
