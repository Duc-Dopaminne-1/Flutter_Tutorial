import { useCallback, useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import I18n from 'i18n-js';
import moment from 'moment';
import 'moment/min/locales';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import enLocale from './locales/en';
import viLocale from './locales/vi';
import esLocale from './locales/es';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import { get, set } from '@/services/storage';
import { LOCALE } from '@/constants/app';
import { changeLocale } from '@/redux/app/actions';
import NavigationActionsService from '@/navigation/navigation';

I18n.fallbacks = true;

I18n.translations = {
  en: enLocale,
  vi: viLocale,
  es: esLocale,
};

export const supportedLanguages = ['en', 'es'];
export const languagesCodeHighPriority = ['en', 'es', 'fr'];

export const dateFormatByLocale = {
  MDY: ['en'],
  DMY: ['es', 'vi'],
};

export const language = (text = '', param: any = {}) => {
  return I18n.t(text, param);
};

export const changeLocaleLocal = (locale: string) => {
  I18n.locale = locale;
  moment.locale(locale);
  set(LOCALE, locale);
};

export const languageApp = () => {
  const languages = RNLocalize.getLocales();
  if (languages && languages.length > 0 && supportedLanguages.includes(languages[0].languageCode)) {
    return languages[0].languageCode;
  }
  return supportedLanguages[0];
};

export const I18nProvider = ({ children }) => {
  const dispatch = useDispatch();
  const locale = useSelector((state: RootState) => state.app.locale);

  const initLocale = useCallback(async () => {
    const persistedLocale = await get(LOCALE);
    if (persistedLocale && supportedLanguages.includes(persistedLocale)) {
      dispatch(changeLocale(persistedLocale));
    } else {
      const bestLocale = RNLocalize.findBestAvailableLanguage(supportedLanguages)?.languageTag || supportedLanguages[0];
      dispatch(changeLocale(bestLocale));
    }
  }, []);

  useEffect(() => {
    initLocale();
  }, []);

  useEffect(() => {
    if (locale) {
      changeLocaleLocal(locale);
      NavigationActionsService.loadAppData();
    }
  }, [locale]);
  return children;
};
