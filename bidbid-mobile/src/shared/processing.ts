import moment from 'moment';
import { RulePayment, TYPE_CHAT } from '@/constants/app';
import { ActionSaveAllPaymentPayload } from '@/redux/payment';
import { Auction, AuctionStatus, Gender } from '@/models';
import store from '@/redux/store';
import Config from 'react-native-config';
import { language } from '@/i18n';
import { isEqual } from 'lodash';
import { formatNameUser } from '@/shared/discovery';
import { getLocalApp } from '@/redux/app/selector';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PNF = require('google-libphonenumber').PhoneNumberFormat;

export const DevENV = () => {
  // return Config.ENV === 'development' || Config.ENV === 'staging';
  return Config.ENV === 'development';
};

const prepareTimeAuction = DevENV() ? 0 : 2;

export const Log = (title, param) => {
  console.log(`**** ${title}`, param);
};

export const getVersion = (version: string) => {
  if (!version) return '';
  const lastIndexDot = version.lastIndexOf('.');
  return parseInt(version.slice(lastIndexDot + 1, version.length));
};

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const formatPhoneNumber = (phoneNumber = '') => {
  if (phoneNumber) {
    const regionObject = phoneUtil.parse(phoneNumber, null);
    const numberRegion = phoneUtil.getRegionCodeForNumber(regionObject);
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, numberRegion);
    return phoneUtil.format(number, PNF.INTERNATIONAL);
  }
  return language('filterScreen.none');
};

export const getUserId = () => {
  return store.getState().user.data.id;
};

export const safeAuction = (auctions: Auction[]) => {
  return auctions?.filter(item => item.status === AuctionStatus.BIDDING);
};

export function validateTimeCreateAuction(value) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!this.parent.hasOwnProperty('durationId')) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const durationAuction = this.parent.durationTime / 3600;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const timeMeet = value + ' ' + moment(this.parent.time, 'h:mm A').format('HH:mm');
  const now = moment(new Date())
    .add(prepareTimeAuction + durationAuction, 'hours')
    .format('L HH:mm');
  const ms = moment(timeMeet, 'L HH:mm:ss').diff(moment(now, 'L HH:mm:ss'));
  const d = moment.duration(ms);
  const result = Math.floor(d.asHours()) + moment.utc(ms).format(':mm');
  return parseFloat(result) >= 0;
}

export function validateTimeWeekCreateAuction(value) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const timeMeet = value + ' ' + moment(this.parent.time, 'h:mm A').format('HH:mm');
  const nextWeek = moment(new Date()).add(7, 'days').format('L HH:mm');
  const msDay = moment(nextWeek, 'L HH:mm:ss').diff(moment(timeMeet, 'L HH:mm:ss'));
  const dDay = moment.duration(msDay);
  const resultDay = Math.floor(dDay.asHours()) + moment.utc(msDay).format(':mm');
  return parseFloat(resultDay) >= 0;
}

export const convertPriceStringToFloat = (price: string) => {
  return parseFloat(price.split(',').join(''));
};

export function validateEndPrice(value) {
  const endPrice = value ? convertPriceStringToFloat(value) : value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const startPrice = this.parent.startPrice ? convertPriceStringToFloat(this.parent.startPrice) : this.parent.startPrice;
  return !(endPrice && endPrice <= startPrice);
}

export function validateEntryPrice(value) {
  const entryPrice = value ? convertPriceStringToFloat(value) : value;
  return !(entryPrice && entryPrice < 1);
}

export function validateMinimumPrice(value) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const startPriceMain = this.parent.startPrice ? convertPriceStringToFloat(this.parent.startPrice) : this.parent.startPrice;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const endNowPriceMain = this.parent.endPrice ? convertPriceStringToFloat(this.parent.endPrice) : this.parent.endPrice;
  const minimumPriceMain = value ? convertPriceStringToFloat(value) : value;

  if (minimumPriceMain && minimumPriceMain < startPriceMain) {
    return false;
  } else if (minimumPriceMain && endNowPriceMain && minimumPriceMain > endNowPriceMain) {
    return false;
  }
  return true;
}

export function validateDonate(value) {
  if (value === undefined || value === '' || value === '-1') {
    return false;
  }
  return true;
}

