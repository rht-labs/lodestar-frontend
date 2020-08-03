import { validate as _validate } from '.';
import {
  EmailAddressValidator,
  LengthValidator,
  NotNullValidator,
  DateValidator,
} from './standard_validators';
import { startOfToday, startOfTomorrow, startOfYesterday } from 'date-fns';

describe('email validator', () => {
  let validate;
  beforeEach(() => {
    validate = (input: string) => _validate(input, [EmailAddressValidator()]);
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
    validate = (input: string) => _validate(input, [NotNullValidator()]);
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
      _validate(input, [LengthValidator({ minLength: 2, maxLength: 4 })]);
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

describe('Date validators', () => {
  let validate;
  beforeEach(() => {
    validate = (input: string, dateParams: { min: string; max: string }) =>
      _validate(input, [
        DateValidator(
          dateParams,
          'This date does not meet the validation standard'
        ),
      ]);
  });
  test('@today keyword matches the start of today', () => {
    expect(validate(startOfToday(), { min: '@today' })).toBe(null);
    expect(validate(startOfTomorrow(), { min: '@today' })).toBe(null);
    expect(validate(startOfYesterday(), { min: '@today' })).not.toBe(null);
    expect(validate(startOfToday(), { max: '@today' })).toBe(null);
    expect(validate(startOfTomorrow(), { max: '@today' })).not.toBe(null);
    expect(validate(startOfYesterday(), { max: '@today' })).toBe(null);
  });
  test('@yesterday keyword matches the start of yesterday', () => {
    expect(validate(startOfToday(), { min: '@yesterday' })).toBe(null);
    expect(validate(startOfTomorrow(), { min: '@yesterday' })).toBe(null);
    expect(validate(startOfYesterday(), { min: '@yesterday' })).toBe(null);
    expect(validate(startOfToday(), { max: '@yesterday' })).not.toBe(null);
    expect(validate(startOfTomorrow(), { max: '@yesterday' })).not.toBe(null);
    expect(validate(startOfYesterday(), { max: '@yesterday' })).toBe(null);
  });
  test('@tomorrow keyword matches the start of tomorrow', () => {
    expect(validate(startOfToday(), { min: '@tomorrow' })).not.toBe(null);
    expect(validate(startOfTomorrow(), { min: '@tomorrow' })).toBe(null);
    expect(validate(startOfYesterday(), { min: '@tomorrow' })).not.toBe(null);
    expect(validate(startOfToday(), { max: '@tomorrow' })).toBe(null);
    expect(validate(startOfTomorrow(), { max: '@tomorrow' })).toBe(null);
    expect(validate(startOfYesterday(), { max: '@tomorrow' })).toBe(null);
  });
});
