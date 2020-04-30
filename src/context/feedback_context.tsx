import React, { useState } from 'react';
import {AlertVariant} from '@patternfly/react-core';

interface FeedbackContext {
  isLoaderVisible: boolean;
  setIsLoaderVisible: (b:boolean) => false;
  alertMsg: string;
  setAlertMsg: (s:string) => null;
  alertType: AlertVariant;
  setAlertType: (a:AlertVariant) => AlertVariant.success;
}

export const FeedbackContext = React.createContext<FeedbackContext>({
  isLoaderVisible: false,
  setIsLoaderVisible: (b:boolean) => false,
  alertMsg: null,
  alertType: AlertVariant.success,
  hideAlert: any,
  showAlert:
  hideLoader: boolean,
  showLoader: boolean,
});

export const FeedbackSystem = ({ children }: { children: React.ReactNode }) => {
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>(null);
  const [alertType, setAlertType] = useState<AlertVariant>(null);

  const hideLoader = () => setIsLoaderVisible(true);
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
        setIsLoaderVisible,
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
