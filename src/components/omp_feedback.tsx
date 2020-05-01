import React, { useContext }from 'react';
import { Alert, AlertGroup, AlertActionCloseButton, Spinner } from '@patternfly/react-core';
import { FeedbackContext } from '../context/feedback_context';


export function Feedback() {
  const feedbackContext = useContext(FeedbackContext);

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: "fixed",
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  }
  
  const spinnerStyle: React.CSSProperties = {
    left: '49%',
    top: '45%'
  }
  
  return (
    <React.Fragment>
      {feedbackContext.alertMsg && (
        <AlertGroup isToast>
          <Alert
            isInline
            variant={feedbackContext.alertType}
            title={feedbackContext.alertMsg}
            action={<AlertActionCloseButton onClose={feedbackContext.hideAlert} />}
          />
        </AlertGroup>
      )}
      {feedbackContext.isLoaderVisible && (
        <div style={modalStyle}>
          <Spinner style={spinnerStyle}/>
        </div>
      )}
    </React.Fragment>
  );
}
