import React from 'react';
import { Modal, ModalVariant, Button, Form } from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import {
  EngagementFormConfig,
  EngagementFormOption,
} from '../../schemas/engagement_config';
import { CloudProviderFormField } from '../engagement_form_fields/cloud_provider';
import { SubdomainFormField } from '../engagement_form_fields/subdomain';
import { AdditionalDetailsFormField } from '../engagement_form_fields/additional_details';
import { HostingEnvironment } from '../../schemas/hosting_environment';
import { useEngagement } from '../../context/engagement_context/engagement_hook';
import { TextFormField } from '../form_fields/text_form_field';
import { SelectFormField } from '../form_fields/select_form_field';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { useSubdomainUniqueness } from '../../hooks/subdomain_checker';
import { hasRequiredFields } from '../../common/validate_hosting_environment';
import { AvailabilityZoneTooltip } from '../engagement_data_cards/hosting_environment_card/availability_zone_tooltip';

export interface OpenShiftClusterEditModalProps {
  hostingEnvironment: Partial<HostingEnvironment>;
  isOpen: boolean;
  onSave: (hostingEnvironment: Partial<HostingEnvironment>) => void;
  onClose: () => void;
  isEngagementLaunched: boolean;
  suggestedSubdomain?: string;
  setHostingEnvironment: (HostingEnvironment: HostingEnvironment) => void;
}

export function OpenShiftClusterEditModal({
  onClose = () => {},
  hostingEnvironment,
  isOpen,
  onSave: propsOnSave,
  suggestedSubdomain,
  isEngagementLaunched,
  setHostingEnvironment,
}: OpenShiftClusterEditModalProps) {
  const { engagementFormConfig } = useEngagement();

  const {
    isUnique,
    checkSubdomain,
    loading: subdomainCheckLoading,
  } = useSubdomainUniqueness();

  const { hasFeature } = useFeatures();

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
    // const p = {
    //   ocp_cloud_provider_availability_zone: engagementFormConfig?.cloud_options?.availability_zones?.options?.find(element => element.default).value,
    //   ...hostingEnvironment
    // }
    if (hostingEnvironment.ocp_cloud_provider_availability_zone === undefined) {
      hostingEnvironment.ocp_cloud_provider_availability_zone = engagementFormConfig?.cloud_options?.availability_zones?.options?.find(element => element.default).value;
    }
    console.log(hostingEnvironment);
    propsOnSave(hostingEnvironment);
    onClose();
  };

  const onChange = (field: keyof HostingEnvironment, value) => {
    setHostingEnvironment({
      ...hostingEnvironment,
      [field]: value,
    } as HostingEnvironment);
  };

  const canSaveEnvironment = (): boolean => {
    const isSubdomainReady = !subdomainCheckLoading && isUnique;
    if (isEngagementLaunched) {
      return hasRequiredFields(hostingEnvironment) && isSubdomainReady;
    } else {
      return true;
    }
  };

  if (!hostingEnvironment) {
    return <div />;
  }

  // if (
  //   !hostingEnvironment.ocp_cloud_provider_availability_zone
  // ) {
  //   hostingEnvironment.ocp_cloud_provider_availability_zone = engagementFormConfig?.cloud_options?.availability_zones?.options?.find(element => element.default)?.value;
  //   console.log(hostingEnvironment)
  // }

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={onClose}
      title="Hosting Environment"
    >
      <div data-testid="he_edit_modal">
        <EditModalTemplate
          actions={
            <div>
              <Button
                data-testid="oc-edit-save"
                onClick={onSave}
                isDisabled={!canSaveEnvironment()}
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
              testId="provider-region-select"
              emptyValue={{
                label: 'Select a region',
              }}
              options={availableProviderRegionOptions?.map?.(o => ({
                disabled: o.disabled,
                value: o.value,
                label: o.label,
              }))}
              onChange={value => onChange('ocp_cloud_provider_region', value)}
              value={hostingEnvironment?.ocp_cloud_provider_region}
            />
            <SelectFormField
              label={<>Availability Zone
              <AvailabilityZoneTooltip /></>}
              isDisabled={
                engagementFormConfig?.cloud_options?.availability_zones?.options?.length === 0 ||
                !hasFeature(APP_FEATURES.writer)
              }
              testId="provider-availability-zone-select"
              emptyValue={{
                label: "Select an availability zone configuration"
              }}
              options={engagementFormConfig?.cloud_options?.availability_zones?.options?.map?.(
                v => ({ label: v.label, disabled: v.disabled, value: v.value })
              )}
              onChange={value => onChange('ocp_cloud_provider_availability_zone', value)}
              value={hostingEnvironment?.ocp_cloud_provider_availability_zone ?? engagementFormConfig?.cloud_options?.availability_zones?.options?.find(element => element.default).value}
            />
            <SelectFormField
              value={hostingEnvironment?.ocp_version || ''}
              testId="oc_version_select"
              emptyValue={{ label: 'Select a version' }}
              options={engagementFormConfig?.openshift_options?.versions?.options?.map?.(
                v => ({ label: v.label, disabled: v.disabled, value: v.value })
              )}
              label={'OpenShift Version'}
              fieldId="openshift-version"
              isRequired={true}
              onChange={value => onChange('ocp_version', value)}
            />
            <SubdomainFormField
              isEngagementLaunched={isEngagementLaunched}
              isUnique={isUnique}
              isLoading={subdomainCheckLoading}
              onChange={value => {
                checkSubdomain(value, hostingEnvironment?.ocp_sub_domain);
                onChange('ocp_sub_domain', value);
              }}
              hostingEnvironment={hostingEnvironment}
              suggestedSubdomain={suggestedSubdomain}
            />
            <SelectFormField
              value={hostingEnvironment?.ocp_persistent_storage_size}
              testId="persistent-storage-select"
              label="Persistent Storage Needs"
              options={engagementFormConfig?.openshift_options?.persistent_storage?.options?.map?.(
                v => ({ label: v.label, disabled: v.disabled, value: v.value })
              )}
              emptyValue={{ label: 'Select a storage size' }}
              fieldId="persistent_storage_dropdown"
              isRequired={true}
              onChange={value => onChange('ocp_persistent_storage_size', value)}
            />
            <SelectFormField
              isRequired
              options={engagementFormConfig?.openshift_options?.cluster_size?.options?.map?.(
                v => ({ label: v.label, disabled: v.disabled, value: v.value })
              )}
              testId="cluster-size-select"
              fieldId="cluster_size_dropdown"
              value={hostingEnvironment?.ocp_cluster_size || ''}
              emptyValue={{ label: 'Select cluster size' }}
              label="Cluster Size"
              isDisabled={!hasFeature(APP_FEATURES.writer)}
              onChange={value => onChange('ocp_cluster_size', value)}
            />
            <AdditionalDetailsFormField
              onChange={value => onChange('additional_details', value)}
              hostingEnvironment={hostingEnvironment}
            />
          </Form>
        </EditModalTemplate>
      </div>
    </Modal>
  );
}

function getAvailableProviders(
  hostingEnvironment: Partial<HostingEnvironment>,
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
  hostingEnvironment: Partial<HostingEnvironment>
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
