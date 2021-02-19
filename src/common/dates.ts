import { format as formatDate, utcToZonedTime } from 'date-fns-tz';
export const formatUtcDate = (date?: Date): string | undefined => {
  if (!date) {
    return '';
  }
  const dateString = formatDate(utcToZonedTime(date, 'UTC'), 'MMM dd, yyyy', {
    timeZone: 'UTC',
  });
  return dateString;
};
