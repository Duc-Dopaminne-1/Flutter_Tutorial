import I18n from '@/i18n'
import { Image } from '@/models/common'
import { Contact } from '@/models/team'
import { pathOr } from 'ramda'
import { RealmObject } from '@/shared/realmObject'

export class SafeContact {
  private readonly _data: Contact = null

  constructor(data: Contact) {
    this._data = data
  }

  get logoPlaceholder() {
    const normalizeName = this.name
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/^\s+|\s+$|\s+(?=\s)/g, '')
      .toUpperCase()

    const words = normalizeName.split(' ')

    switch (words.length) {
      case 0:
        return ''
      case 1:
        return words[0].substring(0, 2)
      default:
        return words[0].substring(0, 1) + words[1].substring(0, 1)
    }
  }

  get isDirty() {
    const { name, jobTitle, email, phoneNumber } = this._data
    return [name, jobTitle, email, phoneNumber].some(value => !!value)
  }

  get name() {
    return pathOr<string>(I18n.t('newContact'), ['name'], this._data)
  }

  get title() {
    return this.name || I18n.t('businessCard')
  }

  get subtitle() {
    return this.name || I18n.t('fillInfoBusinessCard')
  }

  get jobTitle() {
    return pathOr<string>('', ['jobTitle'], this._data)
  }

  get email() {
    return pathOr<string>('', ['email'], this._data)
  }

  get phoneNumber() {
    return pathOr<string>('', ['phoneNumber'], this._data)
  }

  get businessCardImage(): Image {
    return pathOr<Image>(
      {
        id: '',
        fileName: '',
        orientation: 0,
        imageType: '',
        urls: [],
        ...RealmObject.defaultObject,
      },
      ['businessCardImage'],
      this._data
    )
  }
}