export const sortAuctionByCreatedAt = (auctions: Auction[]): Auction[] => {
  return auctions.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const filterAuctionsBidding = (auctions: Auction[]): Auction[] => {
  return auctions?.filter(item => item.status === AuctionStatus.BIDDING || item.status === AuctionStatus.READY_TO_PAY);
};

export const filterAuctionsOnProcessing = (auctions: Auction[]): Auction[] => {
  return auctions?.filter(item => {
    return item.status === AuctionStatus.READY_TO_MEET || item.status === AuctionStatus.WAITING_PAYMENT;
  });
};

export const filterAuctionsNoWinners = (auctions: Auction[]): Auction[] => {
  return auctions?.filter(item => item.status === AuctionStatus.NO_WINNER);
};

export const filterAuctionsWon = (auctions: Auction[]): Auction[] => {
  return auctions?.filter(
    item =>
      item.status === AuctionStatus.COMPLETED ||
      item.status === AuctionStatus.READY_TO_MEET ||
      item.status === AuctionStatus.WAITING_PAYMENT ||
      item.status === AuctionStatus.FAILED_PAYMENT ||
      (item.status === AuctionStatus.CANCEL && item.cancel && item.cancel.by),
  );
};
export const calculateAge = birthday => {
  let ageDifMs = Date.now() - birthday.getTime();
  let ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const safeBirthDay = (dateOfBirth: any) => {
  return dateOfBirth ? dateOfBirth.split('-')[0] : '';
};

export const getAgeFromDateOfBirth = (dateOfBirth: any) => {
  return new Date().getFullYear() - parseInt(safeBirthDay(dateOfBirth));
};

export const roundToInteger = (num: string): string => {
  const price = convertPriceStringToFloat(num);
  return +(Math.round(Number(price + 'e+0')) + 'e-0') + '';
};

export const currencyFormat = (num: number) => {
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const suggestPrice = (currentPrice: number, endNowPrice: number, percent: number) => {
  const price = currentPrice === null ? 5 : currentPrice;
  const newPrice = price * percent;
  const formatPrice = suggestPriceBid(newPrice.toString());
  // if (!endNowPrice) return [formatPrice, `$${formatPrice}`];
  if (endNowPrice && newPrice > endNowPrice) return [null, null];
  return [formatPrice, `$${formatPrice}`];
};

export const suggestPriceBid = (price: string) => {
  const indexDot = price.indexOf('.') + 1;

  let getDecimal = price.slice(indexDot, price.length);
  let decimal = parseInt(getDecimal);
  if (decimal > 50) {
    return roundToInteger(price) + '.00';
  } else if (decimal < 50) {
    return roundToInteger(price) + '.50';
  } else {
    return price;
  }
};

export const formatNamePayment = (item: ActionSaveAllPaymentPayload): string => {
  switch (item.type) {
    case RulePayment.PayPal:
      return `PayPal - ${item.email}`;
    case RulePayment.Venmo:
      return `${item.type} - ${item.accountId}`;
    case RulePayment.Card:
      return `${item.cardType} - ${item.last4}`;
    default:
      return `${item.cardType} - ${item.last4}`;
  }
  // return item.type === RulePayment.PayPal ? `${item.cardType} - ${item.email}` : `${item.cardType} - ${item.last4}`;
};

export const formatNameDetailPayment = (item: ActionSaveAllPaymentPayload): string => {
  return item.type === RulePayment.PayPal ? `${item.email}` : `${item.cardholderName}`;
};

export const upPerCaseFirst = (text: string): string => {
  if (!text) {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const safeObject: (obj: any) => any = (obj: any) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName];
    }
  }
  return obj;
};

export const replaceAt = (text: string, index: number, replacement: string) => {
  return text.substr(0, index) + replacement + text.substr(index + 1, text.length - index);
};

export const formatCountDown: (endAt: string) => number = (endAt: string) => {
  if (!endAt) {
    return 0;
  }

  const timeMeet = moment(new Date(endAt)).format('MM-DD-YYYY HH:mm:ss');
  const now = moment(new Date()).format('MM-DD-YYYY HH:mm:ss');
  const ms = moment(timeMeet, 'MM-DD-YYYY HH:mm:ss').diff(moment(now, 'MM-DD-YYYY HH:mm:ss'));
  const d = moment.duration(ms);
  const space = Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss');
  const splitTime = space.split(':');
  return parseInt(splitTime[0]) * 60 * 60 + parseInt(splitTime[1]) * 60 + parseInt(splitTime[2]);
};

export function handleRemindTimeInZoom(startAt, timeEnd) {
  const timeMeet = moment(new Date(startAt)).utc().add(timeEnd, 'minutes').format('MM-DD-YYYY HH:mm:ss');
  const now = moment(new Date()).utc().format('MM-DD-YYYY HH:mm:ss');
  const ms = moment(timeMeet, 'MM-DD-YYYY HH:mm:ss').diff(moment(now, 'MM-DD-YYYY HH:mm:ss'));
  const d = moment.duration(ms);
  const space = Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss');
  const splitTime = space.split(':');
  return (parseInt(splitTime[0]) * 60 * 60 + parseInt(splitTime[1]) * 60 + parseInt(splitTime[2])) * 1000;
}

export const getSpaceTime: (endAt: string, timeForPayment: number) => number = (endAt: string, timeForPayment: number) => {
  const timeMeet = moment(new Date(endAt)).add(timeForPayment, 'minutes').format('MM-DD-YYYY HH:mm:ss');
  const now = moment(new Date()).format('MM-DD-YYYY HH:mm:ss');
  const ms = moment(timeMeet, 'MM-DD-YYYY HH:mm:ss').diff(moment(now, 'MM-DD-YYYY HH:mm:ss'));
  const d = moment.duration(ms);

  let spaceTime = parseInt(Math.floor(d.asHours()) + moment.utc(ms).format('mm'));
  if (spaceTime < 0) {
    spaceTime = 0;
  }
  const timeFinal = spaceTime + 1;
  return timeFinal > timeForPayment ? timeForPayment : timeFinal;
};

export const validateAuction = (endAt: string) => {
  if (!endAt) {
    return false;
  }
  const countDownTime = formatCountDown(endAt);
  return countDownTime > 0;
};

export const formatMessage = (result: any[], isSenderInit = '') => {
  const senderId = store.getState().user.data.id;
  let isSender = false;
  let isReceiver = false;
  if (isSenderInit === TYPE_CHAT.IS_SENDER) {
    isSender = true;
    isReceiver = false;
  } else if (isSenderInit === TYPE_CHAT.IS_RECEIVER) {
    isSender = false;
    isReceiver = true;
  }

  if (result[0].content === 'Conversation started') return [];

  if (result.length > 0 && result[result.length - 1].content === 'Conversation started') {
    result.pop();
  }

  return result.map(item => {
    const { id, content, createdAt, creator } = item;
    const data = {
      _id: id,
      text: content,
      createdAt,
      user: {
        _id: creator?.id,
        name: formatNameUser(creator) || null,
        avatar: creator?.avatarUrl || null,
      },
    };
    // you are sender
    if (creator?.id === senderId && !isSender) {
      isSender = true;
      isReceiver = false;
      data['quickReplies'] = true;
    } else if (creator?.id !== senderId && !isReceiver) {
      isSender = false;
      isReceiver = true;
      data['quickReplies'] = true;
    }

    return data;
  });
};

export const formatTime: (time: Date) => string = (time: any) => {
  try {
    const mTime = moment(time ? time : '');
    return mTime.isValid() ? mTime.format('L [@] hh:mma') : '';
  } catch (error) {
    return '';
  }
};

function localizeAll(string, search) {
  let result = string;
  if (string === '1 days') {
    result = '1 day';
  }
  return result.split(search).join(language(search));
}

export const localizeDuration: (duration: string) => string = (duration: string) => {
  if (!duration) return '';
  const needToLocalizeStrings = ['min', 'mins', 'hr', 'hrs', 'minute', 'minutes', 'hour', 'hours', 'day', 'days'];
  return needToLocalizeStrings.reduce((acc, cur) => localizeAll(acc, cur), duration);
};

export const useLocalizeNameField = () => {
  const locale = getLocalApp();

  const localizeNameField = (data: any) => {
    if (!data?.name) return null;
    switch (locale) {
      case 'es':
        return data.esName || data.name;
      default:
        return data.name;
    }
  };

  return localizeNameField;
};

export const formatHourMinus: (time: string) => string = (time: any) => {
  const mTime = moment(time ? time : '');
  return mTime.isValid() ? mTime.format('hh:mma') : '';
};

export const formatTime24 = (time: any) => {
  let hours = time.getHours();
  let minus = time.getMinutes();

  if (hours < 10) {
    hours = '0' + hours;
  }

  if (minus === 0 || minus < 10) {
    minus = '0' + minus;
  }

  return moment(time).format('L') + ' ' + hours + ':' + minus;
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const convertYYMMDDToMMDD = (time: string) => {
  const day = time.slice(time.lastIndexOf('-') + 1, time.lastIndexOf('-') + 3);
  const month = time.slice(time.indexOf('-') + 1, time.lastIndexOf('-') + 3);
  const date = months[parseInt(month) - 1] + ' ' + parseInt(day);
  return date || '';
};

export const convertMMDDYYToYYMMDD = (day: string): string => {
  return day.replace(/(..).(..).(....)/, '$3-$1-$2');
};

//capitalize all words of a string.
export const capitalizeAllWorks = (s: string) => {
  if (!s || s.length === 0) return '';
  let convertToLowerCase = s.trim().toLowerCase();
  return convertToLowerCase.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

export const activeToggleUserPaused = (pauses: any[]): boolean => {
  let flag = true;
  if (!pauses || pauses.length < 1) flag = true;
  else
    pauses.map(item => {
      if (item.type !== 'self') flag = false;
    });

  return flag;
};

export const isUserPaused = (pauses: any[]): boolean => {
  if (!pauses || pauses.length < 1) return false;
  return true;
};

export const sortArrayByOrder = (arr: any[]) => {
  return arr.sort((a, b) => a.order - b.order);
};

export const useLocalizeGenderName = () => {
  const localizeNameField = useLocalizeNameField();

  const getGenderName = (gender: Gender) => {
    const localizedName = localizeNameField(gender);
    if (localizedName.slice(-1) === 's') {
      return localizedName;
    }
    if (localizedName === 'Mujer') {
      return localizedName + 'es';
    }
    return localizedName + 's';
  };

  return getGenderName;
};

export const formatPrice = (price: number): string => {
  let priceFormattedDefault = `$0.00 ${language('currency')}`;
  if (typeof price !== 'number') return priceFormattedDefault;
  if (price < 0) return priceFormattedDefault;
  return `${currencyFormat(price)} ${language('currency')}`;
};
export const deepCompareSelector = (left, right) => isEqual(left, right);
