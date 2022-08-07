import { Observable } from 'rxjs'
import { CacheResult } from '@/locals/models/cache-result'

export class CacheFactory {
  private _realm: Realm = null

  set realm(realm: Realm) {
    this._realm = realm
  }

  fetch(): [
    Observable<Realm.Collection<CacheResult>>,
    Realm.Results<CacheResult>
  ] {
    const results = this._realm.objects<CacheResult>('CacheResult')

    const subscription = new Observable<Realm.Collection<CacheResult>>(
      observer => {
        results.addListener(
          (col): Realm.CollectionChangeCallback<CacheResult> => {
            observer.next(col)

            return null
          }
        )
      }
    )

    return [subscription, results]
  }

  generateQuery(id: string | string[]) {
    if (Array.isArray(id)) {
      return id.length > 0
        ? id.map(id => `id = "${id}"`).join(' OR ')
        : `id = ""`
    }

    return `id = "${id}"`
  }

  sortByListId(
    data: Realm.Collection<CacheResult>,
    listId?: string | string[]
  ) {
    if (!listId || !Array.isArray(listId)) {
      return data
    }

    if (!data) return []

    const arr = []

    for (let i = 0; i < listId.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (listId[i] === data[j].id) {
          arr.push(data[j])
          break
        }
      }
    }

    return arr as any
  }

  fetchById(
    id: string | string[]
  ): [Observable<CacheResult[]>, Realm.Results<CacheResult>] {
    const query = this.generateQuery(id)

    const results = this._realm
      .objects<CacheResult>('CacheResult')
      .filtered(query)

    const subscription = new Observable<CacheResult[]>(observer => {
      observer.next(this.sortByListId(results, id))

      results.addListener(col => {
        observer.next(this.sortByListId(col, id))

        return null
      })
    })

    return [subscription, results]
  }

  update(data: Partial<CacheResult>): Observable<CacheResult> {
    return new Observable<CacheResult>(observer => {
      try {
        let createdData = null

        if (!this._realm) return null

        this._realm.write(() => {
          createdData = this._realm.create<CacheResult>(
            'CacheResult',
            {
              ...data,
            },
            true
          )
        })

        observer.next(createdData)
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  delete(row: CacheResult): Observable<boolean>
  delete(id: string): Observable<boolean>
  delete(rowOrId: any): Observable<boolean> {
    return new Observable<boolean>(observer => {
      try {
        this._realm.write(() => {
          const data =
            typeof rowOrId === 'string'
              ? this._realm.objects('CacheResult').filtered('id = $0', rowOrId)
              : rowOrId

          this._realm.delete(data)
        })

        observer.next(true)
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }
}
