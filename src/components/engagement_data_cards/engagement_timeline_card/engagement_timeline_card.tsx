import React, { useState } from 'react';
import { uuid } from 'uuidv4';
import { DataCard } from '../data_card';
import { Artifact } from '../../../schemas/engagement';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import {
  Table,
  TableVariant,
  TableHeader,
  TableBody,
  cellWidth,
} from '@patternfly/react-table';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';
import { ArtifactEditModal } from '../../engagement_edit_modals/add_artifact_modal';

export interface EngagementTimelineCardProps {
  artifacts: Artifact[];
  onChangeArtifacts: (value: Artifact[]) => void;
  onClear: () => void
  onSave: (artifacts: Array<Artifact>) => void;
}

const ARTIFACT_CRUD_MODAL = 'artifact_crud_modal';

export function EngagementTimelineCard(props: EngagementTimelineCardProps) {
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const [currentArtifact, setCurrentArtifact] = useState<Artifact>();
  const _getUniqueArtifacts = (artifacts: Array<Artifact>): Array<Artifact> => {
    const uniqueArtifactMap = artifacts.reduce<{ [key: string]: Artifact }>(
      (prev, curr) => {
        return {
          ...prev,
          [curr.id]: curr,
        };
      },
      {}
    );
    return Object.keys(uniqueArtifactMap).map(k => uniqueArtifactMap[k]);
  };

  const onEditArtifact = (artifact: Artifact) => {
    setCurrentArtifact(artifact);
    requestOpen(ARTIFACT_CRUD_MODAL);
  };

  const addArtifact = () => {
    requestOpen(ARTIFACT_CRUD_MODAL);
    setCurrentArtifact({ id: uuid() } as Artifact);
  };

  const _onSave = (artifact: Artifact) => {
    const artifacts = _getUniqueArtifacts([...props.artifacts, artifact]);
    props.onChangeArtifacts(artifacts);
    props.onSave(artifacts);
  };

  return (
    <div>
      <ArtifactEditModal
        artifact={currentArtifact}
        isOpen={activeModalKey === ARTIFACT_CRUD_MODAL}
        onClose={requestClose}
        onSave={_onSave}
      />
      <DataCard
        title="Engagement Artifacts"
        trailingIcon={() => <div />}
        actionButton={() => (
          <EditButton
            text="Add an Artifact"
            onClick={addArtifact}
            data-testid="add-artifact-button"
          />
        )}
      >
        <EngagementTimelineCardBody {...props} editArtifact={onEditArtifact} />
      </DataCard>
    </div>
  );
}

function EngagementTimelineCardBody(
  props: EngagementTimelineCardProps & {
    editArtifact(artifact: Artifact): void;
  }
) {
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState<number>();
  const columns = [
    { title: 'Type', transforms: [cellWidth(10)] },
    { title: 'Title', transforms: [cellWidth(20)] },
    { title: 'Description', transforms: [cellWidth('max')] },
    { title: 'Actions' },
  ];
  const actionItems = [
    <DropdownItem key="edit">
      <span data-testid="artifact-edit-button">Edit</span>
    </DropdownItem>,
  ];
  const rows = props.artifacts.map((artifact, idx) => [
    artifact.type,
    {
      title: <a href={artifact.linkAddress}>{artifact.title}</a>,
    },
    artifact.description,
    {
      title: (
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
            ></KebabToggle>
          }
        />
      ),
    },
  ]);
  return (
    <Table
      aria-label="Engagement Artifacts"
      variant={TableVariant.compact}
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}
