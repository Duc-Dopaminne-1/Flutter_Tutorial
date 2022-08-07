import i18n from 'i18n-js';
import isEmpty from 'lodash/isEmpty';
import {getLocales} from 'react-native-localize';

import MessageText_vi from './message/vi.json';
import Server_vi from './server/vi.json';
import vi from './vi.json';

i18n.fallbacks = true;

i18n.translations = {
  vi: {
    ...i18n.translations.vi,
    ...Server_vi,
    ...vi,
    ...MessageText_vi,
  },
  en: {
    ...i18n.translations.en,
    ...Server_vi,
    ...vi,
    ...MessageText_vi,
  },
};

export function loadDeviceLocale() {
  const locales = getLocales();
  if (!isEmpty(locales)) {
    return locales[0].languageCode;
  }
  return null;
}

export function getDeviceLocale() {
  const deviceLocale = loadDeviceLocale();
  const languageInfo = getLanguageInfo(deviceLocale);
  const locale = languageInfo.abbr;
  setMainLocaleLanguage(locale);
  return locale;
}

export function setMainLocaleLanguage(language: string, cb = () => {}) {
  i18n.locale = language;
  cb();
}

export function translate(name: string, params = {defaultValue: name}) {
  return i18n.t(name, params);
}

export const languages = [
  {
    label: 'Vietnamese',
    abbr: 'vi',
    lang: 'vi, vi-VN',
    code: 'vi',
  },
  {
    label: 'English',
    abbr: 'en',
    lang: 'en, en-GB',
    code: 'en',
  },
];

const DEFAULT_LANGUAGE_INDEX = 0;
const DEFAULT_LANGUAGE_INFO = languages[DEFAULT_LANGUAGE_INDEX];
i18n.locale = DEFAULT_LANGUAGE_INFO.abbr;

export function getLanguageInfo(language) {
  if (!language) {
    return DEFAULT_LANGUAGE_INFO;
  }
  const langCodes = languages.filter(item => item.abbr === language);
  if (langCodes && langCodes.length) {
    return langCodes[0];
  }

  return DEFAULT_LANGUAGE_INFO;
}

export const getLocale = language => {
  return getLanguageInfo(language).abbr;
};

export const getLanguageCode = language => {
  return getLanguageInfo(language).lang;
};

export const getLanguageCodeShort = language => {
  return getLanguageInfo(language).code;
};
