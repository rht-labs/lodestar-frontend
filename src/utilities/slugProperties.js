import slugify from "slugify";
import forOwn from "lodash.forown";

const slugProperties = (iterable: object, properties: array) => {
  if (iterable && properties) {
    return forOwn(iterable, (value, key, object) => {
      if (properties.includes(key)) {
        object[key] = slugify(value, { lower: true });
      }
    });
  }
  throw new Error("Object and Property Required");
};

export default slugProperties;
