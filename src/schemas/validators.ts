export type Validator = (input: any) => string | null;

export abstract class Validators {
  static NotNullValidator = (message?: string): Validator => (input: string) =>
    !!input.trim() ? null : message ?? 'The value provided must not be null';

  static EmailAddressValidator = (message?: string): Validator => (
    input: string
  ) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
      ? null
      : message ?? 'Enter a valid email address';

  static DateValidator: { [key: string]: Validator } = {
    future: (input: string) => 'The date must be in the future',
    past: (input: string) => 'The date must be in the past',
  };

  static RegexValidator = (regex: RegExp, message): Validator => (
    input: string
  ) => {
    return regex.test(input) ? null : message ?? 'Invalid input';
  };

  static LengthValidator: ({
    maxLength,
    minLength,
  }: {
    maxLength?: number;
    minLength?: number;
  }) => Validator = ({ maxLength, minLength }) => {
    return (input: any) => {
      if (maxLength === undefined || input.trim().length > maxLength) {
        return `The input should not be longer than ${maxLength} characters`;
      } else if (minLength === undefined || input.trim().length < minLength) {
        return `The input should be longer than ${minLength} characters`;
      } else {
        return null;
      }
    };
  };

  static validate = (value: string, validators: Array<Validator>) =>
    validators.reduce(
      (isValid, validator) => (isValid ? validator(value) : isValid),
      true
    );
}

export function ValidatorFactory(props): Validator {
  if (props?.kind && props.kind in REGISTERED_VALIDATORS) {
    console.log(props?.value);
    return REGISTERED_VALIDATORS[props.kind](props);
  }
  return null;
}

type ValidatorFactory = (props: any) => Validator;

const REGISTERED_VALIDATORS: { [key: string]: ValidatorFactory } = {
  regex: props =>
    Validators.RegexValidator(RegExp(props.value as string), props.message),
  email: props => Validators.EmailAddressValidator(props.message as string),
  notnull: props => Validators.NotNullValidator(props.message as string),
};
