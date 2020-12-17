import React, { useState } from 'react';
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
import { EngagementUser } from '../../schemas/engagement';
import { useEngagements } from '../../context/engagement_context/engagement_hook';

export interface UserRowProps {
  user: EngagementUser;
  onChange: (user: EngagementUser) => void;
  toggleDeleted: (user: EngagementUser) => void;
  isDeleted: boolean;
}

export const UserRow = ({
  user,
  onChange,
  toggleDeleted,
  isDeleted: isUserDeleted,
}: UserRowProps) => {
  const { engagementFormConfig } = useEngagements();
  const { hasFeature } = useFeatures();

  return (
    <>
      <Grid hasGutter style={{ marginTop: '1rem' }}>
        <GridItem span={3}>
          <FormGroup
            fieldId={'user_email'}
            helperTextInvalid={'Enter valid email address'}
            validated={'default'}
          >
            <TextInput
              aria-label="email"
              name="email"
              data-cy={'input_user_email'}
              isRequired
              isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted}
              onChange={e => {
                onChange({ ...user, email: e });
              }}
              placeholder="Email Address"
              type="email"
              value={user.email}
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
            validated={'default'}
          >
            <TextInput
              aria-label="First Name"
              name="first-name"
              data-cy={'input_user_firstname'}
              isRequired
              isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted}
              onChange={e => {
                onChange({ ...user, first_name: e });
              }}
              placeholder="First Name"
              type="text"
              value={user.first_name}
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
            validated={'default'}
          >
            <TextInput
              aria-label="Last Name"
              name="last-name"
              data-cy={'input_user_lastname'}
              isRequired
              isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted}
              onChange={e => {
                onChange({ ...user, last_name: e });
              }}
              placeholder="Last Name"
              type="text"
              value={user.last_name}
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
            validated={'default'}
          >
            <FormSelect
              name="role"
              aria-label="User Role"
              id="user_role_dropdown"
              value={user.role}
              isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted}
              onChange={e => {
                onChange({ ...user, role: e });
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
                  toggleDeleted(user);
                }}
                data-test-id={`remove-user-button`}
                style={{ fontSize: 'small' }}
              />
            ) : (
              <TrashIcon
                onClick={() => {
                  toggleDeleted(user);
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
