import React, { useEffect, useState } from 'react';
import { Engagement } from '../../../schemas/engagement';
import { DataCard } from '../data_card';
import slugify from 'slugify';
import {
  Dropdown,
  DropdownItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  KebabToggle,
  Title,
} from '@patternfly/react-core';
import { OpenShiftClusterEditModal } from '../../engagement_edit_modals/openshift_cluster_edit_modal';
import { EngagementFormOption } from '../../../schemas/engagement_config';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { DatabaseIcon } from '@patternfly/react-icons';
import { HostingEnvironment } from '../../../schemas/hosting_environment';
import {
  cellWidth,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { Feature } from '../../feature/feature';
import { APP_FEATURES } from '../../../common/app_features';
import { uuid } from 'uuidv4';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { ReadyCheck } from '../../ready_check/ready_check';
import { useEngagementFormField } from '../../../context/engagement_context/engagement_context';

const OPENSHIFT_MODAL_KEY = 'openshift_modal';
const requiredHostingEnvironmentFields: Array<keyof HostingEnvironment> = [
  'ocp_cloud_provider_name',
  'ocp_cloud_provider_region',
  'ocp_persistent_storage_size',
  'ocp_sub_domain',
  'ocp_version',
  'environment_name',
];

export function HostingEnvironmentCard() {
  const {
    currentEngagement,
    currentChanges,
    updateEngagementFormField,
    saveEngagement,
    engagementFormConfig,
    clearCurrentChanges,
  } = useEngagements();
  const [currentHostingEnvironment, setCurrentHostingEnvironment] = useState<
    HostingEnvironment
  >(null);
  const onChange = (hostingEnvironments: HostingEnvironment[]) => {
    updateEngagementFormField('hosting_environments', hostingEnvironments);
  };
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState<number>();
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const [hostingEnvironments, setHostingEnvironments] = useEngagementFormField(
    'hosting_environments'
  );

  useEffect(() => {
    setCurrentHostingEnvironment(null);
  }, [currentEngagement]);
  const onClose = () => {
    clearCurrentChanges();
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
    const newEnvironments = getUniqueProviders([
      ...hostingEnvironments,
      hostingEnvironment,
    ]);
    setHostingEnvironments(newEnvironments);
    saveEngagement({
      ...(currentChanges as Engagement),
      hosting_environments: newEnvironments,
    });
  };
  const openHostingEnvironmentModal = (
    hostingEnvironment: HostingEnvironment
  ) => {
    setCurrentHostingEnvironment(hostingEnvironment);
    requestOpen(OPENSHIFT_MODAL_KEY);
  };
  const onDelete = (hostingEnvironment: HostingEnvironment) => {
    const hostingEnvironments = [...currentChanges.hosting_environments];
    hostingEnvironments.splice(
      hostingEnvironments.findIndex(p => p.id === hostingEnvironment.id),
      1
    );
    onChange(hostingEnvironments);
    saveEngagement({
      ...(currentChanges as Engagement),
      hosting_environments: hostingEnvironments,
    });
  };
  const addProvider = () => {
    openHostingEnvironmentModal({ id: uuid() } as HostingEnvironment);
  };
  const actionItems = (hostingEnvironment: HostingEnvironment) => {
    const items = [
      <DropdownItem
        key="edit"
        onClick={() => openHostingEnvironmentModal(hostingEnvironment)}
      >
        Edit
      </DropdownItem>,
    ];
    if (!currentEngagement?.launch) {
      return [
        ...items,
        <DropdownItem onClick={() => onDelete(hostingEnvironment)} key="delete">
          Delete
        </DropdownItem>,
      ];
    }
    return items;
  };
  const columns = [
    { title: '', transforms: [cellWidth(10)] },
    { title: 'Environment Name' },
    { title: 'Hosting Type' },
    { title: 'Version' },
    { title: 'Cloud Provider' },
    { title: 'Actions' },
  ];
  const rows = currentChanges?.hosting_environments?.map?.(
    (hostingEnvironment, idx) => [
      {
        title: (
          <ReadyCheck
            isReady={requiredHostingEnvironmentFields.every(
              f =>
                hostingEnvironment[f] !== undefined &&
                hostingEnvironment[f] !== null &&
                hostingEnvironment[f] !== ''
            )}
          />
        ),
      },
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
  const generateSuggestedSubdomain = (
    project_name: string = '',
    customer_name: string = '',
    randomizer: string = ''
  ): string => {
    let slug = '';
    const maxLen = 8;
    if (project_name?.length > 2) {
      slug = project_name;
    } else if (customer_name?.length > 2) {
      slug = customer_name;
    }
    if (slug.length > maxLen && slug.substring(0, maxLen).includes(' ')) {
      slug = slug.substr(0, slug.lastIndexOf(' ', maxLen));
    }
    slug = slugify(slug.substring(0, maxLen));
    if (randomizer?.length > 0) {
      slug = `${slug}-${randomizer}`;
    }
    return slug;
  };
  const currentEnvironmentIndex = currentChanges?.hosting_environments?.findIndex(
    he => currentHostingEnvironment?.id === he?.id
  );
  const isAddHostingButtonDisabled =
    currentChanges?.hosting_environments?.length >=
    (engagementFormConfig?.logistics_options?.max_hosting_env_count ?? 1);
  return (
    <>
      <OpenShiftClusterEditModal
        isEngagementLaunched={!!currentChanges?.launch}
        onSave={onSave}
        onClose={onClose}
        hostingEnvironment={currentHostingEnvironment}
        isOpen={activeModalKey === OPENSHIFT_MODAL_KEY}
        suggestedSubdomain={generateSuggestedSubdomain(
          currentChanges?.project_name,
          currentChanges?.customer_name,
          currentEnvironmentIndex + 1 > 0
            ? (currentEnvironmentIndex + 1)?.toString()
            : '1'
        )}
      />
      <DataCard
        actionButton={() => (
          <EditButton
            isDisabled={isAddHostingButtonDisabled}
            onClick={addProvider}
            text={'Add Hosting Environment'}
            dataCy={'hosting_env_button'}
          />
        )}
        title="Hosting Environment"
      >
        {currentChanges?.hosting_environments?.length > 0 ? (
          <Table
            aria-label="Engagement Hosting Environments"
            variant={TableVariant.compact}
            cells={columns}
            rows={rows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        ) : (
          <EmptyState>
            <EmptyStateIcon
              icon={DatabaseIcon}
              style={{ fontSize: '34px', margin: '0' }}
            />
            <Title headingLevel="h5" size="md" style={{ marginTop: '0' }}>
              No Hosting Environments Added
            </Title>
            <EmptyStateBody>
              <p>
                Click 'Add Hosting Environment' to start adding hosting
                environments
              </p>
            </EmptyStateBody>
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
