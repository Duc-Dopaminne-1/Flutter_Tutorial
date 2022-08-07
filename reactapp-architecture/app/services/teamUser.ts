import { User, TeamUser } from '@/models/common'
import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Invitation } from '@/models/team'

export class TeamUserFactory extends Factory<TeamUser> {
  constructor(realm: Realm) {
    super(realm, 'TeamUser')
  }

  fetch(): any {
    const results = this._realm
      .objects<TeamUser>('TeamUser')
      .sorted('user.firstName', false)

    const subscription = new Observable<Realm.Collection<TeamUser>>(
      observer => {
        results.addListener(col => {
          observer.next(col)
          return
        })
      }
    )

    return [subscription, results]
  }

  addTeamMember(email: string, user: User): Observable<Invitation> {
    return new Observable<Invitation>(observer => {
      try {
        let createdTeamMember = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            createdTeamMember = this._realm.create<Invitation>('Invitation', {
              email,
              id: this.generateId,
              inviter: user,
              accessType: 'TeamMember',
              status: 'pending',
            })
          })
        } catch (e) {}

        if (createdTeamMember) {
          observer.next(createdTeamMember)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
