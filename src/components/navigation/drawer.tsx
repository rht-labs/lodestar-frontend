import React, {ReactNode} from 'react';
import {PageSidebar} from '@patternfly/react-core';

export interface DrawerProps {
  isDrawerOpen: boolean;
  children: ReactNode;
}

export function Drawer(props:DrawerProps){
  return(
    <PageSidebar nav={props.children} isNavOpen={props.isDrawerOpen} theme="dark">
    </PageSidebar>
  )
}
