import { Linking } from 'react-native';
import { emailRegex } from '@src/constants/regex';

export function getUrlFromString(str = '') {
  const matches = str.match(/\bhttps?:\/\/\S+/gi);
  return matches;
}

export async function canOpenLink(url: string) {
  return await Linking.canOpenURL(url);
}

export function openLink(url: string) {
  Linking.canOpenURL(url).then(isValid => {
    if (isValid) {
      Linking.openURL(url);
    }
  });
}

export function openSMS(phoneNumber: string) {
  Linking.openURL(`sms:${phoneNumber}?body=`);
}

export function openEmail(email: string) {
  Linking.openURL(`mailto:${email}`);
}

export function openCallDial(phoneNumber: string) {
  Linking.openURL(`tel:${phoneNumber}`);
}

export function removeDuplicate(arr: string[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

export function isEmailAddress(email: string) {
  return emailRegex.test(email);
}
