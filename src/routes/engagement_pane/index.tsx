import React, { useEffect } from 'react';
import { Alert, Wizard, PageSection, Text } from '@patternfly/react-core';
import { BasicInformation } from './tabs/01_basic_information';
import { PointOfContact } from './tabs/02_point_of_contact';
import { ClusterInformation } from './tabs/03_cluster_information';
import { ClusterUsers } from './tabs/04_cluster_users';
import { Loading } from './Loading';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { ValidatorFactory } from '../../schemas/validators';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { OMPEngagementButtonPane } from '../../components/omp_engagement_button_pane';
import { Logger } from '../../utilities/logger';

export function EngagementPane() {
  const {
    formOptions,
    getConfig,
    error,
    engagementFormState,
    updateEngagementFormField,
  } = useEngagements();

  useEffect(() => {
    if (!formOptions) {
      Logger.info('getting config');
      getConfig();
    }
  }, [formOptions, getConfig]);

  const validators = getValidatorsFromFormOptions(formOptions);

  const AlertMessage = () => {
    return engagementFormRequestError ? (
      <Alert isInline title="We encountered an error." variant="danger">
        {engagementFormRequestError.message}
      </Alert>
    ) : null;
  };

  const engagementFormRequestError = error;

  const steps = getWizardSteps(
    formOptions,
    engagementFormState,
    updateEngagementFormField
  );

  return (
    <>
      <WizardTemplate>
        <ValidationProvider validators={validators}>
          <AlertMessage />
          <Wizard
            isInPage
            isCompactNav
            steps={steps}
            footer={<CustomWizardFooter />}
          />
        </ValidationProvider>
      </WizardTemplate>
    </>
  );
}

function CustomWizardFooter() {
  return (
    <div style={{ zIndex: 100 }}>
      <OMPEngagementButtonPane />
    </div>
  );
}

const getValidatorsFromFormOptions = (formOptions: EngagementFormConfig = {}) =>
  Object.keys(formOptions || {}).reduce((acc, groupingKey) => {
    return {
      ...acc,
      ...Object.keys(formOptions[groupingKey] ?? {}).reduce(
        (acc, k) => ({
          ...acc,
          [k]: (formOptions?.[groupingKey]?.[k]?.validators || []).map(
            ValidatorFactory
          ),
        }),
        {}
      ),
    };
  }, {});

function WizardTemplate(props: any) {
  return (
    <>
      <PageSection>
        <Text component="h1">Create New Engagement</Text>
      </PageSection>
      <PageSection style={{}}>{props.children}</PageSection>
    </>
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
