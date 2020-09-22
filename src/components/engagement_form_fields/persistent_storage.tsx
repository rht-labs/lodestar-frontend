import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { FormManager } from '../../context/form_manager/form_manager';

interface PersistentStorageFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  engagementFormConfig: EngagementFormConfig;
}

export function PersistentStorageFormField({
  engagement,
  onChange,
  engagementFormConfig,
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
            ?.length === 1 || !hasFeature(APP_FEATURES.writer)
        }
        onChange={e => onChange('ocp_persistent_storage_size', e)}
        value={engagement?.ocp_persistent_storage_size || ''}
      >
        {engagementFormConfig?.openshift_options?.persistent_storage?.options
          ?.length > 0 ? (
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
        ) : (
          <FormSelectOption label={''} value={''} />
        )}
      </FormSelect>
    </FormGroup>
  );
}
