import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_toggles/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { EngagementFormConfig } from '../../schemas/engagement_config';

interface OpenShiftVersionFormFieldProps {
  engagement: Engagement;
  formOptions: EngagementFormConfig;
  onChange: (fieldName: string, value: any) => void;
}

export function OpenShiftVersionFormField({
  onChange,
  engagement,
  formOptions,
}: OpenShiftVersionFormFieldProps) {
  const { hasFeature } = useFeatures();
  return (
    <FormGroup
      label="OpenShift Version"
      isRequired
      fieldId="openshift-provider"
    >
      <FormSelect
        aria-label="OpenShift Version"
        value={engagement?.ocp_version || ''}
        isDisabled={
          formOptions?.openshift_options?.versions?.options?.length === 1 ||
          !hasFeature(APP_FEATURES.writer) ||
          !!engagement?.launch
        }
        onChange={e => onChange('ocp_version', e)}
      >
        {[
          <FormSelectOption value={undefined} label="Select OpenShift version" />,
        ].concat(
          formOptions?.openshift_options?.versions?.options?.map(
            (option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
                label={option.label}
              />
            )
          )
        )}
      </FormSelect>
    </FormGroup>
  );
}
