import { Validator } from '../validator';

interface DateValidatorOptions {
  min: string;
  max: string;
}

export enum DateValidationKeywords {
  today,
  tomorrow,
  yesterday,
  past,
  future,
}

export const DateValidator = (
  value: DateValidatorOptions,
  message: string
): Validator => (input: string) => {
  return message;
};
