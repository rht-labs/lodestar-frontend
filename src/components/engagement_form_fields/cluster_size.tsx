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

interface ClusterSizeFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
}

export function ClusterSizeFormField({
  engagement,
  onChange,
  formOptions,
}: ClusterSizeFormFieldProps) {
  const { hasFeature } = useFeatures();
  return (
    <FormGroup label="Cluster Size" isRequired fieldId="cluster-size">
      <FormSelect
        aria-label="Cluster Size"
        value={engagement?.ocp_cluster_size || ''}
        isDisabled={
          formOptions?.openshift_options?.cluster_size?.options?.length === 1 ||
          !hasFeature(APP_FEATURES.writer) ||
          !!engagement?.launch
        }
        onChange={e => onChange('ocp_cluster_size', e)}
      >
        {formOptions?.openshift_options?.cluster_size?.options?.length > 0 ? (
          formOptions?.openshift_options?.cluster_size?.options.map(
            (option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                label={option.label}
                value={option.value}
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
