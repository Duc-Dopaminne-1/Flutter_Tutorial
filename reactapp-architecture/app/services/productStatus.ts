import { Product, ProductStatus } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import { sortBy } from 'lodash'
import Realm from 'realm'
import { Observable } from 'rxjs'
import I18n from '@/i18n'

type CreateProductStatusDto = Readonly<{
  status: ProductStatus
}>

export class ProductStatusFactory extends Factory<ProductStatus> {
  private _sortData: Realm.Results<ProductStatus>

  constructor(realm: Realm) {
    super(realm, 'ProductStatus')
  }

  get sortData() {
    return this._sortData
  }

  fetch = ({
    descriptor = 'name',
    reverse = true,
    skip = 0,
    limit = -1,
  }: FetchOptions<ProductStatus> = {}): [
    Observable<Realm.Collection<ProductStatus>>,
    Realm.Results<ProductStatus>
  ] => {
    const results = this._realm
      .objects<ProductStatus>('ProductStatus')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<ProductStatus>>(
      observer => {
        results.addListener(
          (col): Realm.CollectionChangeCallback<ProductStatus> => {
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

  getDatFromId = (data: Realm.Results<ProductStatus>, id: string) => {
    if (!id) return null

    return data.find(item => item.id === id)
  }

  sortManually = (
    col: Realm.Collection<ProductStatus>
  ): Realm.Collection<ProductStatus> => {
    const sort = sortBy(col, ['step'])

    // @ts-ignore
    this._sortData = sort
    return sort as any
  }

  transformData = (
    col: Realm.Collection<ProductStatus>,
    options: { skip: number; limit: number }
  ): Realm.Collection<ProductStatus> => {
    const sortedData =
      this.sortManually(col).slice(options.skip, options.limit) || []

    return sortedData as any
  }

  update = (
    id: string,
    data: {
      status: ProductStatus
    }
  ): Observable<ProductStatus> => {
    return new Observable(observer => {
      try {
        let updatedProduct = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            // Create supplier
            updatedProduct = this._realm.create<Product>(
              'Product',
              {
                id,
                status: data.status,
                ...this.widthAudit({}, 'update'),
              },
              true
            )
          })
        } catch (e) {}

        if (updatedProduct) {
          observer.next(updatedProduct)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateStatusMultiProduct = (productsId: string[], status: ProductStatus) => {
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
              productsId.forEach(productId => {
                const product: Product = this._realm.objectForPrimaryKey(
                  'Product',
                  productId
                )

                product.status = status
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
