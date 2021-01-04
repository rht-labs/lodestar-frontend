import React from 'react';
import { FormGroup, TextInput } from '@patternfly/react-core';
import {
  EngagementGroupings,
  useEngagementFormField,
} from '../../context/engagement_context/engagement_context';

export function CustomerNameFormField() {
  const [customerName, setCustomerName] = useEngagementFormField(
    'customer_name',
    EngagementGroupings.engagementSummary
  );
  return (
    <FormGroup label="Client Name" fieldId="customerName" isRequired>
      <TextInput
        type="text"
        name="customer_name"
        id="customer_name"
        aria-label="engagement customer_name"
        value={customerName}
        onChange={setCustomerName}
        data-cy={'customer_name_field'}
      />
    </FormGroup>
  );
}
