import React, {useCallback, useState} from 'react';
import {Notification} from '../../schemas/notification_schema'
import {useServiceProviders} from "../service_provider_context/service_provider_context";
import {FEATURE_FLAG_NOTIFICATION} from "../../common/feature_flags";

interface NotificationContext {
  hasNotification: boolean;
  notifications: Notification[],
  fetchNotifications: () => void,
}

export const NotificationContext = React.createContext<NotificationContext>({
  hasNotification: false,
  notifications: [],
  fetchNotifications: () => {
  }
});

export const NotificationProvider = ({children}: {
  children: React.ReactNode;
}) => {

  const [hasNotification, setHasNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {notificationService} = useServiceProviders();

  const fetchNotifications = useCallback(
    async () => {
      const response = await (notificationService.fetchNotifications());
      setNotifications(response);
      setHasNotification(true);
    },
    [setNotifications, notificationService],
  );

  function notificationFeed() {
    if (!FEATURE_FLAG_NOTIFICATION) {
      return ({
        hasNotification,
        notifications,
        fetchNotifications
      })
    }
    else {
      return (
        {
          hasNotification: false,
          notifications: [],
          fetchNotifications: () => {}
        }
      )
    }
  }

  return (
    <NotificationContext.Provider value={ notificationFeed() } >
      {children}
    </NotificationContext.Provider>
  );
};
