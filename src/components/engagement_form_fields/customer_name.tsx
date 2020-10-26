import React, { useEffect } from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import {FormGroup, TextInput} from '@patternfly/react-core';
import { APP_FEATURES } from '../../common/app_features';
import { Engagement } from '../../schemas/engagement';
import { FormManager } from '../../context/form_manager/form_manager';

export interface CustomerNameFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function CustomerNameFormField(props: CustomerNameFormFieldProps) {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('customer_name'), [registerField]);
  return (
    <FormGroup label="Client Name" fieldId="customerName">
      <TextInput
        isDisabled={!hasFeature(APP_FEATURES.writer)}
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
