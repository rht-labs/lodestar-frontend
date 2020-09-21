import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { FormManager } from '../../context/form_manager/form_manager';

interface CloudProviderRegionFormFieldProps {
  availableProviderRegionOptions: { label: string; value: string }[];
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function CloudProviderRegionFormField({
  availableProviderRegionOptions,
  engagement,
  onChange,
}: CloudProviderRegionFormFieldProps) {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('ocp_cloud_provider_region'), [registerField]);
  return (
    <FormGroup
      label="Provider Region"
      isRequired
      fieldId="cloud-provider-region"
    >
      <FormSelect
        data-testid="provider-region-select"
        aria-label="Cloud provider region"
        id={'cloud_provider_region_dropdown'}
        isDisabled={
          availableProviderRegionOptions?.length === 0 ||
          !hasFeature(APP_FEATURES.writer) ||
          !!engagement?.launch
        }
        readOnly={availableProviderRegionOptions?.length === 0}
        value={engagement?.ocp_cloud_provider_region || ''}
        onChange={e => onChange('ocp_cloud_provider_region', e)}
      >
        {[
          <FormSelectOption label={'Select a region'} value={undefined} />,
        ].concat(
          availableProviderRegionOptions.map((option: any, index: any) => (
            <FormSelectOption
              isDisabled={option.disabled || !hasFeature(APP_FEATURES.writer)}
              key={index}
              value={option.value}
              label={option.label}
              data-cy={option.value}
            />
          ))
        )}
      </FormSelect>
    </FormGroup>
  );
}
