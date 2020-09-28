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

interface ClusterSizeFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  engagementFormConfig: EngagementFormConfig;
}

export function ClusterSizeFormField({
  engagement,
  onChange,
  engagementFormConfig,
}: ClusterSizeFormFieldProps) {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('ocp_cluster_size'), [registerField]);
  return (
    <FormGroup label="Cluster Size" isRequired fieldId="cluster-size">
      <FormSelect
        isRequired
        data-testid="cluster-size-select"
        id="cluster_size_dropdown"
        aria-label="Cluster Size"
        value={engagement?.ocp_cluster_size || ''}
        isDisabled={!hasFeature(APP_FEATURES.writer) || !!engagement?.launch}
        onChange={e => onChange('ocp_cluster_size', e)}
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
