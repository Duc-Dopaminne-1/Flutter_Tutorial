import { Image } from '@/models/common'
import { ImageSize, ImageSizeValue } from '@/shared/image'
import { WorkerDownload } from '@/worker/workerDownload'
import { WorkerFailure } from '@/worker/workerFailure'
import { AsyncPriorityQueue, priorityQueue } from 'async'
import { union } from 'ramda'
import Realm from 'realm'
import { Observable, Subject } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { CacheResult as CacheResultSchema } from '@/locals/schemas/cache-result'
import { CacheResult, ImageLevel } from '@/locals/models/cache-result'
import { CacheFactory } from '@/services/cacheResult'
import { WorkerSystem } from '@/worker/workerSystem'
import {
  CallbackResult,
  Priority,
  Task,
  TaskName,
  TaskType,
} from '@/worker/options'

export type WorkerResult = {
  sourceId?: string
  id: string
  uri: string
  size: ImageSizeValue
  level: ImageLevel
}

export class WorkerCache extends WorkerSystem {
  private _realm: Realm = null
  private _subject: Subject<WorkerResult> = new Subject()
  public _workerDownload: WorkerDownload = new WorkerDownload()
  private _workerFailure: WorkerFailure = new WorkerFailure()
  private _cacheFactory: CacheFactory = new CacheFactory()

  public _queue: AsyncPriorityQueue<Task> = null
  private _queueFnExec: Function[] = []
  private _done: boolean = false

  private readonly ConcurrencyLimit = 5

  protected _buffer: Realm.Collection<CacheResult> = [] as any

  constructor() {
    super()

    // Realm.open({
    //   schema: [CacheResultSchema],
    //   schemaVersion: 14,
    // }).then(realm => {
    //   this._cacheFactory.realm = realm
    // })
  }

  set realm(realm: Realm) {
    this._realm = realm
  }

  observer(
    id: string
  ): [
    Observable<{
      id: string
      url: string
      level: ImageLevel
    }>,
    Realm.Results<CacheResult>
  ]
  observer(
    arrId: string[]
  ): [Observable<Realm.Collection<CacheResult>>, Realm.Results<CacheResult>]
  observer(arrOrId: any): any {
    if (Array.isArray(arrOrId)) {
      return this._cacheFactory.fetchById(arrOrId)
    }

    const [subscription, results] = this._cacheFactory.fetchById(arrOrId)

    const tmp = subscription.pipe(
      map(value => {
        return (
          value[0] || {
            id: '',
            url: '',
            level: 'low',
          }
        )
      })
    )

    return [tmp, results]
  }

  fromCache(id: string): CacheResult {
    return this._buffer.find(value => value.id === id)
  }

  has(id: string, checkImageLevel = true): boolean {
    const data = this.fromCache(id)

    if (checkImageLevel) {
      return !!data && data.level !== 'low'
    }

    return !!data
  }

  delete(row: CacheResult): Observable<boolean>
  delete(id: string): Observable<boolean>
  delete(rowOrId: any): Observable<boolean> {
    return this._cacheFactory.delete(rowOrId)
  }

  clearQueueFnExec() {
    this._queueFnExec = []
  }

  push(col: Image[]): void {
    if (!col) return

    try {
      col.forEach(image => {
        if (!image) return null

        if (image && !image.isValid()) {
          return null
        }

        if (this.has(image.id)) {
          return null
        }

        this._queue.push(
          {
            id: image.id,
            priority: Priority.Received,
            name: TaskName.CacheImage,
            data: image.data ? image.data : image,
            type: image.data ? TaskType.Buffer : TaskType.Url,
          },
          50,
          this.callbackFn
        )
      })
    } catch (e) {}
  }

  callbackFn = (err, data: CallbackResult) => {
    if (err) {
      this._subject.error(err)
    }

    if (data) {
      // this._buffer.get(data.size).set(data.id, data.uri)
      if (!this.has(data.id, false)) {
        this._cacheFactory
          .update({
            id: data.id,
            url: data.uri,
            size: 'XL',
            level: data.level || 'low',
          })
          .subscribe(() => {})
      }

      this._workerDownload.delete(data.id)

      this._subject.next(data)
    }
  }

  init = () => {
    if (!this._realm) {
      return null
    }

    const images = this._realm
      .objects<Image>('Image')
      .filtered('deleted = false')
      .sorted('creationDate', true)

    images.addListener((col, change) => {
      if (change.insertions.length === col.length) {
        return
      }

      const data: any = union(change.modifications, change.insertions).map(
        index => col[index]
      )
      // TODO: Emmit the value has changed to listener

      this.push(data)
    })

    const [subscription] = this._cacheFactory.fetch()

    subscription.pipe(debounceTime(100)).subscribe(data => {
      // console.log('Data was loaded from local')
      this._buffer = data
      this._queueFnExec.forEach(fn => fn())
      this.clearQueueFnExec()
    })
  }

  run = () => {
    this._queue = priorityQueue<Task>(
      async (task, callback: (error: Error, data?: WorkerResult) => void) => {
        try {
          if (this._workerDownload.isProcessing(task.id)) {
            callback(null)
            return
          }

          if (!task.data) {
            callback(null)
            return
          }

          if (task.type === TaskType.Buffer) {
            try {
              this._workerDownload.add(task.id)

              const path = this.path(task.id, ImageSize.XL)

              this.save(path('PUT'), task.data as ArrayBuffer).subscribe(
                () => {
                  callback(null, {
                    id: task.id,
                    uri: path('GET'),
                    size: ImageSize.XL,
                    level: 'low',
                  })
                  this._workerFailure.delete(task.id)
                },
                () => {
                  callback(null)
                }
              )

              return
            } catch (e) {
              this._workerDownload.delete(task.id)
            }
          }

          const image = task.data as Image

          if (image.deleted) {
            callback(null)
            return
          }

          if (!this.isOnline) {
            const path = this.path(image.id, ImageSize.XL)
            const isExists = await this.isExists(path('PUT'))
            const uri = isExists ? path('GET') : ''

            this._workerFailure.add(task.id, task)

            callback(null, {
              uri,
              id: task.id,
              size: ImageSize.XL,
              level: 'low',
            })

            return
          }

          if (task.type === TaskType.Url) {
            // when online
            if (!image.urls || image.urls.length === 0) {
              callback(null)
              return
            }

            switch (task.name) {
              case TaskName.CacheImage: {
                this._workerDownload.add(task.id)

                const path = this.path(image.id, ImageSize.XL)

                this.download(
                  path('PUT'),
                  image.urls[ImageSize.XL].url
                ).subscribe(
                  () => {
                    callback(null, {
                      id: task.id,
                      uri: path('GET'),
                      size: ImageSize.XL,
                      level: 'large',
                    })

                    this._workerDownload.delete(task.id)
                    this._workerFailure.delete(task.id)
                  },
                  () => {
                    this._workerDownload.delete(task.id)
                    this._workerFailure.add(task.id, task)
                    callback(null)
                  }
                )

                return
              }
              default: {
                callback(null)
              }
            }
          }
        } catch (error) {
          // console.log(error.message)
        }
      },
      this.ConcurrencyLimit
    )

    this._queue.drain = () => {
      // console.log('Success')
      this._done = true
    }
  }
}
