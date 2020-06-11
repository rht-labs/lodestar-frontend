import React, {useState} from "react";
import {Page} from '@patternfly/react-core';
import {Header} from '../components/drawer_and_header/header';
import {Drawer} from '../components/drawer_and_header/drawer';
import {EngagementNavigation} from '../components/drawer_and_header/engagement_navigation';

export interface MainTemplateProps{
  children: React.ReactChild;
}

export const MainTemplate = (props: MainTemplateProps) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

    const onNavToggle = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };

    return (
      <Page header={<Header isDrawerOpen={isDrawerOpen}
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
