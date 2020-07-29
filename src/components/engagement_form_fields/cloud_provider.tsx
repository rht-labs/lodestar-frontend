import React from 'react';
import { Engagement } from '../../schemas/engagement';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
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
    <>
      <FormGroup fieldId="Hosting Platform" label="Hosting Type">
        <FormSelect isRequired isDisabled={true}>
          <FormSelectOption label={'OpenShift Container Platform'} />
        </FormSelect>
      </FormGroup>
      <FormGroup fieldId="cloud-provider" label="Cloud Provider" isRequired>
        <FormSelect
          aria-label="Cloud Provider"
          id={'cloud_provider_dropdown'}
          isDisabled={!hasFeature(APP_FEATURES.writer) || !!engagement?.launch}
          isRequired
          value={engagement?.ocp_cloud_provider_name || ''}
          onChange={e => onChange('ocp_cloud_provider_name', e)}
        >
          {[
            <FormSelectOption
              label="Select a provider"
              value={undefined}
            />,
          ].concat(
            availableProviders?.map((option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
                label={option.label}
                data-cy={option.label}
              />
            ))
          )}
        </FormSelect>
      </FormGroup>
    </>
  );
}
