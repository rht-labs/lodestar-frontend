import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import {
  EngagementGroupings,
  useEngagementFormField,
} from '../../context/engagement_context/engagement_context';

export function PublicReferenceField() {
  const [isPublicReference, setIsPublicReference] = useEngagementFormField(
    'public_reference',
    EngagementGroupings.engagementSummary
  );
  return (
    <Checkbox
      id="public-reference"
      label="Can this be used as a public reference?"
      isChecked={isPublicReference ?? false}
      onChange={setIsPublicReference}
    />
  );
}
