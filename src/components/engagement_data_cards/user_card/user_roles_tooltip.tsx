import React from 'react';
import {
  InfoCircleIcon,
} from '@patternfly/react-icons';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { EngagementFormConfig } from "../../../schemas/engagement_config";

interface UserRolesTooltipProps {
  formOptions: EngagementFormConfig;
}

export function UserRolesTooltip({formOptions}: UserRolesTooltipProps) {

  function createTooltipText (formOptions: any) {
    let text = [<></>];
    (formOptions?.user_options?.user_roles?.options ?? []).map((option: any) => {
      return text.push(
        <>
          { descriptionText(option) }
        </>
      )
    });
    return text;
  }

  function descriptionText (option?: any) {
    return (
      <>
        <b style={{color: '#73BCF7'}}> {option.label} </b>
        <br/> {option.description}
        <br/>
      </>
    )
  }

  return (
    <>
      <Tooltip
        content= { createTooltipText(formOptions) }
        entryDelay={0}
        exitDelay={10}
        maxWidth={'45rem'}
        isContentLeftAligned={true}
        position={TooltipPosition.top}>
        <InfoCircleIcon style={{fontSize: 'small', marginLeft: '1rem'}}/>
      </Tooltip>
    </>
  );
}
