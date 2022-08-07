import { Product, Project } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'

type CreateProjectDto = {
  name: string
}

export class ProjectFactory extends Factory<Project> {
  constructor(realm: Realm) {
    super(realm, 'Project')
  }

  fetch = (
    options: FetchOptions<Project> = {
      descriptor: 'lastUpdatedDate',
      reverse: true,
    }
  ): [Observable<Realm.Results<Project>>, Realm.Results<Project>] => {
    const results = this._realm
      .objects<Project>('Project')
      .filtered('deleted = false')
      .sorted(options.descriptor, options.reverse)

    const subscription = new Observable<Realm.Results<Project>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Project> => {
          observer.next(col as any)

          return null
        }
      )
    })

    return [subscription, results]
  }

  fetchWithId = (
    projectId: string
  ): [Observable<Realm.Results<Project>>, Realm.Results<Project>] => {
    const results = this._realm
      .objects<Project>('Project')
      .filtered('deleted = false AND id = $0', projectId)

    const subscription = new Observable<Realm.Results<Project>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Project> => {
          observer.next(col[0] as any)

          return null
        }
      )
    })

    return [subscription, results]
  }

  create = (data: CreateProjectDto): Observable<Project> => {
    return Observable.create(observer => {
      try {
        let createdProject = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            // Create project
            createdProject = this._realm.create<Project>('Project', {
              id: this.generateId,
              name: data.name,
              ...this.createWidthAudit(),
            })
          })
        } catch (e) {}

        if (createdProject) {
          observer.next(createdProject)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  fetchProductFromProject({
    project = null,
    projectId = null,
  }: {
    project?: Project
    projectId?: string
  }): [Observable<Realm.Results<Product>>, Realm.Results<Product>] {
    const results = project
      ? project // The 'project' already has linkingObjects so we can just get linked object instead of finding objectForPrimaryKey
          .linkingObjects('Product', 'projects')
          .filtered('deleted = false')
          .sorted('creationDate', true)
      : this._realm
          .objectForPrimaryKey('Project', projectId)
          .linkingObjects('Product', 'projects')
          .filtered('deleted = false')
          .sorted('creationDate', true)

    const subscription = new Observable<Realm.Results<Product>>(observer => {
      if (!this._realm.isInTransaction) {
        results.addListener(
          (col): Realm.CollectionChangeCallback<Product> => {
            observer.next(col as any)

            return null
          }
        )
      }
    })

    return [subscription, results as any]
  }

  delete = (id: string): Observable<Project> => {
    return Observable.create(observer => {
      try {
        let deletedProject = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            // Delete project
            deletedProject = this._realm.create<Project>(
              'Project',
              {
                id,
                deleted: true,
                ...this.widthAudit({}, 'delete'),
              },
              true
            )
          })
        } catch (e) {}

        if (deletedProject) {
          observer.next(deletedProject)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
