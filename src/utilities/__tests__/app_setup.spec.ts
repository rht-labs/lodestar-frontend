import { setUpValidation } from '../app_setup';
import { Validation } from '../../schemas/validators';

describe('App Setup', () => {
  test('set up validation', () => {
    expect(setUpValidation).not.toThrowError();
    expect(Object.keys(Validation.availableValidatorTypes).sort()).toEqual([
      'date',
      'email',
      'notnull',
      'regex',
    ]);
  });
});
