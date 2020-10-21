import React, { useState } from 'react';
import { Engagement } from '../../../schemas/engagement';
import { DataCard } from '../data_card';
import {
  Button,
  Dropdown,
  DropdownItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  KebabToggle,
  Title,
} from '@patternfly/react-core';
import { OpenShiftClusterEditModal } from '../../engagement_edit_modals/openshift_cluster_edit_modal';
import {
  EngagementFormConfig,
  EngagementFormOption,
} from '../../../schemas/engagement_config';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { RequiredFieldsWarning } from '../../required_fields_warning/required_fields_warning';
import { DatabaseIcon, PlusIcon } from '@patternfly/react-icons';
import { HostingProvider } from '../../../schemas/hosting_provider';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { Feature } from '../../feature/feature';
import { APP_FEATURES } from '../../../common/app_features';

const OPENSHIFT_MODAL_KEY = 'openshift_modal';

export interface OpenShiftClusterSummaryCardProps {
  currentEngagement: Engagement;
  currentEngagementChanges: Engagement;
  onChange: (fieldName: string, value: any) => void;
  onClear: () => void;
  engagementFormConfig: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
}

const columns = [
  { title: 'Cloud Provider' },
  { title: 'Cloud Provider Region' },
  { title: 'Cluster Size' },
  { title: 'Actions' },
];

export function OpenShiftClusterSummaryCard({
  currentEngagement,
  onClear,
  currentEngagementChanges,
  onSave: propsOnSave,
  onChange,
  engagementFormConfig,
  missingRequiredFields,
}: OpenShiftClusterSummaryCardProps) {
  const [currentHostingProvider, setCurrentHostingProvider] = useState<
    HostingProvider
  >(null);
  const openshiftRequiredFields = [
    'ocp_cloud_provider_name',
    'ocp_cloud_provider_region',
    'ocp_version',
    'ocp_cluster_size',
    'ocp_persistent_storage_size',
    'ocp_sub_domain',
  ];
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState<number>();
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const onClose = () => {
    onClear();
    requestClose();
  };
  const onSave = (hostingProvider: HostingProvider) => {};
  const openHostingProviderModal = (hostingProvider: HostingProvider) => {
    setCurrentHostingProvider(hostingProvider);
    requestOpen(OPENSHIFT_MODAL_KEY);
  };
  const actionItems = [
    <DropdownItem key="edit">
      <span data-testid="hosting-provider-edit-button">Edit</span>
    </DropdownItem>,
  ];
  if (currentEngagement) {
    currentEngagement.hosting_providers = [];
  }
  const rows = currentEngagement?.hosting_providers?.map?.(
    (hostingProvider, idx) => [
      getHumanReadableLabel(
        engagementFormConfig?.cloud_options?.providers?.options,
        hostingProvider.ocp_cloud_provider_name
      ),
      getHumanReadableLabel(
        engagementFormConfig?.cloud_options?.providers?.options?.find(
          option => option.value === hostingProvider?.ocp_cloud_provider_name
        )?.options ?? [],
        hostingProvider?.ocp_cloud_provider_region
      ),
      getHumanReadableLabel(
        engagementFormConfig?.openshift_options?.cluster_size?.options,
        hostingProvider?.ocp_cluster_size
      ),
      {
        title: (
          <Feature name={APP_FEATURES.writer}>
            <Dropdown
              isPlain
              dropdownItems={actionItems}
              isOpen={idx === currentOpenDropdown}
              onSelect={() => {
                setCurrentOpenDropdown(undefined);
              }}
              toggle={
                <KebabToggle
                  onToggle={() =>
                    currentOpenDropdown === idx
                      ? setCurrentOpenDropdown(undefined)
                      : setCurrentOpenDropdown(idx)
                  }
                  id={`toggle-id-${idx}`}
                  data-testid="hosting-provider-action-kebab"
                />
              }
            />
          </Feature>
        ),
      },
    ]
  );
  return (
    <>
      <OpenShiftClusterEditModal
        isEngagementLaunched={!!currentEngagement?.launch}
        engagementFormConfig={engagementFormConfig}
        onChange={onChange}
        onSave={onSave}
        onClose={onClose}
        hostingProvider={currentHostingProvider}
        isOpen={activeModalKey === OPENSHIFT_MODAL_KEY}
      />
      <DataCard
        trailingIcon={() =>
          !currentEngagement || currentEngagement?.launch ? (
            <div />
          ) : (
            <RequiredFieldsWarning
              missingRequiredFields={missingRequiredFields}
              requiredFields={openshiftRequiredFields}
            />
          )
        }
        actionButton={() => (
          <div>
            <EditButton
              onClick={() => {
                openHostingProviderModal({} as HostingProvider);
              }}
              text={'Add Provider'}
              dataCy={'hosting_env_button'}
            />
          </div>
        )}
        title="Hosting Environment"
      >
        {currentEngagement?.hosting_providers?.length > 0 ? (
          <Table
            aria-label="Engagement Hosting Providers"
            variant={TableVariant.compact}
            cells={columns}
            rows={rows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        ) : (
          <EmptyState>
            <EmptyStateIcon icon={DatabaseIcon} />
            <Title headingLevel="h4" size="lg">
              No Hosting Providers Added
            </Title>
            <EmptyStateBody>
              <p>No hosting providers have been added to this engagement</p>
              <p>Click below to start adding hosting providers</p>
            </EmptyStateBody>
            <Button
              variant="secondary"
              onClick={() => openHostingProviderModal({} as HostingProvider)}
              data-testid={'add-first-hosting-environment'}
              data-cy={'add_new_environment'}
              style={{ margin: '1rem' }}
            >
              <PlusIcon style={{ fontSize: 'small' }} /> Add Hosting Provider
            </Button>
          </EmptyState>
        )}
      </DataCard>
    </>
  );
}

function getHumanReadableLabel(
  lookupArray: EngagementFormOption[] = [],
  value: string
) {
  return lookupArray?.find(option => option.value === value)?.label ?? value;
}
