import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { PointOfContactEditModal } from '../point_of_contact_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import MockDate from 'mockdate';
import { ValidationContext } from '../../../context/validation_context/validation_context';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('Point of Contact edit modal', () => {
  test('matches snapshot', () => {
    MockDate.set(new Date(2020, 8, 3));
    expect(
      render(
        <PointOfContactEditModal
          onSave={() => {}}
          formOptions={EngagementFormConfig.fromFake()}
          isOpen={true}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
    MockDate.reset();
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
    const textField = await getByTestId('el-email');
    await fireEvent.change(textField, {
      target: { value: 'bot' },
    });
    expect(onChange).toHaveBeenCalled();
  });
  test('Displays validation errors', async () => {
    const { findAllByText } = render(
      <TestStateWrapper>
        <ValidationContext.Provider
          value={{
            clearValidationResults: () => {},
            validationResults: {},
            getValidationResult: () => ['Incorrect input'],
          }}
        >
          <PointOfContactEditModal
            onSave={() => {}}
            engagement={Engagement.fromFake(true)}
            formOptions={{}}
            isOpen={true}
            onChange={() => {}}
          />
        </ValidationContext.Provider>
      </TestStateWrapper>
    );
    expect(await findAllByText('Incorrect input')).toHaveLength(3);
  });
  test('Modifying the email addresses calls validate', async () => {
    const validationSpy = jest.fn();
    const { getByTestId } = render(
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
            formOptions={{}}
            isOpen={true}
            onChange={() => {}}
          />
        </ValidationContext.Provider>
      </TestStateWrapper>
    );
    await fireEvent.change(getByTestId('el-email'), {
      target: { value: 'bot' },
    });
    await fireEvent.change(getByTestId('tech-email'), {
      target: { value: 'bot' },
    });
    await fireEvent.change(getByTestId('customer-email'), {
      target: { value: 'bot' },
    });
    expect(validationSpy).toHaveBeenCalledTimes(3);
  });
});
