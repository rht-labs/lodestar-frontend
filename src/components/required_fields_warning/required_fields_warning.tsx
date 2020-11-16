import React from 'react';
import { getHumanReadableFieldName } from '../../common/human_readable_engagement_field';
import { ReadyCheck } from '../ready_check/ready_check';
interface RequiredFieldsWarningProps {
  requiredFields: string[];
  missingRequiredFields: string[];
}
export function RequiredFieldsWarning({
  requiredFields = [],
  missingRequiredFields = [],
}: RequiredFieldsWarningProps) {
  const neededFields = requiredFields
    .filter(field => missingRequiredFields.includes(field))
    .map(field => getHumanReadableFieldName(field));
  const isReady = neededFields?.length === 0;
  const notReadyTooltip = (
    <div>
      <div>Missing required fields:</div>
      <div>
        <ul>
          {neededFields.map(field => (
            <li>{field}</li>
          ))}
        </ul>
      </div>
    </div>
  );
  const readyTooltip = 'All required fields are completed';
  return (
    <ReadyCheck
      isReady={isReady}
      notReadyTooltip={notReadyTooltip}
      readyTooltip={readyTooltip}
    />
  );
}
