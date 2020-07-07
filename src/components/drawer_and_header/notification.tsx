import React, { useState } from 'react';
import { NotificationBadge } from '@patternfly/react-core';
import { BellIcon } from '@patternfly/react-icons';
import { useNotification } from '../../context/notification_context/notification_hook';

export interface NotificationProps {
  onNotificationClick: () => void;
}

export function Notification(props: NotificationProps) {
  const { hasNotification } = useNotification();
  const [isRead, setRead] = useState(!hasNotification);

  const onClick = () => {
    setRead(true);
    props.onNotificationClick();
  };

  return (
    <>
      <NotificationBadge
        isRead={isRead}
        onClick={onClick}
        title="Notifications"
        aria-label="Notifications"
      >
        <BellIcon />
      </NotificationBadge>
    </>
  );
}
