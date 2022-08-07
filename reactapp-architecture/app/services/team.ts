import { Company, Team, User } from '@/models/common'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import TeamSchema from 'showsourcing-schema/team'

export class TeamFactory extends Factory<Team> {
  private _userRealm: Realm

  constructor(userRealm?: Realm) {
    super(userRealm, 'Team')
    this.className = 'Team'

    if (userRealm) {
      this._userRealm = userRealm
    }
  }

  set realm(value: Realm) {
    this._userRealm = value
    this.realmValue = value
  }

  addRealm = (userRealm: Realm) => {
    if (userRealm) {
      this._userRealm = userRealm
    } else {
      throw new Error('Missing realm property')
    }
  }

  get userData() {
    return this._userRealm.objectForPrimaryKey<User>('User', this.user.identity)
  }

  open = (teamId: string) => {
    try {
      this.realmValue = this._userRealm

      this._realm = this.openSchema({
        schema: TeamSchema,
        path: `team/${teamId}`,
        partial: true,
      })

      return this._realm
    } catch (e) {
      return e
    }
  }

  fetch = (
    {
      descriptor = 'creationDate',
      reverse = true,
      skip = 0,
      limit = -1,
    }: FetchOptions<Team> = {
      descriptor: 'creationDate',
      reverse: true,
    }
  ): [Observable<Realm.Collection<Team>>, Realm.Results<Team>] => {
    const results = this._userRealm
      .objects<Team>('Team')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<Team>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Team> => {
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

  fetchById = (teamId: string): [Observable<Team>, Realm.Results<Team>] => {
    const results = this._userRealm
      .objects<Team>('Team')
      .filtered('id = $0', teamId)

    const subscription = new Observable<Team>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Team> => {
          observer.next(col[0])

          return null
        }
      )
    })

    return [subscription, results]
  }

  create = (data: { teamName: string; company: Company }): Observable<Team> => {
    return new Observable<Team>(observer => {
      try {
        let createdTeam = null

        if (!this._userRealm) {
          observer.error(`Realm property is null`)
          return
        }

        const userData = this._userRealm.objectForPrimaryKey<User>(
          'User',
          this.user.identity
        )

        this._userRealm.write(() => {
          const properties = {
            id: this.generateId,
            company: data.company,
            ownerUser: userData,
            name: data.teamName,
            status: 'pending',
            creationDate: new Date(),
          }

          createdTeam = this._userRealm.create<Team>('Team', properties)
        })

        observer.next(createdTeam)
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }
}
