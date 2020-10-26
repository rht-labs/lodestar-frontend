import React, { useEffect } from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { FormGroup, TextArea } from '@patternfly/react-core';
import { APP_FEATURES } from '../../common/app_features';
import { FormManager } from '../../context/form_manager/form_manager';
import { HostingProvider } from '../../schemas/hosting_provider';

export interface DescriptionFormFieldProps {
  hostingProvider: HostingProvider;
  onChange: (value: string) => void;
}

export function AdditionalDetailsFormField(props: DescriptionFormFieldProps) {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => {
    registerField('additional_details');
  }, [registerField]);
  return (
    <FormGroup label="Additional Information" fieldId="additional_details">
      <TextArea
        data-testid="additional-details-text-area"
        disabled={!hasFeature(APP_FEATURES.writer)}
        name="additional_details"
        id="additional_details"
        aria-label="Additional provisioning information"
        placeholder="Provide additional details"
        value={props.hostingProvider.additional_details || ''}
        resizeOrientation="vertical"
        onChange={props.onChange}
      />
    </FormGroup>
  );
}
