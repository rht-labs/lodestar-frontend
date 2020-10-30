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
import {
  Dropdown,
  KebabToggle,
  DropdownItem,
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
} from '@patternfly/react-core';
import { ArtifactEditModal } from '../../engagement_edit_modals/add_artifact_modal';
import { PlusIcon, ClipboardCheckIcon } from '@patternfly/react-icons';
import { APP_FEATURES } from '../../../common/app_features';
import { Feature } from '../../feature/feature';

export interface EngagementTimelineCardProps {
  artifacts: Artifact[];
  onChangeArtifacts: (value: Artifact[]) => void;
  onClear: () => void;
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
        onClose={() => {
          requestClose();
          props.onClear();
        }}
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
        <EngagementTimelineCardBody
          {...props}
          onAdd={addArtifact}
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
    if (url.includes('://')) {
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
      artifact.type,
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
          <Feature name={APP_FEATURES.writer}>
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
      <EmptyStateIcon icon={ClipboardCheckIcon} />
      <Title headingLevel="h4" size="lg">
        No Artifacts Added
      </Title>
      <EmptyStateBody>
        <p>No artifacts have been added to this engagement</p>
        <p>Click below to start adding artifacts</p>
      </EmptyStateBody>
      <Button
        variant="secondary"
        onClick={props.onAdd}
        data-testid={'add-first-artifact'}
        data-cy={'add_new_artifact'}
        style={{ margin: '1rem' }}
      >
        <PlusIcon style={{ fontSize: 'small' }} /> Add Artifact
      </Button>
    </EmptyState>
  );
}
