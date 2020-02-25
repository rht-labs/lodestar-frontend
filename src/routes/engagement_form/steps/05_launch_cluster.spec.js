import React from "react";
import { render } from "enzyme";
import LaunchCluster from "./05_launch_cluster";
import defaultValues from "../initial_state";

test("Basic component renders correctly", () => {
  const component = render(<LaunchCluster values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
