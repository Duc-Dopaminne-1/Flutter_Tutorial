import { pathOr } from 'ramda'
import { GlobalSupplier } from '@/models/global'

export class SafeBooth {
  private readonly _booth: any = null

  constructor(booth) {
    this._booth = booth
  }

  get boothId() {
    return pathOr<string>('', ['id'], this._booth)
  }

  get boothName() {
    return pathOr<string>('', ['boothName'], this._booth)
  }

  get supplier() {
    return pathOr<GlobalSupplier>(null, ['supplier'], this._booth)
  }
}
