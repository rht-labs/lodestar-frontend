import React, { useState } from 'react';
import { DataCard } from '../data_card';
import { Artifact } from '../../../schemas/engagement';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { getLabelForValue } from '../../../common/label_value_tools';
import {
  Table,
  TableVariant,
  TableHeader,
  TableBody,
  cellWidth,
} from '@patternfly/react-table';
import {
  Dropdown,
  KebabToggle,
  DropdownItem,
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { ArtifactEditModal } from '../../engagement_edit_modals/add_artifact_modal';
import { ClipboardCheckIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Feature } from '../../feature/feature';
import { useEngagement } from '../../../context/engagement_context/engagement_hook';
import { useEngagementArtifacts } from '../../../context/engagement_context/engagement_context';

export interface EngagementTimelineCardProps {
  artifacts: Artifact[];
  onClear: () => void;
  onSave: (artifacts: Array<Artifact>) => void;
}

const ARTIFACT_CRUD_MODAL = 'artifact_crud_modal';

export function EngagementArtifactCard() {
  const {
    currentEngagement,
    currentChanges,
    saveEngagement,
    clearCurrentChanges,
    engagementFormConfig,
  } = useEngagement();
  const { addArtifact, artifacts, updateArtifact } = useEngagementArtifacts();
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const [currentArtifactId, setCurrentArtifactId] = useState<string>(null);

  const artifactTypes =
    engagementFormConfig?.artifact_options?.types?.options ?? [];

  const onEditArtifact = (artifact: Artifact) => {
    requestOpen(getModalKey());
    setCurrentArtifactId(artifact.uuid);
  };

  const openArtifactModal = () => {
    const newArtifact: Partial<Artifact> = {
      uuid: null,
      type: artifactTypes[0]?.value,
    };
    addArtifact(newArtifact as Artifact);
    requestOpen(getModalKey());
    setCurrentArtifactId(newArtifact.uuid);
  };

  const indexedArtifactChanges =
    artifacts.reduce?.((p, c) => ({ ...p, [c.uuid]: c }), {}) ?? {};

  const onSave = (artifacts: Artifact[]) =>
    saveEngagement({ ...currentChanges, artifacts });

  const onFinishArtifactEdit = () => {
    onSave(addArtifact(indexedArtifactChanges[currentArtifactId]));
  };
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState<number>();
  const columns = [
    { title: 'Type', transforms: [cellWidth(10)] },
    { title: 'Title', transforms: [cellWidth(20)] },
    { title: 'Description', transforms: [cellWidth('max')] },
    { title: 'Actions' },
  ];
  function getAbsoluteUrl(url: string): string {
    if (url?.includes?.('://')) {
      return url;
    } else {
      return `//${url}`;
    }
  }
  const actionItems = [
    <DropdownItem key="edit">
      <span data-testid="artifact-edit-button">Edit</span>
    </DropdownItem>,
  ];
  const getModalKey = () => `${ARTIFACT_CRUD_MODAL}`;
  const addLinkIconWithWrapCorrection = (children: any) => {
    const childrenArray = String(children).split(' ');
    return <>{childrenArray.slice(0, -1).join(' ')} <span className="nowrap">{childrenArray.slice(-1)}&nbsp;<ExternalLinkAltIcon className="externalAltLinkIcon"/></span></>;
  }
  const rows =
    currentEngagement?.artifacts?.map?.((artifact, idx) => [
      getLabelForValue(
        engagementFormConfig?.artifact_options?.types?.options ?? [],
        artifact.type
      ),
      {
        title: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={getAbsoluteUrl(artifact.linkAddress)}
          >
            {addLinkIconWithWrapCorrection(artifact.title)}
          </a>
        ),
      },
      artifact.description,
      {
        title: (
          <>
            <Feature name={'engagementWriter'}>
              <Dropdown
                isPlain
                dropdownItems={actionItems}
                isOpen={idx === currentOpenDropdown}
                onSelect={() => {
                  setCurrentOpenDropdown(undefined);
                  onEditArtifact(artifact);
                }}
                toggle={
                  <KebabToggle
                    onToggle={() =>
                      currentOpenDropdown === idx
                        ? setCurrentOpenDropdown(undefined)
                        : setCurrentOpenDropdown(idx)
                    }
                    id={`toggle-id-${idx}`}
                    data-testid="artifact-action-kebab"
                  />
                }
              />
            </Feature>
          </>
        ),
      },
    ]) ?? [];

  return (
    <div>
      <ArtifactEditModal
        artifact={indexedArtifactChanges[currentArtifactId]}
        isOpen={activeModalKey === getModalKey()}
        onUpdate={updateArtifact}
        onClose={() => {
          requestClose();
          clearCurrentChanges();
        }}
        onSave={onFinishArtifactEdit}
        artifactTypes={artifactTypes}
      />
      <DataCard
        title="Engagement Artifacts"
        trailingIcon={() => <div />}
        actionButton={() => (
          <Feature name="writer">
            <EditButton
              text="Add an Artifact"
              onClick={openArtifactModal}
              data-testid="add-artifact-button"
            />
          </Feature>
        )}
      >
        {currentEngagement?.artifacts?.length > 0 ? (
          <div data-testid="artifact-table">
            <Table
              aria-label="Engagement Artifacts"
              variant={TableVariant.compact}
              cells={columns}
              rows={rows}
            >
              <TableHeader />
              <TableBody />
            </Table>
          </div>
        ) : (
          <EmptyState>
            <EmptyStateIcon
              icon={ClipboardCheckIcon}
              style={{ fontSize: '34px', margin: '0' }}
            />
            <Title headingLevel="h5" size="md" style={{ marginTop: '0' }}>
              No Artifacts Added
            </Title>
            <EmptyStateBody>
              <p>Click 'Add Artifact' button to start adding artifacts</p>
            </EmptyStateBody>
          </EmptyState>
        )}
      </DataCard>
    </div>
  );
}
