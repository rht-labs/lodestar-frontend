export type Validator = (input: string) => boolean;

export class Validators {
  static NotNullValidator: Validator = (input: string) => !!input.trim();

  static EmailAddressValidator: Validator = (input: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  static DateValidator: { [key: string]: Validator } = {
    future: (input: string) => false,
    past: (input: string) => false,
  };

  static LengthValidator: ({
    maxLength,
    minLength,
  }: {
    maxLength?: number;
    minLength?: number;
  }) => Validator = ({ maxLength, minLength }) => (input: string) =>
    ((maxLength === undefined || input.trim().length <= maxLength) &&
    (minLength === undefined || input.trim().length >= minLength));

  static validate = (value: string, validators: Array<Validator>) =>
    validators.reduce(
      (isValid, validator) => (isValid ? validator(value) : isValid),
      true
    );
}
