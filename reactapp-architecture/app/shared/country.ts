import I18n from '@/i18n'
import countries from '@/i18n/countries/en'
import { isNil } from 'ramda'

export type IteratorCountry = {
  id: string
  name: string
}

export class SafeCountry {
  static getCountryName(id: string): string {
    const name = I18n.t(id, { defaultValue: id })

    return !isNil(name) ? name : ''
  }

  static data(): Realm.Collection<IteratorCountry> {
    return Object.keys(countries).map(key => {
      return {
        id: key,
        name: I18n.t(key),
      }
    }) as any
  }
}
