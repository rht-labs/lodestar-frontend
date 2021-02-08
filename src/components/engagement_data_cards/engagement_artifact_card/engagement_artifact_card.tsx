import React, { useState } from 'react';
import { uuid } from 'uuidv4';
import { DataCard } from '../data_card';
import { Artifact, ArtifactType } from '../../../schemas/engagement';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
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
    currentChanges,
    saveEngagement,
    clearCurrentChanges,
  } = useEngagements();
  const { addArtifact, artifacts, updateArtifact } = useEngagementArtifacts();
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();

  const onEditArtifact = (artifact: Artifact) => {
    requestOpen(getModalKey(artifact.id));
  };

  const openArtifactModal = () => {
    const newArtifact = { id: uuid() };
    addArtifact(newArtifact as Artifact);
    requestOpen(getModalKey(newArtifact.id));
  };

  const indexedArtifactChanges =
    currentChanges?.artifacts?.reduce?.((p, c) => ({ ...p, [c.id]: c }), {}) ??
    {};

  const onSave = (artifacts: Artifact[]) =>
    saveEngagement({ ...currentChanges, artifacts });

  const onFinishArtifactEdit = (artifact: Artifact) => {
    onSave(addArtifact(artifact));
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
  const getModalKey = (id: string) => `${ARTIFACT_CRUD_MODAL}${id}`;
  const rows =
    artifacts?.map?.((artifact, idx) => [
      ArtifactType[artifact.type],
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
            <ArtifactEditModal
              artifact={indexedArtifactChanges[artifact.id]}
              isOpen={activeModalKey === getModalKey(artifact.id)}
              onUpdate={updateArtifact}
              onClose={() => {
                requestClose();
                clearCurrentChanges();
              }}
              onSave={onFinishArtifactEdit}
            />
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
        {artifacts?.length > 0 ? (
          <Table
            aria-label="Engagement Artifacts"
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
