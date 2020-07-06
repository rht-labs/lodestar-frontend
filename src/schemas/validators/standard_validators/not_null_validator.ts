import { Validator } from '../validator';

export const NotNullValidator = (message?: string): Validator => (
  input: string
) => (!!input.trim() ? null : message ?? 'The value provided must not be null');
