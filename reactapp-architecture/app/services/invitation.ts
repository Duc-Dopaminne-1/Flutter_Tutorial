import { User } from '@/models/common'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Invitation } from '@/models/team'

export class InvitationFactory extends Factory<User> {
  constructor(realm: Realm) {
    super(realm, 'Invitation')
  }

  fetch = (): [
    Observable<Realm.Collection<Invitation>>,
    Realm.Results<Invitation>
  ] => {
    const results = this._realm.objects<Invitation>('Invitation')

    const subscription = new Observable<Realm.Collection<Invitation>>(
      observer => {
        results.addListener(
          (col): Realm.CollectionChangeCallback<Invitation> => {
            observer.next(col)

            return null
          }
        )
      }
    )

    return [subscription, results]
  }
}
