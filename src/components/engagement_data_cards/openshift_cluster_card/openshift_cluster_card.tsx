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
import { HostingEnvironment } from '../../../schemas/hosting_environment';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { Feature } from '../../feature/feature';
import { APP_FEATURES } from '../../../common/app_features';
import { uuid } from 'uuidv4';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';

const OPENSHIFT_MODAL_KEY = 'openshift_modal';

export interface OpenShiftClusterSummaryCardProps {
  currentEngagementChanges: Engagement;
  onChange: (hostingEnvironments: HostingEnvironment[]) => void;
  onClear: () => void;
  engagementFormConfig: EngagementFormConfig;
  onSave: (hostingEnvironments: HostingEnvironment[]) => void;
  missingRequiredFields: string[];
}

export function OpenShiftClusterSummaryCard({
  currentEngagementChanges,
  onClear,
  onSave: propsOnSave,
  onChange,
  engagementFormConfig,
  missingRequiredFields,
}: OpenShiftClusterSummaryCardProps) {
  const [currentHostingEnvironment, setCurrentHostingEnvironment] = useState<
    HostingEnvironment
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
  const { saveEngagement } = useEngagements();
  const onClose = () => {
    onClear();
    requestClose();
  };
  const getUniqueProviders = (
    providers: HostingEnvironment[]
  ): HostingEnvironment[] => {
    return Object.values(
      providers.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {})
    );
  };
  const onSave = (hostingEnvironment: HostingEnvironment) => {
    const hostingEnvironments = getUniqueProviders([
      ...currentEngagementChanges.hosting_environments,
      hostingEnvironment,
    ]);
    console.log(hostingEnvironments);
    onChange(hostingEnvironments);
    propsOnSave(hostingEnvironments);
    // saveEngagement({
    //   ...currentEngagementChanges,
    //   hosting_environments: hostingEnvironments,
    // });
  };
  const openHostingEnvironmentModal = (
    hostingEnvironment: HostingEnvironment
  ) => {
    setCurrentHostingEnvironment(hostingEnvironment);
    requestOpen(OPENSHIFT_MODAL_KEY);
  };
  const onDelete = (hostingEnvironment: HostingEnvironment) => {
    const hostingEnvironments = [
      ...currentEngagementChanges.hosting_environments,
    ];
    hostingEnvironments.splice(
      hostingEnvironments.findIndex(p => p.id === hostingEnvironment.id),
      1
    );
    onChange(hostingEnvironments);
    propsOnSave(hostingEnvironments);
    saveEngagement({
      ...currentEngagementChanges,
      hosting_environments: hostingEnvironments,
    });
  };
  const addProvider = () => {
    openHostingEnvironmentModal({ id: uuid() } as HostingEnvironment);
  };
  const actionItems = (hostingEnvironment: HostingEnvironment) => [
    <DropdownItem onClick={() => onDelete(hostingEnvironment)} key="delete">
      Delete
    </DropdownItem>,
    <DropdownItem
      key="edit"
      onClick={() => openHostingEnvironmentModal(hostingEnvironment)}
    >
      Edit
    </DropdownItem>,
  ];
  // TODO Remove
  if (currentEngagementChanges) {
    currentEngagementChanges.launch = null;
  }
  const columns = [
    { title: 'Environment Name' },
    { title: 'Hosting Type' },
    { title: 'Version' },
    { title: 'Cloud Provider' },
    { title: 'Actions' },
  ];
  const rows = currentEngagementChanges?.hosting_environments?.map?.(
    (hostingEnvironment, idx) => [
      hostingEnvironment.environment_name,
      'Openshift Container Platform',
      getHumanReadableLabel(
        engagementFormConfig?.openshift_options?.versions?.options,
        hostingEnvironment?.ocp_version
      ),
      getHumanReadableLabel(
        engagementFormConfig?.cloud_options?.providers?.options,
        hostingEnvironment.ocp_cloud_provider_name
      ),
      {
        title: (
          <Feature name={APP_FEATURES.writer}>
            <Dropdown
              isPlain
              dropdownItems={actionItems(hostingEnvironment)}
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
        isEngagementLaunched={!!currentEngagementChanges?.launch}
        engagementFormConfig={engagementFormConfig}
        onSave={onSave}
        onClose={onClose}
        hostingEnvironment={currentHostingEnvironment}
        isOpen={activeModalKey === OPENSHIFT_MODAL_KEY}
      />
      <DataCard
        trailingIcon={() =>
          !currentEngagementChanges || currentEngagementChanges?.launch ? (
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
              onClick={addProvider}
              text={'Add Provider'}
              dataCy={'hosting_env_button'}
            />
          </div>
        )}
        title="Hosting Environment"
      >
        {currentEngagementChanges?.hosting_environments?.length > 0 ? (
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
              onClick={addProvider}
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
