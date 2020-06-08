import React from 'react';
import {PageSidebar} from '@patternfly/react-core';
import {EngagementNavigation} from './engagement_navigation';

export interface DrawerProps {
  isDrawerOpen: boolean;
}

export function Drawer(props:DrawerProps){
  return(
    <PageSidebar nav={<EngagementNavigation/>} isNavOpen={props.isDrawerOpen} theme="dark" >
    </PageSidebar>
  )
}
