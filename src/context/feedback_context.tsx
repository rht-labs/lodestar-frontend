import React, { useState } from 'react';
import {AlertVariant} from '@patternfly/react-core';

interface FeedbackContext {
  isLoaderVisible: boolean;
  setIsLoaderVisible: (isLoaderVisible:boolean) => false;
  alertMsg: string | null;
  setAlertMsg: (msg:string) => null;
  alertType: AlertVariant;
  setAlertType: (alertType:AlertVariant) => AlertVariant.success;
  showAlert: () => {};
  hideLoader: () => {};
  showLoader: () => {};
}

export const FeedbackContext = React.createContext<FeedbackContext>({
  isLoaderVisible: false,
  // setActiveEngagement: (engagement: Engagement) => {},
  setIsLoaderVisible: (isLoaderVisible:boolean) => false,
  alertMsg: null,
  setAlertMsg: (msg:string) => {},
  alertType: AlertVariant.success,
  hideAlert: () => {},
  showAlert:(msg:string, variant:AlertVariant) => {},
  hideLoader: () => {},
  showLoader: () => {},
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
