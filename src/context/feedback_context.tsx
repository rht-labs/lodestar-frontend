import React, { useState, useContext, useRef, useEffect } from 'react';
import { AlertVariant } from '@patternfly/react-core';

interface FeedbackContext {
  isLoaderVisible: boolean;
  alertMsg: string | null;
  alertType: AlertVariant;
  showAlert: (
    msg: string,
    variant: AlertType,
    timed?: boolean,
    actions?: AlertAction[]
  ) => void;
  hideLoader: () => void;
  showLoader: () => void;
  hideAlert: () => void;
  alertActions: AlertAction[];
}

export const FeedbackContext = React.createContext<FeedbackContext>({
  isLoaderVisible: false,
  alertMsg: null,
  alertType: AlertVariant.success,
  hideAlert: () => {},
  showAlert: (msg: string, variant: AlertType, timed: boolean) => {},
  hideLoader: () => {},
  showLoader: () => {},
  alertActions: [],
});

export interface AlertAction {
  title: string;
  action: () => void;
}

export enum AlertType {
  error,
  success,
}

export interface Alert {
  message: string;
  type: AlertVariant;
  timer: NodeJS.Timer;
  actions?: AlertAction[];
}

export const FeedbackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(false);
  const [alert, setAlert] = useState<Alert>(null);

  const hideLoader = () => setIsLoaderVisible(false);
  const showLoader = () => setIsLoaderVisible(true);

  const hideAlert = () => {
    if (!!alert?.timer) {
      clearTimeout(alert?.timer);
    }
    setAlert(null);
  };

  const hideAlertRef = useRef(hideAlert);
  useEffect(() => clearTimeout(alert?.timer), [alert]);
  const showAlert = (
    msg: string,
    variant: AlertType,
    timed: boolean = true,
    actions: AlertAction[] = []
  ) => {
    setAlert({
      message: msg,
      type:
        variant === AlertType.error
          ? AlertVariant.danger
          : AlertVariant.success,
      timer:
        timed && variant !== AlertType.error
          ? setTimeout(hideAlertRef.current, 5000)
          : null,
      actions,
    });
  };

  return (
    <FeedbackContext.Provider
      value={{
        isLoaderVisible,
        alertMsg: alert?.message,
        alertType: alert?.type,
        hideLoader,
        showLoader,
        hideAlert,
        showAlert,
        alertActions: alert?.actions ?? [],
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);
