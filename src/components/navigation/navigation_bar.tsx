import React from 'react';
import {Brand, PageHeader, Toolbar,} from '@patternfly/react-core';

export interface NavigationBarProps{
  isDrawerOpen: boolean;
  onNavToggle: ()=>void;
}
export function NavigationBar(props:NavigationBarProps) {

  return (
    <PageHeader
      showNavToggle
      isNavOpen={props.isDrawerOpen}
      onNavToggle={props.onNavToggle}
      logo={
        <div>
          <Toolbar>
            <Brand
              alt="Open Innovation Labs"
              src={`${process.env.PUBLIC_URL}/oil_logo.png`}
            ></Brand>
            <div style={{width: 50}}/>
          </Toolbar>
        </div>
      }
    ></PageHeader>
  );
}
