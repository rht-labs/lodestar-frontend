import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { ArtifactEditModal } from '../add_artifact_modal';
import { Artifact, Engagement } from '../../../schemas/engagement';
import { EngagementContext } from '../../../context/engagement_context/engagement_context';

describe('Engagement Edit Modal', () => {
  const mockTypes = [
    { label: 'Demo', value: 'demo' },
    { label: 'Weekly Report', value: 'weeklyReport' },
  ];
  test('artifact callbacks are called correctly when an artifact is updated', () => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    const onUpdate = jest.fn();
    const artifact = Artifact.fromFake(true);
    const newTitle = 'Vanderbilt week 1';
    const modal = render(
      <ArtifactEditModal
        artifactTypes={mockTypes}
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
  test('artifact modal button should only be enabled if all required fields are filled out', async () => {
    const onSave = jest.fn();
    let artifact: Partial<Artifact> = { id: '1', type: 'demo' };
    const Component = () => (
      <ArtifactEditModal
        artifactTypes={mockTypes}
        artifact={artifact}
        onSave={onSave}
        onClose={() => {}}
        onUpdate={update => (artifact = update)}
        isOpen={true}
      />
    );
    let view = render(<Component />);
    const typeDropdown = await view.findByTestId('artifact-type-select');
    const artifactTitle = await view.findByTestId('artifact-title-input');
    const artifactLinkInput = await view.findByTestId('artifact-link-input');
    const artifactDescriptionInput = await view.findByTestId(
      'artifact-description-input'
    );
    const getSaveButton = () => view.findByTestId('save-artifact');
    const assertIsDisabled = async () => {
      const saveButton = await getSaveButton();
      expect(saveButton).toHaveAttribute('disabled');
    };
    const rerender = () => view.rerender(<Component />);

    await assertIsDisabled();
    await fireEvent.change(typeDropdown, { target: { value: 'demo' } });

    rerender();
    await assertIsDisabled();
    await fireEvent.change(artifactTitle, { target: { value: 'description' } });
    rerender();
    await assertIsDisabled();
    await fireEvent.change(artifactLinkInput, { target: { value: 'link' } });
    rerender();
    await assertIsDisabled();
    await fireEvent.change(artifactDescriptionInput, {
      target: { value: 'description' },
    });

    rerender();
    expect(await getSaveButton()).not.toHaveAttribute('disabled');
    await fireEvent.click(await getSaveButton());
    expect(onSave).toHaveBeenCalled();
  });
});
