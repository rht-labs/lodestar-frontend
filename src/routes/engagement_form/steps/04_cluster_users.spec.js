import React from "react";
import { render } from "enzyme";
import ClusterUsers from "./04_cluster_users";
import defaultValues from "../initial_state";

const defaultOptions = {
  "user-management": {
    rbac: {
      roles:[
        {"first_name": "Philip", "last_name": "Double", "email": "pdouble@redhat.com", "role": "admin"},
        {"first_name": "Hudson", "last_name": "Double", "email": "hdouble@redhat.com", "role": "observer"},
        {"first_name": "Isa", "last_name": "Double", "email": "idouble@redhat.com", "role": "developer"}
      ]
    }
  }
};

test("Basic component renders correctly", () => {
  const component = render(<ClusterUsers options={defaultOptions} values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
