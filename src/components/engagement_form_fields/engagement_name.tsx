import React from 'react';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { useEngagementFormField } from '../../context/engagement_context/engagement_context';

export function EngagementNameFormField() {
  const [engagementName, setEngagementName] = useEngagementFormField(
    'project_name'
  );
  return (
    <FormGroup label="Engagement Name" fieldId="engagementName" isRequired>
      <TextInput
        type="text"
        name="engagement_name"
        id="engagement_name"
        aria-label="engagement_name"
        value={engagementName}
        onChange={setEngagementName}
        data-cy={'engagement_name_field'}
      />
    </FormGroup>
  );
}
