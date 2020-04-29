import React, { useState } from 'react';
import { Alert, AlertActionCloseButton, AlertVariant } from '@patternfly/react-core';
// import { EngagementFormContext } from '../context/engagement_form_context';
// import { EngagementContext } from '../context/engagement_context';
// import { ConfigContext } from '../context/config_context';


function _OMPFeedback() {
  // const engagementContext = useContext(EngagementContext);
  // const engagementFormContext = useContext(EngagementFormContext);
  // const configContext = useContext(ConfigContext);

  let type:AlertVariant = AlertVariant.danger;
  let alertMsg = 'temp message';
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  
  const closeAlert = () => setIsAlertVisible(false);
  const showAlert = (msg, variant) => {
    if(variant === 'error'){
      type = AlertVariant.error;
    }else{
      type = AlertVariant.success;
    }
    alertMsg = msg;
    setIsAlertVisible(true);
  }
  showAlert("Your save was successful.", "error");
  return (
    <React.Fragment>
      {isAlertVisible && (
        <Alert
          variant={type}
          title={alertMsg}
          action={<AlertActionCloseButton onClose={closeAlert} />}
        />
      )}
    </React.Fragment>
  );
}

export const Feedback = React.memo(_OMPFeedback);