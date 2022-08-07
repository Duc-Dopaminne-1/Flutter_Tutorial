import { Category, Product } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

type CreateCategoryDto = {
  name: string
}

export class CategoryFactory extends Factory<Category> {
  constructor(realm: Realm) {
    super(realm, 'Category')
  }

  fetch = (
    options: FetchOptions<Category> = {
      descriptor: 'name',
      reverse: false,
    }
  ): [Observable<Realm.Collection<Category>>, Realm.Results<Category>] => {
    const results = this._realm
      .objects<Category>('Category')
      .filtered('deleted = false')
      .sorted(options.descriptor, options.reverse)

    const subscription = new Observable<Realm.Collection<Category>>(
      observer => {
        results.addListener(
          (col): Realm.CollectionChangeCallback<Category> => {
            observer.next(col)

            return null
          }
        )
      }
    )

    return [subscription, results]
  }

  fetchById = (categoryId: string): Observable<Category> => {
    return Observable.create(observer => {
      try {
        if (this._realm && categoryId) {
          const results = this._realm
            .objects<Category>('Category')
            .filtered('deleted = false AND id = $0', categoryId)

          results.subscribe()
          results.addListener(
            (col): Realm.CollectionChangeCallback<Category> => {
              observer.next(col[0])

              return null
            }
          )
        } else {
          observer.error('Missing category id')
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  create = (
    data: CreateCategoryDto,
    isUpdateToRealm = false,
    idUpdate = ''
  ): Observable<Category> => {
    return Observable.create(observer => {
      try {
        let createdCategory = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create category
          createdCategory = this._realm.create<Category>('Category', {
            id: this.generateId,
            name: data.name,
            ...this.widthAudit(),
          })

          if (isUpdateToRealm && idUpdate) {
            const updatedProduct = this._realm.create<Product>(
              'Product',
              {
                id: idUpdate,
                category: createdCategory,
                ...this.widthAudit({}, 'update'),
              },
              true
            )
          }
        })

        if (createdCategory) {
          observer.next(createdCategory)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  createAndUpdateForMultiProduct = (
    data: CreateCategoryDto,
    productsId: string[]
  ): Observable<Category> => {
    return Observable.create(observer => {
      try {
        let createdCategory = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create category
          createdCategory = this._realm.create<Category>('Category', {
            id: this.generateId,
            name: data.name,
            ...this.widthAudit(),
          })

          productsId.forEach(productId => {
            const product: Product = this._realm.objectForPrimaryKey(
              'Product',
              productId
            )

            product.category = createdCategory
          })
        })

        if (createdCategory) {
          observer.next(createdCategory)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
