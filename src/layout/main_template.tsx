import React, {useState} from "react";
import {Page} from '@patternfly/react-core';
import {NavigationBar} from '../components/navigation/navigation_bar';
import {Feedback} from '../components/omp_feedback';
import {Drawer} from '../components/navigation/drawer';

export const MainTemplate =
  ({children}: { children: React.ReactChild }) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

    const onNavToggle = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };

    return (
      <Page header={<NavigationBar isDrawerOpen={isDrawerOpen} onNavToggle={onNavToggle}/>}
            style={{height: '100vh'}}
            sidebar={<Drawer isDrawerOpen={isDrawerOpen}/>
            }>
        <Feedback/>
        {children}
      </Page>
    );
  };
