import { Company, Team, User } from '@/models/common'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import TeamSchema from 'showsourcing-schema/team'
import { Project, Sample } from '@/models/team'

export class TeamRealmFactory extends Factory<Team> {
  constructor(realm: Realm) {
    super(realm, 'Team')
  }

  fetchTeamById = (teamId: string): [Observable<Team>, Realm.Results<Team>] => {
    const results = this._realm
      .objects<Team>('Team')
      .filtered('id = $0', teamId)

    const subscription = new Observable<Team>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Team> => {
          observer.next(col[0] as any)
          return null
        }
      )
    })

    return [subscription, results]
  }
}
