import { Supplier } from '@/models/team'
import { pathOr } from 'ramda'
import { Image } from '@/models/common'

export class SafeGlobalSupplier {
  private readonly _globalSupplier = null

  constructor(supplier: Supplier) {
    this._globalSupplier = supplier
  }

  get id() {
    return pathOr<string>('', ['id'], this._globalSupplier)
  }

  get name() {
    return pathOr<string>('', ['name'], this._globalSupplier)
  }

  get fullName() {
    return pathOr<string>('', ['localName'], this._globalSupplier)
  }

  get tradingName() {
    return pathOr<string>('', ['tradingName'], this._globalSupplier)
  }

  get description() {
    return pathOr<string>('', ['description'], this._globalSupplier)
  }

  get country() {
    return pathOr<string>('', ['countryCode'], this._globalSupplier)
  }

  get city() {
    return pathOr<string>('', ['city'], this._globalSupplier)
  }

  get address() {
    return pathOr<string>('', ['addressFull'], this._globalSupplier)
  }

  get website() {
    return pathOr<string>('', ['website'], this._globalSupplier)
  }

  get officeEmail() {
    return pathOr<string>('', ['emailAddress'], this._globalSupplier)
  }

  get officePhone() {
    return pathOr<string>('', ['phone'], this._globalSupplier)
  }

  get type() {
    return pathOr<string>('', ['type'], this._globalSupplier)
  }

  get logo() {
    return pathOr<Image>(null, ['supplierImage'], this._globalSupplier)
  }
}
