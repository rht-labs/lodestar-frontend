import React, { useEffect, useState } from 'react';
import { Modal, ModalVariant, Button, Form } from '@patternfly/react-core';
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
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { TextFormField } from '../form_fields/text_form_field';
export interface OpenShiftClusterEditModalProps {
  hostingEnvironment: HostingEnvironment;
  isOpen: boolean;
  onSave: (hostingEnvironment: HostingEnvironment) => void;
  onClose: () => void;
  isEngagementLaunched: boolean;
  suggestedSubdomain?: string;
}

export function OpenShiftClusterEditModal({
  onClose = () => {},
  hostingEnvironment: propsHostingEnvironment,
  isOpen,
  onSave: propsOnSave,
  suggestedSubdomain,
  isEngagementLaunched,
}: OpenShiftClusterEditModalProps) {
  const { engagementFormConfig } = useEngagements();
  const [hostingEnvironment, setHostingEnvironment] = useState<
    HostingEnvironment
  >();

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
          <TextFormField
            isRequired
            data-testid="hosting_environment_name"
            type="text"
            fieldId="hosting_environment_name"
            testId={'hosting_environment_name'}
            value={hostingEnvironment.environment_name}
            onChange={e => {
              onChange('environment_name', e);
            }}
            label="Environment Name"
          />
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
            hostingEnvironment={hostingEnvironment}
          />
          <SubdomainFormField
            isEngagementLaunched={isEngagementLaunched}
            onChange={value => onChange('ocp_sub_domain', value)}
            hostingEnvironment={hostingEnvironment}
            suggestedSubdomain={suggestedSubdomain}
          />
          <PersistentStorageFormField
            onChange={value => onChange('ocp_persistent_storage_size', value)}
            hostingEnvironment={hostingEnvironment}
            isEngagementLaunched={isEngagementLaunched}
          />
          <ClusterSizeFormField
            onChange={value => {
              onChange('ocp_cluster_size', value);
              console.log(value);
            }}
            hostingEnvironment={hostingEnvironment}
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
