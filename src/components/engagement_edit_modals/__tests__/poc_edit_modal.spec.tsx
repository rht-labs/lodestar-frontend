import React from 'react';
import {render, fireEvent, RenderResult} from '@testing-library/react';
import { PointOfContactEditModal } from '../point_of_contact_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';
import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';

describe('Point of Contact edit modal', () => {
  let view: RenderResult;

  test('matches snapshot', async () => {
    MockDate.set(new Date(2020, 8, 3));
    const rendered = render(
      <PointOfContactEditModal
        onClose={() => {}}
        onSave={() => {}}
        isOpen={true}
        engagement={Engagement.fromFake(true)}
      />
    );
    expect(rendered).toMatchSnapshot();
    MockDate.reset();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { findByTestId } = render(
      <PointOfContactEditModal
        onSave={onSave}
        engagement={Engagement.fromFake(true)}
        isOpen={true}
        onClose={() => {}}
      />
    );
    await fireEvent.click(await findByTestId('poc-edit-save'));
    expect(onSave).toHaveBeenCalled();
  });
  test('When editing a field, the onChange method is called', async () => {
    const onChange = jest.fn();
    const { findByTestId } = render(
      <EngagementContext.Provider
        value={
          ({
            updateEngagementFormField: onChange,
          } as unknown) as IEngagementContext
        }
      >
        <PointOfContactEditModal
          onClose={() => {}}
          onSave={() => {}}
          engagement={Engagement.fromFake(true)}
          isOpen={true}
        />
      </EngagementContext.Provider>
    );
    const textField = await findByTestId('el-email');
    await fireEvent.change(textField, {
      target: { value: 'bot' },
    });
    expect(onChange).toHaveBeenCalled();
  });

  test('Adding invalid email addresses shows error message', async () => {
    const onChange= jest.fn();
    const view = render(
      <EngagementContext.Provider
        value={
          ({
            updateEngagementFormField: onChange,
          } as unknown) as IEngagementContext
        }
      >
          <PointOfContactEditModal
            onSave={() => {}}
            engagement={Engagement.fromFake(true)}
            isOpen={true}
            onClose={() => {}}
          />
      </EngagementContext.Provider>
    );

    const { findByTestId } = view;
    await fireEvent.change(await findByTestId('el-email'), {
      target: { value: 'invalidEmail' },
    });
    await fireEvent.change(await findByTestId('tech-email'), {
      target: { value: 'invalidEmail' },
    });
    await fireEvent.change(await findByTestId('customer-email'), {
      target: { value: 'invalidEmail' },
    });
    expect(await view.findAllByText('Enter valid email address')).toHaveLength(3);
  });
});
