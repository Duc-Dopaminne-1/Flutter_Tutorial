import { Currency } from '@/models/constant'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class CountryFactory extends Factory<Currency> {
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
            observer.next(col)

            return null
          }
        )
      }
    )

    return [subscription, results]
  }
}
