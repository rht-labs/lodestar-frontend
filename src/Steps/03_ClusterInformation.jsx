import React from 'react';
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput
} from '@patternfly/react-core';

const cloudProviders = [
  { value: 'open-stack', label: 'OpenStack' },
  { value: 'aws', label: 'AWS' },
  { value: 'google-cloud', label: 'Google Cloud' },
  { value: 'azure', label: 'Microsoft Azure' },
];
const openshiftVersion = [
  { value: 'v4.3', label: 'v4.3' },
  { value: 'v4.2', label: 'v4.2' },
  { value: 'v3.11', label: 'v3.11', disabled: true },
  { value: 'v3.10', label: 'v3.10', disabled: true },
  { value: 'v3.9', label: 'v3.9', disabled: true },
];
const persistentStorage = [
  { value: 'none', label: 'None' },
  { value: '50', label: '50GB' },
  { value: '100', label: '100GB' },
  { value: '500', label: '500GB' },
  { value: '1000', label: '1TB' },
];
const clusterSize = [
  { value: 'small', label: 'Small - Up To 5 Users' },
  { value: 'medium', label: 'Medium - Up to 15 Users' },
  { value: 'large', label: 'Large - 30+' },
];


const ClusterInformation = () => {
  return(
    <Form isHorizontal>
      <FormGroup
         label="Cloud Provider"
         isRequired
         fieldId="cloud-provider"
       >
         <FormSelect
          aria-label="Cloud Provider">
            {cloudProviders.map((option, index) => (
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
          aria-label="OpenShift Version">
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
         helperText="<desired-subdomain>.rht-labs.com"
       >
        <TextInput
          isRequired
          type="text"
          id="subdomain"
          name="subdomain"
        />
      </FormGroup>
      <FormGroup
         label="Persistent Storage Needs"
         isRequired
         fieldId="persistent-storage-needs"
       >
         <FormSelect
          aria-label="Persistent Storage Needs">
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
      <FormGroup
         label="Cluster Size"
         isRequired
         fieldId="cluster-size"
       >
         <FormSelect
          aria-label="Cluster Size">
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
  )
}

export default ClusterInformation;
