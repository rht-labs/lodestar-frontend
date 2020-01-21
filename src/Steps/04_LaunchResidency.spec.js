import React from "react";
import { render } from "enzyme";
import LaunchResidency from "./04_LaunchResidency";
import defaultValues from "../initialState";

test("Basic component renders correctly", () => {
  const component = render(<LaunchResidency values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
