import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Page,
  PageHeader,
  PageSidebar,
  PageSection,
  Wizard
} from '@patternfly/react-core';
import BasicInformation from  './Steps/BasicInformation';
import ClusterInformation from './Steps/ClusterInformation';
import PointOfContact from './Steps/PointOfContact';

const App = () => {
  return (
    <Page
      header={
        <PageHeader/>
      }
      sidebar={
        <PageSidebar
          isNavOpen
          theme="dark"
        />
      }
    >
      <PageSection
        style={{height: '92vh'}}
        >
        <Wizard
          isCompactNav
          isInPage
          steps={[
            { name: 'Basic Information', component: <BasicInformation/>, hideCancelButton: true },
            { name: 'Point of Contact', component: <PointOfContact/>, hideCancelButton: true },
            { name: 'Openshift Cluster', component: <ClusterInformation/>, hideCancelButton: true },
          ]}
        />
      </PageSection>
    </Page>
  );
}

export default App;
