export type Validator = (input: string) => boolean;

export type ValidatorFactory = (options: any) => Validator;

type ValidatorOrValidatorFactory = Validator | ValidatorFactory;

export const NotNullValidator: Validator = (input: string) => !!input.trim();

export const EmailAddressValidator: Validator = (input: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

export const DateValidator = {
  isFuture: (input: string) => {
    try {
      const date = new Date(Date.parse(input));
      if (date > new Date()) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  },
  isPast: (input: string) => {
    try {
      const date = new Date(Date.parse(input));
      if (date < new Date()) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  },

  isInRange: ({ before, after }: { before: Date; after: Date }) => (
    input: string
  ) => {
    try {
      const date = new Date(Date.parse(input));
      if (date <= before && date >= after) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  },
};

export const LengthValidator: ValidatorFactory = ({
  maxLength,
  minLength,
}: {
  maxLength: number;
  minLength: number;
}) => (input: string) =>
  (maxLength === undefined || input.trim().length <= maxLength) &&
  (minLength === undefined || input.trim().length >= minLength);

export const validate = (value: string, validators: Array<Validator>) =>
  validators.reduce(
    (isValid, validator) => (isValid ? validator(value) : isValid),
    true
  );
