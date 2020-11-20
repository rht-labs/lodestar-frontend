import React, {useEffect, useState} from 'react';
import {
  Form,
  FormSelect,
  FormSelectOption,
  TextInput,
  Grid,
  GridItem,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Button, FormGroup,
} from '@patternfly/react-core';
import { PlusIcon, TrashIcon, UndoIcon } from '@patternfly/react-icons';
import { APP_FEATURES } from '../../common/app_features';
import { Feature } from '../feature/feature';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { UserRolesTooltip } from '../engagement_data_cards/user_card/user_roles_tooltip';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { FormManager } from '../../context/form_manager/form_manager';
import { EngagementUser } from '../../schemas/engagement';

export interface UserEditFieldsProps {
  users: any;
  engagementFormConfig: EngagementFormConfig;
  onChange: (users: EngagementUser[]) => void;
  deletedUsers: string[];
  toggleDeleted: (email: string) => void;
  addUser: any;
  setHasValidInput: any;
  hasValidInput: boolean;
}

export const UserEditFields = ({
  users,
  engagementFormConfig,
  onChange,
  deletedUsers,
  toggleDeleted,
  addUser,
  setHasValidInput,
  hasValidInput
}: UserEditFieldsProps) => {
  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('engagement_users'), [registerField]);
  const columns = [
    { title: 'Email' },
    { title: 'First name' },
    { title: 'Last name' },
    {
      title: (
        <>
          Role
          <UserRolesTooltip engagementFormConfig={engagementFormConfig} />
        </>
      ),
    },
  ];

  const [validEmail, setValidEmail] = useState<boolean | null>(null);
  const [validName, setValidName] = useState<boolean | null>(null);
  const [validLastName, setValidLastName] = useState<boolean | null>(null);
  const [validRole, setValidRole] = useState<boolean | null>(null);

  useEffect(() => {
    setHasValidInput(validEmail && validName && validLastName && validRole);
  }, [validEmail, validName, validLastName, validRole, setHasValidInput]);

  return (
    <>
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <Card isFlat style={{ borderWidth: 0, padding: '1rem' }}>
            <CardBody>
              <Table
                aria-label="Engagement users table"
                variant={TableVariant.compact}
                borders={true}
                cells={columns}
                rows={[]}
              >
                <TableHeader />
                <TableBody />
              </Table>
              <Grid hasGutter>
                <Form>
                  <GridItem>
                    {users.map((value: any, index: any) => {
                      const isUserDeleted =
                        deletedUsers.indexOf(users[index].email) > -1;
                      if(validEmail === null || validName === null || validLastName === null || validRole === null) {
                        setValidEmail(validateEmail(value.email));
                        setValidName(validateString(value.first_name));
                        setValidLastName(validateString(value.last_name));
                        setValidRole(validateRole(value.role));
                      }
                      return (
                        <div key={index}>
                          <Grid hasGutter style={{ marginTop: '1rem' }}>
                            <GridItem span={3}>
                              <FormGroup
                                fieldId={'user_email'}
                                helperTextInvalid={'Enter valid email address'}
                                validated={
                                  validateEmail(value.email)
                                    ? 'default'
                                    : 'error' }
                              >
                                <TextInput
                                  aria-label="email"
                                  name="email"
                                  data-cy={'input_user_email'}
                                  isRequired
                                  isDisabled={
                                    !hasFeature(APP_FEATURES.writer) ||
                                    isUserDeleted
                                  }
                                  onChange={e => {
                                    users[index].email = e;
                                    setValidEmail(validateEmail(value.email));
                                    setValidName(validateString(value.first_name));
                                    setValidLastName(validateString(value.last_name));
                                    setValidRole(validateRole(value.role));
                                    onChange(users);
                                  }}
                                  placeholder="Email Address"
                                  type="email"
                                  value={value.email|| ''}
                                  style={
                                    isUserDeleted
                                      ? { textDecorationLine: 'line-through' }
                                      : {}
                                  }
                                />
                              </FormGroup>
                            </GridItem>
                            <GridItem span={3}>
                              <FormGroup
                                fieldId={'user_first_name'}
                                helperTextInvalid={'Enter valid first name'}
                                validated={
                                  validateString(value.first_name)
                                    ? 'default'
                                    : 'error' }
                              >
                                <TextInput
                                  aria-label="First Name"
                                  name="first-name"
                                  data-cy={'input_user_firstname'}
                                  isRequired
                                  isDisabled={
                                    !hasFeature(APP_FEATURES.writer) ||
                                    isUserDeleted
                                  }
                                  onChange={e => {
                                    users[index].first_name = e;
                                    setValidEmail(validateEmail(value.email));
                                    setValidName(validateString(value.first_name));
                                    setValidLastName(validateString(value.last_name));
                                    setValidRole(validateRole(value.role));
                                    onChange(users);
                                  }}
                                  placeholder="First Name"
                                  type="text"
                                  value={value.first_name || ''}
                                  style={
                                    isUserDeleted
                                      ? { textDecorationLine: 'line-through' }
                                      : {}
                                  }
                                />
                              </FormGroup>
                            </GridItem>
                            <GridItem span={3}>
                              <FormGroup
                                fieldId={'user_last_name'}
                                helperTextInvalid={'Enter valid last name'}
                                validated={
                                  validateString(value.last_name)
                                    ? 'default'
                                    : 'error' }
                              >
                                <TextInput
                                  aria-label="Last Name"
                                  name="last-name"
                                  data-cy={'input_user_lastname'}
                                  isRequired
                                  isDisabled={
                                    !hasFeature(APP_FEATURES.writer) ||
                                    isUserDeleted
                                  }
                                  onChange={e => {
                                    users[index].last_name = e;
                                    setValidEmail(validateEmail(value.email));
                                    setValidName(validateString(value.first_name));
                                    setValidLastName(validateString(value.last_name));
                                    setValidRole(validateRole(value.role));
                                    onChange(users);
                                  }}
                                  placeholder="Last Name"
                                  type="text"
                                  value={value.last_name || ''}
                                  style={
                                    isUserDeleted
                                      ? { textDecorationLine: 'line-through' }
                                      : {}
                                  }
                                />
                              </FormGroup>
                            </GridItem>
                            <GridItem span={2}>
                              <FormGroup
                                fieldId={'user_role'}
                                helperTextInvalid={'Select valid role'}
                                validated={
                                  validateRole(value.role)
                                    ? 'default'
                                    : 'error' }
                              >
                                <FormSelect
                                  name="role"
                                  aria-label="User Role"
                                  id="user_role_dropdown"
                                  value={value.role || ''}
                                  isDisabled={
                                    !hasFeature(APP_FEATURES.writer) ||
                                    isUserDeleted
                                  }
                                  onChange={e => {
                                    users[index].role = e;
                                    setValidEmail(validateEmail(value.email));
                                    setValidName(validateString(value.first_name));
                                    setValidLastName(validateString(value.last_name));
                                    setValidRole(validateRole(value.role));
                                    onChange(users);
                                  }}
                                  style={
                                    isUserDeleted
                                      ? { textDecorationLine: 'line-through' }
                                      : {}
                                  }
                                  isRequired
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
                                      engagementFormConfig?.user_options
                                        ?.user_roles?.options ?? []
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
                              </FormGroup>
                            </GridItem>
                            <GridItem span={1} style={{ paddingTop: '0.5rem' }}>
                              <Feature name={APP_FEATURES.writer}>
                                {isUserDeleted ? (
                                  <UndoIcon
                                    onClick={() => {
                                      toggleDeleted(users[index].email);
                                    }}
                                    data-test-id={`remove-user-button-${index}`}
                                    style={{ fontSize: 'small' }}
                                  />
                                ) : (
                                  <TrashIcon
                                    onClick={() => {
                                      toggleDeleted(users[index].email);
                                    }}
                                    style={{ fontSize: 'small' }}
                                  />
                                )}
                              </Feature>
                            </GridItem>
                          </Grid>
                        </div>
                      );
                    })}
                  </GridItem>
                  <Feature name={APP_FEATURES.writer}>
                    <Button
                      variant="secondary"
                      onClick={addUser}
                      data-testid={'add-first-user'}
                      data-cy={'add_new_user'}
                      isDisabled={!(hasValidInput)}
                    >
                      <PlusIcon style={{ fontSize: 'small' }} /> Add User
                    </Button>
                  </Feature>
                </Form>
              </Grid>
            </CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </>
  );

  function validateEmail ( email: string ) {
    let regexEmail = /^.*@.*\..*$/;
    return regexEmail.test(email);
  }

  function validateString ( name: string ) {
    let regexString = /^[\w'\-,.]*[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]+$/;
    return regexString.test(name);
  }

  function validateRole (role: string){
    return !(role === undefined || role === '');
  }
};
