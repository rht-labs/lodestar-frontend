import { FormGroup, TextInput, TextInputTypes } from '@patternfly/react-core';
import React from 'react';
export type TextFormFieldTypes =
  | 'text'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'time'
  | 'url';
export interface TextFormFieldProps {
  label?: string;
  value?: string;
  maxLength?: number;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  testId?: string;
  fieldId?: string;
  helperText?: string;
  placeholder?: string;
  type?: TextFormFieldTypes;
}
export function TextFormField(props: TextFormFieldProps) {
  const {
    value = '',
    label,
    isRequired = false,
    onChange,
    maxLength,
    isDisabled = false,
    testId,
    fieldId = '',
    helperText = '',
    placeholder = '',
    type = TextInputTypes.text,
  } = props;
  return (
    <FormGroup
      isRequired={isRequired}
      label={label}
      fieldId={fieldId}
      helperText={helperText}
    >
      <TextInput
        maxLength={maxLength}
        isRequired={isRequired}
        data-testid={testId}
        isDisabled={isDisabled}
        type={type}
        id={fieldId}
        name={fieldId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-cy={testId}
      />
    </FormGroup>
  );
}
