import React, { useEffect } from 'react';
import { Checkbox } from '@patternfly/react-core';
import { Engagement } from '../../schemas/engagement';
import { FormManager } from '../../context/form_manager/form_manager';

export interface PublicReferenceFieldProps {
  onChange: (fieldName: string, value: any) => void;
  engagement: Engagement;
}
export function PublicReferenceField(props: PublicReferenceFieldProps) {
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('public_reference'), [registerField]);
  return (
    <Checkbox
      id="public-reference"
      label="Can this be used as a public reference?"
      isChecked={props.engagement.public_reference ?? false}
      onChange={checked => props.onChange('public_reference', checked)}
    />
  );
}
