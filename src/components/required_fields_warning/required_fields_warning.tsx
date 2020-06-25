import React from 'react';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { Tooltip } from '@patternfly/react-core';
import { getHumanReadableFieldName } from '../../common/human_readable_engagement_field';
interface RequiredFieldsWarningProps {
  requiredFields: string[];
}
export function RequiredFieldsWarning({
  requiredFields = [],
}: RequiredFieldsWarningProps) {
  const { missingRequiredFields } = useEngagements();
  const neededFields = requiredFields
    .filter(field => missingRequiredFields.includes(field))
    .map(field => getHumanReadableFieldName(field));
  if (!neededFields?.length) {
    return <div />;
  }
  return (
    <Tooltip content={`Missing required fields: ${neededFields.join(', ')}`}>
      <ExclamationTriangleIcon color="#EC7A08" />
    </Tooltip>
  );
}
