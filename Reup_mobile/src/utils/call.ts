import { Linking } from 'react-native';
import { isAndroid } from '.';

const createError = (msg = '') => Promise.reject(new Error(msg));

const openLink = (url: string) => {
  return Linking.canOpenURL(url).then(canOpen => {
    if (!canOpen) {
      return createError(`invalid URL provided: ${url}`);
    }
    return Linking.openURL(url).catch(err => Promise.reject(err));
  });
};

export function openMail(sendTo: string, subject = '', body = '') {
  Linking.openURL(`mailto:${sendTo}?subject=${subject}&body=${body}`);
}

function getSMSDivider(): string {
  return !isAndroid() ? '&' : '?';
}

export function openSmsUrl(phone: string, body: string): Promise<any> {
  return openLink(`sms:${phone}${getSMSDivider()}body=${body}`);
}

export function isValidPhoneNumber(number: string) {
  const phoneno = /^\d{10}$/;
  if (number.match(phoneno)) {
    return true;
  }
  return false;
}

export const call = (args = {}) => {
  const settings = {
    prompt: true,
    number: 0,
    ...args,
  };

  /**
   * Check number
   * if (!settings.number) { return createError('no number provided') }
   * if (!isString(settings.number)) { return createError('number should be string') }
   * if (!isBool(settings.prompt)) { return createError('prompt should be bool') } *
   */

  const url = `${!isAndroid() && settings.prompt ? 'telprompt:' : 'tel:'}${settings.number}`;

  return openLink(url);
};
