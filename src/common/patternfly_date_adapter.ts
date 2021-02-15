import { format as formatDate, parse as parseDate, isValid } from 'date-fns';
export const getFormattedDate = (inputDate: Date | string = ''): string => {
  // Dates must be formatted YYYY-MM-DD for patternfly date picker.
  // They are coming back inconsistently from the backend,
  // so this function checks to see if the date needs to be formatted,
  // then formats the date appropriately
  if (
    !inputDate ||
    inputDate === '' ||
    (inputDate instanceof Date && !isValid(inputDate))
  ) {
    return '';
  }
  if (inputDate instanceof Date) {
    const dateString = `${inputDate.getUTCFullYear()}-${(
      inputDate.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${inputDate
      .getUTCDate()
      .toString()
      .padStart(2, '0')}`;
    return dateString;
  } else if (inputDate.indexOf('-') > -1) {
    return inputDate;
  } else {
    return formatDate(
      parseDate(inputDate, 'yyyyMMdd', new Date()),
      'yyyy-MM-dd'
    );
  }
};

export const parseDatePickerDate = (dateString: string): Date | undefined => {
  if (!dateString || dateString?.trim() === '') {
    return undefined;
  }
  const dateParts = dateString.split('-');
  const parsedDateParts = dateParts.map(p => parseInt(p, 10));
  if (parsedDateParts.some(p => isNaN(p))) {
    return;
  }
  if (parsedDateParts.length === 3) {
    return new Date(
      Date.UTC(parsedDateParts[0], parsedDateParts[1] - 1, parsedDateParts[2])
    );
  }

  return;
};
