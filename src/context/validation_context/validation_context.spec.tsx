import React from 'react';
import { useValidation } from './validation_hook';
import { renderHook, act } from '@testing-library/react-hooks';
import { ValidationProvider, FormValidator } from './validation_context';
import '@testing-library/jest-dom/extend-expect';
import {
  NotNullValidator,
  LengthValidator,
} from '../../schemas/validators/standard_validators';

describe('Validation Context Hook', () => {
  const wrapper = validators => ({ children }) => (
    <ValidationProvider validators={validators}>{children}</ValidationProvider>
  );
  const getHook = (validators?: FormValidator) => {
    return renderHook(() => useValidation(), { wrapper: wrapper(validators) });
  };

  test('can receive validators as a prop', () => {
    expect(() => (
      <ValidationProvider validators={{ validateTest: [] }} />
    )).not.toThrowError();
  });

  test('by default, form validation errors is an empty object', () => {
    const { result } = getHook();
    expect(result.current.validationResults).toEqual({});
  });

  test('getting a validation result for a field that has not been validated returns an empty array', () => {
    const { result } = getHook();
    expect(result.current.getValidationResult('hello')).toEqual([]);
  });

  test('the validate function from context should return an empty array by default', () => {
    const { result } = getHook();
    expect(result.current.validate('hello')('blah')).toEqual([]);
  });

  test('the validate function returns an empty array if all validators pass', () => {
    const { result } = getHook({
      hello: [
        NotNullValidator(),
        LengthValidator({ maxLength: 4, minLength: 1 }),
      ],
    });
    act(() => {
      expect(result.current.validate('hello')('hi')).toEqual([]);
    });
  });

  test('the validate function returns an array of strings if any validator fails', () => {
    const { result } = getHook({
      hello: [NotNullValidator(), LengthValidator({ minLength: 5 })],
    });
    act(() => {
      expect(result.current.validate('hello')('hi').length).toBeGreaterThan(0);
    });
  });

  test('when a validation fails, the validationResults should update', async () => {
    const { result, waitForNextUpdate } = getHook({
      hello: [NotNullValidator()],
    });

    await act(async () => {
      result.current.validate('hello')('hi');
      await waitForNextUpdate;
    });

    expect(result.current.getValidationResult('hello')).toEqual([]);
  });
});
