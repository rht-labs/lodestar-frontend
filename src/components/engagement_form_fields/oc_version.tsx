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

interface OpenShiftVersionFormFieldProps {
  engagement: Engagement;
  engagementFormConfig: EngagementFormConfig;
  onChange: (fieldName: string, value: any) => void;
}

export function OpenShiftVersionFormField({
  onChange,
  engagement,
  engagementFormConfig,
}: OpenShiftVersionFormFieldProps) {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('ocp_version'), [registerField]);
  return (
    <FormGroup
      label="OpenShift Version"
      isRequired
      fieldId="openshift-provider"
    >
      <FormSelect
        data-testid="oc-version-select"
        aria-label="OpenShift Version"
        id={'oc_version_dropdown'}
        value={engagement?.ocp_version || ''}
        isDisabled={
          engagementFormConfig?.openshift_options?.versions?.options?.length ===
            1 ||
          !hasFeature(APP_FEATURES.writer) ||
          !!engagement?.launch
        }
        onChange={e => onChange('ocp_version', e)}
      >
        {[
          <FormSelectOption
            value={undefined}
            label="Select OpenShift version"
          />,
        ].concat(
          engagementFormConfig?.openshift_options?.versions?.options?.map(
            (option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
                label={option.label}
                data-cy={option.value}
              />
            )
          )
        )}
      </FormSelect>
    </FormGroup>
  );
}
