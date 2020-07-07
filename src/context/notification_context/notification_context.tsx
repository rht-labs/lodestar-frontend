import React, { useCallback, useState } from 'react';
import { Notification } from '../../schemas/notification_schema';
import { useServiceProviders } from '../service_provider_context/service_provider_context';
import { APP_FEATURES } from '../../common/app_features';

interface NotificationContext {
  hasNotification: boolean;
  notifications: Notification[];
  fetchNotifications: () => void;
}

export const NotificationContext = React.createContext<NotificationContext>({
  hasNotification: false,
  notifications: [],
  fetchNotifications: () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hasNotification, setHasNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { notificationService } = useServiceProviders();

  const fetchNotifications = useCallback(async () => {
    const response = await notificationService.fetchNotifications();
    setNotifications(response);
    setHasNotification(true);
  }, [setNotifications, notificationService]);

  function notificationFeed() {
    if (!APP_FEATURES.notifications) {
      return {
        hasNotification,
        notifications,
        fetchNotifications,
      };
    } else {
      return {
        hasNotification: false,
        notifications: [],
        fetchNotifications: () => {},
      };
    }
  }

  return (
    <NotificationContext.Provider value={notificationFeed()}>
      {children}
    </NotificationContext.Provider>
  );
};
