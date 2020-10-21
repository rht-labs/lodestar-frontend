import React, { useEffect } from 'react';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { FormManager } from '../../context/form_manager/form_manager';
import { HostingProvider } from '../../schemas/hosting_provider';

interface PersistentStorageFormFieldProps {
  hostingProvider: HostingProvider;
  onChange: (value: string) => void;
  engagementFormConfig: EngagementFormConfig;
  isEngagementLaunched: boolean;
}

export function PersistentStorageFormField({
  hostingProvider,
  onChange,
  engagementFormConfig,
  isEngagementLaunched,
}: PersistentStorageFormFieldProps) {
  const { hasFeature } = useFeatures();

  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('ocp_persistent_storage_size'), [
    registerField,
  ]);
  return (
    <FormGroup
      label="Persistent Storage Needs"
      isRequired
      fieldId="persistent-storage-needs"
    >
      <FormSelect
        data-testid="persistent-storage-select"
        aria-label="Persistent Storage Needs"
        id={'persistent_storage_dropdown'}
        isDisabled={
          engagementFormConfig?.openshift_options?.persistent_storage?.options
            ?.length === 1 ||
          !hasFeature(APP_FEATURES.writer) ||
          isEngagementLaunched
        }
        onChange={onChange}
        value={hostingProvider?.ocp_persistent_storage_size || ''}
      >
        {[
          <FormSelectOption
            key={'undefined storage'}
            label="Select storage size"
            value={undefined}
          />,
        ].concat(
          engagementFormConfig?.openshift_options?.persistent_storage?.options?.map(
            (option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                label={option.label}
                value={option.value}
                data-cy={option.value}
              />
            )
          )
        )}
      </FormSelect>
    </FormGroup>
  );
}
