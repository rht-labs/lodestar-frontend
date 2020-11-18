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

  return (
    <Tooltip
      content={isReady ? readyTooltip : notReadyTooltip}
      entryDelay={10}
      exitDelay={10}
    >
      <CheckCircleIcon color={isReady ? readyColor : notReadyColor} />
    </Tooltip>
  );
}
