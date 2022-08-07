import moment from 'moment';
import { Config } from '@src/configs/appConfig';

export function formatTime(date: string): string {
  const dateFormat = moment(date).format('hh:mm a');
  return dateFormat == 'Invalid date' ? '' : dateFormat;
}

export function formatDate(date: string): string {
  const dateFormat = moment(date).format('MMMM DD, YYYY');
  return dateFormat == 'Invalid date' ? '' : dateFormat;
}

export function formatDateWith(date: string, fromFormat = 'MMMM DD, YYYY', toFormat = 'MMMM DD, YYYY'): string {
  const dateFormat = moment(date, fromFormat).format(toFormat);
  return dateFormat == 'Invalid date' ? '' : dateFormat;
}

function formatTwoDigits(n: number) {
  return n < 10 ? '0' + n : n;
}

export function formatTimePlayer(seconds: number) {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  if (hh > 0) {
    return hh + ':' + formatTwoDigits(mm) + ':' + formatTwoDigits(ss);
  } else {
    return mm + ':' + formatTwoDigits(ss);
  }
}

export function formatDuration(seconds: number) {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  if (hh > 0) {
    return hh + ':' + formatTwoDigits(mm) + ':' + formatTwoDigits(ss) + 'h';
  } else if (mm > 0) {
    return mm + ':' + formatTwoDigits(ss) + 'm';
  } else {
    return ss + 's';
  }
}

export function formatDurationRecord(ms: number) {
  const ss = Math.floor(ms / 1000) % 60;
  const mm = Math.floor(ms / 1000 / 60) % 60;

  if (mm > 0) {
    return mm + ':' + formatTwoDigits(ss);
  } else if (ss >= 0) {
    return '00:' + formatTwoDigits(ss);
  }
}

export function formatBlogDuration(minutes: number) {
  const mm = Math.floor(minutes) % 60;
  const hh = Math.floor(minutes / 60);

  if (hh > 0) {
    return hh + (hh > 1 ? ' hours ' : ' hour ') + (mm > 0 ? formatTwoDigits(mm) + (mm > 1 ? ' mins' : ' min') : '');
  } else {
    return mm + (mm > 1 ? ' mins' : ' min');
  }
}

export const formatApiToUI = (datetime: string) => {
  return moment(datetime)
    .format(Config.Manager.formatDate)
    .toLocaleString();
};

export const formatUIToApi = (datetime: string, formatDate: string = Config.Manager.formatDate) => {
  return moment(datetime, formatDate).toISOString();
};

export const getStartAndEndDate = (month: number, year: number) => {
  month = month - 1;
  year = month === -1 ? year - 1 : year;

  const startDate = moment()
    .date(1)
    .month(month)
    .year(year)
    .format(Config.Manager.formatDateDisplay);

  return {
    startDate: startDate,
    endDate: moment(startDate)
      .add(1, 'months')
      .subtract(1, 'days')
      .format(Config.Manager.formatDateDisplay),
  };
};

export const ordinalDay = (day: string) => {
  if (Number(day) > 3 && Number(day) < 21) return `${day}th`;
  switch (Number(day) % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

export const numberWeeksOfMonth = (year: string, month: string) => {
  const date = `${year}-${month}`;
  const startMonth = moment(date);
  const weeks = [];
  weeks.push({
    startDay: moment(startMonth)
      .startOf('week')
      .format(Config.Manager.formatDateDisplay),
    endDay: moment(startMonth)
      .endOf('week')
      .format(Config.Manager.formatDateDisplay),
  });
  while (
    startMonth.add(7, 'days').isSameOrBefore(moment(date).endOf('month')) ||
    moment(startMonth)
      .startOf('week')
      .isSameOrBefore(moment(date).endOf('month'))
  ) {
    weeks.push({
      startDay: moment(startMonth)
        .startOf('week')
        .format(Config.Manager.formatDateDisplay),
      endDay: moment(startMonth)
        .endOf('week')
        .format(Config.Manager.formatDateDisplay),
    });
  }
  return weeks;
};

export const monthOrDayFormatNumberToString = (value: number) => {
  return `${value.toString().length === 1 ? `0${value}` : value}`;
};

export const monthFormatToString = (value: string) => {
  const month = value.split('-')[1];
  const year = value.split('-')[0];
  return `${year}-${monthOrDayFormatNumberToString(Number(month))}`;
};
