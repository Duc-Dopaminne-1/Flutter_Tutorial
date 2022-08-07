import { Comment } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

type CreateCommentDto = {
  text: string
}

export class CommentFactory extends Factory<Comment> {
  constructor(realm: Realm) {
    super(realm, 'Comment')
  }

  fetch = (
    options: FetchOptions<Comment> = {
      descriptor: 'text',
      reverse: false,
    }
  ): [Observable<Realm.Collection<Comment>>, Realm.Results<Comment>] => {
    const results = this._realm
      .objects<Comment>('Comment')
      .filtered('deleted = false')
      .sorted(options.descriptor, options.reverse)

    const subscription = new Observable<Realm.Collection<Comment>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Comment> => {
          observer.next(col)

          return null
        }
      )
    })

    return [subscription, results]
  }

  fetchById = (commentId: string): Observable<Comment> => {
    return Observable.create(observer => {
      try {
        if (this._realm && commentId) {
          const results = this._realm
            .objects<Comment>('Comment')
            .filtered('deleted = false AND id = $0', commentId)

          results.subscribe()
          results.addListener(
            (col): Realm.CollectionChangeCallback<Comment> => {
              observer.next(col[0])

              return null
            }
          )
        } else {
          observer.error('Missing comment id')
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  /**
   *
   * @param data
   */
  create = (data: CreateCommentDto): Observable<Comment> => {
    return Observable.create(observer => {
      try {
        let createdComment = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create comment
          createdComment = this._realm.create<Comment>('Comment', {
            id: this.generateId,
            text: data.text,
            ...this.widthAudit(),
          })
        })

        if (createdComment) {
          observer.next(createdComment)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
