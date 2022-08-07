type EventName = 'onSuccess'

export class ImageStore {
  private _numberOfImages: number = 0
  private _source: string[] = []
  private _thumbnail: string = ''
  private _loading = false

  private _onSuccess = null

  add(data: string): void
  add(data: string[]): void
  add(data: any): void {
    this._source = this._source.concat(data)

    if (this._source.length >= this._numberOfImages) {
      this._loading = false
      this._onSuccess && this._onSuccess(false)
    }
  }

  clear() {
    this._source = []
  }

  data() {
    return this._source
  }

  set loading(value: boolean) {
    this._loading = value

    this._onSuccess && this._onSuccess(value)
  }

  set thumbnail(value: string) {
    this._thumbnail = value
  }

  set numberOfImages(value: number) {
    this._numberOfImages = value
  }

  get thumbnail() {
    return this._thumbnail
  }

  addEventListener(eventName: EventName, fn: (...args: any[]) => void) {
    if (eventName === 'onSuccess') {
      this._onSuccess = fn
    }
  }

  removeEventListener(eventName: EventName) {
    if (eventName === 'onSuccess') {
      this._onSuccess = null
    }
  }
}

export const imageStore = new ImageStore()
