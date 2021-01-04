import React from 'react';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { HostingEnvironment } from '../../schemas/hosting_environment';
import { useEngagements } from '../../context/engagement_context/engagement_hook';

interface OpenShiftVersionFormFieldProps {
  hostingEnvironment: HostingEnvironment;
  onChange: (value: string) => void;
}

export function OpenShiftVersionFormField({
  onChange,
  hostingEnvironment,
}: OpenShiftVersionFormFieldProps) {
  const { engagementFormConfig } = useEngagements();
  const { hasFeature } = useFeatures();
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
