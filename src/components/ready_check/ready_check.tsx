import React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { ReactChild } from 'react';

export interface ReadyCheckProps {
  isReady?: boolean;
  readyTooltip?: ReactChild;
  notReadyTooltip?: ReactChild;
  readyColor?: string;
  notReadyColor?: string;
}

export function ReadyCheck(props: ReadyCheckProps) {
  const {
    isReady = false,
    readyTooltip = '',
    notReadyTooltip = '',
    readyColor = 'green',
    notReadyColor = 'lightgrey',
  } = props;
  const TooltipWrapper = ({ children }) => {
    if ((isReady && !!readyTooltip) || (!isReady && !!notReadyTooltip)) {
      return (
        <Tooltip
          content={isReady ? readyTooltip : notReadyTooltip}
          entryDelay={10}
          exitDelay={10}
        >
          {children}
        </Tooltip>
      );
    }
    return children;
  };
  return (
    <TooltipWrapper>
      <CheckCircleIcon color={isReady ? readyColor : notReadyColor} />
    </TooltipWrapper>
  );
}
