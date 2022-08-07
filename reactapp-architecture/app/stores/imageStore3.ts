import { BehaviorSubject } from 'rxjs'

type EventName = 'onSuccess' | 'onResult'

export type Source = {
  id: string
  base64: string
}[]

export class ImageStore3 {
  private _source: Source = []
  private _resultSubject = new BehaviorSubject<Source>([])
  private _successSubject = new BehaviorSubject<boolean>(false)

  private _onSuccess = null
  private _onResult = null

  append(source: Source) {
    this._source = this._source.concat(source)

    this._resultSubject.next(this._source)
    this._successSubject.next(true)

    this._onResult && this._onResult(this._source)
    this._onSuccess && this._onSuccess(true)
  }

  removeById = (id: string) => {
    this._source = this._source.filter(source => source.id !== id)

    this._resultSubject.next(this._source)
    this._successSubject.next(true)

    this._onResult && this._onResult(this._source)
    this._onSuccess && this._onSuccess(true)
  }

  thumbnailId() {
    try {
      const image = this._source[0]
      return image && image.id
    } catch (e) {
      return ''
    }
  }

  clear() {
    this._source = []
  }

  data() {
    return this._source
  }

  observerResult() {
    return this._resultSubject
  }

  observerSuccess() {
    return this._successSubject
  }

  addEventListener(eventName: EventName, fn: (...args: any[]) => void) {
    switch (eventName) {
      case 'onSuccess': {
        this._onSuccess = fn
        return
      }
      case 'onResult': {
        this._onResult = fn
        return
      }
    }
  }

  removeEventListener(eventName: EventName) {
    switch (eventName) {
      case 'onSuccess': {
        this._onSuccess = null
        return
      }
      case 'onResult': {
        this._onResult = null
        return
      }
    }
  }
}

export const imageStore3 = new ImageStore3()
