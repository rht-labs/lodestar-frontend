import {
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import React from 'react';

export interface SelectFormFieldOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}
export interface SelectFormFieldProps<T> {
  emptyValue?: Pick<SelectFormFieldOption<T>, 'label'>;
  options: Partial<SelectFormFieldOption<T>>[];
  testId?: string;
  fieldId?: string;
  isRequired?: boolean;
  label: string;
  isDisabled?: boolean;
  readOnly?: boolean;
  value: T;
  onChange: (value: T) => void;
}
export function SelectFormField<T>({
  options = [],
  isRequired = false,
  fieldId = '',
  isDisabled = false,
  readOnly = false,
  testId = '',
  label = '',
  value,
  emptyValue,
}: SelectFormFieldProps<T>) {
  let finalOptions = options;
  if (!!emptyValue) {
    finalOptions = ([emptyValue] as Partial<SelectFormFieldOption<T>>[]).concat(
      finalOptions
    );
  }
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={fieldId}>
      <FormSelect
        data-testid={testId}
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
              key={o.label}
              value={o.value}
              label={o.label}
              data-cy={o.value}
            />
          ))}
      </FormSelect>
    </FormGroup>
  );
}
