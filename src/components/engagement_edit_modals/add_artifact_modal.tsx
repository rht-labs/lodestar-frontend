import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Form,
  FormSelect,
  FormGroup,
  FormSelectOption,
} from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { Artifact, ArtifactType } from '../../schemas/engagement';
import {
  useAnalytics,
  AnalyticsCategory,
} from '../../context/analytics_context/analytics_context';
import { TextFormField } from '../form_fields/text_form_field';

export interface ArtifactEditModalProps {
  onClose: () => void;
  isOpen: boolean;
  artifact: Artifact;
  onSave: (artifact: Artifact) => void;
}

export function ArtifactEditModal(props: ArtifactEditModalProps) {
  const [artifactEdits, setArtifactEdits] = useState<Partial<Artifact>>({});
  const { logEvent } = useAnalytics();

  useEffect(
    () =>
      setArtifactEdits({
        type: ArtifactType.demo,
        ...props.artifact,
      }),
    [props.artifact]
  );

  const onSave = () => {
    const newArtifacts = { ...(props.artifact ?? {}), ...artifactEdits };
    props.onSave(newArtifacts as Artifact);
    logEvent({
      action: 'Add Artifact',
      category: AnalyticsCategory.engagements,
    });
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
              onChange={(value: string, _) => {
                setArtifactEdits({
                  ...artifactEdits,
                  type: ArtifactType[value],
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
          <TextFormField
            value={artifactEdits?.title}
            label="Artifact Title"
            isRequired={true}
            onChange={e => setArtifactEdits({ ...artifactEdits, title: e })}
            fieldId="artifact_title"
            testId="artifact-title-input"
          />
          <TextFormField
            label="Artifact Link"
            value={artifactEdits?.linkAddress ?? ''}
            testId="artifact-link-input"
            fieldId="artifact_link"
            isRequired={true}
            onChange={e =>
              setArtifactEdits({ ...artifactEdits, linkAddress: e })
            }
          />
          <TextFormField
            value={artifactEdits?.description}
            onChange={description =>
              setArtifactEdits({ ...artifactEdits, description })
            }
            isRequired={true}
            fieldId="artifact-description"
            helperText={`${artifactEdits?.description?.length ?? 0}/250`}
          />
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
