import React from 'react';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { useEngagement } from '../../../context/engagement_context/engagement_hook';

export function AvailabilityZoneTooltip() {
  const { engagementFormConfig } = useEngagement();

  function createTooltipText(engagementFormConfig: EngagementFormConfig) {
    let text = [<div key={'tooltipText'} />];
    (engagementFormConfig?.cloud_options?.availability_zones?.options ?? []).map(
      (option: any, index: number) => {
        return text.push(<div key={index}>{descriptionText(option)}</div>);
      }
    );
    return text;
  }

  function descriptionText(option?: any) {
    return (
      <>
        <b style={{ color: '#73BCF7' }}> {option.label} </b>
        <br /> {option.description}
        <br />
      </>
    );
  }

  return (
    <>
      <Tooltip
        content={createTooltipText(engagementFormConfig)}
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
