import React from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  Spinner,
  AlertActionLink,
} from '@patternfly/react-core';
import { useFeedback } from '../../context/feedback_context/feedback_context';

export function Feedback() {
  const {
    alertMsg,
    alertType,
    hideAlert,
    isLoaderVisible,
    alertActions,
  } = useFeedback();
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
    transitionDelay: `${transitionDuration}ms, 0ms`,
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
            data-testid="ls-feedback-alert"
            variant={alertType}
            title={alertMsg}
            actionLinks={
              alertActions?.map((action, i) => {
                return (
                  <AlertActionLink
                    data-testid={`ls-feedback-alert-action-${i}`}
                    key={action?.title}
                    onClick={() => {
                      action?.action();
                      hideAlert();
                    }}
                  >
                    {action.title}
                  </AlertActionLink>
                );
              }) ?? undefined
            }
            actionClose={<AlertActionCloseButton onClose={hideAlert} />}
          />
        </AlertGroup>
      )}
      <div
        id="omp-loader-backdrop"
        style={{ ...modalStyle, ...(isLoaderVisible ? {} : hiddenStyle) }}
      >
        <Spinner style={spinnerStyle} />
      </div>
    </React.Fragment>
  );
}
