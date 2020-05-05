import React, { useState } from 'react';
import { TextInput, TextInputProps } from '@patternfly/react-core';
import { Validators, Validator } from '../common/validators';

export type ValidationStrategy = 'onblur' | 'onchange' | 'always';

export interface OMPTextInputProps extends TextInputProps {
  children?: any;
  validators?: Array<Validator>;
  validationStrategy?: ValidationStrategy;
}

export const OMPTextInput = ({
  validators,
  validationStrategy = 'onblur',
  onChange,
  ...rest
}: OMPTextInputProps) => {
  const [validationState, setValidationState] = useState<
    'default' | 'success' | 'error'
  >('default');

  const doValidation = (value: string) => {
    const isValid = Validators.validate(value, validators);
    setValidationState(isValid ? 'success' : 'error');
  };
  const handleChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    if (validationStrategy === 'onchange' || validationStrategy === 'always') {
      doValidation(value);
    }
    onChange(value, event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (validationStrategy === 'onblur' || validationStrategy === 'always') {
      doValidation(event.target.value);
    }
    typeof rest.onBlur === 'function' && rest.onBlur(event);
  };
  return (
    <TextInput
      onBlur={handleBlur}
      onChange={handleChange}
      validated={validators && validationState}
      {...(rest as any)}
    />
  );
};
