import React from 'react';
import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelContent,
} from '@patternfly/react-core';

export interface NotificationContentProps{
  onClose: any;
}

export function NotificationContent(props: NotificationContentProps) {

  return (
    <DrawerPanelContent>
      <DrawerHead>
        <span>drawer-panel</span>
        <DrawerActions>
          <DrawerCloseButton onClick={props.onClose}/>
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  )}
