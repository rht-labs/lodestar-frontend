import React, { useState, useContext, useRef, useEffect } from 'react';
import { AlertVariant } from '@patternfly/react-core';

interface FeedbackContext {
  isLoaderVisible: boolean;
  alertMsg: string | null;
  alertType: AlertVariant;
  showAlert: (msg: string, variant: AlertType, timed?: boolean) => void;
  hideLoader: () => void;
  showLoader: () => void;
  hideAlert: () => void;
}

export const FeedbackContext = React.createContext<FeedbackContext>({
  isLoaderVisible: false,
  alertMsg: null,
  alertType: AlertVariant.success,
  hideAlert: () => {},
  showAlert: (msg: string, variant: AlertType, timed: boolean) => {},
  hideLoader: () => {},
  showLoader: () => {},
});

export enum AlertType {
  error,
  success,
}

export const FeedbackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>(null);
  const [alertType, setAlertType] = useState<AlertVariant>(null);
  const [alertTimer, setAlertTimer] = useState(null);

  const hideLoader = () => setIsLoaderVisible(false);
  const showLoader = () => setIsLoaderVisible(true);

  const hideAlert = () => {
    setAlertMsg(null);
    if (alertTimer !== null) {
      clearTimeout(alertTimer);
      setAlertTimer(null);
    }
  };

  const hideAlertRef = useRef(hideAlert);
  useEffect(() => clearTimeout(alertTimer), [alertTimer]);
  const showAlert = (
    msg: string,
    variant: AlertType,
    timed: boolean = true
  ) => {
    if (variant === AlertType.error) {
      setAlertType(AlertVariant.danger);
    } else {
      setAlertType(AlertVariant.success);
    }
    setAlertMsg(msg);

    if (timed && variant !== AlertType.error) {
      setAlertTimer(setTimeout(hideAlertRef.current, 5000));
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        isLoaderVisible,
        alertMsg,
        alertType,
        hideLoader,
        showLoader,
        hideAlert,
        showAlert,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);
