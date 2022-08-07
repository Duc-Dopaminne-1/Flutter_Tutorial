import { mergeAll } from 'ramda'
import I18n, { getLanguages } from 'react-native-i18n'
import moment from 'moment/min/moment-with-locales.js'

import enCountries from './countries/en'
import enError from './errors/en'
import enLocale from './locales/en'
import enStatus from './status/en'
import enUnits from './units/en'
import enWeightUnits from './weightUnits/en'

import cnCountries from './countries/cn'
import cnError from './errors/cn'
import cnLocale from './locales/cn'
import cnStatus from './status/cn'
import cnUnits from './units/cn'
import cnWeightUnits from './weightUnits/cn'

I18n.fallbacks = true

/**
 * Change the locale of moment to Chinese if needed
 * Note: import moment lib from 'moment/min/moment-with-locales.js' and not from the 'moment' to make it work properly
 */
if (I18n.currentLocale() === 'zh') {
  moment.locale('zh-cn')
}

I18n.translations = {
  en: mergeAll([
    enLocale,
    enCountries,
    enUnits,
    enWeightUnits,
    enStatus,
    enError,
  ]),
  zh: mergeAll([
    cnLocale,
    cnCountries,
    cnUnits,
    cnWeightUnits,
    cnStatus,
    cnError,
  ]),
}

I18n.defaultLocale = 'en'

// getLanguages().then(languages => {
//   console.log(languages)
//   I18n.defaultLocale = 'cn'
// })

export default I18n
