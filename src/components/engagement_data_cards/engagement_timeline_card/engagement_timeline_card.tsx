import React, { useState } from 'react';
import { uuid } from 'uuidv4';
import { DataCard } from '../data_card';
import {Artifact, ArtifactType} from '../../../schemas/engagement';
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

export function EngagementTimelineCard() {
  const {
    currentChanges,
    saveEngagement,
    clearCurrentChanges,
  } = useEngagements();
  const { addArtifact, artifacts } = useEngagementArtifacts();
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const [currentArtifact, setCurrentArtifact] = useState<Artifact>();

  const onEditArtifact = (artifact: Artifact) => {
    setCurrentArtifact(artifact);
    requestOpen(ARTIFACT_CRUD_MODAL);
  };

  const openArtifactModal = () => {
    requestOpen(ARTIFACT_CRUD_MODAL);
    setCurrentArtifact({ id: uuid() } as Artifact);
  };

  const onSave = (artifacts: Artifact[]) =>
    saveEngagement({ ...currentChanges, artifacts });

  const onFinishArtifactEdit = (artifact: Artifact) => {
    onSave(addArtifact(artifact));
  };

  return (
    <div>
      <ArtifactEditModal
        artifact={currentArtifact}
        isOpen={activeModalKey === ARTIFACT_CRUD_MODAL}
        onClose={() => {
          requestClose();
          clearCurrentChanges();
        }}
        onSave={onFinishArtifactEdit}
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
        <EngagementTimelineCardBody
          artifacts={artifacts}
          onClear={clearCurrentChanges}
          onSave={artifacts => saveEngagement({ ...currentChanges, artifacts })}
          onAdd={openArtifactModal}
          editArtifact={onEditArtifact}
        />
      </DataCard>
    </div>
  );
}

function EngagementTimelineCardBody(
  props: EngagementTimelineCardProps & {
    editArtifact(artifact: Artifact): void;
    onAdd(): void;
  }
) {
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
  const rows =
    props?.artifacts?.map?.((artifact, idx) => [
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
          <Feature name={'writer'}>
            <Dropdown
              isPlain
              dropdownItems={actionItems}
              isOpen={idx === currentOpenDropdown}
              onSelect={() => {
                setCurrentOpenDropdown(undefined);
                props.editArtifact(artifact);
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
        ),
      },
    ]) ?? [];

  return props?.artifacts?.length > 0 ? (
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
  );
}
