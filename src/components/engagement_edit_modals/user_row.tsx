import React, { useState } from 'react';
import {
  FormSelect,
  FormSelectOption,
  TextInput,
  Grid,
  GridItem,
  FormGroup,
  Checkbox, Tooltip, TooltipPosition
} from '@patternfly/react-core';
import {
  validateEmail,
  validateRole,
  validateString,
} from '../../common/user_validation';
import { TrashIcon, UndoIcon } from '@patternfly/react-icons';
import { APP_FEATURES } from '../../common/app_features';
import { Feature } from '../feature/feature';
import { useFeatures } from '../../context/feature_context/feature_hook';
import {EngagementStatus, EngagementUser} from '../../schemas/engagement';
import { useEngagements } from '../../context/engagement_context/engagement_hook';

export interface UserRowProps {
  user: EngagementUser;
  onChange: (user: EngagementUser) => void;
  toggleDeleted: (user: EngagementUser) => void;
  isDeleted: boolean;
  status: EngagementStatus
}

export const UserRow = ({
  user,
  onChange,
  toggleDeleted,
  isDeleted: isUserDeleted,
  status,
}: UserRowProps) => {
  const { engagementFormConfig } = useEngagements();
  const { hasFeature } = useFeatures();
  const [ isReset, setIsReset ] = useState(false);

  return (
    <>
      <Grid hasGutter style={{ marginTop: '1rem' , marginLeft:'0rem'}}>
        <GridItem span={3}>
          <FormGroup
            fieldId={'user_email'}
            helperTextInvalid={'Enter valid email address'}
            validated={validateEmail(user.email) ? 'default' : 'error'}
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
        <GridItem span={2}>
          <FormGroup
            fieldId={'user_first_name'}
            helperTextInvalid={'Enter valid first name'}
            validated={validateString(user.first_name) ? 'default' : 'error'}
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
        <GridItem span={2}>
          <FormGroup
            fieldId={'user_last_name'}
            helperTextInvalid={'Enter valid last name'}
            validated={validateString(user.last_name) ? 'default' : 'error'}
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
            validated={validateRole(user.role) ? 'default' : 'error'}
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
        <Feature name={'writer'}>
          <GridItem
            span={1}
            style={{ paddingTop: '1rem', paddingLeft: '1.5rem' }}
          >
            <Tooltip
              content={"Select users you want to reset (Active Engagements only)"}
              entryDelay={0}
              exitDelay={10}
              isContentLeftAligned={true}
              position={TooltipPosition.top}
            >
              <Checkbox isDisabled={!hasFeature(APP_FEATURES.writer) || isUserDeleted || status !== EngagementStatus.active}
                        isChecked={isReset}
                        onChange={e => {
                          setIsReset(e);
                          onChange({ ...user, reset: e });
                        }}
                        id={user.uuid} />
            </Tooltip>
          </GridItem>
          <GridItem span={1} style={{ paddingTop: '0.5rem', paddingLeft: '3.5rem'  }}>
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
                style={{ fontSize: 'small'}}
              />
            )}
          </GridItem>
        </Feature>
      </Grid>
    </>
  );
};
