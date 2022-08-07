import { Image } from '@/models/common'
import { ImageSizeValue, SafeImage } from '@/shared/image'

export interface ISafeImages {
  isEmpty: boolean
  all: Image[]
  allId: string[]
  allTypes: string[]
  first: Image
  numberOfImages: number
  uri: string
  placeholder: string
  preload(size?: ImageSizeValue): void
}

export class SafeImages implements ISafeImages {
  private readonly _source: Image[]
  private static _defaultImage = {
    id: '',
    data: new ArrayBuffer(8),
    fileName: '',
    orientation: 0,
    imageType: '',
    urls: [],
  } as Image

  constructor(_source: Image[]) {
    this._source = SafeImages.filterDeleteImage(_source)
  }

  static default(): ISafeImages {
    return {
      isEmpty: true,
      all: [],
      first: SafeImages._defaultImage,
      allId: [],
      allTypes: [],
      numberOfImages: 0,
      uri: '',
      placeholder: '',
      preload() {
        return null
      },
    }
  }

  get isEmpty() {
    return this._source.length === 0
  }

  get all() {
    return this._source
  }

  get allId() {
    return this._source.map(item => item.id)
  }

  get allTypes() {
    return this._source.map(item => item.imageType)
  }

  get first() {
    return this._source.length > 0 ? this._source[0] : SafeImages._defaultImage
  }

  get numberOfImages() {
    return !this.isEmpty ? this._source.length : 0
  }

  get uri() {
    return new SafeImage(this.first).uri
  }

  get placeholder() {
    return new SafeImage(this.first).placeholder
  }

  static filterDeleteImage(images: Image[]) {
    if (!images) return []

    return images.filter(image => image.deleted === false)
  }

  preload() {}
}
