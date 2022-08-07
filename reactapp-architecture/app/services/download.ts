import { User } from '@/models/common'
import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class DownloadFactory extends Factory<any> {
  constructor(realm?: Realm) {
    super(realm)
  }

  reconnectUser = (): [Observable<any>, Realm.Results<any>] => {
    const results = this._realm.objects<User>('User')

    const subscription = new Observable<any>(observer => {
      results.subscribe('User').addListener(
        (col): Realm.CollectionChangeCallback<any> => {
          observer.next(col as any)
          return null
        }
      )
    })

    return [subscription, results]
  }
}
