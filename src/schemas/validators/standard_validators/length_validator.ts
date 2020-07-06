import { Validator } from '../validator';

export const LengthValidator: ({
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
