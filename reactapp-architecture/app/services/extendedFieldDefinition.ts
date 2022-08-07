import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class ExtendedFieldDefinitionFactory extends Factory<any> {
  constructor(realm: Realm) {
    super(realm, 'ExtendedFieldDefinition')
  }

  fetch(type: string): any {
    const results = this._realm
      .objects<any>('ExtendedFieldDefinition')
      .filtered(`target = "${type}"`)
      .sorted('order', false)

    const subscription = new Observable<Realm.Collection<any>>(observer => {
      results.addListener(col => {
        observer.next(col)
        observer.complete()
        return
      })
    })

    return [subscription, results]
  }
}
