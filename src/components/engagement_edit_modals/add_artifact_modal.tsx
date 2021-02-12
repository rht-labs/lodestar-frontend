import React from 'react';
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
import { Artifact } from '../../schemas/engagement';
import {
  useAnalytics,
  AnalyticsCategory,
} from '../../context/analytics_context/analytics_context';

export interface ArtifactEditModalProps {
  onClose: () => void;
  isOpen: boolean;
  artifact: Partial<Artifact>;
  onUpdate: (artifact: Partial<Artifact>) => void;
  onSave: () => void;
  artifactTypes: { label: string; value: string }[];
}

export function ArtifactEditModal(props: ArtifactEditModalProps) {
  const { logEvent } = useAnalytics();
  const { artifact } = props;

  const onSave = () => {
    props.onSave();
    logEvent({
      action: 'Add Artifact',
      category: AnalyticsCategory.engagements,
    });
    props.onClose?.();
  };
  const isSaveEnabled =
    artifact &&
    !!artifact.description &&
    !!artifact.linkAddress &&
    !!artifact.title &&
    !!artifact.type;

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
            isDisabled={!isSaveEnabled}
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
              value={props?.artifact?.type}
              onChange={(type: string, _) => {
                props.onUpdate({
                  ...props.artifact,
                  type,
                });
              }}
            >
              {props.artifactTypes?.map?.((artifactType, index) => (
                <FormSelectOption key={index} {...artifactType} />
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
              value={props.artifact?.title ?? ''}
              onChange={e => props.onUpdate({ ...props.artifact, title: e })}
            />
          </FormGroup>
          <FormGroup label="Artifact Link" isRequired fieldId="artifact-link">
            <TextInput
              isRequired
              data-testid="artifact-link-input"
              name="artifact_link"
              aria-label="Artifact Link"
              data-cy="artifact-link-input"
              value={props.artifact?.linkAddress ?? ''}
              onChange={e =>
                props.onUpdate({ ...props.artifact, linkAddress: e })
              }
            />
          </FormGroup>
          <FormGroup
            label="Artifact Description"
            isRequired
            fieldId="artifact-description"
            helperText={`${props.artifact?.description?.length ?? 0}/250`}
          >
            <TextInput
              isRequired
              maxLength={250}
              data-testid="artifact-description-input"
              name="artifact_description"
              data-cy="artifact-description-input"
              aria-label="Artifact Description"
              value={props.artifact?.description ?? ''}
              onChange={e =>
                props.onUpdate({ ...props.artifact, description: e })
              }
            />
          </FormGroup>
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
