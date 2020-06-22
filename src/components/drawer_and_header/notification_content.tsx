import React from 'react';
import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelContent,
  Alert, Text
} from '@patternfly/react-core';

export interface NotificationContentProps{
  onClose: any;
  notification: [
    {
      title: string,
      message: string,
      type: "default" | "info" | "warning" | "success" | "danger" | undefined
    }]
}

export function NotificationContent(props: NotificationContentProps) {

  return (
    <DrawerPanelContent>
      <DrawerHead>
        <Text>
          <b> All Notifications </b>
        </Text>
        <DrawerActions>
          <DrawerCloseButton onClick={props.onClose}/>
        </DrawerActions>
      </DrawerHead>

      {props.notification?.map(n => (
        <Alert title={ n.title} variant={ n.type }>
          { n.message }
        </Alert>
        ))}
    </DrawerPanelContent>
  )}
