import { Validator } from './validator';
import {
  RegexValidator,
  EmailAddressValidator,
  NotNullValidator,
  DateValidator,
} from './standard_validators';

type ValidatorFactory = (validationOptions: any) => Validator;

export abstract class Validation {
  private static _validators: { [key: string]: ValidatorFactory } = {};
  public static registerValidator(
    key: string,
    validatorFactory: ValidatorFactory
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
    return Validation.availableValidatorTypes ?? {};
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

Validation.registerValidator('regex', validationOptions =>
  RegexValidator(RegExp(validationOptions.value), validationOptions.message)
);

Validation.registerValidator('email', validationOptions =>
  EmailAddressValidator(validationOptions.message)
);

Validation.registerValidator('notnull', validationOptions =>
  NotNullValidator(validationOptions.message as string)
);

Validation.registerValidator('date', validationOptions =>
  DateValidator(validationOptions.value, validationOptions.message)
);
