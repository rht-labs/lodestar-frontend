import React, { useState } from 'react';
import {AlertVariant} from '@patternfly/react-core';

interface FeedbackContext {
  isLoaderVisible: boolean;
  setIsLoaderVisible: (isLoaderVisible:boolean) => void;
  alertMsg: string | null;
  setAlertMsg: (msg:string) => void;
  alertType: AlertVariant;
  setAlertType: (alertType:AlertVariant) => void;
  showAlert: (msg:string, variant:string, timed?:boolean) => void;
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
  showAlert:(msg:string, variant:string, timed:boolean) => {},
  hideLoader: () => {},
  showLoader: () => {},
});

export const FeedbackProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);
  const [alertMsg, setAlertMsg] = useState<string>(null);
  const [alertType, setAlertType] = useState<AlertVariant>(null);

  const hideLoader = () => setIsLoaderVisible(false);
  const showLoader = () => setIsLoaderVisible(true);

  const hideAlert = () => {
    setAlertMsg(null);
    if(alertTimer !== null){
      clearTimeout(alertTimer);
      alertTimer = null;
    }
  }
  let alertTimer = null;
  
  const showAlert = (msg:string, variant:string, timed:boolean = true) => {
    if(variant === 'error'){
      setAlertType(AlertVariant.danger);
    }else{
      setAlertType(AlertVariant.success);
    }
    setAlertMsg(msg);

    if(timed && variant !== 'error'){
      console.log("show alert");
      alertTimer = setTimeout(hideAlert, 5000);
    }
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
