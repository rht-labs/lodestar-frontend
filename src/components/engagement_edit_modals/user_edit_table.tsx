import React, { useState, useEffect } from 'react';
import {
  SelectOption,
  Card,
  CardBody,
  Button,
} from '@patternfly/react-core';
import {
  EditableTextCell,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
  EditableSelectInputCell,
  validateCellEdits,
  cancelCellEdits,
  applyCellEdits
} from "@patternfly/react-table";

import { UserRolesTooltip } from "../engagement_data_cards/user_card/user_roles_tooltip";
import { EngagementFormConfig } from "../../schemas/engagement_config";
import { useFeatures } from "../../context/feature_context/feature_hook";
import { APP_FEATURES } from "../../common/app_features";
import { Feature } from "../feature/feature";

interface UserEditTableProps{
  users: any;
  formOptions: EngagementFormConfig;
  onChange: (fieldName: string, value: any) => void;
}
export const UserEditTable = ({
  users,
  formOptions,
  onChange,
}: UserEditTableProps) => {

  const allActions = [{
    title: 'Remove user',
    onClick: (event, rowId) => removeUser(rowId)
  }];

  const usersInArrayFormat: string[][] = [];
  let rowsInEditableFormat: any = [];
  const columns = [
    { title: 'First name'},
    { title: 'Last name'},
    { title: 'Email' },
    { title:
        <>
          Role
          <UserRolesTooltip formOptions={formOptions}/>
        </>
    },
  ];
  const [rows, setRows] = useState<any[]>([]);
  const [actions] = useState<any[]>(allActions);

  formatUsersForTable();
  useEffect(() => {
    setRows(rowsInEditableFormat);
  }, [onChange]);

  function formatUsersForTable() {
    users?.map((user: any) => {
      usersInArrayFormat.push([user.first_name , user.last_name, user.email, user.role])
    });

    usersInArrayFormat.map( row => {
      return (
      rowsInEditableFormat.push({
        rowEditBtnAriaLabel: idx => `Edit row ${idx}`,
        rowSaveBtnAriaLabel: idx => `Save edits for row ${idx}`,
        rowCancelBtnAriaLabel: idx => `Cancel edits for row ${idx}`,
        rowEditValidationRules: [
          {
            name: 'required',
            validator: value => value.trim() !== '',
            errorText: 'This field is required'
          }
        ],
        cells: [
          {
            title: (value, rowIndex, cellIndex, props) => (
              <EditableTextCell
                value={value}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                props={props}
                handleTextInputChange={handleFirstNameTextInputChange}
                isDisabled={!hasFeature(APP_FEATURES.writer)}
                inputAriaLabel="first name" />
            ),
            props: {
              value: row[0],
              name: row[0]
            }
          },
          {
            title: (value, rowIndex, cellIndex, props) => (
              <EditableTextCell
                value={value}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                props={props}
                isDisabled={!hasFeature(APP_FEATURES.writer)}
                handleTextInputChange={handleLastNameTextInputChange}
                inputAriaLabel="last name" />
            ),
            props: {
              value: row[1],
              name: row[1],
            }
          },
          {
            title: (value, rowIndex, cellIndex, props) => (
              <EditableTextCell
                value={value}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                props={props}
                isDisabled={!hasFeature(APP_FEATURES.writer)}
                handleTextInputChange={handleEmailTextInputChange}
                inputAriaLabel="email" />
            ),
            props: {
              value: row[2],
              name: row[2],
            }
          },
          {
            title: (value, rowIndex, cellIndex, props) => (
              <EditableSelectInputCell
                value={value}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                props={props}
                onSelect={onSelect}
                clearSelection={clearSelection}
                isOpen={props.isSelectOpen || false}
                options={props.options?.map((option, index) => (
                  <SelectOption
                    key={index}
                    value={option.value}
                    id={'uniqueIdRow1Cell4Option' + index}
                    isPlaceholder={option.isPlaceholder}
                  />
                ))}
                onToggle={(isOpen) => {onToggle(isOpen, rowIndex, cellIndex)}}
                selections={props.selected || ['Option 1']}
              />
            ),
            props: {
              value: ['Option 1'],
              name: 'uniqueIdRow1Cell4',
              options: [
                {value: 'Placeholder...', isPlaceholder: true},
                {value: 'Option 1'},
                {value: 'Option 2'},
                {value: 'Option 3'},
                {value: 'Option 4'},
                {value: 'Option 5'}
              ],
              editableSelectProps: {
                variant: 'single',
                'aria-label': "Row 1 cell 4 content",
              }
            }
          },
        ]
      }));
    });
  };

  const { hasFeature } = useFeatures();
  function removeUser(rowId: any) {
    users.splice(users[rowId], 1);
    onChange('user', users);
  }

  function addUser() {
    const newUser = { first_name: '', last_name: '', email: '', role: '' };
    users.push(newUser);
    onChange('user', users);
  }

  const updateEditableRows = (evt, type, isEditable, rowIndex, validationErrors) => {
    let newRows = Array.from(rows);
    if (validationErrors && Object.keys(validationErrors).length) {
      newRows[rowIndex] = validateCellEdits(newRows[rowIndex], type, validationErrors);
      setRows(newRows);
      return;
    }

    if (type === 'cancel') {
      newRows[rowIndex] = cancelCellEdits(newRows[rowIndex]);
      console.log("***** new rows cancel: "+ newRows.length);
      setRows(newRows);
      return;
    }
    newRows[rowIndex] = applyCellEdits(newRows[rowIndex], type);
    setRows(newRows);
  };

  const handleFirstNameTextInputChange = (newValue, evt, rowIndex, cellIndex) => {
    users[rowIndex].first_name = newValue;
    onChange('user', users);
    let newRows = Array.from(rows);
    newRows[rowIndex].cells[cellIndex].props.editableValue = newValue;
    setRows(newRows);
  };
  const handleLastNameTextInputChange = (newValue, evt, rowIndex, cellIndex) => {
    users[rowIndex].last_name = newValue;
    onChange('user', users);
    let newRows = Array.from(rows);
    newRows[rowIndex].cells[cellIndex].props.editableValue = newValue;
    setRows(newRows);
  };
  const handleEmailTextInputChange = (newValue, evt, rowIndex, cellIndex) => {
    users[rowIndex].email = newValue;
    onChange('user', users);
    let newRows = Array.from(rows);
    newRows[rowIndex].cells[cellIndex].props.editableValue = newValue;
    setRows(newRows);
  };

  const onSelect = (newValue, evt, rowIndex, cellIndex, isPlaceholder) => {
    console.log(">>> inside onSelect");
    const newRows = Array.from(rows);
    console.log(">>> new rows", newRows);
    const newCellProps = newRows[rowIndex].cells[cellIndex].props;
    console.log(">>> newCellProps", newCellProps);
    if (isPlaceholder) {
      newCellProps.editableValue = [];
      newCellProps.selected = [];
    } else {
      if (newCellProps.editableValue === undefined) {
        newCellProps.editableValue = [];
      }

      let newSelected = Array.from(newCellProps.selected);
      console.log(">>> newSelected", newSelected);

      switch (newCellProps.editableSelectProps.variant) {
        case 'typeaheadmulti':
        case 'checkbox': {
          if (!newSelected.includes(newValue)) {
            newSelected.push(newValue);
          } else {
            newSelected = newSelected.filter(el => el !== newValue);
          }
          break;
        }
        default: {
          newSelected = newValue;
        }
      }
      newCellProps.editableValue = newSelected;
      newCellProps.selected = newSelected;
    }
    setRows(newRows);
  };

  const clearSelection = (rowIndex, cellIndex) => {
    const newRows = Array.from(rows);
    const newCellProps = newRows[rowIndex].cells[cellIndex].props;
    newCellProps.editableValue = [];
    newCellProps.selected = [];
    setRows(newRows);
  };

  const onToggle = (isOpen, rowIndex, cellIndex) => {
    let newRows = Array.from(rows);
    newRows[rowIndex].cells[cellIndex].props.isSelectOpen = isOpen;
    setRows(newRows);
  };

  return(
    <>
      <Card isFlat style={{borderWidth: 0}}>
        <CardBody>
          <Table
            aria-label="Engagement users table"
            actions={actions}
            variant={TableVariant.compact}
            borders={true}
            cells={columns}
            rows={rows}
            onRowEdit={updateEditableRows}
          >
            <TableHeader />
            <TableBody />
          </Table>
          <Feature name={APP_FEATURES.writer}>
            <Button
              variant="secondary"
              onClick={addUser}
              data-testid={'add-first-user'}
              data-cy={'add_new_user'}
              style={{margin: '1rem'}}
            >
              Add User
            </Button>
          </Feature>
        </CardBody>
      </Card>
    </>
  )};

