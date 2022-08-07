import { User } from '@/models/common'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Invitation } from '@/models/team'

export class UserFactory extends Factory<User> {
  private _data: Realm.Collection<User>
  private _userRealm: Realm

  constructor(realm?: Realm) {
    super(realm)
  }

  get data() {
    return this._data
  }

  get info() {
    return this.userData
  }

  get current() {
    return this.user
  }

  set realm(value: Realm) {
    this._userRealm = value
  }

  fetch = ({
    descriptor = 'firstName',
    reverse = false,
    skip = 0,
    limit = -1,
  }: FetchOptions<User> = {}): [
    Observable<Realm.Collection<User>>,
    Realm.Results<User>
  ] => {
    const results = this._realm
      .objects<User>('User')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<User>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<User> => {
          if (skip >= 0 && limit > 0) {
            observer.next(col.slice(skip, limit) as any)
          } else {
            observer.next(col)
          }

          return null
        }
      )
    })

    return [subscription, results]
  }

  fetchById = (userId: string): [Observable<User>, Realm.Results<User>] => {
    const results = this._realm
      .objects<User>('User')
      .filtered('id = $0', userId)

    const subscription = new Observable<User>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<User> => {
          observer.next(col[0])

          return null
        }
      )
    })

    return [subscription, results]
  }

  fetchFromUser = (): [Observable<User>, Realm.Results<User>] => {
    const results = this._userRealm.objects<User>('User')

    const subscription = new Observable<User>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<User> => {
          observer.next(col[0] as any)
          return null
        }
      )
    })

    return [subscription, results]
  }

  updateToUser(id: string, data: any): Observable<User> {
    return new Observable<User>(observer => {
      try {
        let updateUser = null

        if (!this._userRealm) {
          observer.error(`Realm User property is null`)
          return
        }

        try {
          this._userRealm.write(() => {
            updateUser = this._userRealm.create<User>(
              'User',
              {
                id,
                ...data,
              },
              true
            )
          })
        } catch (e) {}

        if (updateUser) {
          observer.next(updateUser)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
