import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from '@patternfly/react-core';
import { slugify } from 'transliteration';
import { APP_FEATURES } from '../../../common/app_features';
import { Engagement } from '../../../schemas/engagement_schema';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { useFeatures } from '../../../context/feature_toggles/feature_hook';
import { Loading } from '../Loading';
import { LaunchAction } from '../../../components/launch_action/launch_action';

interface ClusterInformationProps {
  formOptions?: EngagementFormConfig;
  engagement: Engagement;
  onChange: (field: string, value: any) => void;
}

export const ClusterInformation = ({
  formOptions,
  engagement,
  onChange,
}: ClusterInformationProps) => {
  const { hasFeature } = useFeatures();
  const [editedByUser, setEditedByUser] = useState<{ [key: string]: boolean }>(
    {}
  );
  if (!formOptions) {
    return <Loading />;
  }
  const tabContent: React.CSSProperties = {
    margin: 45,
  };

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };

  const availableProviders =
    formOptions?.cloud_options?.providers?.options ?? [];
  if (
    engagement.ocp_cloud_provider_name &&
    !availableProviders.find(
      option =>
        option.value && option.value === engagement.ocp_cloud_provider_name
    )
  ) {
    availableProviders.push({
      value: engagement.ocp_cloud_provider_name,
      label: engagement.ocp_cloud_provider_name,
    });
  }
  const provider = formOptions?.cloud_options?.providers?.options?.find(
    p => p.value === engagement.ocp_cloud_provider_name
  );
  const availableProviderRegionOptions = provider?.options ?? [];

  if (
    availableProviderRegionOptions?.length === 0 &&
    engagement.ocp_cloud_provider_region
  ) {
    availableProviderRegionOptions.push({
      value: engagement.ocp_cloud_provider_region,
      label: engagement.ocp_cloud_provider_region,
    });
  }

  const getSubdomainHelperText = () => {
    if (editedByUser['ocp_sub_domain']) {
      return engagement.ocp_sub_domain;
    } else {
      if (engagement.ocp_sub_domain) {
        return slugify(engagement.ocp_sub_domain);
      } else if (engagement.suggested_subdomain) {
        return engagement.suggested_subdomain;
      } else {
        return '<desired-subdomain>';
      }
    }
  };

  const getSubdomainFieldText = () => {
    if (editedByUser['ocp_sub_domain']) {
      return engagement.ocp_sub_domain;
    } else {
      return engagement.ocp_sub_domain || engagement.suggested_subdomain || '';
    }
  };

  return (
    <Form style={tabContent} isHorizontal>
      <FormGroup fieldId="cloud-provider" label="Cloud Provider" isRequired>
        <FormSelect
          aria-label="Cloud Provider"
          isDisabled={
            availableProviders?.length === 1 ||
            !hasFeature(APP_FEATURES.writer) ||
            !!(engagement as Engagement).launch
          }
          value={engagement.ocp_cloud_provider_name || ''}
          onChange={e => onChange('ocp_cloud_provider_name', e)}
        >
          {availableProviders?.map((option: any, index: any) => (
            <FormSelectOption
              isDisabled={option.disabled}
              key={index}
              value={option.value}
              label={option.label}
            />
          ))}
        </FormSelect>
      </FormGroup>

      <FormGroup
        label="Provider Region"
        isRequired
        fieldId="cloud-provider-region"
      >
        <FormSelect
          style={input}
          aria-label="Cloud provider region"
          isDisabled={
            availableProviderRegionOptions?.length === 0 ||
            !hasFeature(APP_FEATURES.writer) ||
            !!(engagement as Engagement).launch
          }
          readOnly={availableProviderRegionOptions?.length === 0}
          value={engagement.ocp_cloud_provider_region || ''}
          onChange={e => onChange('ocp_cloud_provider_region', e)}
        >
          {availableProviderRegionOptions.map((option: any, index: any) => (
            <FormSelectOption
              isDisabled={option.disabled || !hasFeature(APP_FEATURES.writer)}
              key={index}
              value={option.value}
              label={option.label}
            />
          ))}
        </FormSelect>
      </FormGroup>

      <FormGroup
        label="OpenShift Version"
        isRequired
        fieldId="openshift-provider"
      >
        <FormSelect
          style={input}
          aria-label="OpenShift Version"
          value={engagement.ocp_version || ''}
          isDisabled={
            formOptions?.openshift_options?.versions?.options?.length === 1 ||
            !hasFeature(APP_FEATURES.writer) ||
            !!(engagement as Engagement).launch
          }
          onChange={e => onChange('ocp_version', e)}
        >
          {formOptions?.openshift_options?.versions?.options?.length > 0 ? (
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
          ) : (
            <FormSelectOption value={''} label={''} />
          )}
        </FormSelect>
      </FormGroup>

      <FormGroup
        label="Desired Subdomain"
        isRequired
        fieldId="subdomain"
        helperText={
          <div>
            Applications will live at:&nbsp;
            <strong>{`${getSubdomainHelperText()}.rht-labs.com`}</strong>
          </div>
        }
      >
        <TextInput
          style={input}
          isRequired
          isDisabled={
            !hasFeature(APP_FEATURES.writer) ||
            !!(engagement as Engagement).launch
          }
          type="text"
          id="ocp_sub_domain"
          name="ocp_sub_domain"
          value={getSubdomainFieldText()}
          onChange={e => {
            if (!editedByUser['ocp_sub_domain']) {
              setEditedByUser({ ...editedByUser, ocp_sub_domain: true });
            }
            onChange('ocp_sub_domain', e);
          }}
        />
      </FormGroup>

      <FormGroup
        label="Persistent Storage Needs"
        isRequired
        fieldId="persistent-storage-needs"
      >
        <FormSelect
          style={input}
          aria-label="Persistent Storage Needs"
          isDisabled={
            formOptions?.openshift_options?.persistent_storage?.options
              ?.length === 1 || !hasFeature(APP_FEATURES.writer)
          }
          onChange={e => onChange('ocp_persistent_storage_size', e)}
          value={engagement.ocp_persistent_storage_size || ''}
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
                />
              )
            )
          ) : (
            <FormSelectOption label={''} value={''} />
          )}
        </FormSelect>
      </FormGroup>
      <FormGroup label="Cluster Size" isRequired fieldId="cluster-size">
        <FormSelect
          aria-label="Cluster Size"
          value={engagement.ocp_cluster_size || ''}
          isDisabled={
            formOptions?.openshift_options?.cluster_size?.options?.length ===
              1 ||
            !hasFeature(APP_FEATURES.writer) ||
            !!(engagement as Engagement).launch
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
      <FormGroup label="Cluster Launch" fieldId="launch-data">
        <LaunchAction engagement={engagement} />
      </FormGroup>
    </Form>
  );
};
