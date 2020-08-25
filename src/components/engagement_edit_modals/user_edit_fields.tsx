import React from 'react';
import {
  Button,
  Form,
  FormSelect,
  FormSelectOption,
  InputGroup,
  Text,
  TextInput,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { ErrorCircleOIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { APP_FEATURES } from "../../common/app_features";
import { Feature } from "../feature/feature";
import { EngagementFormConfig } from "../../schemas/engagement_config";
import { useFeatures } from "../../context/feature_context/feature_hook";
import { UserRolesTooltip } from "../engagement_data_cards/user_card/user_roles_tooltip";

export interface UserEditFieldsProps {
  users: any;
  formOptions: EngagementFormConfig;
  onChange: (fieldName: string, value: any) => void;
}

export const UserEditFields = ({
  users,
  formOptions,
  onChange
}: UserEditFieldsProps) => {

  const { hasFeature } = useFeatures();
  function removeUser(index: any) {
    users.splice(index.currentTarget.value, 1);
    onChange('user', users);
  }

  function addUser() {
    const newUser = { first_name: '', last_name: '', email: '', role: '' };
    users.push(newUser);
    onChange('user', users);
  }

  return(
    <>
      <div>
        <Grid>
          <Form isHorizontal>
            <ul>
              <li>
                <InputGroup>
                  <Grid style={{ width: '100%' }}>
                    <GridItem span={3}>
                      <Text>First Name</Text>
                    </GridItem>
                    <GridItem span={3}>
                      <Text>Last Name</Text>
                    </GridItem>
                    <GridItem span={3}>
                      <Text>Email</Text>
                    </GridItem>
                    <GridItem span={2}>
                      <Text>
                        Role
                        <UserRolesTooltip formOptions={formOptions}/>
                      </Text>
                    </GridItem>
                    <GridItem span={1}>
                      <Feature name={APP_FEATURES.writer}>
                        <Text>Del</Text>
                      </Feature>
                    </GridItem>
                  </Grid>
                </InputGroup>
              </li>

              { users.map(
                (value: any, index: any) => {
                  return (
                    <li key={index}>
                      <InputGroup>
                        <Grid style={{ width: '100%' }}>
                          <GridItem span={3}>
                            <TextInput
                              aria-label="First Name"
                              name="first-name"
                              data-cy={'input_user_firstname'}
                              isDisabled={
                                !hasFeature(APP_FEATURES.writer)
                              }
                              onChange={e => {
                                users[
                                  index
                                  ].first_name = e;
                                onChange(
                                  'user',
                                  users
                                );
                              }}
                              placeholder="First Name"
                              type="text"
                              value={value.first_name || ''}
                            />
                          </GridItem>
                          <GridItem span={3}>
                            <TextInput
                              aria-label="Last Name"
                              name="last-name"
                              data-cy={'input_user_lastname'}
                              isDisabled={
                                !hasFeature(APP_FEATURES.writer)
                              }
                              onChange={e => {
                                users[
                                  index
                                  ].last_name = e;
                                onChange(
                                  'user',
                                  users
                                );
                              }}
                              placeholder="Last Name"
                              type="text"
                              value={value.last_name || ''}
                            />
                          </GridItem>
                          <GridItem span={3}>
                            <TextInput
                              aria-label="email"
                              name="email"
                              data-cy={'input_user_email'}
                              isDisabled={
                                !hasFeature(APP_FEATURES.writer)
                              }
                              onChange={e => {
                                users[
                                  index
                                  ].email = e;
                                onChange(
                                  'user',
                                  users
                                );
                              }}
                              placeholder="Email Address"
                              type="email"
                              value={value.email || ''}
                            />
                          </GridItem>
                          <GridItem span={2}>
                            <FormSelect
                              name="role"
                              aria-label="User Role"
                              id="user_role_dropdown"
                              value={value.role || ''}
                              isDisabled={
                                !hasFeature(APP_FEATURES.writer)
                              }
                              onChange={e => {
                                users[
                                  index
                                  ].role = e;
                                onChange(
                                  'user',
                                  users
                                );
                              }}
                            >
                              {[
                                <FormSelectOption
                                  isDisabled={true}
                                  key={'placeholder'}
                                  value={undefined}
                                  label={'Select a role'}
                                />,
                              ].concat(
                                (
                                  formOptions?.user_options?.user_roles
                                    ?.options ?? []
                                )?.map((option: any, index: number) => (
                                  <FormSelectOption
                                    isDisabled={option.disabled}
                                    key={index}
                                    value={option.value}
                                    label={option.label}
                                    data-cy={option.label}
                                  />
                                ))
                              )}
                            </FormSelect>
                          </GridItem>
                          <GridItem span={1}>
                            <Feature name={APP_FEATURES.writer}>
                              <Button
                                data-testid={`remove-user-button-${index}`}
                                onClick={removeUser}
                                value={index}
                                variant="danger"
                                isInline
                              >
                                <ErrorCircleOIcon />
                              </Button>
                            </Feature>
                          </GridItem>
                        </Grid>
                      </InputGroup>
                    </li>
                  );
                }
              )}
            </ul>
          </Form>
        </Grid>
        <Feature name={APP_FEATURES.writer}>
          <Button
            onClick={addUser}
            variant="link"
            icon={<PlusCircleIcon />}
            data-cy={'add_more_users'}
          >
            Add User
          </Button>
        </Feature>
      </div>
    </>
  )};
