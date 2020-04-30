import React, { useState } from 'react';
import { Alert, AlertActionCloseButton, AlertVariant, Button, Spinner } from '@patternfly/react-core';
// import { AutomationIcon } from '@patternfly/react-icons';
// import { EngagementFormContext } from '../context/engagement_form_context';
// import { EngagementContext } from '../context/engagement_context';
// import { ConfigContext } from '../context/config_context';


export function Feedback() {
  // const engagementContext = useContext(EngagementContext);
  // const engagementFormContext = useContext(EngagementFormContext);
  // const configContext = useContext(ConfigContext);

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

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: "fixed",
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 301,
  }
  
  const spinnerStyle: React.CSSProperties = {
    left: '49%',
    top: '45%'
  }
  
  return (
    <React.Fragment>
      {alertMsg && (
        <Alert
          variant={alertType}
          title={alertMsg}
          action={<AlertActionCloseButton onClose={hideAlert} />}
        />
      )}
      <Button onClick={() => showAlert("Your save was successful.", "success")}>Click</Button>
      {isLoaderVisible && (
        <div style={modalStyle}>
          <Spinner style={spinnerStyle}/>
        </div>
      )}
      <Button onClick={hideLoader}>Click</Button>
    </React.Fragment>
  );
}
