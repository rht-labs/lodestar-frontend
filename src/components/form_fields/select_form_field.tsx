import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import React from 'react';

export interface SelectFormFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface SelectFormFieldProps {
  emptyValue?: Pick<SelectFormFieldOption, 'label'>;
  options: Partial<SelectFormFieldOption>[];
  testId?: string;
  fieldId?: string;
  isRequired?: boolean;
  label: string;
  isDisabled?: boolean;
  readOnly?: boolean;
  value: string;
  onChange: (value: string) => void;
}
export function SelectFormField({
  options = [],
  isRequired = false,
  fieldId = '',
  isDisabled = false,
  readOnly = false,
  testId = '',
  label = '',
  onChange,
  value,
  emptyValue,
}: SelectFormFieldProps) {
  let finalOptions = options;
  if (!!emptyValue) {
    finalOptions = ([emptyValue] as Partial<SelectFormFieldOption>[]).concat(
      finalOptions
    );
  }
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={fieldId}>
      <FormSelect
        data-testid={testId}
        onChange={onChange}
        data-cy={testId}
        value={value}
        isDisabled={isDisabled}
        readOnly={readOnly}
        id={fieldId}
      >
        {finalOptions
          .filter(o => !!o)
          .map(o => (
            <FormSelectOption
              isDisabled={o.disabled}
              key={o.value}
              value={o.value}
              label={o.label}
              data-cy={o.value}
            />
          ))}
      </FormSelect>
    </FormGroup>
  );
}
