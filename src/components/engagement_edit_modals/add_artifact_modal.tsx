import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Form,
  FormSelect,
  FormGroup,
  FormSelectOption,
  TextInput,
} from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { Artifact, ArtifactType } from '../../schemas/engagement';
import { FormManager } from '../../context/form_manager/form_manager';

export interface ArtifactEditModalProps {
  onClose: () => void;
  isOpen: boolean;
  artifact: Artifact;
  onSave: (artifact: Artifact) => void;
}

export function ArtifactEditModal(props: ArtifactEditModalProps) {
  const [artifactEdits, setArtifactEdits] = useState<Partial<Artifact>>({});
  const { registerField } = FormManager.useFormGroupManager();

  useEffect(() => registerField('artifacts'), [registerField]);

  useEffect(
    () =>
      setArtifactEdits({
        type: ArtifactType.demo,
        ...props.artifact,
      }),
    [props.artifact]
  );

  const onSave = () => {
    props.onSave({
      ...(props.artifact ?? {}),
      ...artifactEdits,
    } as Artifact);
    props.onClose?.();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Engagement Artifact"
    >
      <EditModalTemplate
        actions={
          <Button
            data-testid="save-artifact"
            onClick={onSave}
            data-cy={'save-artifact-button'}
          >
            Save
          </Button>
        }
      >
        <Form>
          <FormGroup label="Artifact Type" isRequired fieldId="artifact-type">
            <FormSelect
              data-testid="artifact-type-select"
              aria-label="Artifact Type"
              id="artifact-type-select"
              value={artifactEdits?.type}
              onChange={(value: ArtifactType) => {
                setArtifactEdits({
                  ...artifactEdits,
                  type: value,
                });
              }}
            >
              {Object.keys(ArtifactType).map(artifactTypeKey => (
                <FormSelectOption
                  key={ArtifactType[artifactTypeKey]}
                  value={ArtifactType[artifactTypeKey]}
                  label={ArtifactType[artifactTypeKey]}
                >
                  {ArtifactType[artifactTypeKey]}
                </FormSelectOption>
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup label="Artifact Title" isRequired fieldId="artifact-title">
            <TextInput
              isRequired
              data-testid="artifact-title-input"
              name="artifact_title"
              data-cy="artifact-title-input"
              aria-label="Artifact Title"
              value={artifactEdits?.title ?? ''}
              onChange={e => setArtifactEdits({ ...artifactEdits, title: e })}
            />
          </FormGroup>
          <FormGroup label="Artifact Link" isRequired fieldId="artifact-link">
            <TextInput
              isRequired
              data-testid="artifact-link-input"
              name="artifact_link"
              aria-label="Artifact Link"
              data-cy="artifact-link-input"
              value={artifactEdits?.linkAddress ?? ''}
              onChange={e =>
                setArtifactEdits({ ...artifactEdits, linkAddress: e })
              }
            />
          </FormGroup>
          <FormGroup
            label="Artifact Description"
            isRequired
            fieldId="artifact-description"
          >
            <TextInput
              isRequired
              data-testid="artifact-description-input"
              name="artifact_description"
              data-cy="artifact-description-input"
              aria-label="Artifact Description"
              value={artifactEdits?.description ?? ''}
              onChange={e =>
                setArtifactEdits({ ...artifactEdits, description: e })
              }
            />
          </FormGroup>
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
