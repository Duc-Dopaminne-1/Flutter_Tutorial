import { Product, ProductStatus, ProductVote } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import { sortBy } from 'lodash'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class ProductVoteFactory extends Factory<ProductVote> {
  constructor(realm: Realm) {
    super(realm, 'ProductVote')
  }

  deleteVote = (id: string): Observable<ProductVote> => {
    return new Observable(observer => {
      try {
        let removeVoteError = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            // Create supplier
            const voteResult = this._realm.objectForPrimaryKey(
              'ProductVote',
              id
            )

            this._realm.delete(voteResult)
          })
        } catch (e) {
          removeVoteError = e
        }

        if (!removeVoteError) {
          observer.next()
        }
      } catch (e) {
        observer.error(e)
        observer.complete()
      }
    })
  }
}
