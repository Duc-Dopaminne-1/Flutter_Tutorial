import { btoa } from '@/utils/base64'
import _sortBy from 'lodash/sortBy'
import { Image } from '@/models/common'

export type ImageSizeValue = 0 | 1 | 2 | 3 | 4 | 5

// export type ImageSizeKey = 'XS' | 'S' | 'M' | 'XM' | 'L' | 'XL'

export type ImageSizeTypes = {
  XS: 0
  S: 1
  M: 2
  XM: 3
  L: 4
  XL: 5
}

export const ImageSize: ImageSizeTypes = {
  XS: 0,
  S: 1,
  M: 2,
  XM: 3,
  L: 4,
  XL: 5,
}

export const arrayBufferToString = (buffer: ArrayBuffer) => {
  let source = buffer
  if (!buffer) {
    source = new ArrayBuffer(0)
  }

  const bytes = new Uint8Array(source)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary = binary + String.fromCharCode(bytes[i])
  }

  return btoa(binary)
}

export const convertToImage = (buffer: string) => {
  if (!buffer) {
    return ''
  }

  if (buffer === 'AAAAAAAAAAA=') {
    return ''
  }

  return 'data:image/png;base64,' + buffer
}

export const getImageLevel = ({ urls }: Image) => {
  if (urls !== null && urls.length > 0) {
    return 'large'
  }

  return 'low'
}

export const getImageExt = (uri: string) => {
  return uri.substring(
    uri.lastIndexOf('.'),
    uri.indexOf('?') === -1 ? undefined : uri.indexOf('?')
  )
}

export const filterDeleteImage = (images: Image[]) => {
  if (!images) return []

  return images.filter(image => image.deleted === false)
}

export const sortImage = (images: string[] | Image[], index: number) => {
  return _sortBy<Image | string>(images, image => {
    if (typeof image === 'string') {
      return image === images[index] ? 0 : 1
    }

    // FIXME: the id can
    const _images = (images as Image[]) || []
    const id = _images[index] && _images[index].id
    return image.id === id ? 0 : 1
  })
}

export class SafeImage {
  constructor(private _image: Image | string) {}

  get length() {
    if (typeof this._image === 'string') {
      return 0
    }

    if (!this.isValid()) {
      return 0
    }

    return this._image.data.byteLength
  }

  get placeholder() {
    if (typeof this._image === 'string') {
      return this._image
    }

    if (!this.isValid()) {
      return ''
    }

    return convertToImage(arrayBufferToString(this._image.data))
  }

  get uri() {
    if (typeof this._image === 'string') {
      return this._image
    }

    if (!this.isValid()) {
      return ''
    }

    const { urls } = this._image

    if (urls !== null && urls !== undefined && urls.length >= ImageSize.XL) {
      return urls[ImageSize.XL].url
    }

    if (urls !== null && urls !== undefined && urls.length > 0) {
      return urls[urls.length - 1].url
    }

    return ''
  }

  get id() {
    if (typeof this._image === 'string') {
      return ''
    }

    if (!this.isValid()) {
      return ''
    }

    return this._image ? this._image.id : ''
  }

  isValid() {
    if (typeof this._image === 'string') {
      return true
    }

    return this._image && this._image.isValid && this._image.isValid()
  }
}
