import React from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons';
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
      <Tooltip content="All required fields are completed"
               entryDelay={0}>
        <CheckCircleIcon color="green" />
      </Tooltip>
    );
  }
  return (
    <Tooltip content={`Missing required fields: ${neededFields.join(', ')}`}
             entryDelay={0}>
      <ExclamationTriangleIcon color="#EC7A08" />
    </Tooltip>
  );
}
