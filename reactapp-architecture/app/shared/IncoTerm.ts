import { pathOr } from 'ramda'
import { Incoterm } from '@/models/global'

export class SafeIncoTerm {
  private readonly _incoTerm: Incoterm = null

  constructor(incoterm: Incoterm) {
    this._incoTerm = incoterm
  }

  get incotermId() {
    return pathOr<string>(null, ['id'], this._incoTerm)
  }

  get incoTermName() {
    return pathOr<string>('', ['name'], this._incoTerm)
  }

  get logoPlaceholder() {
    const normalizeName = this.incoTermName.toUpperCase()

    return normalizeName.substring(0, 3)
  }
}
