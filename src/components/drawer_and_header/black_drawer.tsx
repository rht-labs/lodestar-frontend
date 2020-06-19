import React, {ReactNode} from 'react';
import {PageSidebar} from '@patternfly/react-core';

export interface BlackDrawerProps {
  isDrawerOpen: boolean;
  children: ReactNode;
}

export function BlackDrawer(props:BlackDrawerProps){
  return(
    <PageSidebar nav={props.children} isNavOpen={props.isDrawerOpen} theme="dark">
    </PageSidebar>
  )
}
