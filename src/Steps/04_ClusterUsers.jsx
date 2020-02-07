import React from "react";
import {
  Form,
  Text,
  TextInput,
  InputGroup,  
} from "@patternfly/react-core";

import injectSheet from 'react-jss';

const styles = {
  listHeader: {
    width: '25%',
    fontWeight: 'bold',
  }
}

const StyledText = ({classes, children}) => (
  <Text className={classes.listHeader}>
    {children}
  </Text>
)

const HeaderText = injectSheet(styles)(StyledText);

const ClusterUsers = ({ classes, options, values, onChange }) => {
  console.log(classes);
  return (
    <Form isHorizontal>
      <ul>
        <li>
          <InputGroup>
            <HeaderText>Last Name</HeaderText>
            <HeaderText>First Name</HeaderText>
            <HeaderText>email</HeaderText>
            <HeaderText>Role</HeaderText>
          </InputGroup>
        </li>
        {values.engagement_users.map((value, index) => {
          return <li key={index}>
            <InputGroup>
              <TextInput
                aria-label="Last Name"
                name="last-name"
                onChange={e => {
                  values.engagement_users[index].last_name = e;
                  onChange({ type: "user", payload: values.engagement_users });
                }}
                placeholder="Last Name"
                type="text"
                value={value.last_name || ''}
              />
              <TextInput
                aria-label="First Name"
                name="first-name"
                helper="first name"
                onChange={e => {
                  values.engagement_users[index].first_name = e;
                  onChange({ type: "user", payload: values.engagement_users });
                }}
                placeholder="First Name"
                type="text"
                value={value.first_name || ''}
              />
              <TextInput
                aria-label="email"
                name="email"
                onChange={e => {
                  values.engagement_users[index].email = e;
                  onChange({ type: "user", payload: values.engagement_users });
                }}
                placeholder="Email Address"
                type="email"
                value={value.email || ''}
              />
              <TextInput
                aria-label="role"
                name="role"
                onChange={e => {
                  values.engagement_users[index].role = e;
                  onChange({ type: "user", payload: values.engagement_users });
                }}
                placeholder="role"
                type="text"
                value={value.role || ''}
              />
            </InputGroup>
          </li>
        })}
      </ul>
    </Form>
  );
};

export default ClusterUsers;
