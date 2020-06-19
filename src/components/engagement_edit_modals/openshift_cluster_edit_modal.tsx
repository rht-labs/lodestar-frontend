import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { Modal, ModalVariant, Button, Form } from '@patternfly/react-core';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import {
  EngagementFormConfig,
  EngagementFormOption,
} from '../../schemas/engagement_config';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { CloudProviderFormField } from '../engagement_form_fields/cloud_provider';
import { CloudProviderRegionFormField } from '../engagement_form_fields/cloud_provider_region';
import { OpenShiftVersionFormField } from '../engagement_form_fields/oc_version';
import { SubdomainFormField } from '../engagement_form_fields/subdomain';
import { PersistentStorageFormField } from '../engagement_form_fields/persistent_storage';
import { ClusterSizeFormField } from '../engagement_form_fields/cluster_size';

export interface OpenShiftClusterEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
}

export function OpenShiftClusterEditModal({
  engagement,
  formOptions,
  onChange,
  isOpen,
  onSave: propsOnSave,
}: OpenShiftClusterEditModalProps) {
  const { requestClose } = useModalVisibility();
  const availableProviders = getAvailableProviders(engagement, formOptions);
  const provider = formOptions?.cloud_options?.providers?.options?.find(
    p => p.value === engagement?.ocp_cloud_provider_name
  );
  const availableProviderRegionOptions = getAvailableRegionOptions(
    provider,
    engagement
  );

  const { engagementFormState } = useEngagements();

  const onSave = () => {
    propsOnSave(engagementFormState);
    requestClose();
  };
  return (
    <Modal variant={ModalVariant.large} isOpen={isOpen} onClose={requestClose}>
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={onSave}>Save</Button>
          </div>
        }
        title="Hosting Environment"
      >
        <Form isHorizontal>
          <CloudProviderFormField
            onChange={onChange}
            availableProviders={availableProviders}
            engagement={engagement}
          />
          <CloudProviderRegionFormField
            onChange={onChange}
            availableProviderRegionOptions={availableProviderRegionOptions}
            engagement={engagement}
          />
          <OpenShiftVersionFormField
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagement}
          />
          <SubdomainFormField
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagement}
          />
          <PersistentStorageFormField
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagement}
          />
          <ClusterSizeFormField
            onChange={onChange}
            formOptions={formOptions}
            engagement={engagement}
          />
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}

function getAvailableProviders(
  engagement: Engagement,
  formOptions: EngagementFormConfig
) {
  const availableProviders =
    formOptions?.cloud_options?.providers?.options ?? [];
  if (
    engagement?.ocp_cloud_provider_name &&
    !availableProviders.find(
      option =>
        option.value && option.value === engagement?.ocp_cloud_provider_name
    )
  ) {
    availableProviders.push({
      value: engagement?.ocp_cloud_provider_name,
      label: engagement?.ocp_cloud_provider_name,
    });
  }
  return availableProviders;
}

function getAvailableRegionOptions(
  provider: EngagementFormOption,
  engagement: Engagement
) {
  const availableProviderRegionOptions = provider?.options ?? [];

  if (
    availableProviderRegionOptions?.length === 0 &&
    engagement?.ocp_cloud_provider_region
  ) {
    availableProviderRegionOptions.push({
      value: engagement?.ocp_cloud_provider_region,
      label: engagement?.ocp_cloud_provider_region,
    });
  }
  return availableProviderRegionOptions;
}
