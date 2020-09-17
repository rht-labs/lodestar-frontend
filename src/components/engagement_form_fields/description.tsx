import React, { useEffect } from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { FormGroup, TextArea } from '@patternfly/react-core';
import { APP_FEATURES } from '../../common/app_features';
import { Engagement } from '../../schemas/engagement';
import { FormManager } from '../../context/form_manager/form_manager';

export interface DescriptionFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function DescriptionFormField(props: DescriptionFormFieldProps) {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormManager();
  useEffect(() => registerField('description'), [registerField]);
  return (
    <FormGroup label="Description" fieldId="description">
      <TextArea
        disabled={!hasFeature(APP_FEATURES.writer)}
        name="description"
        id="description"
        resizeOrientation="vertical"
        aria-label="engagement description"
        placeholder="Description and notes for the Engagement"
        value={props.engagement.description || ''}
        onChange={e => props.onChange('description', e)}
        data-cy={'description_field'}
      />
    </FormGroup>
  );
}
