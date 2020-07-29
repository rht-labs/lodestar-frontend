import React from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { FormGroup, TextArea } from '@patternfly/react-core';
import { APP_FEATURES } from '../../common/app_features';
import { Engagement } from '../../schemas/engagement';

export interface DescriptionFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function AdditionalDetailsFormField(props: DescriptionFormFieldProps) {
  const { hasFeature } = useFeatures();
  return (
    <FormGroup label="Additional Information" fieldId="additional_details">
      <TextArea
        disabled={!hasFeature(APP_FEATURES.writer)}
        name="additional_details"
        id="additional_details"
        aria-label="Additional provisioning information"
        placeholder="Provide additional details"
        value={props.engagement.additional_details || ''}
        resizeOrientation="vertical"
        onChange={e => props.onChange('additional_details', e)}
      />
    </FormGroup>
  );
}
