import slugifyProperty from "./slugifyProperty";

const baseObject = {
  first_property: "I am a string",
  "second-property": "I am also a string"
};

describe("slugifyProperty: ", () => {
  test("returns object if property not passed", () => {
    const nextObject = slugifyProperty(baseObject);
    expect(nextObject).toBe(baseObject);
  });
  test("can slugify a passed property", () => {
    const nextObject = slugifyProperty(baseObject, "first_property");
    expect(nextObject["first_property"]).toBe("i-am-a-string");
  });
  test("can slugify a passed string property", () => {
    const nextObject = slugifyProperty(baseObject, "second-property");
    expect(nextObject["second-property"]).toBe("i-am-also-a-string");
  });
});
