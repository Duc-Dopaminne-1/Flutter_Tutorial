import RNFetchBlob from 'react-native-fetch-blob'
import { workerSystem } from '@/worker/workerSystem'
import { ImageSize } from '@/shared/image'
import { Observable } from 'rxjs'

export class Files {
  static exists(id: string): Observable<boolean> {
    const path = workerSystem.path(id, ImageSize.XL, 'GET')
    return new Observable<boolean>(observer => {
      RNFetchBlob.fs
        .exists(path)
        .then(isExists => {
          observer.next(isExists)
          observer.complete()
        })
        .catch(error => {
          observer.error(error)
          observer.complete()
        })
    })
  }

  static writeFile(id: string, buffer: string): Observable<string> {
    const path = workerSystem.path(id, ImageSize.XL, 'PUT')
    return new Observable<string>(observer => {
      RNFetchBlob.fs
        .writeFile(path, buffer, 'base64')
        .then(() => {
          observer.next(path)
          observer.complete()
        })
        .catch(error => {
          observer.error(error)
          observer.complete()
        })
    })
  }
}
