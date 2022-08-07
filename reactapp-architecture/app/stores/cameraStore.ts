import { Subject } from 'rxjs'
import { CameraData } from '@/libs/LCache'

export class CameraStore {
  private _data: CameraData[] = []
  private _subject = new Subject<CameraData[]>()

  constructor() {}

  // set data(value: CameraData[]) {
  //   this._data = this._data.concat(value)
  // }

  get data(): CameraData[] {
    return this._data
  }

  put(value: CameraData[]) {
    this._data = this._data.concat(value)
    this._subject.next(this._data)
  }

  putAt(value: CameraData, at: number) {
    this._data.splice(at, 0, value)
    this._subject.next(this._data)
  }

  putReplaceAt(value: CameraData, at: number) {
    this._data[at] = value
    this._subject.next(this._data)
  }

  rearrange(fromIndex: number, toIndex: number) {
    const tmp = this._data.splice(fromIndex, 1)
    this._data.splice(toIndex, 0, ...tmp)
    this._subject.next(this._data)
  }

  delete(fromIndex: number) {
    this._data.splice(fromIndex, 1)
    this._subject.next(this._data)
  }

  get observer() {
    return this._subject
  }

  clear() {
    this._data = []
  }
}

export const cameraStore = new CameraStore()
