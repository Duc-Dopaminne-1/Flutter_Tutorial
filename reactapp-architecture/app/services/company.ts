import { Company, ImageUrl, Team, User } from '@/models/common'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class CompanyFactory extends Factory<Company> {
  private _userRealm: Realm
  private _data: Realm.Results<Company>

  constructor(userRealm?: Realm) {
    super(userRealm, 'Company')
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

  fetch = (): [
    Observable<Realm.Collection<Company>>,
    Realm.Results<Company>
  ] => {
    const results = this._userRealm.objects<Company>('Company')

    const subscription = new Observable<Realm.Collection<Company>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Company> => {
          const filterData = col.filter(company => company.name)
          observer.next(filterData as any)

          return null
        }
      )
    })

    return [subscription, results]
  }

  fetchById = (companyId: string): Observable<Company> => {
    return Observable.create(observer => {
      try {
        if (this._userRealm && companyId) {
          const results = this._userRealm
            .objects<Company>('Company')
            .filtered('id = $0', companyId)

          results.addListener(col => {
            const data = Array.from(col)[0]

            observer.next(data)
          })
        } else {
          observer.error('Missing company id')
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  create = (companyName: string, teamName: string): Observable<Team> => {
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
          const createdCompany = this._userRealm.create<Company>('Company', {
            id: this.generateId,
            name: companyName,
          })

          createdTeam = this._userRealm.create<Team>('Team', {
            company: createdCompany,
            id: this.generateId,
            ownerUser: userData,
            name: teamName,
            status: 'pending',
            creationDate: new Date(),
          })
        })

        if (createdTeam) {
          observer.next(createdTeam)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
