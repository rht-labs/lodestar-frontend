import React from 'react';
import {
  Alert,
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelContent,
  EmptyState, EmptyStateBody, EmptyStateIcon,
  Text, Title
} from '@patternfly/react-core';
import {Notification} from "../../schemas/notification_schema";
import {BellIcon} from "@patternfly/react-icons";

export interface NotificationContentProps {
  onClose: any;
  notifications: Notification[],
}

function NotificationItems({notifications}: {notifications?: Notification[]}) {
  if (notifications?.length === 0) {
    return (
      <>
        <EmptyState>
          <EmptyStateIcon icon={BellIcon} />
          <Title size="lg" headingLevel="h4">
            No new notifications
          </Title>
          <EmptyStateBody>
            No new notifications are available. Please come back later.
          </EmptyStateBody>
        </EmptyState>
      </>
    )
  }
  else {
    return (
      <>
        {notifications?.map(n => (
          <Alert title={n.title} variant={n.type}>
            {n.message}
          </Alert>
        ))}
      </>
    )
  }
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
      <NotificationItems notifications={props.notifications}/>
    </DrawerPanelContent>
  )
}
