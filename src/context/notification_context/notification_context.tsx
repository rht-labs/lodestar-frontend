import React, {useCallback, useState} from 'react';
import {Notification} from '../../schemas/notification_schema'
import {useServiceProviders} from "../service_provider_context/service_provider_context";

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

  return (
      <NotificationContext.Provider
        value={{
          hasNotification,
          notifications,
          fetchNotifications
        }}
      >
        {children}
      </NotificationContext.Provider>
  );
};
