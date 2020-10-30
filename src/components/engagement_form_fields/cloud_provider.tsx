import React, { useEffect } from 'react';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { FormManager } from '../../context/form_manager/form_manager';
import { HostingProvider } from '../../schemas/hosting_provider';

interface CloudProviderFormFieldProps {
  hostingProvider: HostingProvider;
  onChange: (value: string) => void;
  availableProviders: { label: string; value: string }[];
}

export function CloudProviderFormField({
  hostingProvider,
  onChange,
  availableProviders,
}: CloudProviderFormFieldProps) {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('cloud_provider_dropdown'), [registerField]);
  return (
    <>
      <FormGroup fieldId="Hosting Platform" label="Hosting Type">
        <FormSelect isRequired isDisabled={true}>
          <FormSelectOption label={'OpenShift Container Platform'} />
        </FormSelect>
      </FormGroup>
      <FormGroup fieldId="cloud-provider" label="Cloud Provider" isRequired>
        <FormSelect
          data-testid="cloud-provider-select"
          aria-label="Cloud Provider"
          id={'cloud_provider_dropdown'}
          isDisabled={!hasFeature(APP_FEATURES.writer)} // TODO: Disable field after launch
          isRequired
          value={hostingProvider?.ocp_cloud_provider_name || ''}
          onChange={onChange}
        >
          {[
            <FormSelectOption
              key={'undefined provider'}
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
