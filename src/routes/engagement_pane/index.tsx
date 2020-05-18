import React, { useState, useContext, useEffect } from 'react';
import { Alert, Tabs, Tab } from '@patternfly/react-core';
import { BasicInformation } from './tabs/01_basic_information';
import { PointOfContact } from './tabs/02_point_of_contact';
import { ClusterInformation } from './tabs/03_cluster_information';
import { ClusterUsers } from './tabs/04_cluster_users';
import { Loading } from './Loading';
import { EngagementNav } from '../../components/omp_engagement_nav';
import { EngagementContext } from '../../context/engagement_context/engagement_context';
import { OMPEngagementButtonPane } from '../../components/omp_engagement_button_pane';

export function EngagementPane() {
  const [activeTabKey, setActiveTabKey] = useState<number>(0);
  const engagementContext = useContext(EngagementContext);
  
  const handleTabClick = function(this: any, event: any, tabIndex: any) {
    setActiveTabKey(tabIndex);
  };

  useEffect(() => {
    if (!engagementContext.formOptions) {
      engagementContext.getConfig();
    }
  }, [engagementContext]);

  useEffect(() => {
    setActiveTabKey(0);
  }, [engagementContext.activeEngagement]);

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

  const engagementFormRequestError = engagementContext.error;

  return (
    <>
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
                values={engagementContext.engagementFormState}
                onChange={engagementContext.updateEngagementFormField}
              />
            </Tab>
            <Tab id={'poc'} style={tab} eventKey={1} title="Point of Contact">
              <PointOfContact
                values={engagementContext.engagementFormState}
                onChange={engagementContext.updateEngagementFormField}
              />
            </Tab>
            <Tab id={'oc'} style={tab} eventKey={2} title="OpenShift Cluster">
              {!engagementContext.formOptions?.providerOptions ||
              !engagementContext.formOptions?.openshiftOptions ? (
                <Loading />
              ) : (
                <ClusterInformation
                  providerOptions={
                    engagementContext.formOptions?.providerOptions
                  }
                  openshiftOptions={
                    engagementContext.formOptions?.openshiftOptions
                  }
                  values={engagementContext.engagementFormState}
                  onChange={engagementContext.updateEngagementFormField}
                />
              )}
            </Tab>
            <Tab id={'cu'} style={tab} eventKey={3} title="Users">
              <ClusterUsers
                userManagementOptions={
                  engagementContext.formOptions?.userManagementOptions
                }
                values={engagementContext.engagementFormState}
                onChange={engagementContext.updateEngagementFormField}
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
    </>
  );
}
