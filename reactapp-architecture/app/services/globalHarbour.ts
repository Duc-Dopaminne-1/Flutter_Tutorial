import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Harbour } from '@/models/global'

export class GlobalHarbourFactory extends Factory<Harbour> {
  constructor(realm: Realm) {
    super(realm, 'Harbour')
  }

  fetch = (): [
    Observable<Realm.Collection<Harbour>>,
    Realm.Results<Harbour>
  ] => {
    const results = this._realm
      .objects<Harbour>('Harbour')
      .sorted('name', false)

    const subscription = new Observable<Realm.Collection<Harbour>>(observer => {
      results.addListener(col => {
        observer.next(col)

        return null
      })
    })

    // @ts-ignore
    return [subscription, results]
  }
}
