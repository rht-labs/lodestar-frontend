import { Validator } from './validator';
import {
  RegexValidator,
  EmailAddressValidator,
  NotNullValidator,
  DateValidator,
} from './standard_validators';
type ValidatorFactory = (props: any) => Validator;

export abstract class Validation {
  private static _validators: { [key: string]: ValidatorFactory } = {};
  public static registerValidator(
    key: string,
    validatorFactory: ValidatorFactory
  ) {
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

export function ValidatorFactory(props): Validator {
  if (props?.kind && props.kind in Validation.availableValidatorTypes) {
    return Validation.availableValidatorTypes[props.kind](props);
  }
  return null;
}

Validation.registerValidator('regex', props =>
  RegexValidator(RegExp(props.value), props.message)
);

Validation.registerValidator('email', props =>
  EmailAddressValidator(props.message)
);

Validation.registerValidator('notnull', props =>
  NotNullValidator(props.message as string)
);

Validation.registerValidator('date', props =>
  DateValidator(props.value, props.message)
);
