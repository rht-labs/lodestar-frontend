import React from 'react';
import {
  render,
  act,
  fireEvent,
  waitForDomChange,
} from '@testing-library/react';
import { ArtifactEditModal } from '../add_artifact_modal';
import { Artifact } from '../../../schemas/engagement';

describe('Engagement Edit Modal', () => {
  test('when clicking save, a single artifact is passed as a parameter to onSave', async () => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    const modal = render(
      <ArtifactEditModal
        artifact={Artifact.fromFake(true)}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
        onUpdate={() => {}}
      />
    );
    act(async () => {
      fireEvent.change(modal.getByTestId('artifact-title-input'), {
        target: { value: 'Vanderbilt week 1' },
      });
      await waitForDomChange({ container: modal.container });
      fireEvent.click(modal.getByTestId('save-artifact'));
      expect(onSave).toHaveBeenCalledWith({
        ...Artifact.fromFake(true),
        title: 'Vanderbilt week 1',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });
});
