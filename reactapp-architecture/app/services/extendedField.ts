import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Product, Sample } from '@/models/team'

export class ExtendedFieldFactory extends Factory<any> {
  constructor(realm: Realm) {
    super(realm, 'ExtendedField')
  }

  update = (
    id: string,
    extendFieldDefinition: any,
    value: string,
    product: Product
  ): Observable<Product> => {
    return new Observable<Product>(observer => {
      try {
        let updatedExtendedField = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          if (id.length <= 0) {
            // const createExtendedField = this._realm.create('ExtendedField', {
            //   id: this.generateId,
            //   definition: extendFieldDefinition,
            //   value,
            // })
            const createExtendedField = {
              value,
              id: this.generateId,
              definition: extendFieldDefinition,
            }

            updatedExtendedField = this._realm.create(
              'Product',
              {
                id: product.id,
              },
              true
            )

            updatedExtendedField.extendedFields.push(createExtendedField)
          } else {
            updatedExtendedField = this._realm.create(
              'ExtendedField',
              {
                id,
                value,
              },
              true
            )
          }
        })

        if (updatedExtendedField) {
          observer.next(updatedExtendedField)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateSample = (
    id: string,
    extendFieldDefinition: any,
    value: string,
    sample: Sample
  ): Observable<Sample> => {
    return new Observable<Sample>(observer => {
      try {
        let updatedExtendedField = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          if (id.length <= 0) {
            const createExtendedField = {
              value,
              id: this.generateId,
              definition: extendFieldDefinition,
            }

            updatedExtendedField = this._realm.create(
              'Sample',
              {
                id: sample.id,
              },
              true
            )

            updatedExtendedField.extendedFields.push(createExtendedField)
          } else {
            updatedExtendedField = this._realm.create(
              'ExtendedField',
              {
                id,
                value,
              },
              true
            )
          }
        })

        if (updatedExtendedField) {
          observer.next(updatedExtendedField)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }
}
