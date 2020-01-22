import slugify from "slugify";

const slugifyProperty = (object, property) => {
  if (object && object[property]) {
    object[property] = slugify(object[property], { lower: true });
    return object;
  }
  if (object && !object[property]) {
    return object;
  }
  throw new Error("Object and Property Required");
};

export default slugifyProperty;
