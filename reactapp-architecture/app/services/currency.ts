import currencies from '@/i18n/currencies/en'
import { Currency } from '@/models/constant'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class CurrencyFactory extends Factory<Currency> {
  private readonly _constantRealm: Realm

  constructor(constantRealm: Realm) {
    super()
    this._constantRealm = constantRealm
  }

  fetch = (
    options: FetchOptions<Currency> = {
      descriptor: 'name',
      reverse: false,
    }
  ): [Observable<Realm.Collection<Currency>>, Realm.Results<Currency>] => {
    const results = this._constantRealm
      .objects<Currency>('Currency')
      .sorted(options.descriptor, options.reverse)

    const subscription = new Observable<Realm.Collection<Currency>>(
      observer => {
        results.addListener(
          (col): Realm.CollectionChangeCallback<Currency> => {
            if (col.length === 0) {
              observer.next(currencies as any)
            } else {
              observer.next(col)
            }

            return null
          }
        )
      }
    )

    return [subscription, results]
  }

  fetchById = (currencyId: string): Observable<Currency> => {
    return Observable.create(observer => {
      try {
        if (this._constantRealm && currencyId) {
          const results = this._constantRealm
            .objects<Currency>('Currency')
            .filtered('id = $0', currencyId)

          results.subscribe()
          results.addListener(
            (col): Realm.CollectionChangeCallback<Currency> => {
              observer.next(col[0])

              return null
            }
          )
        } else {
          observer.error('Missing currency id')
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
