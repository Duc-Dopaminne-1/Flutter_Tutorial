import { pathOr } from 'ramda'
import { Harbour } from '@/models/global'

export class SafeHarbour {
  private readonly _harbour: Harbour = null

  constructor(harbour) {
    this._harbour = harbour
  }

  get harbourId() {
    return pathOr<string>(null, ['id'], this._harbour)
  }

  get harbourName() {
    return pathOr<string>('', ['name'], this._harbour)
  }
}
