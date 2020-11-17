import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import {
  EngagementFormConfig,
  EngagementFormOption,
} from '../../schemas/engagement_config';
import { CloudProviderFormField } from '../engagement_form_fields/cloud_provider';
import { CloudProviderRegionFormField } from '../engagement_form_fields/cloud_provider_region';
import { OpenShiftVersionFormField } from '../engagement_form_fields/oc_version';
import { SubdomainFormField } from '../engagement_form_fields/subdomain';
import { PersistentStorageFormField } from '../engagement_form_fields/persistent_storage';
import { ClusterSizeFormField } from '../engagement_form_fields/cluster_size';
import { AdditionalDetailsFormField } from '../engagement_form_fields/additional_details';
import { HostingEnvironment } from '../../schemas/hosting_environment';
import { useEngagementConfig } from '../../context/engagement_context/engagement_config_hook';
export interface OpenShiftClusterEditModalProps {
  hostingEnvironment: HostingEnvironment;
  isOpen: boolean;
  onSave: (hostingEnvironment: HostingEnvironment) => void;
  onClose: () => void;
  isEngagementLaunched: boolean;
}

export function OpenShiftClusterEditModal({
  onClose = () => {},
  hostingEnvironment: propsHostingEnvironment,
  isOpen,
  onSave: propsOnSave,
  isEngagementLaunched,
}: OpenShiftClusterEditModalProps) {
  const [hostingEnvironment, setHostingEnvironment] = useState<
    HostingEnvironment
  >();
  const { engagementFormConfig } = useEngagementConfig();

  useEffect(() => {
    setHostingEnvironment(propsHostingEnvironment);
  }, [propsHostingEnvironment, setHostingEnvironment]);

  const availableProviders = getAvailableProviders(
    hostingEnvironment,
    engagementFormConfig
  );

  const provider = engagementFormConfig?.cloud_options?.providers?.options?.find(
    p => p.value === hostingEnvironment?.ocp_cloud_provider_name
  );

  const availableProviderRegionOptions = getAvailableRegionOptions(
    provider,
    hostingEnvironment
  );

  const onSave = () => {
    propsOnSave({ ...(propsHostingEnvironment ?? {}), ...hostingEnvironment });
    onClose();
  };

  const onChange = (field, value) => {
    setHostingEnvironment({ ...hostingEnvironment, [field]: value });
  };

  if (!hostingEnvironment) {
    return <div />;
  }

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={onClose}
      title="Hosting Environment"
    >
      <EditModalTemplate
        actions={
          <div>
            <Button
              data-testid="oc-edit-save"
              onClick={onSave}
              data-cy={'hosting_env_save'}
            >
              Save
            </Button>
          </div>
        }
      >
        <Form isHorizontal>
          <FormGroup label="Environment Name" isRequired fieldId="subdomain">
            <TextInput
              isRequired
              data-testid="subdomain-input"
              type="text"
              id="ocp_sub_domain"
              name="ocp_sub_domain"
              data-cy={'desired_subdomain_input'}
              value={hostingEnvironment.environment_name}
              onChange={e => {
                onChange('environment_name', e);
              }}
            />
          </FormGroup>
          <CloudProviderFormField
            onChange={(value: string) =>
              onChange('ocp_cloud_provider_name', value)
            }
            availableProviders={availableProviders}
            hostingEnvironment={hostingEnvironment}
          />
          <CloudProviderRegionFormField
            isEngagementLaunched={isEngagementLaunched}
            onChange={value => onChange('ocp_cloud_provider_region', value)}
            availableProviderRegionOptions={availableProviderRegionOptions}
            hostingEnvironment={hostingEnvironment}
          />
          <OpenShiftVersionFormField
            onChange={value => onChange('ocp_version', value)}
            isEngagementLaunched={isEngagementLaunched}
            engagementFormConfig={engagementFormConfig}
            hostingEnvironment={hostingEnvironment}
          />
          <SubdomainFormField
            isEngagementLaunched={isEngagementLaunched}
            onChange={value => onChange('ocp_sub_domain', value)}
            engagementFormConfig={engagementFormConfig}
            hostingEnvironment={hostingEnvironment}
          />
          <PersistentStorageFormField
            onChange={value => onChange('ocp_persistent_storage_size', value)}
            engagementFormConfig={engagementFormConfig}
            hostingEnvironment={hostingEnvironment}
            isEngagementLaunched={isEngagementLaunched}
          />
          <ClusterSizeFormField
            onChange={value => {
              onChange('ocp_cluster_size', value);
              console.log(value);
            }}
            engagementFormConfig={engagementFormConfig}
            hostingEnvironment={hostingEnvironment}
            isEngagementLaunched={isEngagementLaunched}
          />
          <AdditionalDetailsFormField
            onChange={value => onChange('additional_details', value)}
            hostingEnvironment={hostingEnvironment}
          />
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}

function getAvailableProviders(
  hostingEnvironment: HostingEnvironment,
  engagementFormConfig: EngagementFormConfig
) {
  const availableProviders =
    engagementFormConfig?.cloud_options?.providers?.options ?? [];
  if (
    hostingEnvironment?.ocp_cloud_provider_name &&
    !availableProviders.find(
      option =>
        option.value &&
        option.value === hostingEnvironment?.ocp_cloud_provider_name
    )
  ) {
    availableProviders.push({
      value: hostingEnvironment?.ocp_cloud_provider_name,
      label: hostingEnvironment?.ocp_cloud_provider_name,
    });
  }
  return availableProviders;
}

function getAvailableRegionOptions(
  provider: EngagementFormOption,
  hostingEnvironment: HostingEnvironment
) {
  const availableProviderRegionOptions = provider?.options ?? [];

  if (
    availableProviderRegionOptions?.length === 0 &&
    hostingEnvironment?.ocp_cloud_provider_region
  ) {
    availableProviderRegionOptions.push({
      value: hostingEnvironment?.ocp_cloud_provider_region,
      label: hostingEnvironment?.ocp_cloud_provider_region,
    });
  }
  return availableProviderRegionOptions;
}
