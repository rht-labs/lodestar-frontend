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
import { HostingEnvironment } from '../../schemas/hosting_environment';

interface OpenShiftVersionFormFieldProps {
  hostingEnvironment: HostingEnvironment;
  isEngagementLaunched: boolean;
  engagementFormConfig: EngagementFormConfig;
  onChange: (value: string) => void;
}

export function OpenShiftVersionFormField({
  onChange,
  hostingEnvironment,
  engagementFormConfig,
  isEngagementLaunched,
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
        value={hostingEnvironment?.ocp_version || ''}
        isDisabled={
          engagementFormConfig?.openshift_options?.versions?.options?.length ===
            1 || !hasFeature(APP_FEATURES.writer)
        }
        onChange={onChange}
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
