export class RealmObject {
  static defaultObject: Realm.Object = {
    isValid() {
      return true
    },
    objectSchema() {
      return {
        name: '',
        primaryKey: '',
        properties: {},
      }
    },
    linkingObjects() {
      return null
    },
    linkingObjectsCount() {
      return 0
    },
  }
}
