import React, {useState} from 'react';
import {NotificationBadge} from '@patternfly/react-core';
import {BellIcon} from '@patternfly/react-icons';
import { useNotification } from '../../context/notification_context/notification_context';

export interface NotificationProps {
  onNotificationClick: () => void;
}

export function Notification(props: NotificationProps) {

  const { haveNotification } = useNotification();
  const [isRead, setRead] = useState(!haveNotification);

  const onClick = () => {
    setRead(true);
    props.onNotificationClick();
  };

  return (
    <>
      <NotificationBadge isRead={isRead}
                         onClick={onClick}
                         aria-label="Notifications">
        <BellIcon/>
      </NotificationBadge>
    </>
  );
}
