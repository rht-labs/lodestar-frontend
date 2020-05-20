import { Validators } from './validators';

describe('email validator', () => {
  let validate;
  beforeEach(() => {
    validate = (input: string) =>
      Validators.validate(input, [Validators.EmailAddressValidator]);
  });
  test('an email without a domain is not valid', () => {
    expect(validate('ss@')).not.toBe(null);
  });
  test('valid email with no subdomain', () => {
    expect(validate('spencer@s.co')).toBe(null);
  });
  test('valid email with subdomain', () => {
    expect(validate('s@s.s.s.co')).toBe(null);
  });
  test('valid email with plus sign', () => {
    expect(validate('s+s@s.co')).toBe(null);
  });
  test('email without address', () => {
    expect(validate('@s.co')).not.toBe(null);
  });
});

describe('null validator', () => {
  let validate;
  beforeEach(() => {
    validate = (input: string) =>
      Validators.validate(input, [Validators.NotNullValidator]);
  });
  test('a string of whitespace is not valid', () => {
    expect(validate(' ')).not.toBe(null);
  });
  test('a string with only a newline is not valid', () => {
    expect(validate('\n')).not.toBe(null);
  });
  test(' a string with leading and trailing spaces is valid', () => {
    expect(validate(' s ')).toBe(null);
  });
});

describe('length validators', () => {
  let validate;
  beforeEach(() => {
    validate = (input: string) =>
      Validators.validate(input, [
        Validators.LengthValidator({ minLength: 2, maxLength: 4 }),
      ]);
  });
  test('string too short', () => {
    expect(validate('a')).not.toBe(null);
  });
  test('string same length as min length', () => {
    expect(validate('ab')).toBe(null);
  });
  test('string with leading white space that is too short', () => {
    expect(validate(' a')).not.toBe(null);
  });
  test('string with same as max length', () => {
    expect(validate('asdf')).toBe(null);
  });
  test('string over max length', () => {
    expect(validate('asdfg')).not.toBe(null);
  });
  test('string with whitespace that, when trimmed, equals the max length', () => {
    expect(validate(' asdf')).toBe(null);
  });
});
