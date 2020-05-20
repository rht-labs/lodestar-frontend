import React, { useState } from 'react';
import { Validator } from '../../common/validators';

/**
 * The validation context provides an anchor that a validation consumer can use to validate a given value.
 *
 * The validation context receives a list of FieldValidators as a property, and provides
 * a curried method for validating against that list of validators.
 *
 * Additionally, it provides an object of ValidationErrors to consumers, so the consumer can decide
 * how to show validation errors.
 */

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

  const getValidationResults = (fieldName: string) => {
    if (validationResults && validationResults[fieldName]) {
      return validationResults[fieldName];
    }
    return [];
  };

  return (
    <Provider
      value={{
        validationResults,
        getValidationResult: getValidationResults,
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
