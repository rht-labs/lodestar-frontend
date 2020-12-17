import React, { useEffect, useState } from 'react';
import {
  FormSelect,
  FormSelectOption,
  TextInput,
  Grid,
  GridItem,
  FormGroup,
} from '@patternfly/react-core';
import { TrashIcon, UndoIcon } from '@patternfly/react-icons';
import { APP_FEATURES } from '../../common/app_features';
import { Feature } from '../feature/feature';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { FormManager } from '../../context/form_manager/form_manager';
import { EngagementUser } from '../../schemas/engagement';
import { useEngagements } from '../../context/engagement_context/engagement_hook';

export interface UserRowProps {
  user: EngagementUser;
  onChange: (user: EngagementUser) => void;
  toggleDeleted: (user: EngagementUser) => void;
  validateEmail: (email: string) => boolean;
  validateString: (name: string) => boolean;
  validateRole: (role: string) => boolean;
  isDeleted: boolean;
}

export const UserRow = ({
  user,
  onChange,
  toggleDeleted,
  validateEmail,
  validateString,
  validateRole,
  isDeleted: isUserDeleted,
}: UserRowProps) => {
  const copiedUser = { ...user };
  const { engagementFormConfig } = useEngagements();
  const [userEdits, setUserEdits] = useState<Partial<EngagementUser>>({});
  const { hasFeature } = useFeatures();

  return (
    <>
      <Grid hasGutter style={{ marginTop: '1rem' }}>
        <GridItem span={3}>
          <FormGroup
            fieldId={'user_email'}
            helperTextInvalid={'Enter valid email address'}
            validated={validateEmail(copiedUser.email) ? 'default' : 'error'}
          >
            <TextInput
              aria-label="email"
              name="email"
              data-cy={'input_user_email'}
              isRequired
              isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted}
              onChange={e => {
                const newEdit = { ...userEdits, email: e };
                setUserEdits(newEdit);
                onChange({ ...copiedUser, ...newEdit });
              }}
              placeholder="Email Address"
              type="email"
              value={userEdits.email ?? copiedUser.email ?? ''}
              style={
                isUserDeleted ? { textDecorationLine: 'line-through' } : {}
              }
            />
          </FormGroup>
        </GridItem>
        <GridItem span={3}>
          <FormGroup
            fieldId={'user_first_name'}
            helperTextInvalid={'Enter valid first name'}
            validated={
              validateString(copiedUser.first_name) ? 'default' : 'error'
            }
          >
            <TextInput
              aria-label="First Name"
              name="first-name"
              data-cy={'input_user_firstname'}
              isRequired
              isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted}
              onChange={e => {
                const newEdit = { ...userEdits, first_name: e };
                setUserEdits(newEdit);
                onChange({ ...copiedUser, ...newEdit });
              }}
              placeholder="First Name"
              type="text"
              value={userEdits.first_name ?? copiedUser.first_name ?? ''}
              style={
                isUserDeleted ? { textDecorationLine: 'line-through' } : {}
              }
            />
          </FormGroup>
        </GridItem>
        <GridItem span={3}>
          <FormGroup
            fieldId={'user_last_name'}
            helperTextInvalid={'Enter valid last name'}
            validated={
              validateString(copiedUser.last_name) ? 'default' : 'error'
            }
          >
            <TextInput
              aria-label="Last Name"
              name="last-name"
              data-cy={'input_user_lastname'}
              isRequired
              isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted}
              onChange={e => {
                const newEdit = { ...userEdits, last_name: e };
                setUserEdits(newEdit);
                onChange({ ...copiedUser, ...newEdit });
              }}
              placeholder="Last Name"
              type="text"
              value={userEdits.last_name ?? copiedUser.last_name ?? ''}
              style={
                isUserDeleted ? { textDecorationLine: 'line-through' } : {}
              }
            />
          </FormGroup>
        </GridItem>
        <GridItem span={2}>
          <FormGroup
            fieldId={'user_role'}
            helperTextInvalid={'Select valid role'}
            validated={validateRole(copiedUser.role) ? 'default' : 'error'}
          >
            <FormSelect
              name="role"
              aria-label="User Role"
              id="user_role_dropdown"
              value={userEdits.role ?? copiedUser.role ?? ''}
              isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted}
              onChange={e => {
                const newEdit = { ...userEdits, role: e };
                setUserEdits(newEdit);
                onChange({ ...copiedUser, ...newEdit });
              }}
              style={
                isUserDeleted ? { textDecorationLine: 'line-through' } : {}
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
                  engagementFormConfig?.user_options?.user_roles?.options ?? []
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
                  toggleDeleted(copiedUser);
                }}
                data-test-id={`remove-user-button`}
                style={{ fontSize: 'small' }}
              />
            ) : (
              <TrashIcon
                onClick={() => {
                  toggleDeleted(copiedUser);
                }}
                style={{ fontSize: 'small' }}
              />
            )}
          </Feature>
        </GridItem>
      </Grid>
    </>
  );
};
