import React from 'react';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import { getHumanReadableFieldName } from '../../common/human_readable_engagement_field';
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
  if (!neededFields?.length) {
    return (
      <Tooltip
        content="All required fields are completed"
        entryDelay={10}
        exitDelay={10}
      >
        <CheckCircleIcon color="green" />
      </Tooltip>
    );
  }
  return (
    <span>
      <Tooltip
        content={
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
        }
        entryDelay={10}
        exitDelay={10}
      >
        <CheckCircleIcon color="lightgrey" />
      </Tooltip>
    </span>
  );
}
