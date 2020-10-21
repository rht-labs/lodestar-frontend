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
import { HostingProvider } from '../../schemas/hosting_provider';
export interface OpenShiftClusterEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  engagementFormConfig: EngagementFormConfig;
  hostingProvider: HostingProvider;
  isOpen: boolean;
  onSave: (hostingProvider: HostingProvider) => void;
  onClose: () => void;
  isEngagementLaunched: boolean;
}

export function OpenShiftClusterEditModal({
  onClose = () => {},
  hostingProvider: propsHostingProvider,
  engagementFormConfig,
  isOpen,
  onSave: propsOnSave,
  isEngagementLaunched,
}: OpenShiftClusterEditModalProps) {
  const [hostingProvider, setHostingProvider] = useState<HostingProvider>();

  useEffect(() => {
    setHostingProvider(propsHostingProvider);
  }, [propsHostingProvider, setHostingProvider]);

  const availableProviders = getAvailableProviders(
    hostingProvider,
    engagementFormConfig
  );

  const provider = engagementFormConfig?.cloud_options?.providers?.options?.find(
    p => p.value === hostingProvider?.ocp_cloud_provider_name
  );

  const availableProviderRegionOptions = getAvailableRegionOptions(
    provider,
    hostingProvider
  );

  const onSave = () => {
    propsOnSave(hostingProvider);
    onClose();
  };

  const onChange = (field, value) => {
    setHostingProvider({ ...hostingProvider, [field]: value });
  };

  if (!hostingProvider) {
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
          <CloudProviderFormField
            onChange={(value: string) =>
              onChange('ocp_cloud_provider_name', value)
            }
            availableProviders={availableProviders}
            hostingProvider={hostingProvider}
          />
          <CloudProviderRegionFormField
            isEngagementLaunched={isEngagementLaunched}
            onChange={value => onChange('ocp_cloud_provider_region', value)}
            availableProviderRegionOptions={availableProviderRegionOptions}
            hostingProvider={hostingProvider}
          />
          <OpenShiftVersionFormField
            onChange={value => onChange('ocp_version', value)}
            isEngagementLaunched={isEngagementLaunched}
            engagementFormConfig={engagementFormConfig}
            hostingProvider={hostingProvider}
          />
          <SubdomainFormField
            isEngagementLaunched={isEngagementLaunched}
            onChange={value => onChange('ocp_sub_domain', value)}
            engagementFormConfig={engagementFormConfig}
            hostingProvider={hostingProvider}
          />
          <PersistentStorageFormField
            onChange={value => onChange('ocp_persistent_storage_size', value)}
            engagementFormConfig={engagementFormConfig}
            hostingProvider={hostingProvider}
            isEngagementLaunched={isEngagementLaunched}
          />
          <ClusterSizeFormField
            onChange={value => onChange('ocp_cluster_size', value)}
            engagementFormConfig={engagementFormConfig}
            hostingProvider={hostingProvider}
            isEngagementLaunched={isEngagementLaunched}
          />
          <AdditionalDetailsFormField
            onChange={value => onChange('additional_details', value)}
            hostingProvider={hostingProvider}
          />
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}

function getAvailableProviders(
  hostingProvider: HostingProvider,
  engagementFormConfig: EngagementFormConfig
) {
  const availableProviders =
    engagementFormConfig?.cloud_options?.providers?.options ?? [];
  if (
    hostingProvider?.ocp_cloud_provider_name &&
    !availableProviders.find(
      option =>
        option.value &&
        option.value === hostingProvider?.ocp_cloud_provider_name
    )
  ) {
    availableProviders.push({
      value: hostingProvider?.ocp_cloud_provider_name,
      label: hostingProvider?.ocp_cloud_provider_name,
    });
  }
  return availableProviders;
}

function getAvailableRegionOptions(
  provider: EngagementFormOption,
  hostingProvider: HostingProvider
) {
  const availableProviderRegionOptions = provider?.options ?? [];

  if (
    availableProviderRegionOptions?.length === 0 &&
    hostingProvider?.ocp_cloud_provider_region
  ) {
    availableProviderRegionOptions.push({
      value: hostingProvider?.ocp_cloud_provider_region,
      label: hostingProvider?.ocp_cloud_provider_region,
    });
  }
  return availableProviderRegionOptions;
}
