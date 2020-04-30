import React, { useState } from 'react';
import {AlertVariant} from '@patternfly/react-core';

interface FeedbackContext {
  isLoaderVisible: boolean;
  setIsLoaderVisible: (isLoaderVisible:boolean) => void;
  alertMsg: string | null;
  setAlertMsg: (msg:string) => void;
  alertType: AlertVariant;
  setAlertType: (alertType:AlertVariant) => void;
  showAlert: (msg:string, variant:string) => void;
  hideLoader: () => void;
  showLoader: () => void;
  hideAlert: () => void;
}

export const FeedbackContext = React.createContext<FeedbackContext>({
  isLoaderVisible: false,
  setIsLoaderVisible: (isLoaderVisible:boolean) => {},
  alertMsg: null,
  setAlertMsg: (msg:string) => {},
  setAlertType: (alertType:AlertVariant) => {},
  alertType: AlertVariant.success,
  hideAlert: () => {},
  showAlert:(msg:string, variant:string) => {},
  hideLoader: () => {},
  showLoader: () => {},
});

export const FeedbackProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>(null);
  const [alertType, setAlertType] = useState<AlertVariant>(null);

  const hideLoader = () => setIsLoaderVisible(false);
  const showLoader = () => setIsLoaderVisible(true);

  const hideAlert = () => setAlertMsg(null);
  const showAlert = (msg:string, variant:string) => {
    if(variant === 'error'){
      setAlertType(AlertVariant.danger);
    }else{
      setAlertType(AlertVariant.success);
    }
    setAlertMsg(msg);
  }

  return (
    <FeedbackContext.Provider
      value={{
        isLoaderVisible,
        setIsLoaderVisible: (isLoaderVisible) => setIsLoaderVisible(isLoaderVisible),
        alertMsg,
        setAlertMsg,
        alertType,
        setAlertType,
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
