import React, {useState} from "react";
import {Page} from '@patternfly/react-core';
import {NavigationBar} from '../components/navigation/navigation_bar';
import {Drawer} from '../components/navigation/drawer';
import {EngagementNavigation} from '../components/navigation/engagement_navigation';

export interface MainTemplateProps{
  children: React.ReactChild;
}

export const MainTemplate = (props: MainTemplateProps) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

    const onNavToggle = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };

    return (
      <Page header={<NavigationBar isDrawerOpen={isDrawerOpen}
                                   onNavToggle={onNavToggle}/>}
            style={{height: '100vh'}}
            sidebar={
              <Drawer isDrawerOpen={isDrawerOpen}>
                <EngagementNavigation/>
              </Drawer>
            }>
        {props.children}
      </Page>
    );
  };
