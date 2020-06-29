import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_toggles/feature_hook';
import { APP_FEATURES } from '../../common/app_features';

interface CloudProviderFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  availableProviders: { label: string; value: string }[];
}

export function CloudProviderFormField({
  engagement,
  onChange,
  availableProviders,
}: CloudProviderFormFieldProps) {
  const { hasFeature } = useFeatures();
  return (
    <FormGroup fieldId="cloud-provider" label="Cloud Provider" isRequired>
      <FormSelect
        aria-label="Cloud Provider"
        isDisabled={!hasFeature(APP_FEATURES.writer) || !!engagement?.launch}
        isRequired
        value={engagement?.ocp_cloud_provider_name || ''}
        onChange={e => onChange('ocp_cloud_provider_name', e)}
      >
        {[
          <FormSelectOption
            label="Select a provider"
            value={undefined}
          ></FormSelectOption>,
        ].concat(
          availableProviders?.map((option: any, index: any) => (
            <FormSelectOption
              isDisabled={option.disabled}
              key={index}
              value={option.value}
              label={option.label}
            />
          ))
        )}
      </FormSelect>
    </FormGroup>
  );
}
