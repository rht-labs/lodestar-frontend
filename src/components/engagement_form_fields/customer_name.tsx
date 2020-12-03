import React, { useEffect } from 'react';
import {FormGroup, TextInput} from '@patternfly/react-core';
import { Engagement } from '../../schemas/engagement';
import { FormManager } from '../../context/form_manager/form_manager';

export interface CustomerNameFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function CustomerNameFormField(props: CustomerNameFormFieldProps) {
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('customer_name'), [registerField]);
  return (
    <FormGroup label="Client Name"
               fieldId="customerName"
               isRequired
    >
      <TextInput
        type="text"
        name="customer_name"
        id="customer_name"
        aria-label="engagement customer_name"
        value={props.engagement.customer_name || ''}
        onChange={e => props.onChange('customer_name', e)}
        data-cy={'customer_name_field'}
      />
    </FormGroup>
  );
}
