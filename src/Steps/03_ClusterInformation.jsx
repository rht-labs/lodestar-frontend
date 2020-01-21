import React from "react";
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput
} from "@patternfly/react-core";
import slug from "slug";

const cloudProvider = [
  { value: "open-stack", label: "OpenStack" },
  { value: "aws", label: "AWS" },
  { value: "google-cloud", label: "Google Cloud" },
  { value: "azure", label: "Microsoft Azure" }
];
const cloudProviderRegion = [
  { value: "us-1-east", label: "US 1 East" },
  { value: "us-1-west", label: "US 1 West" }
];
const openshiftVersion = [
  { value: "v4.3", label: "v4.3" },
  { value: "v4.2", label: "v4.2" }
];
const persistentStorage = [
  { value: "none", label: "None" },
  { value: "50", label: "50GB" },
  { value: "100", label: "100GB" },
  { value: "500", label: "500GB" },
  { value: "1000", label: "1TB" }
];
const clusterSize = [
  { value: "small", label: "Small - Up To 5 Users" },
  { value: "medium", label: "Medium - Up to 15 Users" },
  { value: "large", label: "Large - 30+" }
];

const ClusterInformation = ({ values, onChange }) => {
  return (
    <Form isHorizontal>
      <FormGroup label="Cloud Provider" isRequired fieldId="cloud-provider">
        <FormSelect
          aria-label="Cloud Provider"
          value={values.ocp_cloud_provider_name}
          onChange={e =>
            onChange({ type: "ocp_cloud_provider_name", payload: e })
          }
        >
          {cloudProvider.map((option, index) => (
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
          aria-label="Cloud provider region"
          value={values.ocp_cloud_provider_region}
          onChange={e =>
            onChange({ type: "ocp_cloud_provider_region", payload: e })
          }
        >
          {cloudProviderRegion.map((option, index) => (
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
        label="OpenShift Version"
        isRequired
        fieldId="openshift-provider"
      >
        <FormSelect
          aria-label="OpenShift Version"
          value={values.ocp_version}
          onChange={e => onChange({ type: "ocp_version", payload: e })}
        >
          {openshiftVersion.map((option, index) => (
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
                  ? slug(values.ocp_sub_domain)
                  : "<desired-subdomain>"
              }.rht-labs.com`}
            </strong>
          </div>
        }
      >
        <TextInput
          isRequired
          type="text"
          id="ocp_sub_domain"
          name="ocp_sub_domain"
          value={values.ocp_sub_domain}
          onChange={e => onChange({ type: "ocp_sub_domain", payload: e })}
        />
      </FormGroup>
      <FormGroup
        label="Persistent Storage Needs"
        isRequired
        fieldId="persistent-storage-needs"
      >
        <FormSelect
          aria-label="Persistent Storage Needs"
          value={values.ocp_persistent_storage_size}
          onChange={e =>
            onChange({ type: "ocp_persistent_storage_size", payload: e })
          }
        >
          {persistentStorage.map((option, index) => (
            <FormSelectOption
              isDisabled={option.disabled}
              key={index}
              value={option.value}
              label={option.label}
            />
          ))}
        </FormSelect>
      </FormGroup>
      <FormGroup label="Cluster Size" isRequired fieldId="cluster-size">
        <FormSelect
          aria-label="Cluster Size"
          value={values.ocp_cluster_size}
          onChange={e => onChange({ type: "ocp_cluster_size", payload: e })}
        >
          {clusterSize.map((option, index) => (
            <FormSelectOption
              isDisabled={option.disabled}
              key={index}
              value={option.value}
              label={option.label}
            />
          ))}
        </FormSelect>
      </FormGroup>
    </Form>
  );
};

export default ClusterInformation;
