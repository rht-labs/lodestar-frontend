import React from 'react';
import {
  Button,
  EmptyStateIcon,
  Form,
  FormSelect,
  FormSelectOption,
  InputGroup,
  Text,
  TextInput,
  EmptyState,
  Title,
  EmptyStateBody,
  Modal,
  ModalVariant,
  Grid,
  GridItem,
} from '@patternfly/react-core';

import {
  PlusCircleIcon,
  ErrorCircleOIcon,
  CubesIcon,
} from '@patternfly/react-icons';
import { Feature } from '../../components/feature';
import { APP_FEATURES } from '../../common/app_features';
import { Engagement } from '../../schemas/engagement_schema';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useFeatures } from '../../context/feature_toggles/feature_hook';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../layout/edit_modal_template';

export interface UserEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
}
export function UserEditModal({
  engagement,
  formOptions,
  onChange,
  isOpen,
  onSave: propsOnSave,
}: UserEditModalProps) {
  const { requestClose } = useModalVisibility();
  const { hasFeature } = useFeatures();
  const onSave = () => {
    propsOnSave(engagement);
    requestClose();
  };
  function addUser() {
    const newUser = { first_name: '', last_name: '', email: '', role: '' };
    engagement.engagement_users.push(newUser);
    onChange('user', engagement.engagement_users);
  }
  function removeUser(index: any) {
    engagement.engagement_users.splice(index.currentTarget.value, 1);
    onChange('user', engagement.engagement_users);
  }
  return (
    <Modal variant={ModalVariant.large} isOpen={isOpen} onClose={requestClose}>
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={onSave}>Save</Button>
          </div>
        }
        title="Engagement Users"
      >
        <div>
          {!engagement.engagement_users.length ? (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No Users Added
              </Title>
              <EmptyStateBody>
                <p>No users have been added to this engagement's yet.</p>
                <p>
                  Select the 'add user' button below, to begin adding users.
                </p>
              </EmptyStateBody>
              <Button variant="primary" onClick={addUser}>
                Add User
              </Button>
            </EmptyState>
          ) : (
            <div>
              <Grid>
                <Form isHorizontal>
                  <ul>
                    <li>
                      <InputGroup>
                        <Grid style={{ width: '100%' }}>
                          <GridItem span={3}>
                            <Text>Last Name</Text>
                          </GridItem>
                          <GridItem span={3}>
                            <Text>First Name</Text>
                          </GridItem>
                          <GridItem span={3}>
                            <Text>Email</Text>
                          </GridItem>
                          <GridItem span={2}>
                            <Text>Role</Text>
                          </GridItem>
                          <GridItem span={1}>
                            <Feature name={APP_FEATURES.writer}>
                              <Text>Del</Text>
                            </Feature>
                          </GridItem>
                        </Grid>
                      </InputGroup>
                    </li>
                    {engagement.engagement_users.map(
                      (value: any, index: any) => {
                        return (
                          <li key={index}>
                            <InputGroup>
                              <Grid style={{ width: '100%' }}>
                                <GridItem span={3}>
                                  <TextInput
                                    aria-label="Last Name"
                                    name="last-name"
                                    isDisabled={
                                      !hasFeature(APP_FEATURES.writer)
                                    }
                                    onChange={e => {
                                      engagement.engagement_users[
                                        index
                                      ].last_name = e;
                                      onChange(
                                        'user',
                                        engagement.engagement_users
                                      );
                                    }}
                                    placeholder="Last Name"
                                    type="text"
                                    value={value.last_name || ''}
                                  />
                                </GridItem>
                                <GridItem span={3}>
                                  <TextInput
                                    aria-label="First Name"
                                    name="first-name"
                                    isDisabled={
                                      !hasFeature(APP_FEATURES.writer)
                                    }
                                    onChange={e => {
                                      engagement.engagement_users[
                                        index
                                      ].first_name = e;
                                      onChange(
                                        'user',
                                        engagement.engagement_users
                                      );
                                    }}
                                    placeholder="First Name"
                                    type="text"
                                    value={value.first_name || ''}
                                  />
                                </GridItem>
                                <GridItem span={3}>
                                  <TextInput
                                    aria-label="email"
                                    name="email"
                                    isDisabled={
                                      !hasFeature(APP_FEATURES.writer)
                                    }
                                    onChange={e => {
                                      engagement.engagement_users[
                                        index
                                      ].email = e;
                                      onChange(
                                        'user',
                                        engagement.engagement_users
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
                                    value={value.role || ''}
                                    isDisabled={
                                      !hasFeature(APP_FEATURES.writer)
                                    }
                                    onChange={e => {
                                      engagement.engagement_users[
                                        index
                                      ].role = e;
                                      onChange(
                                        'user',
                                        engagement.engagement_users
                                      );
                                    }}
                                  >
                                    {(
                                      formOptions?.user_options?.user_roles
                                        ?.options ?? []
                                    )?.map((option: any, index: number) => (
                                      <FormSelectOption
                                        isDisabled={option.disabled}
                                        key={index}
                                        value={option.value}
                                        label={option.label}
                                      />
                                    ))}
                                  </FormSelect>
                                </GridItem>
                                <GridItem span={1}>
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
                >
                  Add User
                </Button>
              </Feature>
            </div>
          )}
        </div>
      </EditModalTemplate>
    </Modal>
  );
}
