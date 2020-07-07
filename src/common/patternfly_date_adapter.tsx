import { format as formatDate, parse as parseDate, isValid } from 'date-fns';
export const getFormattedDate = (inputDate: Date | string = ''): string => {
  // Dates must be formatted YYYY-MM-DD for patternfly date picker.
  // They are coming back inconsistently from the backend,
  // so this function checks to see if the date needs to be formatted,
  // then formats the date appropriately
  if (!inputDate || (inputDate instanceof Date && !isValid(inputDate))) {
    return;
  }
  if (inputDate instanceof Date) {
    return formatDate(inputDate, 'yyyy-MM-dd');
  } else if (inputDate.indexOf('-') > -1) {
    return inputDate;
  } else {
    return formatDate(
      parseDate(inputDate, 'yyyyMMdd', new Date()),
      'yyyy-MM-dd'
    );
  }
};
