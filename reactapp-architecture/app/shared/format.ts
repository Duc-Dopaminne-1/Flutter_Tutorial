import { curry } from 'ramda'
import getSymbolFromCurrency from 'currency-symbol-map'
export type CurrencyVal = number | string

export const addSuffix = curry(
  (unit: string, value: CurrencyVal, spacer: string = ' ') => {
    if (!value && value !== 0) {
      return ''
    }

    return value + spacer + unit
  }
)

export const addPrefix = curry(
  (unit: string, value: CurrencyVal, spacer: string = ' ') => {
    if (!value && value !== 0) {
      return ''
    }

    return unit + spacer + value
  }
)

export const getCurrencySymbol = (abbreviation: string = 'USD') => {
  return getSymbolFromCurrency(abbreviation)
}

export const addCurrencySymbol = (abbreviation: string = 'USD') => (
  value: CurrencyVal,
  spacer: string = ' '
) => {
  const currencySymbol = getCurrencySymbol(abbreviation) || abbreviation

  return addPrefix(currencySymbol, value, spacer)
}
