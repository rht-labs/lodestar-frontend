import React, { useState, useContext } from 'react';
import { Alert, Tabs, Tab } from '@patternfly/react-core';
import { BasicInformation } from './tabs/01_basic_information';
import { PointOfContact } from './tabs/02_point_of_contact';
import { ClusterInformation } from './tabs/03_cluster_information';
import { ClusterUsers } from './tabs/04_cluster_users';
import { EngagementFormContext } from '../../context/engagement_form_context';
import { Loading } from './Loading';
import { EngagementNav } from '../../components/engagement_nav';
// import { LaunchCluster } from './tabs/05_launch_cluster';

export function EngagementPane() {
  const [activeTabKey, setActiveTabKey] = useState<number>(0);
  const engagementFormContext = useContext(EngagementFormContext);

  const handleTabClick = function(this: any, event: any, tabIndex: any) {
    setActiveTabKey(tabIndex);
  };

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

  const engagementFormRequestError = engagementFormContext.error;
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
            <Tab eventKey={0} title="Basic Information">
              <BasicInformation
                values={engagementFormContext.state}
                onChange={engagementFormContext.dispatch}
              />
            </Tab>
            <Tab eventKey={1} title="Point of Contact">
              <PointOfContact
                values={engagementFormContext.state}
                onChange={engagementFormContext.dispatch}
              />
            </Tab>
            <Tab eventKey={2} title="OpenShift Cluster">
              {engagementFormContext.clusterOptions === null ? (
                <Loading />
              ) : (
                <ClusterInformation
                  options={engagementFormContext.clusterOptions}
                  values={engagementFormContext.state}
                  onChange={engagementFormContext.dispatch}
                />
              )}
            </Tab>
            <Tab eventKey={3} title="Cluster Users">
              <ClusterUsers
                options={engagementFormContext.clusterOptions}
                values={engagementFormContext.state}
                onChange={engagementFormContext.dispatch}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
      {engagementFormRequestError ? (
        <Alert isInline title="We encountered an error." variant="danger">
          {engagementFormRequestError.message}
        </Alert>
      ) : null}
    </>
  );
}
