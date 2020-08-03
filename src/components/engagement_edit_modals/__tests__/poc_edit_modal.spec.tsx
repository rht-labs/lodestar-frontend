import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { PointOfContactEditModal } from '../point_of_contact_edit_modal';
import { Engagement } from '../../../schemas/engagement';

describe('Point of Contact edit modal', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <PointOfContactEditModal
          onSave={() => {}}
          formOptions={{}}
          isOpen={true}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <PointOfContactEditModal
        onSave={onSave}
        engagement={Engagement.fromFake(true)}
        formOptions={{}}
        isOpen={true}
        onChange={() => {}}
      />
    );
    await fireEvent.click(getByTestId('poc-edit-save'));
    expect(onSave).toHaveBeenCalled();
  });
  test('When editing a field, the onChange method is called', async () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <PointOfContactEditModal
        onSave={() => {}}
        engagement={Engagement.fromFake(true)}
        formOptions={{}}
        isOpen={true}
        onChange={onChange}
      />
    );
    const textField = await getByTestId('poc-edit-field');
    await fireEvent.change(textField, {
      target: { value: 'bot' },
    });
    expect(onChange).toHaveBeenCalled();
  });
});
