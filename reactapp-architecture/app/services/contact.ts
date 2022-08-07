import { Image } from '@/models/common'
import { Contact, Supplier } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Source } from '@/stores/imageStore3'
import { isEmpty, pathOr } from 'ramda'

type UpsertContactDto = Partial<Contact> & {
  imageData?: Source
}

export class ContactFactory extends Factory<Contact> {
  constructor(realm: Realm) {
    super(realm, 'Contact')
  }

  fetch = ({
    descriptor = 'creationDate',
    reverse = true,
    skip = 0,
    limit = -1,
    query = '',
    args = {},
  }: FetchOptions<Contact> = {}): [
    Observable<Realm.Collection<Contact>>,
    Realm.Results<Contact>
  ] => {
    const baseQuery = `deleted = false AND supplier.id = "${args.supplierId}"`
    const results = this._realm
      .objects<Contact>('Contact')
      .filtered(query ? `${baseQuery} AND ${query}` : baseQuery)
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<Contact>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Contact> => {
          if (skip >= 0 && limit > 0) {
            observer.next(col.slice(skip, limit) as any)
          } else {
            observer.next(col)
          }

          return null
        }
      )
    })

    return [subscription, results]
  }

  fetchById = (
    productId: string
  ): [Observable<Contact>, Realm.Results<Contact>] => {
    const results = this._realm
      .objects<Contact>('Contact')
      .filtered('deleted = false AND id = $0', productId)

    const subscription = new Observable<Contact>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Contact> => {
          observer.next(col[0])

          return null
        }
      )
    })

    return [subscription, results]
  }

  upsert = (id: string, data: UpsertContactDto): Observable<Contact> => {
    return new Observable<Contact>(observer => {
      try {
        let createdContact = null

        if (isEmpty(data)) {
          observer.error(`Data is null`)
          return
        }

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          const date = new Date()
          const properties = {
            ...data,
            id: id || this.generateId,
            name: data.name,
            ...this.widthAudit({}, id ? 'update' : 'create'),
          }

          let businessCardImage = null

          // FIXME: error id image have been created before
          if (data.imageData && data.imageData[0]) {
            const idImage = pathOr('', ['id'], data.imageData[0])
            const base64 = pathOr('', ['base64'], data.imageData[0])

            try {
              businessCardImage = this._realm.create<Image>('Image', {
                id: idImage,
                orientation: 0,
                imageType: 'Photo',
                creationDate: date,
                lastUpdatedDate: date,
                fileName: `${idImage}.png`,
                data: base64,
              })
            } catch (e) {}
          }

          // Get supplier
          if (data && data.supplier && data.supplier.id) {
            const supplier = this._realm
              .objects<Supplier>('Supplier')
              .filtered('deleted = false AND id = $0', data.supplier.id)

            properties.supplier = supplier[0]
          }

          try {
            // Upsert contact
            createdContact = this._realm.create<Contact>(
              'Contact',
              properties,
              !!id
            )

            if (businessCardImage) {
              createdContact.businessCardImage = businessCardImage
            }
          } catch (e) {}
        })

        if (createdContact) {
          observer.next(createdContact)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }
}
