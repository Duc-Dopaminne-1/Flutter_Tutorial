import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Booth } from '@/models/global'

export class GlobalBoothFactory extends Factory<Booth> {
  constructor(realm: Realm) {
    super(realm, 'Booth')
  }

  fetchById = (
    boothId: string
  ): [Observable<Realm.Collection<Booth>>, Realm.Results<Booth>] => {
    const results = this._realm
      .objects<Booth>('Booth')
      .filtered('id = $0', boothId)

    const subscription = new Observable<Realm.Collection<Booth>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Booth> => {
          observer.next(col)

          return null
        }
      )
    })

    return [subscription, results]
  }
}
