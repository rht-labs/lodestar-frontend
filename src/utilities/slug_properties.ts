import slugify from 'slugify';
import forOwn from 'lodash.forown';

export const slugProperties = (iterable: object, properties: any[]) => {
  if (iterable && properties) {
    return forOwn(iterable, (value: any, key: any, object: any) => {
      if (properties.includes(key)) {
        object[key] = slugify(value, { lower: true });
      }
    });
  }
  throw new Error('Object and Property Required');
};
