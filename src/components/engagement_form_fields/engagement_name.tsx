import React, { useEffect } from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import {FormGroup, TextInput} from '@patternfly/react-core';
import { APP_FEATURES } from '../../common/app_features';
import { Engagement } from '../../schemas/engagement';
import { FormManager } from '../../context/form_manager/form_manager';

export interface EngagementNameFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function EngagementNameFormField(props: EngagementNameFormFieldProps) {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('engagement_name'), [registerField]);
  return (
    <FormGroup label="Engagement Name" fieldId="engagementName">
      <TextInput
        isDisabled={!hasFeature(APP_FEATURES.writer)}
        type="text"
        name="engagement_name"
        id="engagement_name"
        aria-label="engagement_name"
        value={props.engagement.project_name || ''}
        onChange={e => props.onChange('project_name', e)}
        data-cy={'engagement_name_field'}
      />
    </FormGroup>
  );
}
