import React from "react";
import { render } from "enzyme";
import PointOfContact from "./02_point_of_contact";
import defaultValues from "../initial_state";

test("Basic component renders correctly", () => {
  const component = render(<PointOfContact values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
