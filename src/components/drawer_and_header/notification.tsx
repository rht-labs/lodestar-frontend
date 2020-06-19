import React, {useState} from 'react';
import {NotificationBadge} from '@patternfly/react-core';
import {BellIcon} from '@patternfly/react-icons';

export interface NotificationProps {
  onNotificationClick: () => void;
}

export function Notification(props: NotificationProps) {

  const [isRead, setRead] = useState(false);
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
