import * as Validators from './validators';
import faker from 'faker';

describe('Email validators', () => {
  let validate: Validators.Validator;
  beforeEach(() => {
    validate = (input: string) =>
      Validators.validate(input, [Validators.EmailAddressValidator]);
  });
  test('email with no domain is not valid', () => {
    expect(validate('ss@')).toBeFalsy();
  });
  test('properly formatted email with no subdomain', () => {
    expect(validate('spencer@s.co')).toBeTruthy();
  });
  test('properly formatted email with subdomains', () => {
    expect(validate('s@s.s.s.co')).toBeTruthy();
  });
  test('properly formatted email with allowed special character', () => {
    expect(validate('s+s@s.co')).toBeTruthy();
  });
  test('email without username', () => {
    expect(validate('@s.co')).toBeFalsy();
  });
});

describe('Date validators', () => {
  const getValidatorMethod = (...validators: Validators.Validator[]) => {
    return (input: string) => Validators.validate(input, validators);
  };
  test('future validator accepts random future date', () => {
    const validate = getValidatorMethod(Validators.DateValidator.isFuture);
    const date = faker.date.future();

    expect(validate(date.toString())).toBeTruthy();
  });
  test('future validator rejects random past date', () => {
    const validate = getValidatorMethod(Validators.DateValidator.isFuture);
    const date = faker.date.past();

    expect(validate(date.toString())).toBeFalsy();
  });

  test('past validator accepts past date', () => {
    const validate = getValidatorMethod(Validators.DateValidator.isPast);
    const date = faker.date.past();
    expect(validate(date.toString())).toBeTruthy();
  });

  test('past validator rejects future date', () => {
    const validate = getValidatorMethod(Validators.DateValidator.isPast);
    const date = faker.date.future();
    expect(validate(date.toString())).toBeFalsy();
  });
});

describe('Null validator', () => {
  let validate: Validators.Validator;
  beforeEach(() => {
    validate = (input: string) =>
      Validators.validate(input, [Validators.NotNullValidator]);
  });
  test('a string of spaces is not valid', () => {
    expect(validate(' ')).toBeFalsy();
  });
  test('a string with a newline is not valid', () => {
    expect(validate('\n')).toBeFalsy();
  });
  test('a string with a letter surrounded by spaces is valid', () => {
    expect(validate(' s ')).toBeTruthy();
  });
});

describe('Form Validators', () => {
  test('length validation', () => {
    let validate = (input: string) =>
      Validators.validate(input, [
        Validators.LengthValidator({ minLength: 2, maxLength: 4 }),
      ]);
    expect(validate('a')).toBeFalsy();
    expect(validate('ab')).toBeTruthy();
    expect(validate(' a')).toBeFalsy();
    validate = (input: string) =>
      Validators.validate(input, [
        Validators.LengthValidator({ minLength: 0, maxLength: 1 }),
      ]);
    expect(validate('')).toBeTruthy();
    expect(validate('a')).toBeTruthy();
    expect(validate('ab')).toBeFalsy();
    validate = (input: string) =>
      Validators.validate(input, [
        Validators.LengthValidator({ maxLength: 1 }),
      ]);
    expect(validate('')).toBeTruthy();
    expect(validate('a')).toBeTruthy();
    expect(validate('ab')).toBeFalsy();
    validate = (input: string) =>
      Validators.validate(input, [
        Validators.LengthValidator({ minLength: 1 }),
      ]);
    expect(validate('')).toBeFalsy();
    expect(validate('a')).toBeTruthy();
    expect(validate('abasdfasasfasdfasdf')).toBeTruthy();
  });
});
