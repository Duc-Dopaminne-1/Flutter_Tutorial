import { Image } from '@/models/common'
import { Factory } from '@/services/factory'
import { Platform } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import ImageResizer from 'react-native-image-resizer'
import { forkJoin, Observable } from 'rxjs'

type ResizeImageConfig = {
  width: number
  height: number
  format: 'PNG' | 'JPEG' | 'WEBP'
  quality: number
}

export class ImageFactory extends Factory<Image> {
  constructor(realm: Realm) {
    super(realm)
  }

  static filePath(uri: string) {
    return Platform.select({
      ios: uri.replace('file:///', ''),
      android: uri,
    })
  }

  resize(
    uri: string,
    config: ResizeImageConfig = {
      width: 1024,
      height: 768,
      format: 'JPEG',
      quality: 70,
    }
  ): Observable<string> {
    const { width, height, format, quality } = config

    return new Observable(observer => {
      ImageResizer.createResizedImage(uri, width, height, format, quality)
        .then(result => {
          return RNFetchBlob.fs.readStream(
            ImageFactory.filePath(result.uri),
            'base64',
            4095
          )
        })
        .then(stream => {
          let data = ''
          stream.open()
          stream.onData(chunk => {
            data += chunk
          })
          stream.onError(err => {
            observer.error(err)
          })

          stream.onEnd(() => {
            observer.next(data)
            observer.complete()
          })
        })
        .catch(error => {
          observer.next(error)
          observer.complete()
        })
    })
  }

  convert2Base64(uri: string): Observable<string> {
    return new Observable<string>(observer => {
      RNFetchBlob.fs
        .readStream(ImageFactory.filePath(uri), 'base64', 4095)
        .then(stream => {
          let data = ''

          stream.open()
          stream.onData(chunk => {
            data += chunk
          })

          stream.onError(err => {
            observer.error(err)
          })

          stream.onEnd(() => {
            observer.next(data)
            observer.complete()
          })
        })
        .catch(error => {
          observer.error(error)
          observer.complete()
        })
    })
  }

  convertAll2Base64(uris: string[]) {
    const events = uris.map(uri => this.convert2Base64(uri))

    return forkJoin(events)
  }

  resizeAll(uris: string[]): Observable<string[]> {
    const events = uris.map(uri => this.resize(uri))

    return forkJoin(events)
  }

  resizeWithUri(
    uri: string,
    config: ResizeImageConfig = {
      width: 1024,
      height: 768,
      format: 'JPEG',
      quality: 70,
    }
  ): Observable<string> {
    const { width, height, format, quality } = config

    return new Observable<string>(observer => {
      ImageResizer.createResizedImage(uri, width, height, format, quality)
        .then(result => {
          observer.next(result.uri)
          observer.complete()
        })
        .catch(error => {
          observer.error(error)
          observer.complete()
        })
    })
  }

  resizeAllWithUri(uris: string[]): Observable<string[]> {
    const events = uris.map(uri => this.resizeWithUri(uri))

    return forkJoin(events)
  }
}
