import React, { useCallback, useState } from 'react';
import { Notification } from '../../schemas/notification';
import { APP_FEATURES } from '../../common/app_features';
import { NotificationService } from '../../services/notification_service/notification_service';

export interface INotificationContext {
  hasNotification: boolean;
  notifications: Notification[];
  fetchNotifications: () => void;
}

export const NotificationContext = React.createContext<INotificationContext>({
  hasNotification: false,
  notifications: [],
  fetchNotifications: () => {},
});

export const NotificationProvider = ({
  children,
  notificationService,
}: {
  children: React.ReactNode;
  notificationService: NotificationService;
}) => {
  const [hasNotification, setHasNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
