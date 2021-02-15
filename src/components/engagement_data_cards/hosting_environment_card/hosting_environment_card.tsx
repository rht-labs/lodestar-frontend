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
import { OpenShiftClusterEditModal } from '../../engagement_edit_modals/hosting_environment_edit_modal';
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
import { uuid } from 'uuidv4';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { ReadyCheck } from '../../ready_check/ready_check';
import {
  EngagementGroupings,
  useEngagementFormField,
  useHostingEnvironmentManager,
} from '../../../context/engagement_context/engagement_context';
import { useHostingEnvironmentCheck } from '../../../hooks/hosting_environment_checker';

const OPENSHIFT_MODAL_KEY = 'openshift_modal';

export function HostingEnvironmentCard() {
  const {
    currentChanges,
    currentEngagement,
    saveEngagement,
    engagementFormConfig,
    clearCurrentChanges,
  } = useEngagements();
  const [
    currentHostingEnvironmentId,
    setCurrentHostingEnvironmentId,
  ] = useState<string>(null);
  const [currentHostingEnvironmentChanges = []] = useEngagementFormField(
    'hosting_environments',
    EngagementGroupings.hostingEnvironment
  );
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState<number>();
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const {
    addHostingEnvironment,
    hostingEnvironments,
    deleteHostingEnvironment,
    updateHostingEnvironment,
  } = useHostingEnvironmentManager();
  const currentEnvironmentIndex = currentHostingEnvironmentChanges.findIndex(
    he => currentHostingEnvironmentId === he?.id
  );
  const indexedChanges = currentHostingEnvironmentChanges.reduce(
    (p, c) => ({ ...p, [c.id]: c }),
    {}
  );

  useEffect(() => {
    setCurrentHostingEnvironmentId(null);
  }, [currentEngagement]);

  const onClose = () => {
    clearCurrentChanges();
    requestClose();
  };

  const onSave = () => {
    saveEngagement({
      ...(currentChanges as Engagement),
      hosting_environments: hostingEnvironments,
    });
  };

  const openHostingEnvironmentModal = (
    hostingEnvironment: HostingEnvironment
  ) => {
    setCurrentHostingEnvironmentId(hostingEnvironment.id);
    requestOpen(generateModalId(hostingEnvironment.id));
  };
  const generateModalId = (id: string) => `${OPENSHIFT_MODAL_KEY}${id}`;

  const onDelete = (hostingEnvironment: HostingEnvironment) => {
    deleteHostingEnvironment(hostingEnvironment);
  };

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

  const addEnvironment = () => {
    const newEnv = { id: uuid() };
    addHostingEnvironment(newEnv);
    openHostingEnvironmentModal(newEnv as HostingEnvironment);
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
  const rows = currentEngagement?.hosting_environments?.map?.(
    (hostingEnvironment, idx) => [
      {
        title: (
          <HostingEnvironmentValidity hostingEnvironment={hostingEnvironment} />
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
          <>
            <Feature name={'writer'}>
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
          </>
        ),
      },
    ]
  );
  const isAddHostingButtonDisabled =
    currentHostingEnvironmentChanges.length >=
    (engagementFormConfig?.logistics_options?.max_hosting_env_count ?? 1);
  return (
    <>
      <OpenShiftClusterEditModal
        isEngagementLaunched={!!currentChanges?.launch}
        onSave={onSave}
        onClose={onClose}
        setHostingEnvironment={updateHostingEnvironment}
        hostingEnvironment={{
          ocp_sub_domain: generateSuggestedSubdomain(
            currentChanges?.project_name,
            currentChanges?.customer_name,
            currentEnvironmentIndex + 1 > 0
              ? (currentEnvironmentIndex + 1)?.toString()
              : '1'
          ),
          ...(indexedChanges[currentHostingEnvironmentId] ?? {}),
        }}
        isOpen={activeModalKey === generateModalId(currentHostingEnvironmentId)}
      />
      <DataCard
        actionButton={() => (
          <EditButton
            isDisabled={isAddHostingButtonDisabled}
            onClick={addEnvironment}
            text={'Add Hosting Environment'}
            dataCy={'hosting_env_button'}
          />
        )}
        title="Hosting Environment"
      >
        {currentHostingEnvironmentChanges.length > 0 ? (
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

const HostingEnvironmentValidity = ({
  hostingEnvironment,
}: {
  hostingEnvironment: HostingEnvironment;
}) => {
  const { isValid } = useHostingEnvironmentCheck(
    hostingEnvironment,
    hostingEnvironment.ocp_sub_domain
  );
  return <ReadyCheck isReady={isValid} />;
};
