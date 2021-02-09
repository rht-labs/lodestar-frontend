import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { PointOfContactEditModal } from '../point_of_contact_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';
import {
  IValidationContext,
  ValidationContext,
} from '../../../context/validation_context/validation_context';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';

describe('Point of Contact edit modal', () => {
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
  test('Displays validation errors', async () => {
    const { findAllByText } = render(
      <TestStateWrapper>
        <ValidationContext.Provider
          value={
            ({
              clearValidationResults: () => {},
              validationResults: {},
              getValidationResult: () => ['Incorrect input'],
            } as unknown) as IValidationContext
          }
        >
          <PointOfContactEditModal
            onSave={() => {}}
            engagement={Engagement.fromFake(true)}
            onClose={() => {}}
            isOpen={true}
          />
        </ValidationContext.Provider>
      </TestStateWrapper>
    );
    expect(await findAllByText('Incorrect input')).toHaveLength(3);
  });
  test('Modifying the email addresses calls validate', async () => {
    const validationSpy = jest.fn();
    const { findByTestId } = render(
      <TestStateWrapper>
        <ValidationContext.Provider
          value={{
            clearValidationResults: () => {},
            validationResults: {},
            getValidationResult: () => ['Incorrect input'],
            validate: () => validationSpy,
          }}
        >
          <PointOfContactEditModal
            onSave={() => {}}
            engagement={Engagement.fromFake(true)}
            isOpen={true}
            onClose={() => {}}
          />
        </ValidationContext.Provider>
      </TestStateWrapper>
    );
    await fireEvent.change(await findByTestId('el-email'), {
      target: { value: 'bot' },
    });
    await fireEvent.change(await findByTestId('tech-email'), {
      target: { value: 'bot' },
    });
    await fireEvent.change(await findByTestId('customer-email'), {
      target: { value: 'bot' },
    });
    expect(validationSpy).toHaveBeenCalledTimes(3);
  });
});
