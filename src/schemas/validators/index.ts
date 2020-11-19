import { Validator } from './validator';

type ValidatorFactoryMethod = (validationOptions: any) => Validator;

export abstract class Validation {
  private static _validators: { [key: string]: ValidatorFactoryMethod } = {};
  public static registerValidator(
    key: string,
    validatorFactory: ValidatorFactoryMethod
  ) {
    if (key in Validation._validators) {
      throw Error('A validator with this key has already been registered.');
    }
    Validation._validators = {
      ...Validation._validators,
      [key]: validatorFactory,
    };
  }
  public static get availableValidatorTypes() {
    return Validation._validators ?? {};
  }
}

export const validate = (value: string, validators: Array<Validator>) =>
  validators.reduce(
    (isValid, validator) => (isValid ? validator(value) : isValid),
    true
  );

export function ValidatorFactory(validationOptions): Validator {
  if (
    validationOptions?.kind &&
    validationOptions.kind in Validation.availableValidatorTypes
  ) {
    return Validation.availableValidatorTypes[validationOptions.kind](
      validationOptions
    );
  }
  return null;
}
