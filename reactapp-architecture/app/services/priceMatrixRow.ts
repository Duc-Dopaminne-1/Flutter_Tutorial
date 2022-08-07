import { Price, PriceMatrixRow } from '@/models/team'
import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

type CreatePriceMatrixRowDto = {
  label: string
  price: {
    currency: string
    value: number
    baseCurrencyValue: number
  }
}

export class PriceMatrixRowFactory extends Factory<PriceMatrixRow> {
  constructor(realm: Realm) {
    super(realm)
  }

  /**
   *
   * @param key
   * @param data
   */
  create = (
    key: string,
    data: CreatePriceMatrixRowDto
  ): Observable<PriceMatrixRow> => {
    return Observable.create(observer => {
      try {
        let createdPriceMatrixRow = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        const isLabel = key === 'label'

        this._realm.write(() => {
          // Create price
          const price = this._realm.create<Price>('Price', {
            id: this.generateId,
            currency: !isLabel ? data.price.currency : 'USD',
            value: !isLabel ? data.price.value : 0,
            baseCurrencyValue: 0,
          })

          // Create priceMatrix
          createdPriceMatrixRow = this._realm.create<PriceMatrixRow>(
            'PriceMatrixRow',
            {
              price,
              id: this.generateId,
              label: isLabel ? data.label : '',
            }
          )
        })

        if (createdPriceMatrixRow) {
          observer.next(createdPriceMatrixRow)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  update = (
    id: string | PriceMatrixRow,
    data: Partial<PriceMatrixRow>
  ): Observable<PriceMatrixRow> => {
    return Observable.create(observer => {
      try {
        let updatedPriceMatrixRow = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create priceMatrix
          updatedPriceMatrixRow = this._realm.create<PriceMatrixRow>(
            'PriceMatrixRow',
            {
              id,
              ...data,
            },
            true
          )
        })

        if (updatedPriceMatrixRow) {
          observer.next(updatedPriceMatrixRow)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
