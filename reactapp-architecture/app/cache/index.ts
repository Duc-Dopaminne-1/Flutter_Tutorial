import Realm from 'realm'
import { CacheImage, CacheImageSchema } from '@/cache/cacheImageSchema'
import { AsyncQueue, queue } from 'async'
import { Files } from '@/shared/files'
import RNFetchBlob from 'react-native-fetch-blob'
import { workerSystem } from '@/worker/workerSystem'
import { ImageSize } from '@/shared/image'
import { Source } from '@/stores/imageStore2'
import { Source as Source3 } from '@/stores/imageStore3'
import { FileManager } from '@/utils/fileManager'

export type ImageSavedTask = {
  id: string
  buffer: string
}

export type ImageSavedResult = {
  id: string
  path: string
}

export class CacheSystem {
  private _queue: AsyncQueue<ImageSavedTask>
  private _realm: Realm
  private _results: Realm.Results<CacheImage>
  private _source: CacheImage[]

  constructor() {
    this.run()
    Realm.open({
      schemaVersion: 16,
      schema: [CacheImageSchema],
    }).then(realm => {
      this._realm = realm
      this.callback = this.__callback(realm)
      this.getLocalSource()
      console.log('Opened')
    })
  }

  getUrl(id: string) {
    if (this._realm) {
      const data = this._realm
        .objects<CacheImage>('CacheImage')
        .filtered('id = $0', id)

      if (data) {
        return data.length === 1 ? data[0].path : ''
      }
    }

    return ''
  }

  private getLocalSource() {
    // if (this._realm) {
    //   this._results = this._realm.objects<CacheImage>('CacheImage')
    //   console.log('_results', this._results)
    //
    //   this._results.addListener(col => {
    //     console.log('col', col)
    //   })
    // }
  }

  // @ts-ignore
  private callback(error, value: ImageSavedResult) {}

  private __callback = (realm: Realm) => (error, data: ImageSavedResult) => {
    if (error) {
      console.log(error)
    }

    try {
      if (realm && data) {
        realm.write(() => {
          realm.create<CacheImage>('CacheImage', data)
        })
      }
    } catch (e) {
      console.log('Error on creation')
    }
  }

  push() {
    // this._queue.push(task, this.callback)
  }

  write(_data: Source | Source3) {
    // if (this._realm) {
    //   this._realm.write(() => {
    //     for (const id in data) {
    //       this._realm.create<CacheImage>('CacheImage', {
    //         id,
    //         path: FileManager.path(id),
    //       })
    //     }
    //   })
    // }
  }

  run() {
    // this._queue = queue((task: ImageSavedTask, callback: any) => {
    //   const path = workerSystem.path(task.id, ImageSize.XL, 'PUT')
    //   console.log(path)
    //   RNFetchBlob.fs
    //     .writeFile(path, task.buffer, 'base64')
    //     .then(() => {
    //       callback(null, {
    //         path,
    //         id: task.id,
    //       })
    //     })
    //     .catch(error => {
    //       console.log('error', error)
    //       callback(error)
    //     })
    // }, 10)
  }
}

export const cacheSystem = new CacheSystem()
