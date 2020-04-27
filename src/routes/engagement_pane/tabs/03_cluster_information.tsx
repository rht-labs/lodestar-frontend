import React, { useContext } from 'react';
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from '@patternfly/react-core';
import slugify from 'slugify';
import { FeatureToggleContext } from '../../../context/feature_toggles';
import { APP_FEATURES } from '../../../common/app_features';

export const ClusterInformation = ({
  providerOptions,
  openshiftOptions,
  values,
  onChange,
}: any) => {
  const { hasFeature } = useContext(FeatureToggleContext);
  const tabContent: React.CSSProperties = {
    margin: 45,
  };

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };

  const availableProviders = [...providerOptions];
  if (
    values.ocp_cloud_provider_name &&
    !availableProviders.find(
      option =>
        option &&
        option.label &&
        option.label === values.ocp_cloud_provider_name
    )
  ) {
    availableProviders.push({
      value: values.ocp_cloud_provider_name,
      label: values.ocp_cloud_provider_name,
    });
  }

  const availableProviderRegionOptions =
    providerOptions.find(
      providerOption => providerOption.label === values.ocp_cloud_provider_name
    )?.regions ?? [];

  if (
    availableProviderRegionOptions?.length === 0 &&
    values.ocp_cloud_provider_region
  ) {
    availableProviderRegionOptions.push({
      value: values.ocp_cloud_provider_region,
      label: values.ocp_cloud_provider_region,
    });
  }
  return (
    <Form style={tabContent} isHorizontal>
      <FormGroup fieldId="cloud-provider" label="Cloud Provider" isRequired>
        <FormSelect
          aria-label="Cloud Provider"
          isDisabled={availableProviders?.length === 1}
          value={values.ocp_cloud_provider_name || ''}
          onChange={e =>
            onChange({ type: 'ocp_cloud_provider_name', payload: e })
          }
        >
          {availableProviders?.map((option: any, index: any) => (
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
        label="Provider Region"
        isRequired
        fieldId="cloud-provider-region"
      >
        <FormSelect
          style={input}
          aria-label="Cloud provider region"
          isDisabled={
            availableProviderRegionOptions?.length === 0 ||
            !hasFeature(APP_FEATURES.writer)
          }
          readOnly={availableProviderRegionOptions?.length === 0}
          value={values.ocp_cloud_provider_region || ''}
          onChange={e =>
            onChange({ type: 'ocp_cloud_provider_region', payload: e })
          }
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
          value={values.ocp_version || ''}
          isDisabled={
            openshiftOptions.versions?.length === 1 ||
            !hasFeature(APP_FEATURES.writer)
          }
          onChange={e => onChange({ type: 'ocp_version', payload: e })}
        >
          {openshiftOptions?.versions?.length > 0 ? (
            openshiftOptions?.versions?.map((option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
                label={option.label}
              />
            ))
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
            Applications will live at:
            <strong>
              {`${
                values.ocp_sub_domain
                  ? slugify(values.ocp_sub_domain)
                  : '<desired-subdomain>'
              }.rht-labs.com`}
            </strong>
          </div>
        }
      >
        <TextInput
          style={input}
          isRequired
          isDisabled={!hasFeature(APP_FEATURES.writer)}
          type="text"
          id="ocp_sub_domain"
          name="ocp_sub_domain"
          value={values.ocp_sub_domain || ''}
          onChange={e => onChange({ type: 'ocp_sub_domain', payload: e })}
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
            openshiftOptions['persistent-storage']?.length === 1 ||
            !hasFeature(APP_FEATURES.writer)
          }
          onChange={e =>
            onChange({ type: 'ocp_persistent_storage_size', payload: e })
          }
          value={values.ocp_persistent_storage_size || ''}
        >
          {openshiftOptions['persistent-storage']?.length > 0 ? (
            openshiftOptions[
              'persistent-storage'
            ].map((option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                label={option.label}
                value={option.value}
              />
            ))
          ) : (
            <FormSelectOption label={''} value={''} />
          )}
        </FormSelect>
      </FormGroup>
      <FormGroup label="Cluster Size" isRequired fieldId="cluster-size">
        <FormSelect
          aria-label="Cluster Size"
          value={values.ocp_cluster_size || ''}
          isDisabled={
            openshiftOptions['cluster-size']?.length === 1 ||
            !hasFeature(APP_FEATURES.writer)
          }
          onChange={e => onChange({ type: 'ocp_cluster_size', payload: e })}
        >
          {openshiftOptions['cluster-size']?.length > 0 ? (
            openshiftOptions['cluster-size'].map((option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                label={option.label}
                value={option.value}
              />
            ))
          ) : (
            <FormSelectOption label={''} value={''} />
          )}
        </FormSelect>
      </FormGroup>
    </Form>
  );
};
