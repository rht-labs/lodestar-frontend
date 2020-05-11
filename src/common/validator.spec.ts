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

  test('date within range is accepted', () => {
    const validate = getValidatorMethod(
      Validators.DateValidator.isInRange({
        before: faker.date.future(),
        after: faker.date.past(),
      })
    );
    expect(validate(new Date().toString())).toBeTruthy();
  });

  test('date out of range is rejected', () => {
    const validate = getValidatorMethod(
      Validators.DateValidator.isInRange({
        before: new Date(),
        after: faker.date.past(),
      })
    );
    expect(validate(faker.date.future().toString()));
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

describe('length validator', () => {
  const getValidator = (min: number, max: number) =>
    Validators.LengthValidator({ minLength: min, maxLength: max });
  test('text below the minimum length should be rejected', () => {
    const validate = getValidator(2, 4);
    expect(validate('a')).toBeFalsy();
  });
  test('text above min length should be accepted', () => {
    const validate = getValidator(2, 4);
    expect(validate('abc')).toBeTruthy();
  });
  test('text with same length as min should be accepted', () => {
    const validate = getValidator(2, 4);
    expect(validate('ab')).toBeTruthy();
  });
  test('text above the max length should be rejected', () => {
    const validate = getValidator(2, 4);
    expect(validate('abcde')).toBeFalsy();
  });
  test('text below max length should be accepted', () => {
    const validate = getValidator(2, 4);
    expect(validate('abc')).toBeTruthy();
  });
  test('text with same length as max should be accepted', () => {
    const validate = getValidator(2, 4);
    expect(validate('abcd')).toBeTruthy();
  });
  test('text equal to both min and max length should be accepted', () => {
    const validate = getValidator(2, 2);
    expect(validate('ab')).toBeTruthy();
  });
  test('whitespace padding should not count towards length', () => {
    const validate = getValidator(2, 4);
    expect(validate('    ab     ')).toBeTruthy();
  });
});
