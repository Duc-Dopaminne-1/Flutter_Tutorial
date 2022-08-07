import { ImageSize, ImageSizeValue } from '@/shared/image'

export abstract class WorkerQueue<T> {
  protected _buffer = new Map<ImageSizeValue, Map<string, T>>([
    [ImageSize.XL, new Map<string, T>()],
  ])

  data() {
    return this._buffer.get(ImageSize.XL)
  }

  get(processId: string): T {
    return this._buffer.get(ImageSize.XL).get(processId)
  }

  delete(processId: string, size: ImageSizeValue = ImageSize.XL): void {
    this._buffer.get(size).delete(processId)
  }

  size() {
    return this._buffer.get(ImageSize.XL).size
  }
}
