import React, { useState, useEffect } from 'react';
import { uuid } from 'uuidv4';
import { DataCard } from '../data_card';
import { Artifact } from '../../../schemas/engagement';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import {
  Table,
  TableVariant,
  TableHeader,
  TableBody,
} from '@patternfly/react-table';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';
import { ArtifactEditModal } from '../../engagement_edit_modals/add_artifact_modal';

export interface EngagementTimelineCardProps {
  artifacts: Artifact[];
  onChangeArtifacts: (value: Artifact[]) => void;
  engagementFormConfig: EngagementFormConfig;
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
          [curr.guid]: curr,
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
    setCurrentArtifact({ guid: uuid() } as Artifact);
  };

  const _onSave = (artifact: Artifact) => {
    props.onSave(_getUniqueArtifacts([...props.artifacts, artifact]));
  };

  return (
    <>
      <ArtifactEditModal
        artifact={currentArtifact}
        isOpen={activeModalKey === ARTIFACT_CRUD_MODAL}
        onClose={requestClose}
        onSave={_onSave}
      />
      <DataCard
        title="Engagement Timeline"
        trailingIcon={() => <div />}
        actionButton={() => (
          <EditButton text="Add an Artifact" onClick={addArtifact} />
        )}
      >
        <EngagementTimelineCardBody editArtifact={onEditArtifact} {...props} />
      </DataCard>
    </>
  );
}

function EngagementTimelineCardBody(
  props: EngagementTimelineCardProps & {
    editArtifact(artifact: Artifact): void;
  }
) {
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState<number>();
  const columns = [
    { title: 'Type' },
    { title: 'Title' },
    { title: 'Link to Resource' },
    { title: 'Actions' },
  ];
  const actionItems = [<DropdownItem key="edit">Edit</DropdownItem>];
  const rows = props.artifacts.map((artifact, idx) => [
    artifact.type,
    artifact.title,
    { title: <a href={artifact.linkAddress}>{artifact.linkAddress}</a> },
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
            />
          }
        />
      ),
    },
  ]);
  return (
    <Table
      aria-label="Engagement Timeline"
      variant={TableVariant.compact}
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
}
