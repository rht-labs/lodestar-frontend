import React from "react";
import { render } from "enzyme";
import ClusterUsers from "./04_ClusterUsers";
import defaultValues from "../initialState";

test("Basic component renders correctly", () => {
  const component = render(<ClusterUsers values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
