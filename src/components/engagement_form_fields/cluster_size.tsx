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

interface ClusterSizeFormFieldProps {
  hostingEnvironment: HostingEnvironment;
  onChange: (value: string) => void;
}

export function ClusterSizeFormField({
  hostingEnvironment,
  onChange,
}: ClusterSizeFormFieldProps) {
  const { engagementFormConfig } = useEngagements();
  const { hasFeature } = useFeatures();
  return (
    <FormGroup label="Cluster Size" isRequired fieldId="cluster-size">
      <FormSelect
        isRequired
        data-testid="cluster-size-select"
        id="cluster_size_dropdown"
        aria-label="Cluster Size"
        value={hostingEnvironment?.ocp_cluster_size || ''}
        isDisabled={!hasFeature(APP_FEATURES.writer)}
        onChange={onChange}
      >
        {[
          <FormSelectOption
            key="undefined size"
            value={undefined}
            label="Select cluster size"
          />,
        ].concat(
          engagementFormConfig?.openshift_options?.cluster_size?.options.map(
            (option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                label={option.label}
                value={option.value}
                data-cy={option.label}
              />
            )
          )
        )}
      </FormSelect>
    </FormGroup>
  );
}
