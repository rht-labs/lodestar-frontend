import React from 'react';
import { Engagement } from '../../schemas/engagement';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { EngagementFormConfig } from '../../schemas/engagement_config';

interface PersistentStorageFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
}

export function PersistentStorageFormField({
  engagement,
  onChange,
  formOptions,
}: PersistentStorageFormFieldProps) {
  const { hasFeature } = useFeatures();
  return (
    <FormGroup
      label="Persistent Storage Needs"
      isRequired
      fieldId="persistent-storage-needs"
    >
      <FormSelect
        aria-label="Persistent Storage Needs"
        id={'persistent_storage_dropdown'}
        isDisabled={
          formOptions?.openshift_options?.persistent_storage?.options
            ?.length === 1 || !hasFeature(APP_FEATURES.writer)
        }
        onChange={e => onChange('ocp_persistent_storage_size', e)}
        value={engagement?.ocp_persistent_storage_size || ''}
      >
        {formOptions?.openshift_options?.persistent_storage?.options?.length >
        0 ? (
          formOptions?.openshift_options?.persistent_storage?.options?.map(
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
        ) : (
          <FormSelectOption label={''} value={''} />
        )}
      </FormSelect>
    </FormGroup>
  );
}
