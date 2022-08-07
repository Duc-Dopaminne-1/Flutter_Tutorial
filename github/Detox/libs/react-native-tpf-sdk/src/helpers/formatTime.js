import moment from 'moment';

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) {
    return '';
  }
  return moment(date)
    .add(moment(date).utcOffset() / 60, 'hours')
    .format(format);
};

export const formatToUtc = (date, fromFormat = 'DD/MM/YYY') => {
  if (!date) {
    return '';
  }
  return moment(date, fromFormat).utc().format();
};

export const formatToUtcReq = (date, fromFormat = 'DD/MM/YYYY') => {
  if (!date) {
    return '';
  }
  return moment(date, fromFormat).utc().format();
};

export const dateFromNow = date => {
  if (!date) {
    return '';
  }
  return moment(date).fromNow();
};

export const formatLongDate = date => {
  if (!date) {
    return '';
  }
  return moment(date)
    .add(moment(date).utcOffset() / 60, 'hours')
    .format('DD MMMM, YYYY');
};

export const compareDate = (fDate, tDate) => {
  if (!fDate || !tDate) {
    return false;
  }
  const newFromDate = moment(fDate).format('YYYY-MM-DD');
  const newToDate = moment(tDate).format('YYYY-MM-DD');

  return moment(newFromDate).isSame(newToDate);
};

export const formatDateFromUtc = (date, format = 'DD/MM/YYYY') => {
  if (!date) {
    return moment().format(format);
  }
  return moment(date).format(format);
};
