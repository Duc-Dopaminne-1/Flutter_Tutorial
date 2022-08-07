import 'moment/locale/vi';

import moment from 'moment';

const FORMAT_DATE = {
  SHORT_DDMMYYYY: 'DD/MM/YYYY',
  CALENDAR_DATE: 'YYYY-MM-DD',
  TRANSACTION_DATE_TIME: 'DD/MM/YYYY HH:mm', //moment format is mm
  TIME_DATE: 'HH:mm DD/MM/YYYY',
  TIME_AM_PM: 'hh:mm A',
};

const getDateBeforeByDate = (dateString, dateCount) => {
  return moment(dateString).subtract(dateCount, 'days').toDate();
};

const getDateAfterByDate = (dateString, dateCount) => {
  return moment(dateString).add(dateCount, 'days').toDate();
};

const getDateBefore = dateCount => {
  return moment().subtract(dateCount, 'days').toDate();
};

const getMonthBefore = monthCount => {
  return moment().subtract(monthCount, 'month').toDate();
};

const getCurrentDateString = format => {
  return moment(new Date()).format(format ?? FORMAT_DATE.SHORT_DDMMYYYY);
};

const dateToString = (date, format) => {
  const dateString = moment(date ?? new Date()).format(format ?? FORMAT_DATE.SHORT_DDMMYYYY);
  return dateString;
};

const dateToStringRelative = (date, languageCode = 'vi') => {
  moment.locale(`${languageCode}`);
  return moment(date ?? new Date()).fromNow();
};

const dateToUnixTimestamp = date => {
  if (!date) {
    return 1;
  }
  return Math.round(date.getTime() / 1000);
};

const unixTimestampToDate = timestamp => {
  return new Date(timestamp * 1000);
};

const unixTimestampToDateString = (timestamp, format) => {
  const date = unixTimestampToDate(timestamp);
  return dateToString(date, format);
};

// Timestamp value in millisecond
const dateToTimestamp = date => {
  if (!date) {
    return 1;
  }
  return date.getTime();
};

const timestampToDate = timestamp => {
  return new Date(timestamp);
};

const timestampToDateString = (timestamp, format) => {
  const date = timestampToDate(timestamp);
  return dateToString(date, format);
};

const getTextDateFromTimeStamp = timestamp => {
  return timestampToDateString(timestamp, FORMAT_DATE.SHORT_DDMMYYYY);
};

const getNowTimeStamp = () => {
  const now = new Date();
  return dateToTimestamp(now);
};

const stringToDate = dateString => {
  return moment(dateString).toDate();
};

const getTransactionDateTimeString = timeStamp => {
  if (!timeStamp) {
    return '';
  }
  const dateString = timestampToDateString(timeStamp, FORMAT_DATE.TRANSACTION_DATE_TIME);
  return dateString;
};

const getCalendarDateTimeString = timeStamp => {
  if (!timeStamp) {
    return '';
  }
  return timestampToDateString(timeStamp, FORMAT_DATE.CALENDAR_DATE);
};

const getDatePickerDateString = date => {
  return dateToString(date, FORMAT_DATE.SHORT_DDMMYYYY);
};

const formatTimeToTimeDate = timeStamp => {
  if (!timeStamp) {
    return '';
  }
  return timestampToDateString(timeStamp, FORMAT_DATE.TIME_DATE);
};

const getDatePickerPropsFromTimeStamp = timestamp => {
  let date,
    formattedDate = null;
  if (timestamp && timestamp > 0) {
    const timeStampToDate = timestampToDate(timestamp);
    formattedDate = getTextDateFromTimeStamp(timestamp);
    date = timeStampToDate.toISOString();
  }
  return {date, formattedDate};
};

const unixTimestampToTimeAmPm = (timestamp, langCode = 'en') => {
  return moment(timestamp).lang(langCode).format(FORMAT_DATE.TIME_AM_PM);
};

const diffDate = (
  startDate,
  endDate,
  unitOfTime = 'minutes', // years | months | weeks | days | hours | minutes
) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return start.diff(end, unitOfTime);
};

export {
  dateToString,
  dateToStringRelative,
  dateToTimestamp,
  dateToUnixTimestamp,
  diffDate,
  FORMAT_DATE,
  formatTimeToTimeDate,
  getCalendarDateTimeString,
  getCurrentDateString,
  getDateAfterByDate,
  getDateBefore,
  getDateBeforeByDate,
  getDatePickerDateString,
  getDatePickerPropsFromTimeStamp,
  getMonthBefore,
  getNowTimeStamp,
  getTextDateFromTimeStamp,
  getTransactionDateTimeString,
  stringToDate,
  timestampToDate,
  timestampToDateString,
  unixTimestampToDate,
  unixTimestampToDateString,
  unixTimestampToTimeAmPm,
};
