import { slugProperties } from './slug_properties';

const baseObject = {
  first_property: 'I am a string',
  'second-property': 'I am also a string',
};

describe('slugProperties: ', () => {
  test('can slugify an array of passed properties', () => {
    const nextObject = slugProperties(baseObject, ['first_property']);
    expect(nextObject['first_property']).toBe('i-am-a-string');
  });
  test('can slugify a passed string property', () => {
    const nextObject = slugProperties(baseObject, 'second-property');
    expect(nextObject['second-property']).toBe('i-am-also-a-string');
  });
  test('throws an error if nothing is passed', () => {
    expect(() => {
      slugProperties(baseObject);
    }).toThrow();
  });
});
