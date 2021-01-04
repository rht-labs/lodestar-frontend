import React, { useEffect, useState } from 'react';
import { Modal, ModalVariant, Button, Form } from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import {
  EngagementFormConfig,
  EngagementFormOption,
} from '../../schemas/engagement_config';
import { CloudProviderFormField } from '../engagement_form_fields/cloud_provider';
import { SubdomainFormField } from '../engagement_form_fields/subdomain';
import { PersistentStorageFormField } from '../engagement_form_fields/persistent_storage';
import { ClusterSizeFormField } from '../engagement_form_fields/cluster_size';
import { AdditionalDetailsFormField } from '../engagement_form_fields/additional_details';
import { HostingEnvironment } from '../../schemas/hosting_environment';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { TextFormField } from '../form_fields/text_form_field';
import { SelectFormField } from '../form_fields/select_form_field';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
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

  const { hasFeature } = useFeatures();
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

  const onChange = (field: keyof HostingEnvironment, value) => {
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
          <SelectFormField
            label="Provider Region"
            isDisabled={
              availableProviderRegionOptions?.length === 0 ||
              !hasFeature(APP_FEATURES.writer)
            }
            data-testid="provider-region-select"
            options={[
              {
                disabled: false,
                value: undefined,
                label: 'Select a region',
              },
            ].concat(
              availableProviderRegionOptions?.map?.(o => ({
                disabled: o.disabled,
                value: o.value,
                label: o.label,
              }))
            )}
            onChange={value => onChange('ocp_cloud_provider_region', value)}
            value={hostingEnvironment?.ocp_cloud_provider_region}
          />
          <SelectFormField
            value={hostingEnvironment?.ocp_version || ''}
            testId="oc-version-select"
            options={[{ value: undefined, label: 'Select a version' }].concat(
              engagementFormConfig?.openshift_options?.versions?.options?.map?.(
                v => ({ label: v.label, disabled: v.disabled, value: v.value })
              )
            )}
            label={'OpenShift Version'}
            fieldId="openshift-version"
            isRequired={true}
            onChange={value => onChange('ocp_version', value)}
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
