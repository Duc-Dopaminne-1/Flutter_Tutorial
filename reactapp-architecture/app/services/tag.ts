import { Tag } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

type CreateTagDto = {
  name: string
}

export class TagFactory extends Factory<Tag> {
  constructor(realm: Realm) {
    super(realm, 'Tag')
  }

  fetch = (
    options: FetchOptions<Tag> = {
      descriptor: 'name',
      reverse: false,
    }
  ): [Observable<Realm.Results<Tag>>, Realm.Results<Tag>] => {
    const results = this._realm
      .objects<Tag>('Tag')
      .filtered('deleted = false')
      .sorted(options.descriptor, options.reverse)

    const subscription = new Observable<Realm.Results<Tag>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Tag> => {
          observer.next(col as any)

          return null
        }
      )
    })

    return [subscription, results]
  }

  create = (data: CreateTagDto): Observable<Tag> => {
    return Observable.create(observer => {
      try {
        let createdTag = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create tag
          createdTag = this._realm.create<Tag>('Tag', {
            id: this.generateId,
            name: data.name,
            ...this.createWidthAudit(),
          })
        })

        if (createdTag) {
          observer.next(createdTag)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
