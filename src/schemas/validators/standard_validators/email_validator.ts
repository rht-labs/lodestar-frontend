import { Validator } from '../validator';

export const EmailAddressValidator = (message?: string): Validator => (
  input: string
) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
    ? null
    : message ?? 'Enter a valid email address';
