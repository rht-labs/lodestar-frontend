import React from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { FormGroup, TextArea } from '@patternfly/react-core';
import { APP_FEATURES } from '../../common/app_features';
import { HostingEnvironment } from '../../schemas/hosting_environment';

export interface DescriptionFormFieldProps {
  hostingEnvironment: Partial<HostingEnvironment>;
  onChange: (value: string) => void;
}

export function AdditionalDetailsFormField(props: DescriptionFormFieldProps) {
  const { hasFeature } = useFeatures();
  return (
    <FormGroup label="Additional Information" fieldId="additional_details">
      <TextArea
        data-testid="additional-details-text-area"
        disabled={!hasFeature(APP_FEATURES.writer)}
        name="additional_details"
        id="additional_details"
        aria-label="Additional provisioning information"
        placeholder="Provide additional details"
        value={props.hostingEnvironment?.additional_details || ''}
        resizeOrientation="vertical"
        onChange={props.onChange}
      />
    </FormGroup>
  );
}
