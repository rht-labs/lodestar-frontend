import { Validator } from '../validator';
import {
  startOfYesterday,
  startOfTomorrow,
  startOfToday,
  isValid,
} from 'date-fns';
interface DateValidatorOptions {
  min: string;
  max: string;
}

const DATE_EXPRESSIONS: { [key: string]: () => Date } = {
  '@today': () => startOfToday(),
  '@yesterday': () => startOfYesterday(),
  '@tomorrow': () => startOfTomorrow(),
};

export const DateValidator = (
  value: DateValidatorOptions,
  message: string
): Validator => (input: Date) => {
  if (!(input instanceof Date) || !isValid(input)) {
    return message;
  }
  if (value.min && value.min in DATE_EXPRESSIONS) {
    if (input < DATE_EXPRESSIONS[value.min]()) {
      return message;
    }
  }

  if (value.max && value.max in DATE_EXPRESSIONS) {
    if (input > DATE_EXPRESSIONS[value.max]()) {
      return message;
    }
  }
  return null;
};
