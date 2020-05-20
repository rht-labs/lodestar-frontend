import { useContext } from 'react';
import { ValidationContext } from './validation_context';

export const useValidation = () => useContext(ValidationContext);
