import React from 'react';
import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelContent,
  Alert, Text
} from '@patternfly/react-core';
import {Notification} from "../../schemas/notification_schema";

export interface NotificationContentProps{
  onClose: any;
  notifications: Notification[],
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

      {props.notifications?.map(n => (
        <Alert title={ n.title} variant={ n.type }>
          { n.message }
        </Alert>
        ))}
    </DrawerPanelContent>
  )}
