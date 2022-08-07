import { User } from '@/models/common'
import Realm from 'realm'

export class UltiFactory {
  private static _realm: Realm
  private static _userRealm: Realm

  static set realm(value: Realm) {
    this._realm = value
  }

  static set userRealm(value: Realm) {
    this._userRealm = value
  }

  static user() {
    return Realm.Sync.User.current
  }

  static userData() {
    if (UltiFactory._userRealm) {
      return this._userRealm.objectForPrimaryKey<User>(
        'User',
        UltiFactory.user().identity
      )
    }

    if (UltiFactory._realm) {
      return this._realm.objectForPrimaryKey<User>(
        'User',
        UltiFactory.user().identity
      )
    }

    return null
  }
}
