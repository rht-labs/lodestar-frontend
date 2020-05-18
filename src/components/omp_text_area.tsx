import React, { useState } from 'react';
import { TextArea, TextAreaProps } from '@patternfly/react-core';
import { Validator, Validators } from '../common/validators';
import { ValidationStrategy } from './omp_text_input';

export interface OMPTextAreaProps extends TextAreaProps {
  children?: any;
  validators?: Array<Validator>;
  validationStrategy?: ValidationStrategy;
}

export const OMPTextArea = ({
  validators,
  validationStrategy = 'onblur',
  onChange,
  ...rest
}: OMPTextAreaProps) => {
  const [validationState, setValidationState] = useState<
    'default' | 'success' | 'error'
  >('default');

  const doValidation = (value: string) => {
    const isValid = Validators.validate(value, validators);
    setValidationState(isValid ? 'success' : 'error');
  };
  const handleChange = (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (validationStrategy === 'onchange' || validationStrategy === 'always') {
      doValidation(value);
    }
    onChange(value, event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (validationStrategy === 'onblur' || validationStrategy === 'always') {
      doValidation(event.target.value);
    }
    typeof rest.onBlur === 'function' && rest.onBlur(event);
  };
  return (
    <TextArea
      onBlur={handleBlur}
      onChange={handleChange}
      validated={validators && validationState}
      {...(rest as any)}
    />
  );
};
