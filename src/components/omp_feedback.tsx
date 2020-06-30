import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  Spinner,
} from '@patternfly/react-core';
import { useFeedback } from '../context/feedback_context';

export function Feedback() {
  const { alertMsg, alertType, hideAlert, isLoaderVisible } = useFeedback();
  const transitionDuration = 200;
  const modalStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1000,
    opacity: 0.67,
    transitionProperty: 'opacity, height',
    transitionDelay: `${transitionDuration}ms, ${0}ms`,
    transitionDuration: `${transitionDuration + 2}ms, ${transitionDuration}ms`,
  };

  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    height: 0,
    transitionProperty: 'opacity, height',
    transitionDelay: `0ms, ${transitionDuration}ms`,
    transitionDuration: `${transitionDuration}ms, ${transitionDuration + 2}ms`,
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
            actionClose={<AlertActionCloseButton onClose={hideAlert} />}
          />
        </AlertGroup>
      )}
      <div style={{ ...modalStyle, ...(isLoaderVisible ? {} : hiddenStyle) }}>
        <Spinner style={spinnerStyle} />
      </div>
    </React.Fragment>
  );
}
