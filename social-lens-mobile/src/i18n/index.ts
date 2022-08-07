import I18n, { getLanguages } from 'react-native-i18n'
import enLocale from './locales/en'
import cnLocale from './locales/es'

I18n.fallbacks = true

export let languageUSer = 'en'

I18n.translations = {
  en: enLocale,
  es: cnLocale,
}

I18n.defaultLocale = 'en'

getLanguages().then(languages => {

  if(languages[0].split('-')[0] !== 'en' && languages[0].split('-')[0] !== 'es') {
    languageUSer = 'en'
    I18n.defaultLocale = 'en'
    return
  }

  languageUSer = languages[0].split('-')[0]
  I18n.defaultLocale = languages[0]
})

export default I18n
