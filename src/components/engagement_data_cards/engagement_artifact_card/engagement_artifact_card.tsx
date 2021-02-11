import React, { useState } from 'react';
import { uuid } from 'uuidv4';
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
import { ClipboardCheckIcon } from '@patternfly/react-icons';
import { Feature } from '../../feature/feature';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
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
  } = useEngagements();
  const { addArtifact, artifacts, updateArtifact } = useEngagementArtifacts();
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const [currentArtifactId, setCurrentArtifactId] = useState<string>(null);

  const onEditArtifact = (artifact: Artifact) => {
    requestOpen(getModalKey());
    setCurrentArtifactId(artifact.id);
  };

  const openArtifactModal = () => {
    const newArtifact = { id: uuid() };
    addArtifact(newArtifact as Artifact);
    requestOpen(getModalKey());
    setCurrentArtifactId(newArtifact.id);
  };

  const indexedArtifactChanges =
    artifacts.reduce?.((p, c) => ({ ...p, [c.id]: c }), {}) ?? {};

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
  const rows =
    currentEngagement?.artifacts?.map?.((artifact, idx) => [
      getLabelForValue(
        engagementFormConfig?.logistics_options?.artifact_types ?? [],
        artifact.type
      ),
      {
        title: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={getAbsoluteUrl(artifact.linkAddress)}
          >
            {artifact.title}
          </a>
        ),
      },
      artifact.description,
      {
        title: (
          <>
            <Feature name={'writer'}>
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
        artifactTypes={
          engagementFormConfig?.logistics_options?.artifact_types ?? []
        }
      />
      <DataCard
        title="Engagement Artifacts"
        trailingIcon={() => <div />}
        actionButton={() => (
          <EditButton
            text="Add an Artifact"
            onClick={openArtifactModal}
            data-testid="add-artifact-button"
          />
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
