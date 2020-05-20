import React, { useState } from 'react';
import { Validator } from '../../common/validators';

export interface ValidationContext {
  validate: (fieldName: string) => (value: any) => string[];
  getValidationResult: (fieldName: string) => string[];
  validationResults: { [key: string]: any };
}

export type FormValidator = { [key: string]: Validator[] };

export const ValidationContext = React.createContext<ValidationContext>({
  validate: (fieldName: string) => (value: any) => [],
  getValidationResult: (fieldName: string) => [],
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
  const setFieldResult = (field: string, result: Array<string>) => {
    setValidationResults({
      ...validationResults,
      [field]: result,
    });
  };

  const getValidationResult = (fieldName: string) => {
    if (validationResults && validationResults[fieldName]) {
      return validationResults[fieldName];
    }
    return [];
  };

  return (
    <Provider
      value={{
        validationResults,
        getValidationResult,
        validate: (fieldName: string) => (value: any) => {
          if (validators && validators[fieldName]) {
            const result = validators[fieldName]
              .reduce(
                (accumulatedErrors, currentValidator) => [
                  ...accumulatedErrors,
                  currentValidator(value),
                ],
                []
              )
              .filter(message => !!message);
            setFieldResult(fieldName, result);
            return result;
          } else {
            return [];
          }
        },
      }}
    >
      {children}
    </Provider>
  );
};
