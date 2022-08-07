import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Incoterm } from '@/models/global'

export class GlobalIncoTermFactory extends Factory<Incoterm> {
  constructor(realm: Realm) {
    super(realm, 'Incoterm')
  }

  fetch = (): [
    Observable<Realm.Collection<Incoterm>>,
    Realm.Results<Incoterm>
  ] => {
    const results = this._realm
      .objects<Incoterm>('Incoterm')
      .sorted('name', false)

    const subscription = new Observable<Realm.Collection<Incoterm>>(
      observer => {
        results.addListener(col => {
          observer.next(col)

          return null
        })
      }
    )

    // @ts-ignore
    return [subscription, results]
  }
}
