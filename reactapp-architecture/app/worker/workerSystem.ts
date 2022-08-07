import { StatusCode } from '@/services/api'
import { Network } from '@/services/network'
import { arrayBufferToString, ImageSizeValue } from '@/shared/image'
import { curry } from 'ramda'
import { Platform } from 'react-native'
import RNFetchBlob, { RNFetchBlobConfig } from 'react-native-fetch-blob'
import { Observable, range, throwError, timer } from 'rxjs'
import { mergeMap, retryWhen, zip } from 'rxjs/operators'
import { fromPromise } from 'rxjs/internal-compatibility'

type VerbType = 'GET' | 'PUT'

export class WorkerSystem {
  protected _networkInfo = null
  protected readonly MaxRetry = 10

  constructor() {
    Network.connectionChange().subscribe(info => {
      this._networkInfo = info
    })
  }

  protected get isOnline() {
    return Network.isConnected(this._networkInfo)
  }

  public static createEndPoint = (verb: VerbType = 'GET') => {
    const cacheDir = RNFetchBlob.fs.dirs.CacheDir
    if (verb === 'GET') {
      return Platform.select({
        ios: `${cacheDir}/ShowSourcing/`,
        android: `${cacheDir}/ShowSourcing/`,
      })
    }

    return `${cacheDir}/ShowSourcing/`
  }

  public async removeAll() {
    await RNFetchBlob.fs.unlink(WorkerSystem.createEndPoint('PUT'))
  }

  public remove(uri: string): Observable<void> {
    return fromPromise(RNFetchBlob.fs.unlink(uri))
  }

  public path = curry((id: string, size: ImageSizeValue, verb: VerbType) => {
    return WorkerSystem.createEndPoint(verb) + size + '/' + id + '.png'
  })

  public stat(size?: ImageSizeValue) {
    const path = size
      ? WorkerSystem.createEndPoint() + size
      : WorkerSystem.createEndPoint()
    return RNFetchBlob.fs.lstat(path)
  }

  public isExists(path: string): Observable<boolean> {
    return fromPromise(RNFetchBlob.fs.exists(path))
  }

  public fetchBlob(options: RNFetchBlobConfig, url: string) {
    return new Observable(observer => {
      RNFetchBlob.config(options)
        .fetch('GET', url)
        .then(result => {
          const { status } = result.respInfo

          if (status !== StatusCode.SUCCESS) {
            result.flush()
            observer.error(new Error(`Access Denied`))

            return null
          }

          if (status === StatusCode.SUCCESS) {
            observer.next(result.path())
            observer.complete()

            return null
          }
        })
        .catch(error => {
          observer.error(error)
        })
    })
  }

  public fetch(options: RNFetchBlobConfig, url: string): Observable<string> {
    return new Observable<string>(observer => {
      this.isExists(options.path).subscribe(val => {
        if (val) {
          observer.next(options.path)
          observer.complete()
        } else {
          RNFetchBlob.config(options)
            .fetch('GET', url)
            .then(result => {
              const { status } = result.respInfo

              if (status !== StatusCode.SUCCESS) {
                result.flush()
                observer.error(new Error(`Access Denied`))
                observer.complete()

                return null
              }

              if (status === StatusCode.SUCCESS) {
                observer.next(result.path())
                observer.complete()

                return null
              }
            })
            .catch(error => {
              observer.error(error)
              observer.complete()
            })
        }
      })
    })
  }

  public download(path: string, url: string): Observable<string> {
    return this.fetch(
      {
        path,
        overwrite: true,
      },
      url
    ).pipe(
      retryWhen(attempts =>
        attempts.pipe(
          zip(range(1, this.MaxRetry)),
          mergeMap(([error, i]) => {
            if (
              error.message === `The Internet connection appears to be offline.`
            ) {
              return throwError(error)
            }

            if (i === this.MaxRetry) {
              return throwError(error)
            }

            // console.log(`Delay retry by ${i} second(s)`)
            return timer(i * 100)
          })
        )
      )
    )
  }

  public save(path: string, buffer: ArrayBuffer): Observable<string> {
    return new Observable(observer => {
      const data = arrayBufferToString(buffer)
      this.isExists(path)
        .pipe(
          mergeMap(val => {
            if (val) {
              return Promise.resolve()
            }

            return RNFetchBlob.fs.writeFile(path, data, 'base64')
          })
        )
        .subscribe(
          () => {
            observer.next(path)
          },
          error => {
            observer.error(error)
          },
          () => {
            observer.complete()
          }
        )
    })
  }
}

export const workerSystem = new WorkerSystem()
