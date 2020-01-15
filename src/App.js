import React, { useState } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Page,
  PageHeader,
  PageSidebar,
  PageSection,
  Wizard
} from '@patternfly/react-core';
import BasicInformation from  './BasicInformation';
import ClusterInformation from './ClusterInformation';
import PointOfContact from './PointOfContact';

const App = () => {
  const [isNavOpen, toggleNav] = useState(false);
  return (
    <Page
      header={
        <PageHeader
          showNavToggle
          isNavOpen={isNavOpen}
          onNavToggle={toggleNav}
        />
      }
      sidebar={
        <PageSidebar
          nav="Navigation"
          isNavOpen={isNavOpen}
          theme="dark"
        />
      }
    >
      <PageSection
        style={{height: '92vh'}}
        >
        <Wizard
          isInPage
          onClose={() => console.log('closed')}
          steps={[
            { name: 'Basic Information', component: <BasicInformation/> },
            { name: 'Point of Contact', component: <PointOfContact/> },
            { name: 'Openshift Cluster', component: <ClusterInformation/> },
            { name: 'Tools and Services', component: <p>Step 4</p> },
            { name: 'Users', component: <p>Final Step</p>, hideCancelButton: true, nextButtonText: 'Done' }
          ]}
        />
      </PageSection>
    </Page>
  );
}

export default App;
