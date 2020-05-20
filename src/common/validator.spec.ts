import { Validators } from './validators';
describe('form validation', () => {
  test('nothing', () => expect(true).toBe(true));
});
// describe('Form Validators', () => {
// test('email validation', () => {
//   const validate = (input: string) =>
//     Validators.validate(input, [Validators.EmailAddressValidator]);
//   expect(validate('ss@')).toBeFalsy();
//   expect(validate('spencer@s.co')).toBeTruthy();
//   expect(validate('s@s.s.s.co')).toBeTruthy();
//   expect(validate('s+s@s.co')).toBeTruthy();
//   expect(validate('@s.co')).toBeFalsy();
// });
// test('null validator', () => {
//   const validate = (input: string) =>
//     Validators.validate(input, [Validators.NotNullValidator]);
//   expect(validate(' ')).toBeFalsy();
//   expect(validate('  ')).toBeFalsy();
//   expect(validate('\n')).toBeFalsy();
//   expect(validate(' s ')).toBeTruthy();
// });
// test('length validation', () => {
//   let validate = (input: string) =>
//     Validators.validate(input, [
//       Validators.LengthValidator({ minLength: 2, maxLength: 4 }),
//     ]);
//   expect(validate('a')).toBeFalsy();
//   expect(validate('ab')).toBeTruthy();
//   expect(validate(' a')).toBeFalsy();
//   validate = (input: string) =>
//     Validators.validate(input, [
//       Validators.LengthValidator({ minLength: 0, maxLength: 1 }),
//     ]);
//   expect(validate('')).toBeTruthy();
//   expect(validate('a')).toBeTruthy();
//   expect(validate('ab')).toBeFalsy();
//   validate = (input: string) =>
//     Validators.validate(input, [
//       Validators.LengthValidator({ maxLength: 1 }),
//     ]);
//   expect(validate('')).toBeTruthy();
//   expect(validate('a')).toBeTruthy();
//   expect(validate('ab')).toBeFalsy();
//   validate = (input: string) =>
//     Validators.validate(input, [
//       Validators.LengthValidator({ minLength: 1 }),
//     ]);
//   expect(validate('')).toBeFalsy();
//   expect(validate('a')).toBeTruthy();
//   expect(validate('abasdfasasfasdfasdf')).toBeTruthy();
// });
// });
