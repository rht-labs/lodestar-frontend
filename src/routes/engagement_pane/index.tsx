import React, { useEffect } from 'react';
import { Alert, Wizard } from '@patternfly/react-core';
import { BasicInformation } from './tabs/01_basic_information';
import { PointOfContact } from './tabs/02_point_of_contact';
import { ClusterInformation } from './tabs/03_cluster_information';
import { ClusterUsers } from './tabs/04_cluster_users';
import { Loading } from './Loading';
import { EngagementNav } from '../../components/omp_engagement_nav';
import { OMPEngagementButtonPane } from '../../components/omp_engagement_button_pane';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { ValidatorFactory } from '../../schemas/validators';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useEngagements } from '../../context/engagement_context/engagement_hook';

const getValidators = (formOptions: EngagementFormConfig = {}) =>
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
  return <div>{props.children}</div>;
}

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
      getConfig();
    }
  }, [formOptions, getConfig]);

  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    display: 'flex',
  };

  const formPane: React.CSSProperties = {
    width: '85%',
  };

  const getWizardSteps = () => {
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
  };
  const engagementFormRequestError = error;

  return (
    <>
      <WizardTemplate>
        <ValidationProvider validators={getValidators(formOptions)}>
          <div style={contentPane}>
            <div style={formPane}></div>
            <OMPEngagementButtonPane />
          </div>
          {engagementFormRequestError ? (
            <Alert isInline title="We encountered an error." variant="danger">
              {engagementFormRequestError.message}
            </Alert>
          ) : null}
        </ValidationProvider>
      </WizardTemplate>
    </>
  );
}
