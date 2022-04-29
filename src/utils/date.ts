import { format } from 'date-fns';
import moment from 'moment';

const DATE_FORMAT = 'MM/dd/yyyy';
const TIME_FORMAT = 'HH:mm';

export type Range = { from: Date; to: Date };

export const formatDate = (date: Date) => format(new Date(date), DATE_FORMAT);
export const formatTime = (date: Date) => format(new Date(date), TIME_FORMAT);

export const formatDateRange = (range: Range) => {
  const { from, to } = range;
  return `${formatDate(from)} ${formatTime(from)} - ${formatTime(to)}`;
};

export const getAge = (dateString: string) => {
  const date = moment(dateString, 'YYYY-MM-DD');
  const years = moment().diff(date, 'years');
  return `${years} years old`;
};
