import { Price, PriceMatrix, PriceMatrixRow, Product } from '@/models/team'
import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class PriceMatrixFactory extends Factory<PriceMatrix> {
  constructor(realm: Realm) {
    super(realm)
  }

  /**
   *
   */
  create = (): Observable<PriceMatrix> => {
    return Observable.create(observer => {
      try {
        let createdPriceMatrix = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create price
          // const price = this._realm.create<Price>('Price', {
          //   id: this.generateId,
          //   currency: 'USD',
          //   value: 0,
          //   baseCurrencyValue: 0,
          // })
          const price = {
            id: this.generateId,
            currency: 'USD',
            value: 0,
            baseCurrencyValue: 0,
          }

          // Create priceMatrix row
          // const rows = this._realm.create<PriceMatrixRow>('PriceMatrixRow', {
          //   price,
          //   id: this.generateId,
          //   label: '',
          // })
          const rows = {
            price,
            id: this.generateId,
            label: '',
          }

          // Create priceMatrix
          createdPriceMatrix = this._realm.create<PriceMatrix>('PriceMatrix', {
            id: this.generateId,
            rows: [rows],
          })
        })

        if (createdPriceMatrix) {
          observer.next(createdPriceMatrix)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  createAndUpdateProduct = (productId: string): Observable<PriceMatrix> => {
    return Observable.create(observer => {
      try {
        let createdPriceMatrix = null
        let updatedProduct = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create price
          // const price = this._realm.create<Price>('Price', {
          //   id: this.generateId,
          //   currency: 'USD',
          //   value: 0,
          //   baseCurrencyValue: 0,
          // })
          const price = {
            id: this.generateId,
            currency: 'USD',
            value: 0,
            baseCurrencyValue: 0,
          }

          // Create priceMatrix row
          // const rows = this._realm.create<PriceMatrixRow>('PriceMatrixRow', {
          //   price,
          //   id: this.generateId,
          //   label: '',
          // })
          const rows = {
            price,
            id: this.generateId,
            label: '',
          }

          // Create priceMatrix
          // createdPriceMatrix = this._realm.create<PriceMatrix>('PriceMatrix', {
          //   id: this.generateId,
          //   rows: [rows],
          // })
          createdPriceMatrix = {
            id: this.generateId,
            rows: [rows],
          }

          // update product
          updatedProduct = this._realm.create<Product>(
            'Product',
            {
              id: productId,
              priceMatrix: createdPriceMatrix,
              ...this.createWidthAudit({}, true),
            },
            true
          )
        })

        if (createdPriceMatrix) {
          observer.next(createdPriceMatrix)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  addRow = (
    id: string,
    priceMatrixRows: PriceMatrixRow[],
    currency: string
  ): Observable<PriceMatrix> => {
    return Observable.create(observer => {
      try {
        let updatePriceMatrix = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        // Get user data
        this._realm.write(() => {
          // Create price
          // const price = this._realm.create<Price>('Price', {
          //   currency,
          //   id: this.generateId,
          //   value: 0,
          //   baseCurrencyValue: 0,
          // })
          const price = {
            currency,
            id: this.generateId,
            value: 0,
            baseCurrencyValue: 0,
          }

          // Create priceMatrix
          const row = this._realm.create<PriceMatrixRow>('PriceMatrixRow', {
            price,
            id: this.generateId,
            label: '',
          })

          // Create priceMatrix
          updatePriceMatrix = this._realm.create<PriceMatrix>(
            'PriceMatrix',
            {
              id,
              rows: [...priceMatrixRows].concat(row),
            },
            true
          )
        })

        if (updatePriceMatrix) {
          observer.next(updatePriceMatrix)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  update = (id: string, data: PriceMatrixRow[]): Observable<PriceMatrix> => {
    return Observable.create(observer => {
      try {
        let updatedPriceMatrix = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create priceMatrix
          updatedPriceMatrix = this._realm.create<PriceMatrix>(
            'PriceMatrix',
            {
              id,
              ...data,
            },
            true
          )
        })

        if (updatedPriceMatrix) {
          observer.next(updatedPriceMatrix)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  updateCurrency = (
    data: PriceMatrixRow[],
    currency: string,
    objectMatrixPrice: number
  ): Observable<PriceMatrix> => {
    return Observable.create(observer => {
      try {
        // let updatedPriceMatrix = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        if (!data) {
          observer.error(`Data is null`)
          return
        }

        this._realm.write(() => {
          data[objectMatrixPrice].price.currency = currency
        })

        observer.next('Success')
        observer.complete()
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
