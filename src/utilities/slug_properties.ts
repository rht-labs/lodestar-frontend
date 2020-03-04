import slugify from "slugify";
import forOwn from "lodash.forown";

const slugProperties = (iterable: object, properties: Array<any>) => {
  if (iterable && properties) {
    return forOwn(iterable, (value: any, key: any, object: any) => {
      if (properties.includes(key)) {
        object[key] = slugify(value, { lower: true });
      }
    });
  }
  throw new Error("Object and Property Required");
};

export default slugProperties;
