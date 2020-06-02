import React, { useContext } from 'react';
import {
  Button,
  EmptyStateIcon,
  Form,
  FormSelect,
  FormSelectOption,
  InputGroup,
  Text,
  TextInput,
} from '@patternfly/react-core';

import {
  PlusCircleIcon,
  ErrorCircleOIcon,
  CubesIcon,
} from '@patternfly/react-icons';
import { FeatureToggleContext } from '../../../context/feature_toggles/feature_toggles';
import { Feature } from '../../../components/feature';
import { APP_FEATURES } from '../../../common/app_features';
import { Engagement } from '../../../schemas/engagement_schema';
import { useFeatures } from '../../../context/feature_toggles/feature_hook';

const selectStyle: React.CSSProperties = {
  width: '24%',
};

const listHeader: React.CSSProperties = {
  width: '24%',
  fontWeight: 'bold',
};

const buttonHeader: React.CSSProperties = {
  width: '4%',
  fontWeight: 'bold',
};

export const ClusterUsers = ({
  userManagementOptions,
  values,
  onChange,
}: {
  onChange: (name: string, value: any) => void;
  values: Engagement;
  userManagementOptions?: any;
}) => {
  const { hasFeature } = useFeatures();

  //Functions for Cluster User interactivity
  function addUser() {
    const newUser = { first_name: '', last_name: '', email: '', role: '' };
    values.engagement_users.push(newUser);
    onChange('user', values.engagement_users);
  }

  function removeUser(index: any) {
    values.engagement_users.splice(index.currentTarget.value, 1);
    onChange('user', values.engagement_users);
  }

  const tabContent: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    margin: 100,
  };

  return (
    <div className="pf-c-empty-state">
      {!values.engagement_users.length ? (
        <div>
          <div style={{ fontSize: '3rem' }}>
            <div>
              <EmptyStateIcon icon={CubesIcon} />
            </div>
            No Users Added
          </div>
          <div>
            <p>No users have been added to this engagement's yet.</p>
            <p>Select the 'add user' button below, to begin adding users.</p>
          </div>
        </div>
      ) : (
        <Form style={tabContent} isHorizontal>
          <ul>
            <li>
              <InputGroup>
                <Text style={listHeader}>Last Name</Text>
                <Text style={listHeader}>First Name</Text>
                <Text style={listHeader}>Email</Text>
                <Text style={listHeader}>Role</Text>
                <Feature name={APP_FEATURES.writer}>
                  <Text style={buttonHeader}>Del</Text>
                </Feature>
              </InputGroup>
            </li>
            {values.engagement_users.map((value: any, index: any) => {
              return (
                <li key={index}>
                  <InputGroup>
                    <TextInput
                      aria-label="Last Name"
                      name="last-name"
                      isDisabled={!hasFeature(APP_FEATURES.writer)}
                      onChange={e => {
                        values.engagement_users[index].last_name = e;
                        onChange('user', values.engagement_users);
                      }}
                      placeholder="Last Name"
                      type="text"
                      value={value.last_name || ''}
                    />
                    <TextInput
                      aria-label="First Name"
                      name="first-name"
                      isDisabled={!hasFeature(APP_FEATURES.writer)}
                      onChange={e => {
                        values.engagement_users[index].first_name = e;
                        onChange('user', values.engagement_users);
                      }}
                      placeholder="First Name"
                      type="text"
                      value={value.first_name || ''}
                    />
                    <TextInput
                      aria-label="email"
                      name="email"
                      isDisabled={!hasFeature(APP_FEATURES.writer)}
                      onChange={e => {
                        values.engagement_users[index].email = e;
                        onChange('user', values.engagement_users);
                      }}
                      placeholder="Email Address"
                      type="email"
                      value={value.email || ''}
                    />
                    <FormSelect
                      style={selectStyle}
                      name="role"
                      aria-label="User Role"
                      value={value.role || ''}
                      isDisabled={!hasFeature(APP_FEATURES.writer)}
                      onChange={e => {
                        values.engagement_users[index].role = e;
                        onChange('user', values.engagement_users);
                      }}
                    >
                      {userManagementOptions?.rbac?.roles?.map(
                        (option: any, index: number) => (
                          <FormSelectOption
                            isDisabled={option.disabled}
                            key={index}
                            value={option.value}
                            label={option.label}
                          />
                        )
                      )}
                    </FormSelect>
                    <Feature name={APP_FEATURES.writer}>
                      <Button
                        onClick={removeUser}
                        value={index}
                        variant="danger"
                        isInline
                      >
                        <ErrorCircleOIcon />
                      </Button>
                    </Feature>
                  </InputGroup>
                </li>
              );
            })}
          </ul>
        </Form>
      )}
      <Feature name={APP_FEATURES.writer}>
        <Button onClick={addUser} variant="link" icon={<PlusCircleIcon />}>
          Add User
        </Button>
      </Feature>
    </div>
  );
};
