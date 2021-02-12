import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { ArtifactEditModal } from '../add_artifact_modal';
import { Artifact } from '../../../schemas/engagement';

describe('Engagement Edit Modal', () => {
  test('artifact callbacks are called correctly when an artifact is updated', () => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    const onUpdate = jest.fn();
    const artifact = Artifact.fromFake(true);
    const newTitle = 'Vanderbilt week 1';
    const modal = render(
      <ArtifactEditModal
        artifactTypes={[
          { label: 'Demo', value: 'demo' },
          { label: 'Weekly Report', value: 'weeklyReport' },
        ]}
        artifact={artifact}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    );
    fireEvent.change(modal.getByTestId('artifact-title-input'), {
      target: { value: newTitle },
    });
    expect(onUpdate).toHaveBeenCalledWith({ ...artifact, title: newTitle });
    fireEvent.click(modal.getByTestId('save-artifact'));
    expect(onSave).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
