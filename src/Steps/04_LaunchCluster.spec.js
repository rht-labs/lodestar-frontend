import React from "react";
import { render } from "enzyme";
import LaunchCluster from "./04_LaunchCluster";
import defaultValues from "../initialState";

test("Basic component renders correctly", () => {
  const component = render(<LaunchCluster values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
