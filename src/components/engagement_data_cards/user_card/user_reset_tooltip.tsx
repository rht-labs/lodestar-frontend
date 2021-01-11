import React from 'react';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';

export function UserResetTooltip() {

  return (
    <>
      <Tooltip
        content={"Select users you want to reset (Active Engagements only)"}
        entryDelay={0}
        exitDelay={10}
        maxWidth={'45rem'}
        isContentLeftAligned={true}
        position={TooltipPosition.top}
      >
        <InfoCircleIcon style={{ fontSize: 'small', marginLeft: '1rem' }} />
      </Tooltip>
    </>
  );
}
