import { Factory } from '@/services/factory'
import Realm from 'realm'
import {
  Category,
  Project,
  Supplier,
  Tag,
  Event,
  ProductStatus,
} from '@/models/team'

export class CopyProductFactory extends Factory<any> {
  constructor(realm: Realm) {
    super(realm, '')
  }

  fetch = (
    eventId: string,
    supplierId: string,
    categoryId: string,
    listTagId: string[],
    listProjectId: string[],
    statusId: string
  ): any => {
    const eventResult = this._realm
      .objects<Event>('Event')
      .filtered('deleted = false AND id = $0', eventId)

    const supplierResult = this._realm
      .objects<Supplier>('Supplier')
      .filtered('deleted = false AND id = $0', supplierId)

    const categoryResult = this._realm
      .objects<Category>('Category')
      .filtered('deleted = false AND id = $0', categoryId)

    const listTagResult = !listTagId
      ? []
      : listTagId
          .map(tagId => {
            return this._realm
              .objects<Tag>('Tag')
              .filtered('deleted = false AND id = $0', tagId)
          })
          .map(data => data[0])

    const listProjectResult = !listProjectId
      ? []
      : listProjectId
          .map(projectId => {
            return this._realm
              .objects<Project>('Project')
              .filtered('deleted = false AND id = $0', projectId)
          })
          .map(data => data[0])

    const statusResult = this._realm
      .objects<ProductStatus>('ProductStatus')
      .filtered('id = $0', statusId)

    return [
      eventResult[0] ? eventResult[0] : null,
      supplierResult[0] ? supplierResult[0] : null,
      categoryResult[0] ? categoryResult[0] : null,
      listTagResult,
      listProjectResult,
      statusResult[0] ? statusResult[0] : null,
    ]
  }

  fetchSuggest = (
    listCategoryId: string[] = [],
    listSupplierId: string[] = [],
    listTagId: string[] = [],
    listProjectId: string[] = [],
    listEventId: string[] = []
  ): any => {
    /* CATEGORY */
    const listCategoryResult =
      listCategoryId && listCategoryId.length === 0
        ? []
        : listCategoryId
            .map(categoryId => {
              return this._realm
                .objects<Category>('Category')
                .filtered('deleted = false AND id = $0', categoryId)
            })
            .map(data => data[0])
            .filter(data => data)

    /* SUPPLIER */
    const listSupplierResult =
      listSupplierId && listSupplierId.length === 0
        ? []
        : listSupplierId
            .map(supplierId => {
              return this._realm
                .objects<Supplier>('Supplier')
                .filtered('deleted = false AND id = $0', supplierId)
            })
            .map(data => data[0])
            .filter(data => data)

    /* TAG */
    const listTagResult =
      listTagId && listTagId.length === 0
        ? []
        : listTagId
            .map(tagId => {
              return this._realm
                .objects<Tag>('Tag')
                .filtered('deleted = false AND id = $0', tagId)
            })
            .map(data => data[0])
            .filter(data => data)

    /* PROJECT */
    const listProjectResult =
      listProjectId && listProjectId.length === 0
        ? []
        : listProjectId
            .map(projectId => {
              return this._realm
                .objects<Project>('Project')
                .filtered('deleted = false AND id = $0', projectId)
            })
            .map(data => data[0])
            .filter(data => data)

    /* PROJECT */
    const listEventResult =
      listEventId && listEventId.length === 0
        ? []
        : listEventId
            .map(eventId => {
              return this._realm
                .objects<Event>('Event')
                .filtered('deleted = false AND id = $0', eventId)
            })
            .map(data => data[0])
            .filter(data => data)

    return [
      listCategoryResult,
      listSupplierResult,
      listTagResult,
      listProjectResult,
      listEventResult,
    ]
  }
}
