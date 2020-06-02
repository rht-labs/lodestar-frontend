import React, { useState, useContext } from 'react';
import { AlertVariant } from '@patternfly/react-core';

interface FeedbackContext {
  isLoaderVisible: boolean;
  alertMsg: string | null;
  alertType: AlertVariant;
  showAlert: (msg: string, variant: string, timed?: boolean) => void;
  hideLoader: () => void;
  showLoader: () => void;
  hideAlert: () => void;
}

export const FeedbackContext = React.createContext<FeedbackContext>({
  isLoaderVisible: false,
  alertMsg: null,
  alertType: AlertVariant.success,
  hideAlert: () => {},
  showAlert: (msg: string, variant: string, timed: boolean) => {},
  hideLoader: () => {},
  showLoader: () => {},
});

export const FeedbackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);
  const [alertMsg, setAlertMsg] = useState<string>(null);
  const [alertType, setAlertType] = useState<AlertVariant>(null);

  const hideLoader = () => setIsLoaderVisible(false);
  const showLoader = () => setIsLoaderVisible(true);

  const hideAlert = () => {
    setAlertMsg(null);
    if (alertTimer !== null) {
      clearTimeout(alertTimer);
      alertTimer = null;
    }
  };
  let alertTimer = null;

  const showAlert = (msg: string, variant: string, timed: boolean = true) => {
    if (variant === 'error') {
      setAlertType(AlertVariant.danger);
    } else {
      setAlertType(AlertVariant.success);
    }
    setAlertMsg(msg);

    if (timed && variant !== 'error') {
      alertTimer = setTimeout(hideAlert, 5000);
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
