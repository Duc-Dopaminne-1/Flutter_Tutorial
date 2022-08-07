import { User } from '@/models/common'
import { AppSubscription } from '@/services/subscription'
import Realm from 'realm'
import v4 from 'uuid/v4'
import { openSchema, SchemaConfig } from '@/services/api'

type CreateWithAudit = {
  user?: User
  date?: Date
  deleted?: boolean
}

export type FetchOptions<T> = {
  descriptor?: keyof T
  reverse?: boolean
  skip?: number
  limit?: number
  query?: string
  isReceiveChange?: boolean
  args?: any
}

// @ts-ignore
export abstract class Factory<T> extends AppSubscription<T> {
  protected static _currentUserData: User
  protected _realm: Realm
  protected _change = {
    deletions: [],
    insertions: [],
    modifications: [],
    newModifications: [],
    oldModifications: [],
  }

  protected constructor(realm?: Realm, className?: string) {
    super(realm, className)
    this._realm = realm
  }

  static injectCurrentUser(currentUser: User) {
    Factory._currentUserData = currentUser
  }

  static user() {
    const userRealmData = Realm.Sync.User.current
    return userRealmData ? userRealmData : { identity: '' }
  }

  protected generateWithReceiveChange({
    isReceiveChange,
    selectOne,
    change,
    data,
    isDeleteLocal,
  }: any) {
    if (isReceiveChange) {
      return {
        isDeleteLocal,
        change,
        col: selectOne ? data[0] : data,
      }
    }

    return selectOne ? data[0] : data
  }

  protected generateResult({
    isReceiveChange,
    limit = -1,
    skip = 0,
    change = this._change,
    data = [],
    selectOne = false,
    isDeleteLocal = false,
  }: any) {
    if (selectOne) {
      return this.generateWithReceiveChange({
        isReceiveChange,
        change,
        data,
        selectOne,
        isDeleteLocal,
      })
    }

    if (skip >= 0) {
      const results = limit >= 0 ? data.slice(skip, limit) : data
      return this.generateWithReceiveChange({
        isDeleteLocal,
        isReceiveChange,
        change,
        data: results,
      })
    }

    return data
  }

  protected get generateId() {
    return v4()
  }

  protected get user() {
    return Realm.Sync.User.current
  }

  protected get userData() {
    return (
      this._realm.objectForPrimaryKey<User>('User', this.user.identity) ||
      Factory._currentUserData
    )
  }

  // abstract fetch(options: FetchOptions<T>): Observable<Realm.Results<T>>
  //
  // abstract fetchById(id: string): Observable<T>
  //
  // abstract create(data: any): Observable<T>

  protected openSchema = (config?: SchemaConfig) => {
    return openSchema({
      ...config,
      user: this.user,
    })
  }

  protected createWidthAudit = (
    { user = this.userData, date = new Date() }: CreateWithAudit = {},
    update = false
  ) => {
    if (update) {
      return {
        lastUpdatedBy: user,
        lastUpdatedDate: date,
      }
    }

    return {
      creationDate: date,
      createdBy: user,
      deletedBy: null,
      deletionDate: null,
      lastUpdatedBy: user,
      lastUpdatedDate: date,
      deleted: false,
    }
  }

  protected widthAudit = (
    { user = this.userData, date = new Date() }: CreateWithAudit = {},
    type: 'create' | 'update' | 'delete' = 'create'
  ) => {
    if (type === 'delete') {
      return {
        lastUpdatedBy: user,
        lastUpdatedDate: date,
        deletedBy: user,
        deletionDate: date,
        deleted: true,
      }
    }

    if (type === 'update') {
      return {
        lastUpdatedBy: user,
        lastUpdatedDate: date,
      }
    }

    return {
      creationDate: date,
      createdBy: user,
      deletedBy: null,
      deletionDate: null,
      lastUpdatedBy: user,
      lastUpdatedDate: date,
      deleted: false,
    }
  }
}
