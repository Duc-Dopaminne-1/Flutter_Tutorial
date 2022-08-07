import { changeLanguage } from '../redux/actions/settings';
import checkNumber from '../helpers/checkNumber';
import I18n from 'i18n-js';
import Memoize from 'lodash.memoize';
import moment from 'moment';
import 'moment/min/locales';
import { store } from '../redux/store/configureStore';
import en from './locales/en';
import vi from './locales/vi';

const prefix = 'tpf_sdk_lang';

const translationGetters = {
  vi: {
    [prefix]: {
      ...vi
    }
  },
  en: {
    [prefix]: {
      ...en
    }
  }
};

const regexCheckExist = /^(?=.*\bmissing\b)(?=.*\btranslation\b).*$/g;

export const translate = Memoize(
  (key, config) => {
    try {
      if (Array.isArray(key)) {
        const arr = [...key].filter(ob => {
          if ((ob + '').trim()) {
            return ob;
          }
        });

        const newArr = arr.map(ob => {
          if (checkNumber(ob)) {
            return ob;
          }
          const trans = I18n.t(`${prefix}.${ob}`, config).replace(`${prefix}.`, '');

          if (!trans.match(regexCheckExist)) {
            return trans;
          }

          return ob;
        });

        return newArr.join(' ');
      }

      const textTranslate = I18n.t(`${prefix}.${key}`, config).replace(`${prefix}.`, '');

      if (textTranslate.match(regexCheckExist) || typeof textTranslate === 'object') {
        return key;
      }

      return I18n.t(`${prefix}.${key}`, config).replace(`${prefix}.`, '');
    } catch (error) {
      return key;
    }
  },
  (textTranslate, config) => {
    try {
      return config ? textTranslate + JSON.stringify(config) : textTranslate;
    } catch (error) {
      return textTranslate;
    }
  }
);

export const setI18nConfig = async (lang = '') => {
  const fallback = { languageTag: lang || 'vi' };
  const { languageTag } = fallback;
  I18n.locale = languageTag;
  const translateGlobal = I18n.translations;

  I18n.translations = {
    [languageTag]: {
      ...translateGlobal[languageTag],
      ...translationGetters[languageTag]
    }
  };

  // I18n.translations = {
  //   [languageTag]: translationGetters[languageTag]
  // };

  moment.locale(I18n.locale);
  translate.cache.clear();
};

export const loadLanguage = () => {
  I18n.translations = translationGetters;
};

// Get current app language
export const initLanguge = language => {
  const lang = language || store.getState()?.setting?.lang || '';

  if (lang) {
    setI18nConfig(lang);
  } else {
    const languageCode = 'vi';
    // const locales = RNLocalize.getLocales();
    // const languageCode = locales[0]?.languageCode || '';
    store.dispatch(changeLanguage(languageCode));
    setI18nConfig(languageCode);
  }
};

export default I18n;
