import React from "react";
import { render } from "enzyme";
import ClusterInformation from "./03_ClusterInformation";
import defaultValues from "../initialState";

test("Basic component renders correctly", () => {
  const component = render(<ClusterInformation values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
