import { Task, Product, Supplier } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { User } from '@/models/user'

type CreateTaskDto = {
  name: string
  assignee: User
  dueDate: Date
  description: string
  product: Product
  supplier: Supplier
}
type CreateMultiTaskDto = {
  name: string
  assignee: User
  dueDate: Date
  description: string
  product?: Product[]
  supplier?: Supplier
  productsId?: string[]
  suppliersId?: string[]
}

export class TaskFactory extends Factory<Task> {
  constructor(realm: Realm) {
    super(realm, 'Task')
  }

  fetch(
    option: FetchOptions<Task> & { isReceiveChange: true }
  ): [
    Observable<{
      col: Realm.Collection<Task>
      change: Realm.CollectionChangeSet
    }>,
    Realm.Results<Task>
  ]
  fetch(
    option: FetchOptions<Task>
  ): [Observable<Realm.Collection<Task>>, Realm.Results<Task>]
  fetch({
    descriptor = 'creationDate',
    reverse = true,
    skip = 0,
    limit = -1,
    query = '',
    isReceiveChange,
  }: FetchOptions<Task> = {}): any {
    const results = this._realm
      .objects<Task>('Task')
      .filtered(query ? `deleted = false AND ${query}` : 'deleted = false')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<Task>>(observer => {
      observer.next(
        this.generateResult({
          isReceiveChange,
          data: results,
        })
      )

      results.addListener((col, change) => {
        observer.next(
          this.generateResult({
            isReceiveChange,
            change,
            limit,
            skip,
            data: col,
          })
        )

        return null
      })
    })

    return [subscription, results]
  }

  fetchById(productId: string): [Observable<Task>, Realm.Results<Task>]
  fetchById(
    taskId: string,
    isReceiveChange?: boolean
  ): [
    Observable<{
      col: Task
      change: Realm.CollectionChangeSet
    }>,
    Realm.Results<Task>
  ]
  fetchById(taskId: string, isReceiveChange?: boolean): any {
    const results = this._realm
      .objects<Task>('Task')
      .filtered('deleted = false AND id = $0', taskId)

    const subscription = new Observable<Task>(observer => {
      observer.next(
        this.generateResult({
          isReceiveChange,
          data: results,
          selectOne: true,
        })
      )

      results.addListener((col, change) => {
        observer.next(
          this.generateResult({
            isReceiveChange,
            change,
            data: col,
            selectOne: true,
          })
        )

        return
      })
    })

    return [subscription, results]
  }

  create = (data: CreateTaskDto): Observable<Task> => {
    return new Observable<Task>(observer => {
      try {
        let createdTask = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        const product =
          data.product && data.product.id
            ? this._realm.objectForPrimaryKey('Product', data.product.id)
            : null

        const supplier =
          data.supplier && data.supplier.id
            ? this._realm.objectForPrimaryKey('Supplier', data.supplier.id)
            : null

        this._realm.write(() => {
          try {
            createdTask = this._realm.create<Task>('Task', {
              product,
              supplier,
              id: this.generateId,
              name: data.name,
              assignee: data.assignee,
              dueDate: data.dueDate,
              done: false,
              description: data.description,
              ...this.widthAudit(),
            })
          } catch (e) {}
        })

        if (createdTask) {
          observer.next(createdTask)
          observer.complete()
        } else {
          observer.error()
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  // TODO move to createMulti
  createMultiSupplier = (data: CreateMultiTaskDto): Observable<Task[]> => {
    return new Observable<Task[]>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            data.suppliersId.forEach(supplierId => {
              const supplier: Supplier = this._realm.objectForPrimaryKey(
                'Supplier',
                supplierId
              )

              this._realm.create<Task>('Task', {
                supplier,
                product: null,
                id: this.generateId,
                name: data.name,
                assignee: data.assignee,
                dueDate: data.dueDate,
                done: false,
                description: data.description,
                ...this.widthAudit(),
              })
            })
          } catch (e) {
            errorWhileUpdate = e
          }
        })

        if (!errorWhileUpdate) {
          /**
           * pass data in here if you want return value
           */
          observer.next()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  createMulti = (data: CreateMultiTaskDto): Observable<Task[]> => {
    return new Observable<Task[]>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            data.productsId.forEach(productId => {
              const product: Product = this._realm.objectForPrimaryKey(
                'Product',
                productId
              )

              const supplier =
                product.supplier && product.supplier.id
                  ? this._realm.objectForPrimaryKey(
                      'Supplier',
                      product.supplier.id
                    )
                  : null

              this._realm.create<Task>('Task', {
                product,
                supplier,
                id: this.generateId,
                name: data.name,
                assignee: data.assignee,
                dueDate: data.dueDate,
                done: false,
                description: data.description,
                ...this.widthAudit(),
              })
            })
          } catch (e) {
            errorWhileUpdate = e
          }
        })

        if (!errorWhileUpdate) {
          /**
           * pass data in here if you want return value
           */
          observer.next()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  update = (id: string | Task, data: Partial<Task>): Observable<Task> => {
    return new Observable<Task>(observer => {
      try {
        let updateTask: Task | null | undefined

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Update task
          try {
            updateTask = this._realm.create<Task>(
              'Task',
              {
                id,
                ...data,
                ...this.createWidthAudit({}, true),
              },
              true
            )
          } catch (e) {
            observer.error(e)
          }
        })

        if (updateTask) {
          observer.next(updateTask)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }
}
