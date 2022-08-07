import { Supplier, SupplierStatus } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import { sortBy } from 'lodash'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class SuppplierStatusFactory extends Factory<SupplierStatus> {
  private _sortData: Realm.Results<SupplierStatus>

  constructor(realm: Realm) {
    super(realm, 'SupplierStatus')
  }

  get sortData() {
    return this._sortData
  }

  fetch = ({
    descriptor = 'step',
    reverse = false,
    skip = 0,
    limit = -1,
  }: FetchOptions<SupplierStatus> = {}): [
    Observable<Realm.Collection<SupplierStatus>>,
    Realm.Results<SupplierStatus>
  ] => {
    const results = this._realm
      .objects<SupplierStatus>('SupplierStatus')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<SupplierStatus>>(
      observer => {
        results.addListener(
          (col): Realm.CollectionChangeCallback<SupplierStatus> => {
            if (skip >= 0 && limit > 0) {
              const data = this.transformData(col, { skip, limit })
              observer.next(data)
            } else {
              const data = this.sortManually(col)
              observer.next(data)
            }

            return null
          }
        )
      }
    )

    return [subscription, results]
  }

  getDatFromId = (data: Realm.Results<SupplierStatus>, id: string) => {
    if (!id) return null

    return data.find(item => item.id === id)
  }

  sortManually = (
    col: Realm.Collection<SupplierStatus>
  ): Realm.Collection<SupplierStatus> => {
    const sort = sortBy(col, ['step'])

    // @ts-ignore
    this._sortData = sort
    return sort as any
  }

  transformData = (
    col: Realm.Collection<SupplierStatus>,
    options: { skip: number; limit: number }
  ): Realm.Collection<SupplierStatus> => {
    const sortedData =
      this.sortManually(col).slice(options.skip, options.limit) || []

    return sortedData as any
  }

  update = (
    id: string,
    data: {
      status: SupplierStatus
    }
  ): Observable<SupplierStatus> => {
    return new Observable(observer => {
      try {
        let updatedSupplier = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            // Create supplier
            updatedSupplier = this._realm.create<Supplier>(
              'Supplier',
              {
                id,
                status: data.status,
                ...this.widthAudit({}, 'update'),
              },
              true
            )
          })
        } catch (e) {}

        if (updatedSupplier) {
          observer.next(updatedSupplier)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateStatusMultiSupplier = (
    suppliersId: string[],
    status: SupplierStatus
  ) => {
    return new Observable(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            try {
              suppliersId.forEach(supplierId => {
                this._realm.create<Supplier>(
                  'Supplier',
                  {
                    status,
                    id: supplierId,
                    ...this.widthAudit({}, 'update'),
                  },
                  true
                )
              })
            } catch (e) {
              errorWhileUpdate = e
            }
          })
        } catch (e) {}

        if (!errorWhileUpdate) {
          /**
           * pass data in here if you want return value
           */
          observer.next()
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }
}
