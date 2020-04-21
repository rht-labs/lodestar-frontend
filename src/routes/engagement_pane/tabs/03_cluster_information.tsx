import React from 'react';
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from '@patternfly/react-core';
import slugify from 'slugify';
import find from 'lodash.find';

export const ClusterInformation = ({ options, values, onChange }: any) => {
  const tabContent: React.CSSProperties = {
    margin: 45,
  };

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };

  return (
    <Form style={tabContent} isHorizontal>
      <FormGroup fieldId="cloud-provider" label="Cloud Provider" isRequired>
        <FormSelect
          aria-label="Cloud Provider"
          isDisabled={options?.providers?.length === 1}
          value={values.ocp_cloud_provider_name || ''}
          onChange={e =>
            onChange({ type: 'ocp_cloud_provider_name', payload: e })
          }
        >
          {options?.providers?.map((option: any, index: any) => (
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
        {values.ocp_cloud_provider_name ? (
          <FormSelect
            style={input}
            aria-label="Cloud provider region"
            value={values.ocp_cloud_provider_region || ''}
            onChange={e =>
              onChange({ type: 'ocp_cloud_provider_region', payload: e })
            }
          >
            {find(options.providers, {
              value: values.ocp_cloud_provider_name,
            })?.regions.map((option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
                label={option.label}
              />
            ))}
          </FormSelect>
        ) : null}
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
          isDisabled={options.openshift.versions.length === 1}
          onChange={e => onChange({ type: 'ocp_version', payload: e })}
        >
          {options.openshift.versions.map((option: any, index: any) => (
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
          isDisabled={options.openshift['persistent-storage'].length === 1}
          onChange={e =>
            onChange({ type: 'ocp_persistent_storage_size', payload: e })
          }
          value={values.ocp_persistent_storage_size || ''}
        >
          {options.openshift['persistent-storage'].map(
            (option: any, index: any) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                label={option.label}
                value={option.value}
              />
            )
          )}
        </FormSelect>
      </FormGroup>
      <FormGroup label="Cluster Size" isRequired fieldId="cluster-size">
        <FormSelect
          aria-label="Cluster Size"
          value={values.ocp_cluster_size || ''}
          isDisabled={options.openshift['cluster-size'].length === 1}
          onChange={e => onChange({ type: 'ocp_cluster_size', payload: e })}
        >
          {options.openshift['cluster-size'].map((option: any, index: any) => (
            <FormSelectOption
              isDisabled={option.disabled}
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
        </FormSelect>
      </FormGroup>
    </Form>
  );
};
