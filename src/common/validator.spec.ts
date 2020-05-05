import { Validators } from './validators';

describe('Form Validators', () => {
  test('email validation', () => {
    const isValidEmail = (input: string) =>
      Validators.validate(input, [Validators.EmailAddressValidator]);
    expect(isValidEmail('ss@')).toBeFalsy();
    expect(isValidEmail('spencer@s.co')).toBeTruthy();
    expect(isValidEmail('s@s.s.s.co')).toBeTruthy();
    expect(isValidEmail('s+s@s.co')).toBeTruthy();
    expect(isValidEmail('@s.co')).toBeFalsy();
  });
  test('null validator', () => {
    const isNullValid = (input: string) =>
      Validators.validate(input, [Validators.NotNullValidator]);
    expect(isNullValid(' ')).toBeFalsy();
    expect(isNullValid('  ')).toBeFalsy();
    expect(isNullValid('\n')).toBeFalsy();
    expect(isNullValid(' s ')).toBeTruthy();
  });
  
});
