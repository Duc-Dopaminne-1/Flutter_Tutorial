import { BehaviorSubject, Subject } from 'rxjs'
import { workerSystem } from '@/worker/workerSystem'
import { ImageSize } from '@/shared/image'
import { FileManager } from '@/utils/fileManager'

type EventName = 'onSuccess' | 'onResult'

export type Source = { [key: string]: string }

export type Source2 = [{ id: string; base64: string }]

export class ImageStore2 {
  private _source: Source = {}
  private _sourceLength: number = 0
  private _subject = new BehaviorSubject<Source>({})

  private _onSuccess = null
  private _onResult = null

  append(source: { [key: string]: string }) {
    this._source = Object.assign(this._source, source)
    this._sourceLength = this.countSource(source)
    // this._subject.next(this._source)
    this._onResult && this._onResult(this._source)
    this._onSuccess && this._onSuccess(true)
  }

  countSource(source: Source) {
    let i = 0
    for (const id in source) {
      i++
    }

    return i
  }

  toPaths(source: Source) {
    const data = []
    let i = 0
    for (const id in source) {
      data[i] = FileManager.path(id)
      i++
    }

    return data
  }

  toIds(source: Source) {
    const data = []
    for (const id in source) {
      data.push(id)
    }

    return data
  }

  clear() {
    this._source = {}
  }

  thumbnailId() {
    let key = ''
    for (const id in this._source) {
      key = id
      break
    }

    return key
  }

  item(id: string) {
    return this._source[id]
  }

  data() {
    return this._source
  }

  observer() {
    return this._subject
  }

  sourceLength() {
    return this._sourceLength
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

export const imageStore2 = new ImageStore2()
