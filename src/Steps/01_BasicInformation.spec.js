import React from "react";
import { render } from "enzyme";
import BasicInformation from "./01_BasicInformation";
import defaultValues from "../initial_state";

test("Basic component renders correctly", () => {
  const component = render(<BasicInformation values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
