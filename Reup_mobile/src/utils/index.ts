import initials from 'initials';
import { Platform } from 'react-native';
import translate from '@src/localize';
import moment from 'moment';
import { Config as ConfigApp } from '@src/configs/appConfig';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { ENV } from '@src/constants/app';
import Config from 'react-native-config';

export const isAndroid = () => {
  return Platform.OS === 'android';
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const formatPrice = (price: number) => {
  return `$${parseFloat(price.toString()).toFixed(2)}`;
};

const charSymbol = (name: string) => {
  const nameSplit = name.replace(/[^\w\s]/gi, '');
  let initials: any = nameSplit.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};

export function getInitialName(name: string) {
  return name
    ? name.split(' ').length == 1
      ? initials(name.toLowerCase())
        .toString()
        .toUpperCase()
      : charSymbol(name)
    : '';
}

export const getKeyboardAdvoidStyle = () => {
  return isAndroid() ? -500 : 0;
};

export const getFullName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};

export const getSelectedIds = (selectedIds: string[], item: any) => {
  const existItem = selectedIds.findIndex(id => id === item.id);
  if (existItem >= 0) {
    const selectedItems = [...selectedIds];
    selectedItems.splice(existItem, 1);
    return selectedItems;
  } else {
    const temps = [...selectedIds, item.id];
    return temps;
  }
};

export const getUnitAddress = (block: string, floor: string, code: string) => {
  return `${block}-${floor}${code}`;
};

export const getTenantAddress = (block: string, floor: string, code: string) => {
  return `${translate('tenant_detail.block')} ${block} - ${floor}${code}`;
};

export const getUserNameFromMail = (mail: string) => {
  var nameParts = mail.split('@');
  var name = nameParts.length == 2 ? nameParts[0] : null;
  if (name) {
    name = name.replace('.', ' ');
    return name;
  }
  return '';
};

export const getFirstName = (email: string) => {
  const fullname = getUserNameFromMail(email);
  let firstName = '';
  if (fullname.split(' ').length > 0) {
    firstName = fullname.split(' ')[0];
  } else {
    firstName = fullname;
  }
  return firstName;
};

export const getLastName = (email: string) => {
  const fullname = getUserNameFromMail(email);
  let lastName = '';
  if (fullname.split(' ').length > 0) {
    lastName = fullname.split(' ')[1];
  }
  return lastName;
};

export const upperCaseFirstChar = (name: string) => {
  const newName = name.toLowerCase();
  return newName.charAt(0).toUpperCase() + newName.slice(1);
};

export const formatTime = (time: string) => {
  return time ? moment(time).format(ConfigApp.Manager.formatDate) : '';
};

export const getUserName = (firstName?: string, lastName?: string, email?: string) => {
  if (!firstName && !lastName) {
    return getUserNameFromMail(email ?? '');
  } else {
    return getFullName(firstName ?? '', lastName ?? '');
  }
};

export const formatCurrency = (amount: number, currency?: string, digit?: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ? currency : ConfigApp.Manager.currency,
    minimumFractionDigits: digit ? digit : 0,
  });
  return formatter.format(amount);
};

export const isTenantApp = () => {
  return Config.ENV === ENV.TENANT_DEV || Config.ENV === ENV.TENANT_PROD;
};

export const isManagerApp = () => {
  return Config.ENV === ENV.MANAGER_PROD || Config.ENV === ENV.MANAGER_DEV;
};

export const getApartmentName = (unitBlock: string, unitFloor: string, unitCode: string) => {
  const floor = unitFloor ? unitFloor : '';
  const code = unitCode ? unitCode : '';
  if (unitBlock && (floor || code)) {
    return unitBlock + '-' + floor + code;
  } else {
    return floor + code;
  }
};

export const formatText = (text: string): string => {
  return text && text.length ? text.replace('$', '').replace(/,/gi, '') : '0';
};

