import React from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons';
import { Tooltip, Popover } from '@patternfly/react-core';
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
      <Tooltip content="All required fields are completed">
        <CheckCircleIcon color="green" />
      </Tooltip>
    );
  }
  const tooltipText = neededFields.join(', ');
  return (
    <Popover
      headerContent="Missing required fields"
      aria-label="Missing fields warning"
      bodyContent={
        <div style={{ padding: '0 0 0 2rem' }}>
          <ul style={{ listStyleType: 'disc' }}>
            {neededFields.map(f => (
              <li>{f}</li>
            ))}
          </ul>
        </div>
      }
    >
      <span>
        <ExclamationTriangleIcon
          style={{ cursor: 'pointer' }}
          color="#EC7A08"
          title={`Missing required fields: ${tooltipText}`}
        />
      </span>
    </Popover>
  );
}
