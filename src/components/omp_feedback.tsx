import React, { useContext } from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  Spinner,
} from '@patternfly/react-core';
import { useFeedback } from '../context/feedback_context';

export function Feedback() {
  const { alertMsg, alertType, hideAlert, isLoaderVisible } = useFeedback();

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1000,
  };

  const spinnerStyle: React.CSSProperties = {
    left: '49%',
    top: '45%',
  };

  return (
    <React.Fragment>
      {alertMsg && (
        <AlertGroup isToast>
          <Alert
            isInline
            variant={alertType}
            title={alertMsg}
            action={<AlertActionCloseButton onClose={hideAlert} />}
          />
        </AlertGroup>
      )}
      {isLoaderVisible && (
        <div style={modalStyle}>
          <Spinner style={spinnerStyle} />
        </div>
      )}
    </React.Fragment>
  );
}
