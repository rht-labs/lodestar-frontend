import React from "react";
import {
  Form,
  Text,
  TextInput,
  InputGroup,
  Button,  
} from "@patternfly/react-core";

import { PlusCircleIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import injectSheet from 'react-jss';

const styles = {
  listHeader: {
    width: '24%',
    fontWeight: 'bold',
  },
  buttonHeader: {
    width: '4%',
    fontWeight: 'bold'
  }
}

const StyledText = ({classes, children}) => (
  <Text className={classes.listHeader}>
    {children}
  </Text>
)

const StyledButtonText = ({classes, children}) => (
  <Text className={classes.buttonHeader}>
    {children}
  </Text>
)

const HeaderText = injectSheet(styles)(StyledText);
const HeaderTextButton = injectSheet(styles)(StyledButtonText);


const ClusterUsers = ({ classes, options, values, onChange }) => {
  
  //Functions for Cluster User interactivity
  function addUser(){
    const newUser = {first_name: '', last_name: '', email: '', role: ''};
    values.engagement_users.push(newUser);
    onChange({ type: "user", payload: values.engagement_users });
  }

  function removeUser(index){
    values.engagement_users.splice(index.currentTarget.value);
    onChange({ type: "user", payload: values.engagement_users })
  }
  
  return (
    <Form isHorizontal>
      <ul>
        <li>
          <InputGroup>
            <HeaderText>Last Name</HeaderText>
            <HeaderText>First Name</HeaderText>
            <HeaderText>email</HeaderText>
            <HeaderText>Role</HeaderText>
            <HeaderTextButton>Del</HeaderTextButton>
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
              <Button onClick={removeUser} value={index} variant="danger" isInline>
                <ErrorCircleOIcon />
              </Button>
            </InputGroup> 
          </li>
        })}
      </ul>
      <Button onClick={addUser} variant="link" icon={<PlusCircleIcon />}>
        Add User
      </Button>
    </Form>
  );
};

export default ClusterUsers;
