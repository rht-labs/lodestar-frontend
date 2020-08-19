import React, { useState, useCallback } from 'react';
import { Validator } from '../../schemas/validators/validator';

export interface ValidationContext {
  validate: (fieldName: string) => (value: any) => string[];
  getValidationResult: (fieldName: string) => string[];
  validationResults: { [key: string]: any };
  clearValidationResults: () => void;
}

export type FormValidator = { [key: string]: Validator[] };

export const ValidationContext = React.createContext<ValidationContext>({
  validate: (fieldName: string) => (value: any) => [],
  getValidationResult: (fieldName: string) => [],
  clearValidationResults: () => {},
  validationResults: {},
});

const { Provider } = ValidationContext;

export const ValidationProvider = ({
  children,
  validators = {},
}: {
  children?: any;
  validators: FormValidator;
}) => {
  const [validationResults, setValidationResults] = useState({});

  const getValidationResult = (fieldName: string) => {
    if (validationResults && validationResults[fieldName]) {
      return validationResults[fieldName];
    }
    return [];
  };

  const clearValidationResults = useCallback(() => {
    setValidationResults({});
  }, [setValidationResults]);

  const validate = useCallback(
    (fieldName: string) => (value: any) => {
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
        setValidationResults({
          ...validationResults,
          [fieldName]: result,
        });
        return result;
      } else {
        return [];
      }
    },
    [validators, validationResults]
  );

  return (
    <Provider
      value={{
        validationResults,
        getValidationResult,
        clearValidationResults,
        validate,
      }}
    >
      {children}
    </Provider>
  );
};
