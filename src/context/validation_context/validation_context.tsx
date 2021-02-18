import React, { useCallback, useRef } from 'react';
import { Validator } from '../../schemas/validators/validator';

export interface IValidationContext {
  validate: (fieldName: string) => (value: any) => string[];
  getValidationResult: (fieldName: string) => string[];
  clearValidationResults: () => void;
}

export type FormValidator = { [key: string]: Validator[] };

export const ValidationContext = React.createContext<IValidationContext>({
  validate: (fieldName: string) => (value: any) => [],
  getValidationResult: (fieldName: string) => [],
  clearValidationResults: () => {},
});

const { Provider } = ValidationContext;

export const ValidationProvider = ({
  children,
  validators = {},
}: {
  children?: any;
  validators: FormValidator;
}) => {
  const validationResults = useRef<{}>();

  const getValidationResult = (fieldName: string) => {
    if (validationResults?.current?.[fieldName]) {
      return validationResults?.current?.[fieldName];
    }
    return [];
  };

  const clearValidationResults = useCallback(() => {
    validationResults.current = {};
  }, []);

  const validate = (fieldName: string) => (value: any) => {
    if (validators && validators[fieldName]) {
      const result = validators[fieldName]
        .reduce(
          (accumulatedErrors, currentValidator) => [
            ...accumulatedErrors,
            currentValidator?.(value),
          ],
          []
        )
        .filter(message => !!message);
      validationResults.current = {
        ...validationResults.current,
        [fieldName]: result,
      };
      return result;
    } else {
      return [];
    }
  };

  return (
    <Provider
      value={{
        getValidationResult,
        clearValidationResults,
        validate,
      }}
    >
      {children}
    </Provider>
  );
};
