import { formatDate } from '../../helpers/formatTime';

const getDate = date => {
  return date.slice(date.length - 1) === 'Z' ? date.slice(0, -1) : date;
};

export const parseScheduleItem = item => {
  return {
    id: item?.id,
    referenceName: item?.referenceName,
    referenceId: item?.referenceId,
    location: item?.location,
    referenceType: item?.referenceType,
    status: item?.status,
    fromTime: item?.fromDateTime ? formatDate(getDate(item?.fromDateTime), 'HH:mm') : '',
    fromDate: item?.fromDateTime ? formatDate(getDate(item?.fromDateTime), 'DD/MM/YYYY') : '',
    toTime: item?.toDateTime ? formatDate(getDate(item?.toDateTime), 'HH:mm') : '',
    toDate: item?.toDateTime ? formatDate(getDate(item?.toDateTime), 'DD/MM/YYYY') : '',
    description: item?.description,
    remindBefore: item?.remindBefore,
    feedback: item?.feedback,
    notes: item?.notes
  };
};

export const parseScheduleList = items => {
  let list = items || [];
  return list.map(item => parseScheduleItem(item));
};
