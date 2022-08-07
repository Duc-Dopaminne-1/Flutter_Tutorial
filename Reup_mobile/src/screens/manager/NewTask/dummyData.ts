import translate from '@src/localize';
import { Theme } from '@src/components/Theme';

export const hardStatus = [
  { key: 1, label: translate('category_details.active') },
  { key: 2, label: translate('category_details.inactive') },
];

export const PriorityEnum = {
  high: translate('task.high'),
  medium: translate('task.medium'),
  low: translate('task.low'),
};

export const getColorPriorityText = (priority: string) => {
  if (priority == PriorityEnum.high) {
    return Theme.priority.high;
  } else if (priority == PriorityEnum.medium) {
    return Theme.priority.medium;
  } else if (priority == PriorityEnum.low) {
    return Theme.priority.low;
  } else {
    return Theme.priority.default;
  }
};

export const hardPriority = [
  { _key: '', _value: 'Please Choose' },
  { _key: PriorityEnum.high, _value: PriorityEnum.high },
  { _key: PriorityEnum.medium, _value: PriorityEnum.medium },
  { _key: PriorityEnum.low, _value: PriorityEnum.low },
];

export const hardIntervalType = [
  { _key: '', _value: 'Please Choose' },
  // { _key: translate('task.day'), _value: translate('task.day') },
  { _key: translate('task.week'), _value: translate('task.week') },
  { _key: translate('task.month'), _value: translate('task.month') },
  { _key: translate('task.year'), _value: translate('task.year') },
];

export const hardMonthOfYears = [
  {
    id: '1',
    name: translate('months_of_year.january'),
    isActive: false,
  },
  {
    id: '2',
    name: translate('months_of_year.february'),
    isActive: false,
  },
  {
    id: '3',
    name: translate('months_of_year.march'),
    isActive: false,
  },
  {
    id: '4',
    name: translate('months_of_year.april'),
    isActive: false,
  },
  {
    id: '5',
    name: translate('months_of_year.may'),
    isActive: false,
  },
  {
    id: '6',
    name: translate('months_of_year.june'),
    isActive: false,
  },
  {
    id: '7',
    name: translate('months_of_year.july'),
    isActive: false,
  },
  {
    id: '8',
    name: translate('months_of_year.august'),
    isActive: false,
  },
  {
    id: '9',
    name: translate('months_of_year.september'),
    isActive: false,
  },
  {
    id: '10',
    name: translate('months_of_year.october'),
    isActive: false,
  },
  {
    id: '11',
    name: translate('months_of_year.november'),
    isActive: false,
  },
  {
    id: '12',
    name: translate('months_of_year.december'),
    isActive: false,
  },
];
