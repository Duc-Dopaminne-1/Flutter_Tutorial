import { Company } from '@/models/common'
import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class TeamCompanyFactory extends Factory<Company> {
  constructor(realm: Realm) {
    super(realm, 'Company')
  }

  fetch = (): [Observable<Company>, Realm.Results<Company>] => {
    const results = this._realm.objects<Company>('Company')

    const subscription = new Observable<Company>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Company> => {
          observer.next(col as any)

          return null
        }
      )
    })

    return [subscription, results]
  }
}
