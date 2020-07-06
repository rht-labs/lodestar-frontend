import { Validator } from '../validator';

export const RegexValidator = (regex: RegExp, message): Validator => (
  input: string
) => {
  return regex.test(input) ? null : message ?? 'Invalid input';
};
