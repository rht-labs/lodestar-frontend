import React, { useState, useContext } from 'react';
import { Notification_type } from './notification_type';

interface NotificationContext {
  haveNotification: boolean;
  notification: [
    {
      title: string,
      message: string,
      type: "default" | "info" | "warning" | "success" | "danger" | undefined
    }]
}

export const NotificationContext = React.createContext<NotificationContext>({
  haveNotification: true,
  notification: [
    {
    title: 'Test Title 1',
    message: 'Test Message 1',
    type: Notification_type.SUCCESS
    },
    {
      title: 'Test Title 2',
      message: 'Test Message 2',
      type: Notification_type.INFO
    },
    {
      title: 'Test Title 3',
      message: 'Test Message 3',
      type: Notification_type.WARNING
    },
    {
      title: 'Test Title 4',
      message: 'Test Message 4',
      type: Notification_type.DANGER
    },
  ]
});

// export const FeedbackProvider = ({children}: {
//   children: React.ReactNode;
// }) => {
//
//   const [isNotification, useNotification] = useState<boolean>(false);
//
//   return (
//     <NotificationContext.Provider
//       value={{ notificationMsgs: "this is a test", haveNotification: true }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

export const useNotification = () => useContext(NotificationContext);
