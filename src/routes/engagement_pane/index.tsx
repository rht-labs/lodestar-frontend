import React, { useState, useEffect } from 'react';
import { Alert, Tabs, Tab } from '@patternfly/react-core';
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

export function EngagementPane() {
  const [activeTabKey, setActiveTabKey] = useState<number>(0);
  const {
    formOptions,
    getConfig,
    activeEngagement,
    error,
    engagementFormState,
    updateEngagementFormField,
  } = useEngagements();

  const handleTabClick = function(this: any, event: any, tabIndex: any) {
    setActiveTabKey(tabIndex);
  };

  useEffect(() => {
    if (!formOptions) {
      getConfig();
    }
  }, [formOptions, getConfig]);

  useEffect(() => {
    setActiveTabKey(0);
  }, [activeEngagement]);

  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    display: 'flex',
  };

  const columnPane: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    width: '15%',
    borderRight: '1px solid #AFBAC4',
  };

  const formPane: React.CSSProperties = {
    width: '85%',
  };

  const tabs: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
  };

  const tab: React.CSSProperties = {
    borderBottom: '.5px solid #AFBAC4',
    borderRight: '.5px solid #AFBAC4',
  };

  const engagementFormRequestError = error;

  return (
    <>
      <ValidationProvider
        validators={getValidators(engagementContext?.formOptions)}
      >
        <div style={contentPane}>
          <div style={columnPane}>
            <EngagementNav />
          </div>
          <div style={formPane}>
            <Tabs
              style={tabs}
              isFilled
              activeKey={activeTabKey}
              onSelect={handleTabClick}
            >
              <Tab
                id={'basic_info'}
                style={tab}
                eventKey={0}
                title="Basic Information"
              >
                <BasicInformation
                  formOptions={formOptions}
                  values={engagementFormState}
                  onChange={updateEngagementFormField}
                />
              </Tab>
              <Tab id={'poc'} style={tab} eventKey={1} title="Point of Contact">
                <PointOfContact
                  values={engagementFormState}
                  onChange={updateEngagementFormField}
                />
              </Tab>
              <Tab id={'oc'} style={tab} eventKey={2} title="OpenShift Cluster">
                {!formOptions?.providerOptions ||
                !formOptions?.openshiftOptions ? (
                  <Loading />
                ) : (
                  <ClusterInformation
                    formOptions={formOptions}
                    values={engagementFormState}
                    onChange={updateEngagementFormField}
                  />
                )}
              </Tab>
              <Tab id={'cu'} style={tab} eventKey={3} title="Users">
                <ClusterUsers
                  formOptions={formOptions}
                  values={engagementFormState}
                  onChange={updateEngagementFormField}
                />
              </Tab>
            </Tabs>
          </div>
          <OMPEngagementButtonPane />
        </div>
        {engagementFormRequestError ? (
          <Alert isInline title="We encountered an error." variant="danger">
            {engagementFormRequestError.message}
          </Alert>
        ) : null}
      </ValidationProvider>
    </>
  );
}
